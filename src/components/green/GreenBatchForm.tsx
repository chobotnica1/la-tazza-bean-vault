import { useState, useEffect } from 'react';
import type { GreenCoffeeBatch, CoffeeRating, WeightUnit } from '../../entities';
import './GreenBatchForm.css';

interface GreenBatchFormProps {
  batch: GreenCoffeeBatch | null;
  onSave: (batch: GreenCoffeeBatch) => void;
  onCancel: () => void;
}

export default function GreenBatchForm({ batch, onSave, onCancel }: GreenBatchFormProps) {
  const [formData, setFormData] = useState<Partial<GreenCoffeeBatch>>({
    variety: '',
    origin: '',
    farm: '',
    importer: '',
    warehouse: '',
    bagSizeValue: 60,
    bagSizeUnit: 'kg',
    quantityBags: 1,
    rating: 'AA',
    pricePerUnit: 0,
    priceUnit: 'lb',
    deliveryCost: 0,
    receivedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (batch) {
      // Parse bagSize if it exists
      if (batch.bagSize) {
        const parts = batch.bagSize.split(' ');
        if (parts.length === 2) {
          setFormData({
            ...batch,
            bagSizeValue: parseFloat(parts[0]) || 60,
            bagSizeUnit: parts[1] as WeightUnit || 'kg',
          });
          return;
        }
      }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.variety || !formData.origin || !formData.warehouse) {
      alert('Please fill in all required fields');
      return;
    }

    // Combine bagSizeValue and bagSizeUnit into bagSize
    const bagSize = `${formData.bagSizeValue || 60} ${formData.bagSizeUnit || 'kg'}`;

    const batchToSave: GreenCoffeeBatch = {
      id: batch?.id || crypto.randomUUID(),
      variety: formData.variety!,
      origin: formData.origin!,
      farm: formData.farm || '',
      importer: formData.importer || '',
      warehouse: formData.warehouse!,
      bagSize: bagSize,
      quantityBags: formData.quantityBags || 1,
      rating: (formData.rating as CoffeeRating) || 'AA',
      pricePerBag: formData.pricePerUnit || 0,
      receivedDate: formData.receivedDate || new Date().toISOString().split('T')[0],
      notes: formData.notes,
    };

    onSave(batchToSave);
  };

  return (
    <form className="green-batch-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{batch ? 'Edit Green Coffee Batch' : 'Add New Green Coffee Batch'}</h3>
        <button type="button" onClick={onCancel} className="btn-close">
          ✕
        </button>
      </div>

      <div className="form-body">
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
              <label>Farm</label>
              <input
                type="text"
                name="farm"
                value={formData.farm}
                onChange={handleChange}
                placeholder="e.g., Kochere Cooperative"
              />
            </div>

            <div className="form-group">
              <label>Importer</label>
              <input
                type="text"
                name="importer"
                value={formData.importer}
                onChange={handleChange}
                placeholder="e.g., Sweet Maria's"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Rating <span className="required">*</span>
            </label>
            <select name="rating" value={formData.rating} onChange={handleChange} required>
              <option value="AAA+">AAA+</option>
              <option value="AAA">AAA</option>
              <option value="AA">AA</option>
              <option value="A">A</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h4>Inventory Details</h4>
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

          <div className="form-row">
            <div className="form-group">
              <label>Bag Size</label>
              <div className="input-group">
                <input
                  type="number"
                  name="bagSizeValue"
                  value={formData.bagSizeValue}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
                <select name="bagSizeUnit" value={formData.bagSizeUnit} onChange={handleChange}>
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="g">g</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Received Date</label>
              <input
                type="date"
                name="receivedDate"
                value={formData.receivedDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Pricing</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Price per Bag</label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Cost</label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  name="deliveryCost"
                  value={formData.deliveryCost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
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
              placeholder="Additional notes about this batch..."
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