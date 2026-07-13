import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Business from '../models/Business.js';
import Inventory from '../models/Inventory.js';
import connectDB from './db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections to clean run seed
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Business.deleteMany({});
    await Inventory.deleteMany({});

    console.log('🧹 Database collections cleared.');

    // 1. Seed Users (with preset pre-hashed passwords from User.js hooks)
    const admin = await User.create({
      name: 'NEXUS Administrator',
      email: 'admin@nexus.com',
      password: 'password123',
      role: 'Admin',
      isVerified: true,
      phoneNumber: '+1 555-0100'
    });

    const customer = await User.create({
      name: 'Arthur Dent',
      email: 'customer@nexus.com',
      password: 'password123',
      role: 'Customer',
      isVerified: true,
      phoneNumber: '+1 555-0101'
    });

    const individualSeller = await User.create({
      name: 'Ford Prefect',
      email: 'individual@nexus.com',
      password: 'password123',
      role: 'Individual Seller',
      isVerified: true,
      phoneNumber: '+1 555-0102'
    });

    const businessSeller = await User.create({
      name: 'Zaphod Beeblebrox',
      email: 'business@nexus.com',
      password: 'password123',
      role: 'Business Seller',
      isVerified: true,
      phoneNumber: '+1 555-0103'
    });

    console.log('👤 Mock users seeded successfully.');

    // Create Business profile for the business seller
    const business = await Business.create({
      owner: businessSeller._id,
      companyName: 'Beeblebrox Intergalactic Inc',
      businessRegistrationNumber: 'LIC-778899-GALAXY',
      taxId: 'TX-GALAXY-8899',
      address: {
        street: '88 Starship Avenue',
        city: 'Sector 4',
        state: 'Betelgeuse V',
        country: 'Galaxy Core',
        zip: '004411'
      },
      verificationStatus: 'Approved',
      rating: 4.8,
      reviewsCount: 15
    });

    console.log('💼 Business seller profile initialized.');

    // 2. Seed Categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', icon: 'Cpu' },
      { name: 'Fashion', slug: 'fashion', icon: 'Shirt' },
      { name: 'Mobiles', slug: 'mobiles', icon: 'Smartphone' },
      { name: 'Cars', slug: 'cars', icon: 'Car' },
      { name: 'Bikes', slug: 'bikes', icon: 'Bike' },
      { name: 'Furniture', slug: 'furniture', icon: 'Home' },
      { name: 'Books', slug: 'books', icon: 'BookOpen' },
      { name: 'Sports', slug: 'sports', icon: 'Dribbble' },
      { name: 'Gaming', slug: 'gaming', icon: 'Gamepad2' },
      { name: 'Beauty', slug: 'beauty', icon: 'Sparkles' },
      { name: 'Pets', slug: 'pets', icon: 'Dog' }
    ];

    const seededCategories = await Category.insertMany(categories);
    console.log('🏷️ Product categories loaded.');

    const electronicsId = seededCategories.find(c => c.slug === 'electronics')._id;
    const fashionId = seededCategories.find(c => c.slug === 'fashion')._id;

    // 3. Seed Products
    const products = [
      {
        name: 'Aurelia Royal Gold Chronograph',
        slug: 'aurelia-royal-gold-chronograph',
        description: 'The Aurelia Chronograph stands as a triumph in haute horology. Featuring custom Calibre-X automatic mechanics, case lines crafted from 18-karat brushed gold plate, and Sapphire structural crystals.',
        brand: 'Aurelia Geneva',
        category: fashionId,
        seller: businessSeller._id,
        sellerType: 'Business Seller',
        price: 1850,
        discount: 10,
        images: [
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 35,
        warranty: '5-year international manufacturer warranty',
        deliveryInfo: 'Vetted transport in 2-4 business days.',
        condition: 'New',
        isWholesale: true,
        minOrderQuantity: 5,
        bulkPricing: [
          { minQuantity: 5, price: 1500 },
          { minQuantity: 10, price: 1350 }
        ],
        specifications: [
          { name: 'Case Material', value: '18K Yellow Gold' },
          { name: 'Movement', value: 'Automatic Self-Winding' }
        ]
      },
      {
        name: 'Vintage Mahogany Leather Travel Trunk',
        slug: 'vintage-mahogany-leather-travel-trunk',
        description: 'Original mahogany leather suitcase from 1974. Beautiful patination, brass fixtures, and silk interior lining.',
        brand: 'Louis Heritage',
        category: fashionId,
        seller: individualSeller._id,
        sellerType: 'Individual Seller',
        price: 680,
        discount: 0,
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'],
        stock: 1,
        warranty: 'No warranty',
        deliveryInfo: 'Escrow secured local pickup only.',
        condition: 'Like New',
        isNegotiable: true,
        localPickupOnly: true,
        specifications: [
          { name: 'Material', value: 'Mahogany Leather' },
          { name: 'Year', value: '1974' }
        ]
      },
      {
        name: 'Retina OLED Pro Display (2025)',
        slug: 'retina-oled-pro-display-2025',
        description: 'High-fidelity OLED computer display with ultra-rich contrast and professional wide color calibration.',
        brand: 'VisionTech',
        category: electronicsId,
        seller: individualSeller._id,
        sellerType: 'Individual Seller',
        price: 890,
        discount: 20,
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600'],
        stock: 2,
        warranty: 'Expired seller warranty',
        deliveryInfo: 'Dispatches in 3-5 days.',
        condition: 'Very Good',
        isNegotiable: true,
        specifications: [
          { name: 'Screen Type', value: 'OLED' },
          { name: 'Resolution', value: '4K Ultra HD' }
        ]
      }
    ];

    for (const prod of products) {
      const p = await Product.create(prod);
      // create matching inventory levels
      await Inventory.create({
        product: p._id,
        stockLevel: p.stock,
        warehouseLocation: 'General Shelf A',
        logs: [{ type: 'StockIn', quantity: p.stock, reason: 'Seeder initialization.' }]
      });
    }

    console.log('📦 Marketplace products seeded with inventory logs.');

    // 4. Seed Coupons
    await Coupon.create({
      code: 'WELCOME10',
      discountType: 'Percentage',
      discountValue: 10,
      minPurchaseAmount: 50,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true
    });

    await Coupon.create({
      code: 'NEXUS50',
      discountType: 'FixedAmount',
      discountValue: 50,
      minPurchaseAmount: 200,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true
    });

    console.log('🎟️ Settlement discount coupons generated.');
    console.log('🎉 Database seeding complete! Exit process.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
