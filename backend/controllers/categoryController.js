import Category from '../models/Category.js';

// Helper to construct slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('parent', 'name');
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories mapped in hierarchical tree structure
// @route   GET /api/categories/tree
// @access  Public
export const getCategoryTree = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();
    
    // Group categories by parent ID
    const categoryMap = {};
    categories.forEach(cat => {
      cat.children = [];
      categoryMap[cat._id.toString()] = cat;
    });

    const tree = [];
    categories.forEach(cat => {
      if (cat.parent) {
        const parentId = cat.parent.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(cat);
        }
      } else {
        tree.push(cat);
      }
    });

    return res.status(200).json({
      success: true,
      tree,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin Only)
export const createCategory = async (req, res, next) => {
  try {
    const { name, parent, icon, description } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error('A category with this name already exists');
    }

    const category = await Category.create({
      name,
      slug: slugify(name),
      parent: parent || null,
      icon,
      description,
    });

    return res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};
