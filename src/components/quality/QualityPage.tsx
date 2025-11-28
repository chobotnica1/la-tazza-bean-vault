import { useState } from 'react';
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
  const [records, setRecords] = useState<CuppingRecord[]>(getAllCuppingRecords());
  const [editingRecord, setEditingRecord] = useState<CuppingRecord | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEdit = (record: CuppingRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this cupping record?')) {
      deleteCuppingRecord(id);
      setRecords(getAllCuppingRecords());
    }
  };

  const handleSave = (record: CuppingRecord) => {
    if (editingRecord) {
      updateCuppingRecord(record);
    } else {
      addCuppingRecord(record);
    }
    setRecords(getAllCuppingRecords());
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

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