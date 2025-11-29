import { useState, useEffect } from 'react';
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
  const [batches, setBatches] = useState<GreenCoffeeBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBatch, setEditingBatch] = useState<GreenCoffeeBatch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('table');

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    const data = await getAllGreenBatches();
    setBatches(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  const handleEdit = (batch: GreenCoffeeBatch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      await deleteGreenBatch(id);
      await loadBatches();
    }
  };

  const handleSave = async (batch: GreenCoffeeBatch) => {
    if (editingBatch) {
      await updateGreenBatch(batch);
    } else {
      await addGreenBatch(batch);
    }
    await loadBatches();
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBatch(null);
  };

  if (loading) {
    return (
      <div className="green-inventory-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Loading inventory...
        </div>
      </div>
    );
  }

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