import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ActivityLog.css';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/audit-logs');
        if (res.data && Array.isArray(res.data.logs)) {
          setLogs(res.data.logs);
        } else {
          setLogs([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      search === '' ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase())) ||
      (log.target && log.target.toLowerCase().includes(search.toLowerCase()));
    const matchesUser = filterUser === '' || (log.user && log.user.toLowerCase().includes(filterUser.toLowerCase()));
    const matchesAction = filterAction === '' || (log.action && log.action.toLowerCase().includes(filterAction.toLowerCase()));
    const matchesDate = filterDate === '' || (log.timestamp && new Date(log.timestamp).toLocaleDateString() === filterDate);
    return matchesSearch && matchesUser && matchesAction && matchesDate;
  });

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredLogs.map(({ timestamp, user, action, target, details }) => ({
      timestamp: new Date(timestamp).toLocaleString(),
      user,
      action,
      target,
      details,
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'activity_log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Date/Time', 'User', 'Action', 'Target', 'Details']],
      body: filteredLogs.map(log => [
        log.timestamp ? new Date(log.timestamp).toLocaleString() : '',
        log.user || '',
        log.action || '',
        log.target || '',
        log.details || '',
      ]),
      styles: { fontSize: 9 },
    });
    doc.save('activity_log.pdf');
  };

  return (
    <div className="activity-log">
      <h1>Activity Log</h1>
      <div className="activity-log-filters">
        <input
          type="text"
          placeholder="Search details or target..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search details or target"
        />
        <input
          type="text"
          placeholder="Filter by user..."
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          aria-label="Filter by user"
        />
        <input
          type="text"
          placeholder="Filter by action..."
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          aria-label="Filter by action"
        />
        <input
          type="date"
          placeholder="Filter by date..."
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          aria-label="Filter by date"
        />
        <button className="auth-input" style={{ background: '#10b3b3', color: 'white', fontWeight: 600 }} onClick={handleExportCSV} disabled={filteredLogs.length === 0} aria-label="Export activity log as CSV">
          Export CSV
        </button>
        <button className="auth-input" style={{ background: '#234567', color: 'white', fontWeight: 600 }} onClick={handleExportPDF} disabled={filteredLogs.length === 0} aria-label="Export activity log as PDF">
          Export PDF
        </button>
      </div>
      {loading ? (
        <div role="status" aria-live="polite">Loading...</div>
      ) : error ? (
        <div className="table-error-state" aria-live="assertive">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>
          {error}
        </div>
      ) : (
        <table className="activity-log-table" aria-label="Activity log list">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr><td colSpan={5} className="table-empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#b6d4f7" strokeWidth="2" strokeLinecap="round"/></svg>
                No logs found.
              </td></tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</td>
                  <td>{log.user || ''}</td>
                  <td>{log.action || ''}</td>
                  <td>{log.target || ''}</td>
                  <td>{log.details || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActivityLog; 