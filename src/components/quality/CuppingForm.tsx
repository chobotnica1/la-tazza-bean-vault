import { useState, useEffect } from 'react';
import type { CuppingRecord } from '../../entities';
import { getAllGreenBatches } from '../../repositories/localStore';
import './CuppingForm.css';

interface CuppingFormProps {
  record: CuppingRecord | null;
  onSave: (record: CuppingRecord) => void;
  onCancel: () => void;
}

const COMMON_DESCRIPTORS = [
  'Floral', 'Fruity', 'Berry', 'Citrus', 'Chocolate', 'Caramel', 'Nutty',
  'Sweet', 'Bright', 'Clean', 'Balanced', 'Complex', 'Smooth', 'Creamy',
  'Winey', 'Earthy', 'Spicy', 'Herbal', 'Honey', 'Vanilla', 'Stone Fruit',
  'Tropical', 'Apple', 'Grape', 'Cherry', 'Blackcurrant', 'Tea-like',
  'Jasmine', 'Bergamot', 'Cocoa', 'Molasses', 'Brown Sugar'
];

export default function CuppingForm({ record, onSave, onCancel }: CuppingFormProps) {
  const [formData, setFormData] = useState<Partial<CuppingRecord>>({
    date: new Date().toISOString().split('T')[0],
    variety: '',
    origin: '',
    farm: '',
    greenBatchId: '',
    score: 80,
    sweetness: undefined,
    acidity: undefined,
    body: undefined,
    finish: undefined,
    uniformity: undefined,
    balance: undefined,
    cleanliness: undefined,
    descriptors: [],
    notes: '',
  });

  const [customDescriptor, setCustomDescriptor] = useState('');
  const greenBatches = getAllGreenBatches();

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || undefined : value,
    }));
  };

  const handleBatchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchId = e.target.value;
    if (batchId) {
      const batch = greenBatches.find(b => b.id === batchId);
      if (batch) {
        setFormData((prev) => ({
          ...prev,
          greenBatchId: batchId,
          variety: batch.variety,
          origin: batch.origin,
          farm: batch.farm,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        greenBatchId: '',
      }));
    }
  };

  const toggleDescriptor = (descriptor: string) => {
    setFormData((prev) => {
      const current = prev.descriptors || [];
      const newDescriptors = current.includes(descriptor)
        ? current.filter(d => d !== descriptor)
        : [...current, descriptor];
      return { ...prev, descriptors: newDescriptors };
    });
  };

  const addCustomDescriptor = () => {
    if (customDescriptor.trim()) {
      setFormData((prev) => ({
        ...prev,
        descriptors: [...(prev.descriptors || []), customDescriptor.trim()],
      }));
      setCustomDescriptor('');
    }
  };

  const removeDescriptor = (descriptor: string) => {
    setFormData((prev) => ({
      ...prev,
      descriptors: (prev.descriptors || []).filter(d => d !== descriptor),
    }));
  };

  const calculateTotalScore = (): number => {
    const components = [
      formData.sweetness,
      formData.acidity,
      formData.body,
      formData.finish,
      formData.uniformity,
      formData.balance,
      formData.cleanliness,
    ];

    const validScores = components.filter(s => s !== undefined) as number[];
    if (validScores.length === 0) return formData.score || 80;

    const total = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round((total / validScores.length) * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.variety || !formData.origin) {
      alert('Please fill in variety and origin');
      return;
    }

    const calculatedScore = calculateTotalScore();

    const recordToSave: CuppingRecord = {
      id: record?.id || `cupping-${Date.now()}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      variety: formData.variety!,
      origin: formData.origin!,
      farm: formData.farm,
      greenBatchId: formData.greenBatchId,
      score: calculatedScore,
      sweetness: formData.sweetness,
      acidity: formData.acidity,
      body: formData.body,
      finish: formData.finish,
      uniformity: formData.uniformity,
      balance: formData.balance,
      cleanliness: formData.cleanliness,
      descriptors: formData.descriptors,
      notes: formData.notes,
    };

    onSave(recordToSave);
  };

  return (
    <form className="cupping-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{record ? 'Edit Cupping Record' : 'New Cupping Record'}</h3>
        <button type="button" onClick={onCancel} className="btn-close">
          ✕
        </button>
      </div>

      <div className="form-body">
        {/* Basic Information */}
        <div className="form-section">
          <h4>Basic Information</h4>
          
          <div className="form-group">
            <label>Link to Green Batch (Optional)</label>
            <select value={formData.greenBatchId || ''} onChange={handleBatchSelect}>
              <option value="">Select a batch...</option>
              {greenBatches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.variety} - {batch.origin} ({batch.receivedDate})
                </option>
              ))}
            </select>
            <small>Auto-fills variety, origin, and farm</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Date <span className="required">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Variety <span className="required">*</span>
              </label>
              <input
                type="text"
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                placeholder="e.g., Ethiopia Yirgacheffe"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Origin <span className="required">*</span>
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g., Ethiopia"
                required
              />
            </div>

            <div className="form-group">
              <label>Farm</label>
              <input
                type="text"
                name="farm"
                value={formData.farm}
                onChange={handleChange}
                placeholder="e.g., Kochere Cooperative"
              />
            </div>
          </div>
        </div>

        {/* SCA Scoring */}
        <div className="form-section">
          <h4>SCA Cupping Protocol Scores (0-10 scale)</h4>
          <p className="section-note">
            Total score will be calculated automatically from component scores
          </p>

          <div className="scores-grid">
            <div className="form-group">
              <label>Sweetness</label>
              <input
                type="number"
                name="sweetness"
                value={formData.sweetness || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.25"
                placeholder="0-10"
              />
            </div>

            <div className="form-group">
              <label>Acidity</label>
              <input
                type="number"
                name="acidity"
                value={formData.acidity || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.25"
                placeholder="0-10"
              />
            </div>

            <div className="form-group">
              <label>Body</label>
              <input
                type="number"
                name="body"
                value={formData.body || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.25"
                placeholder="0-10"
              />
            </div>

            <div className="form-group">
              <label>Finish</label>
              <input
                type="number"
                name="finish"
                value={formData.finish || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.25"
                placeholder="0-10"
              />
            </div>

            <div className="form-group">
              <label>Uniformity</label>
              <input
                type="number"
                name="uniformity"
                value={formData.uniformity || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.25"
                placeholder="0-10"
              />
            </div>

            <div className="form-group">
              <label>Balance</label>
              <input
                type="number"
                name="balance"
                value={formData.balance || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.25"
                placeholder="0-10"
              />
            </div>

            <div className="form-group">
              <label>Cleanliness</label>
              <input
                type="number"
                name="cleanliness"
                value={formData.cleanliness || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.25"
                placeholder="0-10"
              />
            </div>
          </div>

          <div className="calculated-score">
            <label>Calculated Total Score:</label>
            <span className="score-display">{calculateTotalScore().toFixed(1)}</span>
          </div>
        </div>

        {/* Flavor Descriptors */}
        <div className="form-section">
          <h4>Flavor Descriptors</h4>
          
          <div className="descriptors-selection">
            {COMMON_DESCRIPTORS.map(desc => (
              <button
                key={desc}
                type="button"
                className={`descriptor-btn ${(formData.descriptors || []).includes(desc) ? 'selected' : ''}`}
                onClick={() => toggleDescriptor(desc)}
              >
                {desc}
              </button>
            ))}
          </div>

          <div className="custom-descriptor">
            <input
              type="text"
              value={customDescriptor}
              onChange={(e) => setCustomDescriptor(e.target.value)}
              placeholder="Add custom descriptor..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomDescriptor();
                }
              }}
            />
            <button type="button" onClick={addCustomDescriptor} className="btn-add">
              Add
            </button>
          </div>

          {formData.descriptors && formData.descriptors.length > 0 && (
            <div className="selected-descriptors">
              <label>Selected Descriptors:</label>
              <div className="descriptor-tags">
                {formData.descriptors.map((desc, idx) => (
                  <span key={idx} className="descriptor-tag">
                    {desc}
                    <button
                      type="button"
                      onClick={() => removeDescriptor(desc)}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="form-section">
          <h4>Cupping Notes</h4>
          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={5}
              placeholder="Additional tasting notes, observations, defects, etc..."
            />
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          {record ? 'Update Record' : 'Save Record'}
        </button>
      </div>
    </form>
  );
}