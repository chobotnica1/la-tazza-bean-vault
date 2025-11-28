import { useState, useMemo } from 'react';
import type { RoastedCoffeeBatch } from '../../entities';
import './RoastedBatchTable.css';

interface RoastedBatchTableProps {
  batches: RoastedCoffeeBatch[];
  onEdit: (batch: RoastedCoffeeBatch) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function RoastedBatchTable({
  batches,
  onEdit,
  onDelete,
}: RoastedBatchTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof RoastedCoffeeBatch>('roastDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const search = searchTerm.toLowerCase();
      return (
        batch.variety.toLowerCase().includes(search) ||
        batch.origin.toLowerCase().includes(search) ||
        batch.warehouse.toLowerCase().includes(search) ||
        batch.roastLevel.toLowerCase().includes(search)
      );
    });
  }, [batches, searchTerm]);

  const sortedBatches = useMemo(() => {
    return [...filteredBatches].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === undefined || bVal === undefined) return 0;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredBatches, sortField, sortDirection]);

  const handleSort = (field: keyof RoastedCoffeeBatch) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const totalBags = batches.reduce((sum, b) => sum + b.quantityBags, 0);

  return (
    <div className="roasted-batch-table">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by variety, origin, warehouse, or roast level..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="table-stats">
          <span>{filteredBatches.length} batches</span>
          <span>•</span>
          <span>{totalBags} total bags</span>
        </div>
      </div>

      {sortedBatches.length === 0 ? (
        <div className="empty-state">
          <p>No roasted batches found.</p>
          <small>
            {searchTerm ? 'Try adjusting your search' : 'Click "Add Roasted Batch" to get started'}
          </small>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('variety')}>
                  Variety {sortField === 'variety' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('origin')}>
                  Origin {sortField === 'origin' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('roastLevel')}>
                  Roast Level {sortField === 'roastLevel' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('warehouse')}>
                  Warehouse {sortField === 'warehouse' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('quantityBags')}>
                  Bags {sortField === 'quantityBags' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('formatType')}>Format</th>
                <th onClick={() => handleSort('roastDate')}>
                  Roast Date {sortField === 'roastDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="variety-cell">{batch.variety}</td>
                  <td>{batch.origin}</td>
                  <td>
                    <span className={`roast-badge roast-${batch.roastLevel.toLowerCase()}`}>
                      {batch.roastLevel}
                    </span>
                  </td>
                  <td>{batch.warehouse}</td>
                  <td className="quantity-cell">{batch.quantityBags}</td>
                  <td>
                    {batch.formatType === 'custom' && batch.formatSizeValue && batch.formatSizeUnit
                      ? `${batch.formatSizeValue} ${batch.formatSizeUnit}`
                      : batch.formatType}
                  </td>
                  <td>{new Date(batch.roastDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onEdit(batch)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => onDelete(batch.id)} className="btn-delete">
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