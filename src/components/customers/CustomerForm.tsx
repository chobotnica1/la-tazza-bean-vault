import { useState, useEffect } from 'react';
import type { Customer } from '../../entities';
import './CustomerForm.css';

interface CustomerFormProps {
  customer: Customer | null;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    taxId: '',
    notes: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.city || !formData.state) {
      alert('Please fill in all required fields');
      return;
    }

    const customerToSave: Customer = {
      id: customer?.id || `customer-${Date.now()}`,
      name: formData.name!,
      email: formData.email!,
      phone: formData.phone || '',
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2,
      city: formData.city!,
      state: formData.state!,
      postalCode: formData.postalCode || '',
      country: formData.country || 'USA',
      taxId: formData.taxId,
      notes: formData.notes,
    };

    onSave(customerToSave);
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{customer ? 'Edit Customer' : 'Add New Customer'}</h3>
        <button type="button" onClick={onCancel} className="btn-close">
          ✕
        </button>
      </div>

      <div className="form-body">
        <div className="form-section">
          <h4>Contact Information</h4>
          <div className="form-group">
            <label>
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Business or individual name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="555-0123"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Address</h4>
          <div className="form-group">
            <label>Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Apt, suite, etc. (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Houston"
                required
              />
            </div>

            <div className="form-group">
              <label>
                State <span className="required">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="TX"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="77002"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="USA"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Additional Information</h4>
          <div className="form-group">
            <label>Tax ID</label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              placeholder="EIN or SSN (optional)"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional notes about this customer..."
            />
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          {customer ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>
    </form>
  );
}