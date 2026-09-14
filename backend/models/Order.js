import mongoose from 'mongoose';

const trackingStepSchema = new mongoose.Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, default: 'M' },
  color: { type: String, default: 'White' },
  image: { type: String, default: '' },
});

const customGarmentSchema = new mongoose.Schema({
  garmentType: {
    type: String,
    enum: ['shirt', 'pant', 't-shirt'],
    required: true,
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  materialName: { type: String, default: '' },
  fabricType: { type: String, default: '' },
  selectedColor: { type: String, default: 'White' },
  selectedPattern: { type: String, default: 'Solid' },
  fitType: { type: String, default: 'Slim Fit' },
  collarStyle: { type: String, default: 'Classic' }, // shirt specific
  sleeveLength: { type: String, default: 'Full Sleeve' },
  pantStyle: { type: String, default: 'Chino' }, // pant specific
  tShirtNeck: { type: String, default: 'Round Neck' }, // t-shirt specific
  measurements: {
    chest: { type: String, default: '' },
    waist: { type: String, default: '' },
    hips: { type: String, default: '' },
    length: { type: String, default: '' },
    shoulder: { type: String, default: '' },
    sleeve: { type: String, default: '' },
    inseam: { type: String, default: '' },
  },
  specialInstructions: { type: String, default: '' },
  customPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderType: {
      type: String,
      enum: ['readymade', 'custom', 'mixed'],
      required: true,
      default: 'readymade',
    },
    items: [orderItemSchema],
    customItems: [customGarmentSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      locationCoords: {
        latitude: Number,
        longitude: Number,
      },
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Order Placed', 'Processing', 'Fabric Cutting & Tailoring', 'Quality Check', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    trackingSteps: [trackingStepSchema],
    estimatedDeliveryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
