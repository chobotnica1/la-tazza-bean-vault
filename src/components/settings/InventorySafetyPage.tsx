import { useState, useMemo } from 'react';
import {
  getAllGreenBatches,
  getSafetySettings,
  saveSafetySettings,
  setThreshold,
  removeThreshold,
} from '../../repositories/localStore';
import type { InventorySafetySettings } from '../../entities';
import './InventorySafetyPage.css';

interface VarietyWarehousePair {
  variety: string;
  warehouse: string;
  currentStock: number;
  threshold?: number;
}

export default function InventorySafetyPage() {
  const [settings, setSettings] = useState<InventorySafetySettings>(getSafetySettings());
  const [defaultPerVariety, setDefaultPerVariety] = useState<string>(
    settings.defaultThresholdPerVariety?.toString() || ''
  );
  const [defaultPerWarehouse, setDefaultPerWarehouse] = useState<string>(
    settings.defaultThresholdPerWarehouse?.toString() || ''
  );
  const [thresholdEdits, setThresholdEdits] = useState<{ [key: string]: string }>({});

  const greenBatches = getAllGreenBatches();

  const varietyWarehousePairs = useMemo(() => {
    const pairMap = new Map<string, VarietyWarehousePair>();

    greenBatches.forEach((batch) => {
      const key = `${batch.variety}::${batch.warehouse}`;
      if (pairMap.has(key)) {
        const pair = pairMap.get(key)!;
        pair.currentStock += batch.quantityBags;
      } else {
        pairMap.set(key, {
          variety: batch.variety,
          warehouse: batch.warehouse,
          currentStock: batch.quantityBags,
          threshold: settings.lowStockThresholds[batch.variety]?.[batch.warehouse],
        });
      }
    });

    return Array.from(pairMap.values()).sort((a, b) => {
      if (a.variety !== b.variety) return a.variety.localeCompare(b.variety);
      return a.warehouse.localeCompare(b.warehouse);
    });
  }, [greenBatches, settings]);

  const handleSaveDefaults = () => {
    const updatedSettings: InventorySafetySettings = {
      ...settings,
      defaultThresholdPerVariety: defaultPerVariety
        ? parseFloat(defaultPerVariety)
        : undefined,
      defaultThresholdPerWarehouse: defaultPerWarehouse
        ? parseFloat(defaultPerWarehouse)
        : undefined,
    };

    saveSafetySettings(updatedSettings);
    setSettings(updatedSettings);
    alert('Default thresholds saved successfully');
  };

  const handleThresholdChange = (variety: string, warehouse: string, value: string) => {
    const key = `${variety}::${warehouse}`;
    setThresholdEdits((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveThreshold = (variety: string, warehouse: string) => {
    const key = `${variety}::${warehouse}`;
    const value = thresholdEdits[key];

    if (value === undefined || value === '') {
      removeThreshold(variety, warehouse);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setThreshold(variety, warehouse, numValue);
      } else {
        alert('Please enter a valid number');
        return;
      }
    }

    const updatedSettings = getSafetySettings();
    setSettings(updatedSettings);

    setThresholdEdits((prev) => {
      const newEdits = { ...prev };
      delete newEdits[key];
      return newEdits;
    });
  };

  const handleClearThreshold = (variety: string, warehouse: string) => {
    removeThreshold(variety, warehouse);
    const updatedSettings = getSafetySettings();
    setSettings(updatedSettings);

    const key = `${variety}::${warehouse}`;
    setThresholdEdits((prev) => {
      const newEdits = { ...prev };
      delete newEdits[key];
      return newEdits;
    });
  };

  const getEffectiveThreshold = (pair: VarietyWarehousePair): number | undefined => {
    const key = `${pair.variety}::${pair.warehouse}`;
    if (thresholdEdits[key] !== undefined) {
      const parsed = parseFloat(thresholdEdits[key]);
      return isNaN(parsed) ? undefined : parsed;
    }

    if (pair.threshold !== undefined) {
      return pair.threshold;
    }

    return settings.defaultThresholdPerVariety;
  };

  const isLowStock = (pair: VarietyWarehousePair): boolean => {
    const threshold = getEffectiveThreshold(pair);
    return threshold !== undefined && pair.currentStock <= threshold;
  };

  return (
    <div className="inventory-safety-page">
      <h3>Inventory Safety Settings</h3>
      <p className="description">
        Configure low stock thresholds to receive alerts when inventory levels are running low.
      </p>

      {/* Global Defaults Panel */}
      <div className="defaults-panel">
        <h4>Global Default Thresholds</h4>
        <p className="panel-description">
          Set default thresholds that apply when no specific threshold is configured.
        </p>

        <div className="defaults-form">
          <div className="form-group">
            <label>Default Threshold per Variety (bags)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={defaultPerVariety}
              onChange={(e) => setDefaultPerVariety(e.target.value)}
              placeholder="e.g., 3"
            />
            <small>Applied to all variety-warehouse pairs without specific thresholds</small>
          </div>

          <div className="form-group">
            <label>Default Threshold per Warehouse (bags)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={defaultPerWarehouse}
              onChange={(e) => setDefaultPerWarehouse(e.target.value)}
              placeholder="e.g., 5"
            />
            <small>Alternative default (currently not actively used)</small>
          </div>

          <button onClick={handleSaveDefaults} className="btn-save-defaults">
            Save Default Thresholds
          </button>
        </div>
      </div>

      {/* Variety-Warehouse Threshold Table */}
      <div className="thresholds-section">
        <h4>Specific Thresholds by Variety & Warehouse</h4>

        {varietyWarehousePairs.length === 0 ? (
          <p className="empty-message">
            No inventory data yet. Add green coffee batches to configure thresholds.
          </p>
        ) : (
          <div className="thresholds-table-container">
            <table className="thresholds-table">
              <thead>
                <tr>
                  <th>Variety</th>
                  <th>Warehouse</th>
                  <th>Current Stock</th>
                  <th>Threshold (bags)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {varietyWarehousePairs.map((pair) => {
                  const key = `${pair.variety}::${pair.warehouse}`;
                  const isEditing = thresholdEdits[key] !== undefined;
                  const effectiveThreshold = getEffectiveThreshold(pair);
                  const lowStock = isLowStock(pair);

                  return (
                    <tr key={key} className={lowStock ? 'low-stock-row' : ''}>
                      <td className="variety-cell">{pair.variety}</td>
                      <td>{pair.warehouse}</td>
                      <td className="stock-cell">{pair.currentStock} bags</td>
                      <td>
                        <div className="threshold-input-group">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              isEditing
                                ? thresholdEdits[key]
                                : pair.threshold?.toString() || ''
                            }
                            onChange={(e) =>
                              handleThresholdChange(pair.variety, pair.warehouse, e.target.value)
                            }
                            placeholder={
                              settings.defaultThresholdPerVariety?.toString() || 'None'
                            }
                            className="threshold-input"
                          />
                          {!pair.threshold && effectiveThreshold !== undefined && (
                            <small className="default-indicator">
                              (default: {effectiveThreshold})
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        {lowStock ? (
                          <span className="status-badge status-low">Low Stock</span>
                        ) : effectiveThreshold !== undefined ? (
                          <span className="status-badge status-ok">OK</span>
                        ) : (
                          <span className="status-badge status-none">No threshold</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {isEditing && (
                            <button
                              onClick={() => handleSaveThreshold(pair.variety, pair.warehouse)}
                              className="btn-small btn-save"
                            >
                              Save
                            </button>
                          )}
                          {pair.threshold !== undefined && (
                            <button
                              onClick={() => handleClearThreshold(pair.variety, pair.warehouse)}
                              className="btn-small btn-clear"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Alert Summary */}
      {varietyWarehousePairs.some((p) => isLowStock(p)) && (
        <div className="alert-summary">
          <h4>⚠️ Low Stock Alerts</h4>
          <ul>
            {varietyWarehousePairs
              .filter((p) => isLowStock(p))
              .map((pair) => {
                const key = `${pair.variety}::${pair.warehouse}`;
                const threshold = getEffectiveThreshold(pair);
                return (
                  <li key={key}>
                    <strong>{pair.variety}</strong> at <strong>{pair.warehouse}</strong>:{' '}
                    {pair.currentStock} bags (threshold: {threshold})
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}