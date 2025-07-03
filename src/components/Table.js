import React from 'react';
import '../styles/main.css';

const Table = ({ columns, data, loading, error }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '12px', background: '#e3f0fa', color: '#007bff', fontWeight: 600, textAlign: 'left', borderBottom: '2px solid #b6d4f7' }}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '16px', textAlign: 'center', color: '#888' }}>No data</td></tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} style={{ borderBottom: '1px solid #f0f4f8' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '12px', color: '#234567' }}>{row[col.dataIndex]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 