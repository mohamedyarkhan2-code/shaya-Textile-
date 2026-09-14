import Order from '../models/Order.js';

// Helper to generate readable Order ID like SHAYA-83921
const generateOrderId = () => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `SHAYA-${num}`;
};

// Initial tracking steps generator
const createInitialTrackingSteps = (orderType) => {
  const steps = [
    {
      status: 'Order Placed',
      title: 'Order Confirmed',
      description: 'Your order has been placed and received by Shaya Textile.',
      timestamp: new Date(),
      completed: true,
    },
    {
      status: 'Processing',
      title: 'Processing Order',
      description: 'Order details and inventory verified.',
      timestamp: null,
      completed: false,
    },
  ];

  if (orderType === 'custom' || orderType === 'mixed') {
    steps.push({
      status: 'Fabric Cutting & Tailoring',
      title: 'Custom Tailoring in Progress',
      description: 'Master tailors are cutting fabric & stitching as per your measurements.',
      timestamp: null,
      completed: false,
    });
  }

  steps.push(
    {
      status: 'Quality Check',
      title: 'Quality Check & Packing',
      description: 'Inspected for premium finish and packed carefully.',
      timestamp: null,
      completed: false,
    },
    {
      status: 'Shipped',
      title: 'Shipped',
      description: 'Handed over to courier partner.',
      timestamp: null,
      completed: false,
    },
    {
      status: 'Out for Delivery',
      title: 'Out for Delivery',
      description: 'Delivery executive is on the way to your address.',
      timestamp: null,
      completed: false,
    },
    {
      status: 'Delivered',
      title: 'Delivered',
      description: 'Package delivered safely.',
      timestamp: null,
      completed: false,
    }
  );

  return steps;
};

// @desc    Create new order (Ready-made or Custom)
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, customItems, totalAmount, shippingAddress, paymentMethod, orderType } = req.body;

    if ((!items || items.length === 0) && (!customItems || customItems.length === 0)) {
      return res.status(400).json({ message: 'No items or custom designs in order' });
    }

    const estDelivery = new Date();
    estDelivery.setDate(estDelivery.getDate() + (orderType === 'custom' || orderType === 'mixed' ? 7 : 4));

    const order = new Order({
      orderId: generateOrderId(),
      user: req.user._id,
      orderType: orderType || 'readymade',
      items: items || [],
      customItems: customItems || [],
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      isPaid: paymentMethod === 'Online Payment' || paymentMethod === 'UPI',
      paidAt: paymentMethod === 'Online Payment' || paymentMethod === 'UPI' ? new Date() : null,
      status: 'Order Placed',
      trackingSteps: createInitialTrackingSteps(orderType),
      estimatedDeliveryDate: estDelivery,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID or orderId (e.g. SHAYA-12345) — public for SHAYA- IDs
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    if (id.startsWith('SHAYA-')) {
      // Public access: anyone can track by SHAYA- order ID (like Flipkart)
      order = await Order.findOne({ orderId: id }).populate('user', 'name email phone');
      if (!order) {
        return res.status(404).json({ message: 'Order not found. Please check your Order ID (e.g. SHAYA-84920).' });
      }
      return res.json(order);
    }

    // For MongoDB _id lookups, require auth
    order = await Order.findById(id).populate('user', 'name email phone locationDetails');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions: user can view own order, admin can view all orders
    if (!req.user) {
      return res.status(401).json({ message: 'Please login to view this order' });
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone address locationDetails')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    // Mark tracking steps up to the updated status as completed
    let statusFound = false;
    order.trackingSteps = order.trackingSteps.map((step) => {
      if (step.status === status) {
        statusFound = true;
        return {
          ...step.toObject(),
          completed: true,
          timestamp: new Date(),
          description: note || step.description,
        };
      }
      if (!statusFound) {
        return {
          ...step.toObject(),
          completed: true,
        };
      }
      return step;
    });

    if (status === 'Delivered') {
      order.isPaid = true;
      if (!order.paidAt) order.paidAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
