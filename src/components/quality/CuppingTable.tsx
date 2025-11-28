import { useState, useMemo } from 'react';
import type { CuppingRecord } from '../../entities';
import './CuppingTable.css';

interface CuppingTableProps {
  records: CuppingRecord[];
  onEdit: (record: CuppingRecord) => void;
  onDelete: (id: string) => void;
}

export default function CuppingTable({ records, onEdit, onDelete }: CuppingTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CuppingRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const search = searchTerm.toLowerCase();
      return (
        record.variety.toLowerCase().includes(search) ||
        record.origin.toLowerCase().includes(search) ||
        (record.farm && record.farm.toLowerCase().includes(search)) ||
        (record.descriptors && record.descriptors.some(d => d.toLowerCase().includes(search)))
      );
    });
  }, [records, searchTerm]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
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
  }, [filteredRecords, sortField, sortDirection]);

  const handleSort = (field: keyof CuppingRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'score-exceptional';
    if (score >= 85) return 'score-excellent';
    if (score >= 80) return 'score-very-good';
    return 'score-good';
  };

  return (
    <div className="cupping-table">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by variety, origin, farm, or descriptors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="table-stats">
          <span>{filteredRecords.length} cupping records</span>
        </div>
      </div>

      {sortedRecords.length === 0 ? (
        <div className="empty-state">
          <p>No cupping records found.</p>
          <small>
            {searchTerm ? 'Try adjusting your search' : 'Click "Add Cupping Record" to get started'}
          </small>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('date')}>
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('variety')}>
                  Variety {sortField === 'variety' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('origin')}>
                  Origin {sortField === 'origin' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('score')}>
                  Score {sortField === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Descriptors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td className="variety-cell">{record.variety}</td>
                  <td>{record.origin}</td>
                  <td>
                    <span className={`score-badge ${getScoreColor(record.score)}`}>
                      {record.score.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <div className="descriptors-cell">
                      {record.descriptors && record.descriptors.length > 0 ? (
                        record.descriptors.slice(0, 3).map((desc, idx) => (
                          <span key={idx} className="descriptor-tag">
                            {desc}
                          </span>
                        ))
                      ) : (
                        <span className="no-data">–</span>
                      )}
                      {record.descriptors && record.descriptors.length > 3 && (
                        <span className="more-descriptors">
                          +{record.descriptors.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onEdit(record)} className="btn-edit">
                        View
                      </button>
                      <button onClick={() => onDelete(record.id)} className="btn-delete">
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