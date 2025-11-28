import { useState, useMemo } from 'react';
import type { Customer } from '../../entities';
import './CustomerTable.css';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.city.toLowerCase().includes(search) ||
        customer.state.toLowerCase().includes(search) ||
        (customer.phone && customer.phone.toLowerCase().includes(search))
      );
    });
  }, [customers, searchTerm]);

  return (
    <div className="customer-table">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by name, email, city, state, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="table-stats">
          <span>{filteredCustomers.length} customers</span>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <p>No customers found.</p>
          <small>
            {searchTerm ? 'Try adjusting your search' : 'Click "Add New Customer" to get started'}
          </small>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="name-cell">{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '—'}</td>
                  <td>
                    {customer.city}, {customer.state}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onEdit(customer)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => onDelete(customer.id)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}