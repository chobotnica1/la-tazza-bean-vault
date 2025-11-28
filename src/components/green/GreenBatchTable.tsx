import { useState, useMemo } from 'react';
import type { GreenCoffeeBatch } from '../../entities';
import './GreenBatchTable.css';

interface GreenBatchTableProps {
  batches: GreenCoffeeBatch[];
  onEdit: (batch: GreenCoffeeBatch) => void;
  onDelete: (id: string) => void;
  viewMode: 'table' | 'grouped';
}

export default function GreenBatchTable({
  batches,
  onEdit,
  onDelete,
  viewMode,
}: GreenBatchTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof GreenCoffeeBatch>('variety');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const search = searchTerm.toLowerCase();
      return (
        batch.variety.toLowerCase().includes(search) ||
        batch.origin.toLowerCase().includes(search) ||
        batch.warehouse.toLowerCase().includes(search) ||
        batch.farm.toLowerCase().includes(search) ||
        batch.importer.toLowerCase().includes(search)
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

  const handleSort = (field: keyof GreenCoffeeBatch) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const totalBags = batches.reduce((sum, b) => sum + b.quantityBags, 0);

  if (viewMode === 'grouped') {
    return <div><h3>Grouped View</h3><p>Coming soon...</p></div>;
  }

  return (
    <div className="green-batch-table">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by variety, origin, warehouse, farm, or importer..."
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
          <p>No batches found.</p>
          <small>
            {searchTerm ? 'Try adjusting your search' : 'Click "Add New Batch" to get started'}
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
                <th onClick={() => handleSort('warehouse')}>
                  Warehouse {sortField === 'warehouse' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('quantityBags')}>
                  Bags {sortField === 'quantityBags' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('bagSizeValue')}>Bag Size</th>
                <th onClick={() => handleSort('rating')}>
                  Rating {sortField === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('receivedDate')}>
                  Received {sortField === 'receivedDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="variety-cell">{batch.variety}</td>
                  <td>{batch.origin}</td>
                  <td>{batch.warehouse}</td>
                  <td className="quantity-cell">{batch.quantityBags}</td>
                  <td>
                    {batch.bagSizeValue} {batch.bagSizeUnit}
                  </td>
                  <td>
                    <span className={`rating-badge rating-${batch.rating.replace('+', 'plus')}`}>
                      {batch.rating}
                    </span>
                  </td>
                  <td>{new Date(batch.receivedDate).toLocaleDateString()}</td>
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