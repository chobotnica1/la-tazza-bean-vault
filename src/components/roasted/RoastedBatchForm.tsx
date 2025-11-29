// @ts-nocheck
import { useState, useEffect } from 'react';
import type { RoastedCoffeeBatch, RoastLevel, FormatType, WeightUnit, GreenCoffeeBatch } from '../../entities';
import { getAllGreenBatches } from '../../repositories/localStore';
import './RoastedBatchForm.css';

interface RoastedBatchFormProps {
  batch: RoastedCoffeeBatch | null;
  onSave: (batch: RoastedCoffeeBatch) => void;
  onCancel: () => void;
}

export default function RoastedBatchForm({ batch, onSave, onCancel }: RoastedBatchFormProps) {
  const [formData, setFormData] = useState<Partial<RoastedCoffeeBatch>>({
    variety: '',
    origin: '',
    rating: 'AA',
    roastLevel: 'Medium',
    formatType: '12oz',
    formatSizeValue: undefined,
    formatSizeUnit: 'oz',
    quantityBags: 1,
    warehouse: '',
    roastDate: new Date().toISOString().split('T')[0],
    notes: '',
    linkedGreenBatchId: '',
  });

  const [greenBatches, setGreenBatches] = useState<GreenCoffeeBatch[]>([]);

useEffect(() => {
  getAllGreenBatches().then(setGreenBatches);
}, []);

  useEffect(() => {
    if (batch) {
      setFormData(batch);
    }
  }, [batch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleGreenBatchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchId = e.target.value;
    if (batchId) {
      const greenBatch = greenBatches.find(b => b.id === batchId);
      if (greenBatch) {
        setFormData((prev) => ({
          ...prev,
          linkedGreenBatchId: batchId,
          variety: greenBatch.variety,
          origin: greenBatch.origin,
          rating: greenBatch.rating,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        linkedGreenBatchId: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.variety || !formData.origin || !formData.warehouse) {
      alert('Please fill in all required fields');
      return;
    }

    const batchToSave: RoastedCoffeeBatch = {
      id: batch?.id || crypto.randomUUID(),
      variety: formData.variety!,
      origin: formData.origin!,
      rating: formData.rating as any || 'AA',
      roastLevel: (formData.roastLevel as RoastLevel) || 'Medium',
      formatType: (formData.formatType as FormatType) || '12oz',
      formatSizeValue: formData.formatSizeValue,
      formatSizeUnit: formData.formatSizeUnit as WeightUnit,
      quantityBags: formData.quantityBags || 1,
      warehouse: formData.warehouse!,
      roastDate: formData.roastDate || new Date().toISOString().split('T')[0],
      notes: formData.notes,
      linkedGreenBatchId: formData.linkedGreenBatchId,
    };

    onSave(batchToSave);
  };

  return (
    <form className="roasted-batch-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{batch ? 'Edit Roasted Batch' : 'Add New Roasted Batch'}</h3>
        <button type="button" onClick={onCancel} className="btn-close">
          ✕
        </button>
      </div>

      <div className="form-body">
        <div className="form-section">
          <h4>Link to Green Batch (Optional)</h4>
          <div className="form-group">
            <select 
              value={formData.linkedGreenBatchId || ''} 
              onChange={handleGreenBatchSelect}
            >
              <option value="">Select green batch to auto-fill...</option>
              {greenBatches.map(gb => (
                <option key={gb.id} value={gb.id}>
                  {gb.variety} - {gb.origin} ({gb.receivedDate})
                </option>
              ))}
            </select>
            <small>Auto-fills variety, origin, and rating</small>
          </div>
        </div>

        <div className="form-section">
          <h4>Coffee Information</h4>
          <div className="form-row">
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating</label>
              <select name="rating" value={formData.rating} onChange={handleChange}>
                <option value="AAA+">AAA+</option>
                <option value="AAA">AAA</option>
                <option value="AA">AA</option>
                <option value="A">A</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Roast Level <span className="required">*</span>
              </label>
              <select name="roastLevel" value={formData.roastLevel} onChange={handleChange} required>
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
                <option value="Espresso">Espresso</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Format & Quantity</h4>
          <div className="form-row">
            <div className="form-group">
              <label>
                Format Type <span className="required">*</span>
              </label>
              <select name="formatType" value={formData.formatType} onChange={handleChange} required>
                <option value="12oz">12oz (Retail)</option>
                <option value="5kg">5kg (Wholesale)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Quantity (Bags) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="quantityBags"
                value={formData.quantityBags}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          {formData.formatType === 'custom' && (
            <div className="form-row">
              <div className="form-group">
                <label>Custom Format Size</label>
                <div className="input-group">
                  <input
                    type="number"
                    name="formatSizeValue"
                    value={formData.formatSizeValue || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="Size"
                  />
                  <select name="formatSizeUnit" value={formData.formatSizeUnit} onChange={handleChange}>
                    <option value="oz">oz</option>
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h4>Storage & Date</h4>
          <div className="form-row">
            <div className="form-group">
              <label>
                Warehouse <span className="required">*</span>
              </label>
              <input
                type="text"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                placeholder="e.g., Main Warehouse"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Roast Date <span className="required">*</span>
              </label>
              <input
                type="date"
                name="roastDate"
                value={formData.roastDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Notes</h4>
          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Roast profile notes, tasting notes, etc..."
            />
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          {batch ? 'Update Batch' : 'Add Batch'}
        </button>
      </div>
    </form>
  );
}