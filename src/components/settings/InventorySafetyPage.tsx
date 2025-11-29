import { useState, useEffect } from 'react';
import type { InventorySafetyThreshold } from '../../entities';
import { getAllThresholds, saveAllThresholds } from '../../repositories/localStore';
import './InventorySafetyPage.css';

export default function InventorySafetyPage() {
  const [thresholds, setThresholds] = useState<InventorySafetyThreshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultCritical, setDefaultCritical] = useState(3);
  const [defaultLow, setDefaultLow] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVariety, setNewVariety] = useState('');
  const [newWarehouse, setNewWarehouse] = useState('');
  const [newCritical, setNewCritical] = useState(3);
  const [newLow, setNewLow] = useState(5);

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = async () => {
    setLoading(true);
    const data = await getAllThresholds();
    setThresholds(data);
    
    const defaultThreshold = data.find(t => t.variety === '*' && t.warehouse === '*');
    if (defaultThreshold) {
      setDefaultCritical(defaultThreshold.criticalThreshold);
      setDefaultLow(defaultThreshold.lowThreshold);
    }
    setLoading(false);
  };

  const handleSaveDefaults = async () => {
    const updatedThresholds = thresholds.map(t =>
      t.variety === '*' && t.warehouse === '*'
        ? { ...t, criticalThreshold: defaultCritical, lowThreshold: defaultLow }
        : t
    );

    if (!updatedThresholds.find(t => t.variety === '*' && t.warehouse === '*')) {
      updatedThresholds.push({
        variety: '*',
        warehouse: '*',
        criticalThreshold: defaultCritical,
        lowThreshold: defaultLow,
      });
    }

    await saveAllThresholds(updatedThresholds);
    await loadThresholds();
    alert('Default thresholds saved!');
  };

  const handleAddSpecific = async () => {
    if (!newVariety.trim() || !newWarehouse.trim()) {
      alert('Please fill in variety and warehouse');
      return;
    }

    const exists = thresholds.find(
      t => t.variety === newVariety && t.warehouse === newWarehouse
    );

    if (exists) {
      alert('A threshold for this variety and warehouse already exists');
      return;
    }

    const updatedThresholds = [
      ...thresholds,
      {
        variety: newVariety,
        warehouse: newWarehouse,
        criticalThreshold: newCritical,
        lowThreshold: newLow,
      },
    ];

    await saveAllThresholds(updatedThresholds);
    await loadThresholds();

    setNewVariety('');
    setNewWarehouse('');
    setNewCritical(3);
    setNewLow(5);
    setShowAddForm(false);
  };

  const handleDeleteSpecific = async (variety: string, warehouse: string) => {
    if (variety === '*' && warehouse === '*') {
      alert('Cannot delete default thresholds');
      return;
    }

    if (confirm(`Delete threshold for ${variety} at ${warehouse}?`)) {
      const updatedThresholds = thresholds.filter(
        t => !(t.variety === variety && t.warehouse === warehouse)
      );
      await saveAllThresholds(updatedThresholds);
      await loadThresholds();
    }
  };

  const handleUpdateSpecific = async (
    variety: string,
    warehouse: string,
    criticalThreshold: number,
    lowThreshold: number
  ) => {
    const updatedThresholds = thresholds.map(t =>
      t.variety === variety && t.warehouse === warehouse
        ? { ...t, criticalThreshold, lowThreshold }
        : t
    );

    await saveAllThresholds(updatedThresholds);
    await loadThresholds();
  };

  const specificThresholds = thresholds.filter(
    t => !(t.variety === '*' && t.warehouse === '*')
  );

  if (loading) {
    return (
      <div className="inventory-safety-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-safety-page">
      <h3>Inventory Safety Thresholds</h3>
      <p className="page-description">
        Set alert thresholds for low inventory. The system will highlight batches that fall below
        these levels.
      </p>

      <div className="defaults-section">
        <h4>Default Thresholds (All Varieties & Warehouses)</h4>
        <div className="threshold-inputs">
          <div className="input-group">
            <label>Critical Threshold (bags)</label>
            <input
              type="number"
              value={defaultCritical}
              onChange={(e) => setDefaultCritical(parseInt(e.target.value) || 0)}
              min="0"
            />
            <small>Alert when inventory reaches this level</small>
          </div>

          <div className="input-group">
            <label>Low Threshold (bags)</label>
            <input
              type="number"
              value={defaultLow}
              onChange={(e) => setDefaultLow(parseInt(e.target.value) || 0)}
              min="0"
            />
            <small>Warning when inventory reaches this level</small>
          </div>
        </div>

        <button className="btn-save" onClick={handleSaveDefaults}>
          Save Default Thresholds
        </button>
      </div>

      <div className="specific-section">
        <div className="section-header">
          <h4>Specific Variety/Warehouse Thresholds</h4>
          <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Specific Threshold'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-form">
            <div className="form-row">
              <div className="input-group">
                <label>Variety</label>
                <input
                  type="text"
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                  placeholder="e.g., Ethiopia Yirgacheffe"
                />
              </div>

              <div className="input-group">
                <label>Warehouse</label>
                <input
                  type="text"
                  value={newWarehouse}
                  onChange={(e) => setNewWarehouse(e.target.value)}
                  placeholder="e.g., Main Warehouse"
                />
              </div>

              <div className="input-group">
                <label>Critical</label>
                <input
                  type="number"
                  value={newCritical}
                  onChange={(e) => setNewCritical(parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>

              <div className="input-group">
                <label>Low</label>
                <input
                  type="number"
                  value={newLow}
                  onChange={(e) => setNewLow(parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>

              <button className="btn-save-specific" onClick={handleAddSpecific}>
                Add
              </button>
            </div>
          </div>
        )}

        {specificThresholds.length > 0 ? (
          <div className="thresholds-table">
            <table>
              <thead>
                <tr>
                  <th>Variety</th>
                  <th>Warehouse</th>
                  <th>Critical</th>
                  <th>Low</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {specificThresholds.map((threshold, idx) => (
                  <ThresholdRow
                    key={idx}
                    threshold={threshold}
                    onUpdate={handleUpdateSpecific}
                    onDelete={handleDeleteSpecific}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-thresholds">
            No specific thresholds set. Default thresholds will apply to all varieties and
            warehouses.
          </p>
        )}
      </div>
    </div>
  );
}

interface ThresholdRowProps {
  threshold: InventorySafetyThreshold;
  onUpdate: (variety: string, warehouse: string, critical: number, low: number) => void;
  onDelete: (variety: string, warehouse: string) => void;
}

function ThresholdRow({ threshold, onUpdate, onDelete }: ThresholdRowProps) {
  const [editing, setEditing] = useState(false);
  const [critical, setCritical] = useState(threshold.criticalThreshold);
  const [low, setLow] = useState(threshold.lowThreshold);

  const handleSave = () => {
    onUpdate(threshold.variety, threshold.warehouse, critical, low);
    setEditing(false);
  };

  const handleCancel = () => {
    setCritical(threshold.criticalThreshold);
    setLow(threshold.lowThreshold);
    setEditing(false);
  };

  return (
    <tr>
      <td>{threshold.variety}</td>
      <td>{threshold.warehouse}</td>
      <td>
        {editing ? (
          <input
            type="number"
            value={critical}
            onChange={(e) => setCritical(parseInt(e.target.value) || 0)}
            min="0"
            className="inline-input"
          />
        ) : (
          threshold.criticalThreshold
        )}
      </td>
      <td>
        {editing ? (
          <input
            type="number"
            value={low}
            onChange={(e) => setLow(parseInt(e.target.value) || 0)}
            min="0"
            className="inline-input"
          />
        ) : (
          threshold.lowThreshold
        )}
      </td>
      <td>
        {editing ? (
          <div className="action-buttons">
            <button onClick={handleSave} className="btn-save-inline">
              Save
            </button>
            <button onClick={handleCancel} className="btn-cancel-inline">
              Cancel
            </button>
          </div>
        ) : (
          <div className="action-buttons">
            <button onClick={() => setEditing(true)} className="btn-edit">
              Edit
            </button>
            <button
              onClick={() => onDelete(threshold.variety, threshold.warehouse)}
              className="btn-delete"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}