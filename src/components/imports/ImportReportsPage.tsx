import './ImportReportsPage.css';

export default function ImportReportsPage() {
  return (
    <div className="import-reports-page">
      <div className="page-header">
        <h2>Import Reports</h2>
        <p className="page-subtitle">Import data from external sources</p>
      </div>

      <div className="import-sections">
        {/* Clover Sales Import */}
        <div className="import-card">
          <div className="card-header">
            <span className="icon">📊</span>
            <h3>Clover Sales Data</h3>
          </div>
          <p className="card-description">
            Import sales transactions from Clover POS system to track product usage and calculate
            depletion rates.
          </p>
          <div className="card-details">
            <h4>Expected Format:</h4>
            <ul>
              <li>CSV file with columns: Date, Product Name, Quantity</li>
              <li>Product names should match your variety names or use sales mappings</li>
              <li>Date format: YYYY-MM-DD or MM/DD/YYYY</li>
            </ul>
          </div>
          <button className="btn-import" disabled>
            📤 Import CSV (Coming Soon)
          </button>
        </div>

        {/* Green Coffee Import */}
        <div className="import-card">
          <div className="card-header">
            <span className="icon">📦</span>
            <h3>Green Coffee Batches</h3>
          </div>
          <p className="card-description">
            Bulk import green coffee inventory from spreadsheets or supplier data.
          </p>
          <div className="card-details">
            <h4>Expected Format:</h4>
            <ul>
              <li>CSV with columns: Variety, Origin, Farm, Importer, Warehouse, Bags, Bag Size, Rating, Price, Received Date</li>
              <li>Bag Size should include unit (e.g., "60 kg")</li>
              <li>Rating: AAA+, AAA, AA, or A</li>
            </ul>
          </div>
          <button className="btn-import" disabled>
            📤 Import CSV (Coming Soon)
          </button>
        </div>

        {/* Roasted Coffee Import */}
        <div className="import-card">
          <div className="card-header">
            <span className="icon">☕</span>
            <h3>Roasted Coffee Batches</h3>
          </div>
          <p className="card-description">
            Import roasted inventory from production logs or external systems.
          </p>
          <div className="card-details">
            <h4>Expected Format:</h4>
            <ul>
              <li>CSV with columns: Variety, Origin, Roast Level, Format, Bags, Warehouse, Roast Date</li>
              <li>Roast Level: Light, Medium, Dark, or Espresso</li>
              <li>Format: 12oz, 5kg, or custom size</li>
            </ul>
          </div>
          <button className="btn-import" disabled>
            📤 Import CSV (Coming Soon)
          </button>
        </div>

        {/* Cupping Records Import */}
        <div className="import-card">
          <div className="card-header">
            <span className="icon">⭐</span>
            <h3>Cupping Records</h3>
          </div>
          <p className="card-description">
            Import cupping session data from spreadsheets or cupping apps.
          </p>
          <div className="card-details">
            <h4>Expected Format:</h4>
            <ul>
              <li>CSV with columns: Date, Variety, Origin, Score, Sweetness, Acidity, Body, Finish, Descriptors</li>
              <li>Scores on 0-10 or 0-100 scale (will be normalized)</li>
              <li>Descriptors as comma-separated values</li>
            </ul>
          </div>
          <button className="btn-import" disabled>
            📤 Import CSV (Coming Soon)
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions-section">
        <h3>📝 Implementation Notes</h3>
        <div className="instruction-content">
          <p>
            <strong>CSV import functionality is planned for a future update.</strong> When implemented,
            it will support:
          </p>
          <ul>
            <li>✅ Drag-and-drop CSV upload</li>
            <li>✅ Column mapping (match your CSV columns to system fields)</li>
            <li>✅ Data validation before import</li>
            <li>✅ Preview before confirming</li>
            <li>✅ Duplicate detection</li>
            <li>✅ Error reporting with line numbers</li>
          </ul>
          <p>
            <strong>Current Workaround:</strong> You can manually enter data using the "Add" buttons
            in each section (Inventory, Quality, etc.), or use the browser console to bulk-load data
            via localStorage as demonstrated in the initial setup.
          </p>
        </div>
      </div>
    </div>
  );
}