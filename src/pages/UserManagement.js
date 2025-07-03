import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, updateUserStatus } from '../services/apiService';
import '../styles/main.css';
import Button from '../components/Button';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleUpdating, setRoleUpdating] = useState({});
  const [roleError, setRoleError] = useState({});
  const [statusUpdating, setStatusUpdating] = useState({});
  const [statusError, setStatusError] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsers();
      if (res.status === 'success' && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setRoleUpdating(prev => ({ ...prev, [userId]: true }));
    setRoleError(prev => ({ ...prev, [userId]: '' }));
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.status === 'success') {
        setUsers(users => users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        throw new Error(res.message || 'Failed to update role');
      }
    } catch (err) {
      setRoleError(prev => ({ ...prev, [userId]: err.message || 'Failed to update role' }));
    } finally {
      setRoleUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    setStatusUpdating(prev => ({ ...prev, [userId]: true }));
    setStatusError(prev => ({ ...prev, [userId]: '' }));
    try {
      const res = await updateUserStatus(userId, !currentStatus);
      if (res.status === 'success') {
        setUsers(users => users.map(u => u._id === userId ? { ...u, active: !currentStatus } : u));
      } else {
        throw new Error(res.message || 'Failed to update status');
      }
    } catch (err) {
      setStatusError(prev => ({ ...prev, [userId]: err.message || 'Failed to update status' }));
    } finally {
      setStatusUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      search === '' ||
      (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesActive = activeFilter === '' || (activeFilter === 'active' ? user.active : !user.active);
    return matchesSearch && matchesRole && matchesActive;
  });

  // Export helpers
  const handleExportCSV = () => {
    if (!filteredUsers.length) return;
    const csvData = filteredUsers.map(u => ({
      Name: u.fullName || u.name || '-',
      Email: u.email,
      Role: u.role,
      Active: u.active ? 'Yes' : 'No',
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleExportPDF = () => {
    if (!filteredUsers.length) return;
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Email', 'Role', 'Active']],
      body: filteredUsers.map(u => [
        u.fullName || u.name || '-',
        u.email,
        u.role,
        u.active ? 'Yes' : 'No',
      ]),
      styles: { fontSize: 9 },
    });
    doc.save('users.pdf');
  };

  return (
    <div className="user-management" style={{ padding: '2rem' }}>
      <h1 style={{ color: '#007bff', marginBottom: '2rem' }}>User Management</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="auth-input"
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 220 }}
          aria-label="Search name or email"
        />
        <select
          className="auth-input"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ minWidth: 120 }}
          aria-label="Filter by role"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="doctor">Doctor</option>
          <option value="user">Patient (user)</option>
        </select>
        <select
          className="auth-input"
          value={activeFilter}
          onChange={e => setActiveFilter(e.target.value)}
          style={{ minWidth: 120 }}
          aria-label="Filter by active status"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button variant="secondary" onClick={handleExportCSV} disabled={!filteredUsers.length} aria-label="Export users as CSV">Export CSV</Button>
        <Button variant="secondary" onClick={handleExportPDF} disabled={!filteredUsers.length} aria-label="Export users as PDF">Export PDF</Button>
      </div>
      {loading ? (
        <div role="status" aria-live="polite">Loading...</div>
      ) : error ? (
        <div className="table-error-state" aria-live="assertive">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>
          {error}
        </div>
      ) : (
        <table className="analytics-table" aria-label="User list" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f8ff' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Name</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Email</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Role</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Active</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={5} className="table-empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#b6d4f7" strokeWidth="2" strokeLinecap="round"/></svg>
                No users found.
              </td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>{user.fullName || user.name || '-'}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>{user.email}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>{user.role}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={user.active}
                      onChange={() => handleStatusChange(user._id, user.active)}
                      disabled={statusUpdating[user._id]}
                      aria-label={user.active ? 'Disable user' : 'Enable user'}
                    />
                    {statusError[user._id] && <div className="error" aria-live="assertive">{statusError[user._id]}</div>}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>
                    <select
                      className="auth-input"
                      value={user.role}
                      onChange={e => handleRoleChange(user._id, e.target.value)}
                      disabled={roleUpdating[user._id]}
                      style={{ minWidth: 120 }}
                      aria-label={`Change role for ${user.fullName || user.name || user.email}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="doctor">Doctor</option>
                      <option value="user">Patient (user)</option>
                    </select>
                    {roleError[user._id] && <div className="error" aria-live="assertive">{roleError[user._id]}</div>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement; 