import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fabricType: {
      type: String,
      required: true, // Cotton, Linen, Silk, Denim, Poly-Blend, Oxford, Twill
    },
    category: {
      type: String,
      required: true,
      enum: ['shirt', 'pant', 't-shirt', 'all'],
      default: 'all',
    },
    pricePerMeter: {
      type: Number,
      required: true,
    },
    baseStitchingPrice: {
      type: Number,
      required: true,
      default: 499,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    availableColors: {
      type: [String],
      default: ['White', 'Light Grey', 'Charcoal Grey', 'Ash', 'Slate'],
    },
    patterns: {
      type: [String],
      default: ['Solid', 'Striped', 'Checkered', 'Textured'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Material = mongoose.model('Material', materialSchema);
export default Material;
