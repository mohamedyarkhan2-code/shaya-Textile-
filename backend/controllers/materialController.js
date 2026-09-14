import Material from '../models/Material.js';

// @desc    Fetch all fabrics/materials
// @route   GET /api/materials
export const getMaterials = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = { $in: [category.toLowerCase(), 'all'] };
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch material by ID
// @route   GET /api/materials/:id
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (material) {
      res.json(material);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create material (Admin only)
// @route   POST /api/materials
export const createMaterial = async (req, res) => {
  try {
    const { name, fabricType, category, pricePerMeter, baseStitchingPrice, description, image, availableColors, patterns, inStock } = req.body;

    const material = new Material({
      name,
      fabricType,
      category: category || 'all',
      pricePerMeter,
      baseStitchingPrice: baseStitchingPrice || 499,
      description,
      image,
      availableColors: availableColors || ['White', 'Light Grey', 'Charcoal Grey', 'Ash', 'Slate'],
      patterns: patterns || ['Solid', 'Striped', 'Checkered', 'Textured'],
      inStock: inStock !== undefined ? inStock : true,
    });

    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update material (Admin only)
// @route   PUT /api/materials/:id
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const { name, fabricType, category, pricePerMeter, baseStitchingPrice, description, image, availableColors, patterns, inStock } = req.body;

    material.name = name || material.name;
    material.fabricType = fabricType || material.fabricType;
    material.category = category || material.category;
    material.pricePerMeter = pricePerMeter !== undefined ? pricePerMeter : material.pricePerMeter;
    material.baseStitchingPrice = baseStitchingPrice !== undefined ? baseStitchingPrice : material.baseStitchingPrice;
    material.description = description || material.description;
    material.image = image || material.image;
    if (availableColors) material.availableColors = availableColors;
    if (patterns) material.patterns = patterns;
    if (inStock !== undefined) material.inStock = inStock;

    const updatedMaterial = await material.save();
    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete material (Admin only)
// @route   DELETE /api/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (material) {
      await Material.findByIdAndDelete(req.params.id);
      res.json({ message: 'Material removed' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
