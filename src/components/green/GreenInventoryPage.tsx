import { useState } from 'react';
import type { GreenCoffeeBatch } from '../../entities';
import {
  getAllGreenBatches,
  addGreenBatch,
  updateGreenBatch,
  deleteGreenBatch,
} from '../../repositories/localStore';
import GreenBatchForm from './GreenBatchForm';
import GreenBatchTable from './GreenBatchTable';
import './GreenInventoryPage.css';

export default function GreenInventoryPage() {
  const [batches, setBatches] = useState<GreenCoffeeBatch[]>(getAllGreenBatches());
  const [editingBatch, setEditingBatch] = useState<GreenCoffeeBatch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('table');

  const handleAddNew = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  const handleEdit = (batch: GreenCoffeeBatch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      deleteGreenBatch(id);
      setBatches(getAllGreenBatches());
    }
  };

  const handleSave = (batch: GreenCoffeeBatch) => {
    if (editingBatch) {
      updateGreenBatch(batch);
    } else {
      addGreenBatch(batch);
    }
    setBatches(getAllGreenBatches());
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBatch(null);
  };


  return (
    <div className="green-inventory-page">
      <div className="page-header">
        <h2>Green Coffee Inventory</h2>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button
              className={viewMode === 'grouped' ? 'active' : ''}
              onClick={() => setViewMode('grouped')}
            >
              Grouped View
            </button>
          </div>
          <button className="btn-primary" onClick={handleAddNew}>
            + Add New Batch
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <GreenBatchForm
              batch={editingBatch}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <GreenBatchTable
        batches={batches}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewMode={viewMode}
      />
    </div>
  );
}