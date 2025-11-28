import { useState } from 'react';
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
  const [customers, setCustomers] = useState<Customer[]>(getAllCustomers());
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
      setCustomers(getAllCustomers());
    }
  };

  const handleSave = (customer: Customer) => {
    if (editingCustomer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
    setCustomers(getAllCustomers());
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h2>Customers</h2>
          <p className="page-subtitle">Manage your customer database</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          + Add New Customer
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