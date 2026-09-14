import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMaterialsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { Scissors, Check, Info, ShieldCheck, Ruler, ArrowRight, Layers } from 'lucide-react';
import './Customize.css';

const Customize = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'shirt';

  const [garmentType, setGarmentType] = useState(initialType);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  
  // Customization Options
  const [fitType, setFitType] = useState('Slim Fit');
  const [collarStyle, setCollarStyle] = useState('Classic Collar');
  const [sleeveLength, setSleeveLength] = useState('Full Sleeve');
  const [pantStyle, setPantStyle] = useState('Chino Flat Front');
  const [tShirtNeck, setTShirtNeck] = useState('Round Neck');
  
  // Body Measurements
  const [measurements, setMeasurements] = useState({
    chest: '38',
    waist: '32',
    hips: '38',
    length: '28',
    shoulder: '17.5',
    sleeve: '24.5',
    inseam: '30',
  });
  
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(true);

  const { addCustomToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, [garmentType]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data } = await getMaterialsApi({ category: garmentType });
      setMaterials(data);
      if (data.length > 0) {
        setSelectedMaterial(data[0]);
        setSelectedColor(data[0].availableColors[0] || 'White');
        setSelectedPattern(data[0].patterns[0] || 'Solid');
      }
    } catch (err) {
      console.error('Error loading custom materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialSelect = (mat) => {
    setSelectedMaterial(mat);
    setSelectedColor(mat.availableColors[0] || 'White');
    setSelectedPattern(mat.patterns[0] || 'Solid');
  };

  // Calculate Price: (pricePerMeter * metersNeeded) + baseStitchingPrice
  const calculatePrice = () => {
    if (!selectedMaterial) return 1499;
    const metersNeeded = garmentType === 'shirt' ? 2.2 : garmentType === 'pant' ? 1.4 : 1.2;
    const fabricCost = Math.round(selectedMaterial.pricePerMeter * metersNeeded);
    return fabricCost + selectedMaterial.baseStitchingPrice;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    const customDesign = {
      garmentType,
      material: selectedMaterial._id,
      materialName: selectedMaterial.name,
      fabricType: selectedMaterial.fabricType,
      selectedColor,
      selectedPattern,
      fitType,
      collarStyle: garmentType === 'shirt' ? collarStyle : '',
      sleeveLength: garmentType === 'shirt' ? sleeveLength : '',
      pantStyle: garmentType === 'pant' ? pantStyle : '',
      tShirtNeck: garmentType === 't-shirt' ? tShirtNeck : '',
      measurements,
      specialInstructions,
      customPrice: calculatePrice(),
    };

    addCustomToCart(customDesign);
    navigate('/cart');
  };

  return (
    <div className="customize-page container">
      <div className="customize-header">
        <div className="badge badge-admin">
          <Scissors size={14} /> SHAYA BESPOKE STUDIO
        </div>
        <h1>Custom Clothing Tailoring Wizard</h1>
        <p>Design your custom Shirt, Pant, or T-Shirt. Select cloth fabric from Admin inventory & enter custom measurements.</p>
      </div>

      <div className="wizard-layout">
        {/* Left Options Panel */}
        <div className="wizard-steps-panel">
          {/* STEP 1: Select Garment Type */}
          <div className="wizard-step-box">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Select Garment Type</h3>
              <div className="garment-type-grid">
                {[
                  { id: 'shirt', label: 'Custom Shirt', icon: '👔' },
                  { id: 'pant', label: 'Custom Pant', icon: '👖' },
                  { id: 't-shirt', label: 'Custom T-Shirt', icon: '👕' },
                ].map((g) => (
                  <button
                    key={g.id}
                    className={`garment-btn ${garmentType === g.id ? 'selected' : ''}`}
                    onClick={() => setGarmentType(g.id)}
                  >
                    <span className="garment-icon">{g.icon}</span>
                    <span className="garment-label">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 2: Select Admin Material / Cloth */}
          <div className="wizard-step-box">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>Choose Cloth / Material Fabric</h3>
              <p className="step-desc">Select premium fabric curated by Shaya Textile Admin.</p>

              {loading ? (
                <div className="loading-spinner">Loading materials...</div>
              ) : (
                <div className="materials-selection-grid">
                  {materials.map((mat) => (
                    <div
                      key={mat._id}
                      className={`material-choice-card ${selectedMaterial?._id === mat._id ? 'active' : ''}`}
                      onClick={() => handleMaterialSelect(mat)}
                    >
                      <img src={mat.image} alt={mat.name} className="mat-thumb" />
                      <div className="mat-choice-info">
                        <h4>{mat.name}</h4>
                        <span className="mat-fabric-tag">{mat.fabricType}</span>
                        <div className="mat-pricing">
                          <span>₹{mat.pricePerMeter}/meter</span> + <span>Stitching ₹{mat.baseStitchingPrice}</span>
                        </div>
                      </div>
                      {selectedMaterial?._id === mat._id && <Check className="check-icon" size={20} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Color & Pattern */}
          {selectedMaterial && (
            <div className="wizard-step-box">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Select Fabric Color & Weave Pattern</h3>
                
                <div className="option-subgroup">
                  <label>Available Fabric Colors:</label>
                  <div className="color-options">
                    {selectedMaterial.availableColors.map((color) => (
                      <button
                        key={color}
                        className={`color-pill ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="option-subgroup">
                  <label>Weave / Pattern:</label>
                  <div className="color-options">
                    {selectedMaterial.patterns.map((pat) => (
                      <button
                        key={pat}
                        className={`color-pill ${selectedPattern === pat ? 'selected' : ''}`}
                        onClick={() => setSelectedPattern(pat)}
                      >
                        {pat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Styling Details */}
          <div className="wizard-step-box">
            <div className="step-number">04</div>
            <div className="step-content">
              <h3>Fit & Styling Customizations</h3>
              
              <div className="styling-form-grid">
                <div className="form-group">
                  <label>Overall Fit Type</label>
                  <select value={fitType} onChange={(e) => setFitType(e.target.value)}>
                    <option value="Slim Fit">Slim Fit (Modern Tailored)</option>
                    <option value="Regular Fit">Regular Fit (Classic Comfort)</option>
                    <option value="Relaxed / Oversized">Relaxed / Oversized</option>
                  </select>
                </div>

                {garmentType === 'shirt' && (
                  <>
                    <div className="form-group">
                      <label>Collar Style</label>
                      <select value={collarStyle} onChange={(e) => setCollarStyle(e.target.value)}>
                        <option value="Classic Collar">Classic Point Collar</option>
                        <option value="Spread Collar">Spread Italian Collar</option>
                        <option value="Mandarin / Band Collar">Mandarin / Band Collar</option>
                        <option value="Button Down Collar">Button-Down Casual</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Sleeve Length</label>
                      <select value={sleeveLength} onChange={(e) => setSleeveLength(e.target.value)}>
                        <option value="Full Sleeve">Full Sleeve (With Cuff)</option>
                        <option value="Half Sleeve">Half Sleeve</option>
                      </select>
                    </div>
                  </>
                )}

                {garmentType === 'pant' && (
                  <div className="form-group">
                    <label>Pant Style</label>
                    <select value={pantStyle} onChange={(e) => setPantStyle(e.target.value)}>
                      <option value="Chino Flat Front">Chino Flat Front</option>
                      <option value="Pleated Formal">Pleated Formal Trouser</option>
                      <option value="Slim Stretch Pant">Slim Stretch Pant</option>
                    </select>
                  </div>
                )}

                {garmentType === 't-shirt' && (
                  <div className="form-group">
                    <label>Neckline Style</label>
                    <select value={tShirtNeck} onChange={(e) => setTShirtNeck(e.target.value)}>
                      <option value="Round Neck">Classic Crew Round Neck</option>
                      <option value="V-Neck">V-Neck Style</option>
                      <option value="Polo Collar">Polo Collar Neck</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STEP 5: Body Measurements */}
          <div className="wizard-step-box">
            <div className="step-number">05</div>
            <div className="step-content">
              <h3>Body Measurements (Inches)</h3>
              <p className="step-desc">Enter your exact measurements. Our tailors adjust for seam allowances.</p>

              <div className="measurements-grid">
                {garmentType === 'shirt' && (
                  <>
                    <div className="m-group">
                      <label>Chest (inches)</label>
                      <input
                        type="number"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Waist (inches)</label>
                      <input
                        type="number"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Shoulder Width (inches)</label>
                      <input
                        type="number"
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Shirt Length (inches)</label>
                      <input
                        type="number"
                        value={measurements.length}
                        onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Sleeve Length (inches)</label>
                      <input
                        type="number"
                        value={measurements.sleeve}
                        onChange={(e) => setMeasurements({ ...measurements, sleeve: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {garmentType === 'pant' && (
                  <>
                    <div className="m-group">
                      <label>Waist (inches)</label>
                      <input
                        type="number"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Hip (inches)</label>
                      <input
                        type="number"
                        value={measurements.hips}
                        onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Inseam Length (inches)</label>
                      <input
                        type="number"
                        value={measurements.inseam}
                        onChange={(e) => setMeasurements({ ...measurements, inseam: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Outseam Full Length (inches)</label>
                      <input
                        type="number"
                        value={measurements.length}
                        onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {garmentType === 't-shirt' && (
                  <>
                    <div className="m-group">
                      <label>Chest (inches)</label>
                      <input
                        type="number"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>T-Shirt Length (inches)</label>
                      <input
                        type="number"
                        value={measurements.length}
                        onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                      />
                    </div>
                    <div className="m-group">
                      <label>Shoulder (inches)</label>
                      <input
                        type="number"
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-group margin-top-md">
                <label>Special Instructions for Tailor (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Please add pearl buttons, extra room around biceps, or specific embroidery note..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Card (Sticky) */}
        <div className="wizard-summary-sidebar">
          <div className="summary-card">
            <h3>Custom Order Summary</h3>
            
            {selectedMaterial ? (
              <div className="summary-details">
                <div className="summary-preview-img">
                  <img src={selectedMaterial.image} alt={selectedMaterial.name} />
                  <div className="summary-garment-badge">
                    {garmentType.toUpperCase()}
                  </div>
                </div>

                <div className="summary-row">
                  <span>Garment Type:</span>
                  <strong>{garmentType === 'shirt' ? 'Custom Shirt' : garmentType === 'pant' ? 'Custom Pant' : 'Custom T-Shirt'}</strong>
                </div>

                <div className="summary-row">
                  <span>Cloth Fabric:</span>
                  <strong>{selectedMaterial.name}</strong>
                </div>

                <div className="summary-row">
                  <span>Selected Color:</span>
                  <strong>{selectedColor}</strong>
                </div>

                <div className="summary-row">
                  <span>Pattern:</span>
                  <strong>{selectedPattern}</strong>
                </div>

                <div className="summary-row">
                  <span>Fit Preference:</span>
                  <strong>{fitType}</strong>
                </div>

                <hr className="summary-divider" />

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Fabric Cost:</span>
                    <span>₹{calculatePrice() - selectedMaterial.baseStitchingPrice}</span>
                  </div>
                  <div className="price-row">
                    <span>Master Stitching:</span>
                    <span>₹{selectedMaterial.baseStitchingPrice}</span>
                  </div>
                  <div className="price-row total-row">
                    <span>Total Custom Price:</span>
                    <span className="total-price-tag">₹{calculatePrice()}</span>
                  </div>
                </div>

                <button onClick={handleAddToCart} className="btn btn-primary width-100 margin-top-md">
                  <Scissors size={18} /> Add Custom Garment to Cart
                </button>
              </div>
            ) : (
              <p>Select a fabric to view pricing</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
