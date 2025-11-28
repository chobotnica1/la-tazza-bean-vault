import { useState } from 'react';
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
  const [batches, setBatches] = useState<RoastedCoffeeBatch[]>(getAllRoastedBatches());
  const [editingBatch, setEditingBatch] = useState<RoastedCoffeeBatch | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  const handleEdit = (batch: RoastedCoffeeBatch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this roasted batch?')) {
      deleteRoastedBatch(id);
      setBatches(getAllRoastedBatches());
    }
  };

  const handleSave = (batch: RoastedCoffeeBatch) => {
    if (editingBatch) {
      updateRoastedBatch(batch);
    } else {
      addRoastedBatch(batch);
    }
    setBatches(getAllRoastedBatches());
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBatch(null);
  };

  const refreshBatches = () => {
    setBatches(getAllRoastedBatches());
  };

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
        onRefresh={refreshBatches}
      />
    </div>
  );
}