import { useState, useEffect } from 'react';
import type { CuppingRecord } from '../../entities';
import {
  getAllCuppingRecords,
  addCuppingRecord,
  updateCuppingRecord,
  deleteCuppingRecord,
} from '../../repositories/localStore';
import CuppingForm from './CuppingForm';
import CuppingTable from './CuppingTable';
import './QualityPage.css';

export default function QualityPage() {
  const [records, setRecords] = useState<CuppingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<CuppingRecord | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const data = await getAllCuppingRecords();
    setRecords(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEdit = (record: CuppingRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this cupping record?')) {
      await deleteCuppingRecord(id);
      await loadRecords();
    }
  };

  const handleSave = async (record: CuppingRecord) => {
    if (editingRecord) {
      await updateCuppingRecord(record);
    } else {
      await addCuppingRecord(record);
    }
    await loadRecords();
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  if (loading) {
    return (
      <div className="quality-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Loading cupping records...
        </div>
      </div>
    );
  }

  return (
    <div className="quality-page">
      <div className="page-header">
        <div>
          <h2>Quality & Cupping</h2>
          <p className="page-subtitle">Track cupping scores and quality assessments</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          + Add Cupping Record
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <CuppingForm
              record={editingRecord}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <CuppingTable
        records={records}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}