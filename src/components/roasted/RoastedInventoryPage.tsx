import { useState, useEffect } from 'react';
import type { RoastedCoffeeBatch } from '../../entities';
import {
  getAllRoastedBatches,
  addRoastedBatch,
  updateRoastedBatch,
  deleteRoastedBatch,
} from '../../repositories/localStore';
import RoastedBatchForm from './RoastedBatchForm';
import RoastedBatchTable from './RoastedBatchTable';
import './RoastedInventoryPage.css';

export default function RoastedInventoryPage() {
  const [batches, setBatches] = useState<RoastedCoffeeBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBatch, setEditingBatch] = useState<RoastedCoffeeBatch | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    const data = await getAllRoastedBatches();
    setBatches(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  const handleEdit = (batch: RoastedCoffeeBatch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this roasted batch?')) {
      await deleteRoastedBatch(id);
      await loadBatches();
    }
  };

  const handleSave = async (batch: RoastedCoffeeBatch) => {
    if (editingBatch) {
      await updateRoastedBatch(batch);
    } else {
      await addRoastedBatch(batch);
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
      <div className="roasted-inventory-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Loading inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="roasted-inventory-page">
      <div className="page-header">
        <h2>Roasted Coffee Inventory</h2>
        <button className="btn-primary" onClick={handleAddNew}>
          + Add Roasted Batch
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <RoastedBatchForm
              batch={editingBatch}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <RoastedBatchTable
        batches={batches}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={loadBatches}
      />
    </div>
  );
}