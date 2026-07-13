import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Business from '../models/Business.js';

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment, sellerRating } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already submitted a review for this product');
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
      sellerRating: sellerRating ? Number(sellerRating) : undefined,
    });

    // Update Product Average Rating (runs automatically in post-save hook on Review model)
    // Now let's calculate and update the Seller's average rating in the Business schema
    if (product.sellerType === 'Business Seller') {
      const business = await Business.findOne({ owner: product.seller });
      if (business) {
        // Find all reviews for all products belonging to this seller
        const sellerProducts = await Product.find({ seller: product.seller });
        const productIds = sellerProducts.map(p => p._id);
        
        const avgStats = await Review.aggregate([
          {
            $match: {
              product: { $in: productIds },
              sellerRating: { $exists: true }
            }
          },
          {
            $group: {
              _id: null,
              averageSellerRating: { $avg: '$sellerRating' },
              totalReviews: { $sum: 1 }
            }
          }
        ]);

        if (avgStats.length > 0) {
          business.rating = Math.round(avgStats[0].averageSellerRating * 10) / 10;
          business.reviewsCount = avgStats[0].totalReviews;
          await business.save();
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a seller (seller dashboard)
// @route   GET /api/reviews/seller/:sellerId
// @access  Private
export const getSellerReviews = async (req, res, next) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerProducts = await Product.find({ seller: sellerId });
    const productIds = sellerProducts.map(p => p._id);

    const reviews = await Review.find({ product: { $in: productIds } })
      .populate('user', 'name avatar')
      .populate('product', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ask a question on a product listing
// @route   POST /api/reviews/qas/:productId
// @access  Private
export const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) {
      res.status(404);
      throw new Error('Product listing not found');
    }

    if (!question || !question.trim()) {
      res.status(400);
      throw new Error('Question content cannot be empty');
    }

    product.qas.push({
      user: req.user._id,
      question,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Question posted successfully',
      qas: product.qas,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Answer a question on a product listing
// @route   PUT /api/reviews/qas/:productId/:qaId
// @access  Private
export const answerQuestion = async (req, res, next) => {
  try {
    const { answer } = req.body;
    const { productId, qaId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product listing not found');
    }

    // Auth ownership check: must be owner of product or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Forbidden: Only the listing supplier can submit answers');
    }

    const qaItem = product.qas.id(qaId);
    if (!qaItem) {
      res.status(404);
      throw new Error('Question reference not found');
    }

    qaItem.answer = answer;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Question answered successfully',
      qas: product.qas,
    });
  } catch (error) {
    next(error);
  }
};
