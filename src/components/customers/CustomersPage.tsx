import { useState, useEffect } from 'react';
import type { Customer } from '../../entities';
import {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../repositories/localStore';
import CustomerForm from './CustomerForm';
import CustomerTable from './CustomerTable';
import './CustomersPage.css';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const data = await getAllCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
      await loadCustomers();
    }
  };

  const handleSave = async (customer: Customer) => {
    if (editingCustomer) {
      await updateCustomer(customer);
    } else {
      await addCustomer(customer);
    }
    await loadCustomers();
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  if (loading) {
    return (
      <div className="customers-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Loading customers...
        </div>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <h2>Customers</h2>
        <button className="btn-primary" onClick={handleAddNew}>
          + Add Customer
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <CustomerForm
              customer={editingCustomer}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <CustomerTable
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}