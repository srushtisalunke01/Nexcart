import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Inventory from '../models/Inventory.js';

// Helper to construct slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// @desc    Get all products with filters, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sellerType,
      condition,
      isWholesale,
      sort,
    } = req.query;

    const query = { isSold: false };

    // Search query mapping (text indexing)
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter mapping
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Brand filter mapping
    if (brand) {
      const brandDoc = await Brand.findOne({ slug: brand });
      if (brandDoc) {
        query.brand = brandDoc.name;
      }
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Seller type filter (Business Seller vs Individual Seller vs Admin)
    if (sellerType) {
      query.sellerType = sellerType;
    }

    // C2C condition filter
    if (condition) {
      query.condition = condition;
    }

    // B2B wholesale filter flag
    if (isWholesale) {
      query.isWholesale = isWholesale === 'true';
    }

    // Define Sorting Parameters
    let sortBy = { createdAt: -1 }; // default newest
    if (sort) {
      if (sort === 'priceAsc') sortBy = { price: 1 };
      else if (sort === 'priceDesc') sortBy = { price: -1 };
      else if (sort === 'rating') sortBy = { rating: -1 };
      else if (sort === 'oldest') sortBy = { createdAt: 1 };
    }

    // Pagination calculations
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name email avatar role');

    if (!product) {
      res.status(404);
      throw new Error('Product listing not found');
    }

    // Populate brand details if present
    let brandDetails = null;
    if (product.brand) {
      brandDetails = await Brand.findOne({ name: product.brand });
    }

    // Fetch matching inventory levels
    const inventory = await Inventory.findOne({ product: product._id });

    return res.status(200).json({
      success: true,
      product,
      brandDetails,
      inventory: inventory ? {
        stockLevel: inventory.stockLevel,
        warehouseLocation: inventory.warehouseLocation,
        reorderPoint: inventory.reorderPoint
      } : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product listing
// @route   POST /api/products
// @access  Private (Sellers, Business Sellers, Admins)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      discount,
      images,
      video,
      variants,
      specifications,
      stock,
      warranty,
      deliveryInfo,
      condition,
      isNegotiable,
      localPickupOnly,
      isWholesale,
      minOrderQuantity,
      bulkPricing,
      warehouseLocation
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400);
      throw new Error('Selected category is invalid');
    }

    // Build product
    const product = await Product.create({
      name,
      slug: slugify(name),
      description,
      brand,
      category,
      seller: req.user._id,
      sellerType: req.user.role,
      price,
      discount,
      images,
      video,
      variants: variants || [],
      specifications: specifications || [],
      stock: stock || 0,
      warranty,
      deliveryInfo,
      condition: condition || 'New',
      isNegotiable: isNegotiable || false,
      localPickupOnly: localPickupOnly || false,
      isWholesale: isWholesale || false,
      minOrderQuantity: minOrderQuantity || 1,
      bulkPricing: bulkPricing || []
    });

    if (product) {
      // Auto create inventory document
      await Inventory.create({
        product: product._id,
        stockLevel: stock || 0,
        warehouseLocation: warehouseLocation || 'General Shelf A',
        logs: [{
          type: 'StockIn',
          quantity: stock || 0,
          reason: 'Initial Product Stock Inbound',
        }]
      });

      return res.status(201).json({
        success: true,
        product,
      });
    } else {
      res.status(400);
      throw new Error('Invalid product details provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product listing
// @route   PUT /api/products/:id
// @access  Private (Owner or Admin)
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Authenticate ownership: must be the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('User not authorized to update this listing');
    }

    // Set slug if name changes
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Update matching inventory stock levels if provided
    if (req.body.stock !== undefined) {
      await Inventory.findOneAndUpdate(
        { product: product._id },
        { 
          $set: { stockLevel: req.body.stock },
          $push: {
            logs: {
              type: 'Correction',
              quantity: req.body.stock,
              reason: 'Manual Stock Level Sync Correction',
            }
          }
        }
      );
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private (Owner or Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Authenticate ownership
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('User not authorized to delete this listing');
    }

    await Product.findByIdAndDelete(req.params.id);
    await Inventory.findOneAndDelete({ product: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Product listing and inventory record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get autocomplete search suggestions
// @route   GET /api/products/search/suggestions
// @access  Public
export const searchSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    // Find up to 5 matching products matching search pattern
    const suggestions = await Product.find({
      name: { $regex: query, $options: 'i' },
      isSold: false
    })
      .select('name brand')
      .limit(5);

    return res.status(200).json({
      success: true,
      suggestions: suggestions.map(s => s.name),
    });
  } catch (error) {
    next(error);
  }
};
