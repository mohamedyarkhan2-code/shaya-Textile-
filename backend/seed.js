import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Material from './models/Material.js';
import Order from './models/Order.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shaya_textile');
    console.log('MongoDB Connected for Seeding');
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Executive Grey Oxford Shirt',
    description: 'Crisp 100% Egyptian cotton grey oxford shirt for professional formal & business casual wear.',
    category: 'shirt',
    price: 1899,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Grey', 'White', 'Charcoal'],
    stock: 40,
    isFeatured: true,
  },
  {
    name: 'Classic Pure White Linen Shirt',
    description: 'Ultra-breathable premium linen shirt perfect for summer events and casual luxury.',
    category: 'shirt',
    price: 2199,
    originalPrice: 2899,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    sizes: ['M', 'L', 'XL'],
    colors: ['White', 'Light Grey'],
    stock: 35,
    isFeatured: true,
  },
  {
    name: 'Tailored Slate Grey Chino Pants',
    description: 'Premium stretch-twill chino pants with ergonomic waistline and clean sleek drape.',
    category: 'pant',
    price: 2499,
    originalPrice: 3199,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Grey', 'Charcoal', 'Black'],
    stock: 50,
    isFeatured: true,
  },
  {
    name: 'Monochrome Grey Pima Cotton T-Shirt',
    description: 'Heavyweight Pima cotton minimal tee with structured crew neck and anti-pilling coat.',
    category: 't-shirt',
    price: 999,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ash Grey', 'Off-White', 'Heather Grey'],
    stock: 60,
    isFeatured: true,
  },
  {
    name: 'Minimalist White Oversized Tee',
    description: 'Streetwear-inspired drop shoulder heavyweight t-shirt in pure off-white.',
    category: 't-shirt',
    price: 1199,
    originalPrice: 1699,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    sizes: ['M', 'L', 'XL'],
    colors: ['White', 'Light Grey'],
    stock: 45,
    isFeatured: false,
  },
  {
    name: 'Charcoal Grey Pleated Formal Trousers',
    description: 'Sophisticated worsted wool blend trousers tailored for high-end corporate events.',
    category: 'pant',
    price: 2999,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    sizes: ['30', '32', '34', '36'],
    colors: ['Charcoal Grey', 'Dark Grey'],
    stock: 30,
    isFeatured: true,
  }
];

const sampleMaterials = [
  {
    name: 'Supima Extra-Long Staple Cotton',
    fabricType: 'Supima Cotton',
    category: 'shirt',
    pricePerMeter: 650,
    baseStitchingPrice: 599,
    description: 'Silky smooth, high thread count cotton tailored specifically for luxury bespoke shirts.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    availableColors: ['Pure White', 'Silver Grey', 'Slate Grey', 'Pearl Grey', 'Midnight Charcoal'],
    patterns: ['Solid', 'Micro-Check', 'Pinstripe', 'Herringbone'],
    inStock: true,
  },
  {
    name: 'Belgian Pure Flax Linen',
    fabricType: 'Pure Linen',
    category: 'shirt',
    pricePerMeter: 850,
    baseStitchingPrice: 699,
    description: 'Natural organic linen with cool ventilation, ideal for summer custom shirts and kurtas.',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&auto=format&fit=crop&q=80',
    availableColors: ['Off-White', 'Natural Ash', 'Dusty Grey', 'Cloud White'],
    patterns: ['Solid Slub', 'Chambray', 'Vertical Stripes'],
    inStock: true,
  },
  {
    name: 'Italian Stretch Wool Twill',
    fabricType: 'Worsted Wool Blend',
    category: 'pant',
    pricePerMeter: 1200,
    baseStitchingPrice: 899,
    description: 'High performance wrinkle-resistant fabric crafted for custom formal trousers & chinos.',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
    availableColors: ['Gunmetal Grey', 'Charcoal', 'Heather Grey', 'Obsidian Black'],
    patterns: ['Solid', 'Glen Check', 'Houndstooth'],
    inStock: true,
  },
  {
    name: 'Heavyweight French Terry Cotton',
    fabricType: '320 GSM French Terry',
    category: 't-shirt',
    pricePerMeter: 450,
    baseStitchingPrice: 399,
    description: 'Ultra soft knitted structure engineered for custom oversized tees & polo t-shirts.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    availableColors: ['Pure White', 'Melange Grey', 'Stone Grey', 'Coal Black'],
    patterns: ['Solid Matt', 'Acid Wash Effect'],
    inStock: true,
  }
];

const seedDB = async () => {
  await connectDB();

  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Material.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data.');

    // Create Admin Users
    const adminUser = await User.create({
      name: 'Shaya Admin',
      email: 'admin@shayatextile.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9876543210',
      address: {
        street: '124 Textile Avenue, Industrial Zone',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      locationDetails: {
        latitude: 19.0760,
        longitude: 72.8777,
        city: 'Mumbai',
        state: 'Maharashtra',
        ipAddress: '103.21.124.8',
        lastUpdated: new Date(),
      },
    });

    const adminUser2 = await User.create({
      name: 'Mohamed Yar Khan',
      email: 'mohamedyarkhan07@gmail.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9876543210',
      address: {
        street: 'Main Admin Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
      },
      locationDetails: {
        latitude: 13.0827,
        longitude: 80.2707,
        city: 'Chennai',
        state: 'Tamil Nadu',
        ipAddress: '103.21.124.9',
        lastUpdated: new Date(),
      },
    });

    // Create Sample Customer User
    const sampleCustomer = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'User@123',
      role: 'user',
      phone: '+91 9123456789',
      address: {
        street: '45 Heritage Apartments, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
      },
      locationDetails: {
        latitude: 12.9716,
        longitude: 77.5946,
        city: 'Bengaluru',
        state: 'Karnataka',
        ipAddress: '49.207.210.14',
        lastUpdated: new Date(),
      },
    });

    console.log('Created Admin:', adminUser.email, '(Password: Admin@123)');
    console.log('Created Customer:', sampleCustomer.email, '(Password: User@123)');

    // Seed Products & Materials
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${createdProducts.length} ready-made products.`);

    const createdMaterials = await Material.insertMany(sampleMaterials);
    console.log(`Seeded ${createdMaterials.length} custom materials.`);

    // Seed Sample Order
    const sampleOrder = await Order.create({
      orderId: 'SHAYA-84920',
      user: sampleCustomer._id,
      orderType: 'mixed',
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 1,
          size: 'L',
          color: 'Grey',
          image: createdProducts[0].image,
        },
      ],
      customItems: [
        {
          garmentType: 'shirt',
          material: createdMaterials[0]._id,
          materialName: createdMaterials[0].name,
          fabricType: createdMaterials[0].fabricType,
          selectedColor: 'Silver Grey',
          selectedPattern: 'Solid',
          fitType: 'Slim Fit',
          collarStyle: 'Spread Collar',
          sleeveLength: 'Full Sleeve',
          measurements: {
            chest: '40 in',
            waist: '34 in',
            shoulder: '18 in',
            length: '29 in',
            sleeve: '25 in',
          },
          specialInstructions: 'Please use extra grey pearl buttons.',
          customPrice: 1899,
        },
      ],
      totalAmount: 3798,
      shippingAddress: {
        name: sampleCustomer.name,
        phone: sampleCustomer.phone,
        street: sampleCustomer.address.street,
        city: sampleCustomer.address.city,
        state: sampleCustomer.address.state,
        pincode: sampleCustomer.address.pincode,
        locationCoords: {
          latitude: 12.9716,
          longitude: 77.5946,
        },
      },
      paymentMethod: 'UPI',
      isPaid: true,
      paidAt: new Date(),
      status: 'Fabric Cutting & Tailoring',
      trackingSteps: [
        { status: 'Order Placed', title: 'Order Confirmed', description: 'Order received.', timestamp: new Date(Date.now() - 86400000 * 2), completed: true },
        { status: 'Processing', title: 'Processing Order', description: 'Verified material stock.', timestamp: new Date(Date.now() - 86400000 * 1), completed: true },
        { status: 'Fabric Cutting & Tailoring', title: 'Custom Tailoring in Progress', description: 'Master tailor in progress.', timestamp: new Date(), completed: true },
        { status: 'Quality Check', title: 'Quality Check & Packing', description: 'Inspection pending.', timestamp: null, completed: false },
        { status: 'Shipped', title: 'Shipped', description: 'Pending dispatch.', timestamp: null, completed: false },
        { status: 'Out for Delivery', title: 'Out for Delivery', description: 'Pending delivery.', timestamp: null, completed: false },
        { status: 'Delivered', title: 'Delivered', description: 'Pending delivery.', timestamp: null, completed: false },
      ],
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 4),
    });

    console.log(`Seeded demo order ${sampleOrder.orderId} for tracking demonstration.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
