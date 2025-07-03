import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, createPatient, updatePatient, deletePatient, createAppointment, fetchAppointments, updateAppointment, deleteAppointment, fetchAuditLogs, fetchSummaryReport, fetchAppointmentsByDateRange, getFrequentDiagnoses } from '../../services/apiService';
import Card from '../Card';
import Table from '../Table';
import Button from '../Button';
import Modal from '../Modal';
import '../../styles/main.css';
import { useAuth } from '../../contexts/AuthContext';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorBoundary from '../../components/ErrorBoundary';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [patientStats, setPatientStats] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [currentUserToEditRole, setCurrentUserToEditRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [updateRoleError, setUpdateRoleError] = useState(null);
  const [updateRoleLoading, setUpdateRoleLoading] = useState(false);

  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showDeletePatientModal, setShowDeletePatientModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [patientFormData, setPatientFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    age: '',
  });
  const [patientFormError, setPatientFormError] = useState(null);
  const [patientFormLoading, setPatientFormLoading] = useState(false);

  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [showDeleteAppointmentModal, setShowDeleteAppointmentModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointmentFormData, setAppointmentFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    type: '',
    status: 'Scheduled',
  });
  const [appointmentFormError, setAppointmentFormError] = useState(null);
  const [appointmentFormLoading, setAppointmentFormLoading] = useState(false);

  const [patientSearch, setPatientSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');

  const [reportFrom, setReportFrom] = useState(null);
  const [reportTo, setReportTo] = useState(null);
  const [dateFilteredAppointments, setDateFilteredAppointments] = useState([]);
  const [dateFilterLoading, setDateFilterLoading] = useState(false);
  const [dateFilterError, setDateFilterError] = useState('');

  // Frequent Diagnoses Analytics State
  const [frequentDiagnoses, setFrequentDiagnoses] = useState([]);
  const [diagnosesLoading, setDiagnosesLoading] = useState(false);
  const [diagnosesError, setDiagnosesError] = useState('');

  const navigate = useNavigate();

  const fetchPatientsData = async () => {
    try {
      setLoading(true);
        const response = await getUsers();
      if (response.status === 'success' && Array.isArray(response.data)) {
        setPatients(response.data);
      } else if (response.data && Array.isArray(response.data.patients)) {
        setPatients(response.data.patients);
      } else {
        setPatients([]);
      }
      } catch (err) {
      setError(err.message || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

  const fetchAppointmentsData = async () => {
    try {
      setLoading(true);
      const response = await fetchAppointments();
      if (response.status === 'success' && Array.isArray(response.data)) {
        setAppointments(response.data);
      } else if (response.data && Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogsData = async () => {
    try {
      const response = await fetchAuditLogs();
      if (response.status === 'success' && Array.isArray(response.data)) {
        setAuditLogs(response.data);
      } else {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setError(err.message || 'Failed to fetch audit logs');
    }
  };

  const fetchReportingData = async () => {
    try {
      const summaryRes = await fetchSummaryReport();
      if (summaryRes.status === 'success' && summaryRes.data) {
        setPatientStats({ totalPatients: summaryRes.data.totalPatients });
        setAppointmentStats({ totalAppointments: summaryRes.data.totalAppointments, recentAppointments: summaryRes.data.recentAppointments });
      }
    } catch (err) {
      console.error('Failed to fetch reporting data:', err);
      setError(err.message || 'Failed to fetch reporting data');
    }
  };

  const fetchFrequentDiagnoses = async () => {
    setDiagnosesLoading(true);
    setDiagnosesError('');
    try {
      const data = await getFrequentDiagnoses();
      setFrequentDiagnoses(data);
    } catch (err) {
      setDiagnosesError(err.message || 'Failed to fetch frequent diagnoses');
    } finally {
      setDiagnosesLoading(false);
    }
  };

  const handleDateFilter = async () => {
    if (!reportFrom || !reportTo) return;
    setDateFilterLoading(true);
    setDateFilterError('');
    try {
      const fromStr = reportFrom.toISOString().split('T')[0];
      const toStr = reportTo.toISOString().split('T')[0];
      const res = await fetchAppointmentsByDateRange(fromStr, toStr);
      if (res.status === 'success' && res.data && Array.isArray(res.data.appointments)) {
        setDateFilteredAppointments(res.data.appointments);
      } else {
        setDateFilteredAppointments([]);
        setDateFilterError(res.message || 'No data found for selected range.');
      }
    } catch (err) {
      setDateFilteredAppointments([]);
      setDateFilterError(err.message || 'Failed to fetch data.');
    } finally {
      setDateFilterLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsData();
    fetchAppointmentsData();
    fetchAuditLogsData();
    fetchReportingData();
    fetchFrequentDiagnoses();
  }, []);

  const handleEditRole = (user) => {
    setCurrentUserToEditRole(user);
    setSelectedRole(user.role);
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!currentUserToEditRole || !selectedRole) return;

    setUpdateRoleLoading(true);
    setUpdateRoleError(null);
    try {
      const res = await updateUserRole(currentUserToEditRole._id, selectedRole);
      if (res.status === 'success') {
        setShowEditRoleModal(false);
        fetchPatientsData();
      } else {
        throw new Error(res.message || 'Failed to update role');
      }
    } catch (err) {
      setUpdateRoleError(err.message || 'Failed to update role');
    } finally {
      setUpdateRoleLoading(false);
    }
  };

  const handleOpenCreatePatientModal = () => {
    setPatientFormData({
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      age: '',
    });
    setPatientFormError(null);
    setShowCreatePatientModal(true);
  };

  const handleEditPatient = (patient) => {
    setCurrentPatient(patient);
    const dobFormatted = patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '';
    setPatientFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      dob: dobFormatted,
      gender: patient.gender || '',
      email: patient.email || '',
      phone: patient.phone || '',
      address: patient.address || '',
      age: patient.age || '',
    });
    setPatientFormError(null);
    setShowEditPatientModal(true);
  };

  const handlePatientFormChange = (e) => {
    const { name, value } = e.target;
    setPatientFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePatient = async () => {
    setPatientFormLoading(true);
    setPatientFormError(null);
    try {
      const res = await createPatient(patientFormData);
      if (res.status === 'success') {
        setShowCreatePatientModal(false);
        fetchPatientsData();
      } else {
        throw new Error(res.message || 'Failed to create patient');
      }
    } catch (err) {
      setPatientFormError(err.message || 'Failed to create patient');
    } finally {
      setPatientFormLoading(false);
    }
  };

  const handleUpdatePatient = async () => {
    if (!currentPatient) return;

    setPatientFormLoading(true);
    setPatientFormError(null);
    try {
      const res = await updatePatient(currentPatient._id, patientFormData);
      if (res.status === 'success') {
        setShowEditPatientModal(false);
        fetchPatientsData();
      } else {
        throw new Error(res.message || 'Failed to update patient');
      }
    } catch (err) {
      setPatientFormError(err.message || 'Failed to update patient');
    } finally {
      setPatientFormLoading(false);
    }
  };

  const handleDeletePatient = (patient) => {
    setCurrentPatient(patient);
    setShowDeletePatientModal(true);
  };

  const confirmDeletePatient = async () => {
    if (!currentPatient) return;

    setPatientFormLoading(true);
    setPatientFormError(null);
    try {
      const res = await deletePatient(currentPatient._id);
      if (res.status === 'success') {
        setShowDeletePatientModal(false);
        fetchPatientsData();
      } else {
        throw new Error(res.message || 'Failed to delete patient');
      }
    } catch (err) {
      setPatientFormError(err.message || 'Failed to delete patient');
    } finally {
      setPatientFormLoading(false);
    }
  };

  const handleOpenCreateAppointmentModal = () => {
    setAppointmentFormData({
      patient: '',
      doctor: '',
      date: '',
      time: '',
      type: '',
      status: 'Scheduled',
    });
    setAppointmentFormError(null);
    setShowCreateAppointmentModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    const appointmentDate = appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '';
    setAppointmentFormData({
      patient: appointment.patient._id || '',
      doctor: appointment.doctor._id || '',
      date: appointmentDate,
      time: appointment.time || '',
      type: appointment.type || '',
      status: appointment.status || 'Scheduled',
    });
    setAppointmentFormError(null);
    setShowEditAppointmentModal(true);
  };

  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAppointment = async () => {
    setAppointmentFormLoading(true);
    setAppointmentFormError(null);
    try {
      const res = await createAppointment(appointmentFormData);
      if (res.status === 'success') {
        setShowCreateAppointmentModal(false);
        fetchAppointmentsData();
      } else {
        throw new Error(res.message || 'Failed to create appointment');
      }
    } catch (err) {
      setAppointmentFormError(err.message || 'Failed to create appointment');
    } finally {
      setAppointmentFormLoading(false);
    }
  };

  const handleUpdateAppointment = async () => {
    if (!currentAppointment) return;

    setAppointmentFormLoading(true);
    setAppointmentFormError(null);
    try {
      const res = await updateAppointment(currentAppointment._id, appointmentFormData);
      if (res.status === 'success') {
        setShowEditAppointmentModal(false);
        fetchAppointmentsData();
      } else {
        throw new Error(res.message || 'Failed to update appointment');
      }
    } catch (err) {
      setAppointmentFormError(err.message || 'Failed to update appointment');
    } finally {
      setAppointmentFormLoading(false);
    }
  };

  const handleDeleteAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setShowDeleteAppointmentModal(true);
  };

  const confirmDeleteAppointment = async () => {
    if (!currentAppointment) return;

    setAppointmentFormLoading(true);
    setAppointmentFormError(null);
    try {
      const res = await deleteAppointment(currentAppointment._id);
      if (res.status === 'success') {
        setShowDeleteAppointmentModal(false);
        fetchAppointmentsData();
      } else {
        throw new Error(res.message || 'Failed to delete appointment');
      }
    } catch (err) {
      setAppointmentFormError(err.message || 'Failed to delete appointment');
    } finally {
      setAppointmentFormLoading(false);
    }
  };

  const patientColumns = [
    { key: '_id', title: 'ID', dataIndex: '_id' },
    { key: 'firstName', title: 'First Name', dataIndex: 'firstName' },
    { key: 'lastName', title: 'Last Name', dataIndex: 'lastName' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    { key: 'phone', title: 'Phone', dataIndex: 'phone' },
    { key: 'gender', title: 'Gender', dataIndex: 'gender' },
    { key: 'dob', title: 'Date of Birth', dataIndex: 'dob', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'age', title: 'Age', dataIndex: 'age' },
    { key: 'address', title: 'Address', dataIndex: 'address' },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => handleEditRole(item)}>
            Edit Role
          </Button>
          <Button variant="primary" onClick={() => handleEditPatient(item)}>
            Edit
          </Button>
          <Button variant="secondary" style={{ background: '#d32f2f', color: 'white' }} onClick={() => handleDeletePatient(item)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const appointmentColumns = [
    { key: '_id', title: 'ID', dataIndex: '_id' },
    { key: 'patient', title: 'Patient', dataIndex: 'patient', render: (patient) => patient ? `${patient.firstName} ${patient.lastName}` : 'N/A' },
    { key: 'doctor', title: 'Doctor', dataIndex: 'doctor', render: (doctor) => doctor ? `${doctor.firstName} ${doctor.lastName}` : 'N/A' },
    { key: 'date', title: 'Date', dataIndex: 'date', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'time', title: 'Time', dataIndex: 'time' },
    { key: 'type', title: 'Type', dataIndex: 'type' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" onClick={() => handleEditAppointment(item)}>
            Edit
          </Button>
          <Button variant="secondary" style={{ background: '#d32f2f', color: 'white' }} onClick={() => handleDeleteAppointment(item)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const auditLogColumns = [
    { key: '_id', title: 'ID', dataIndex: '_id' },
    { key: 'timestamp', title: 'Timestamp', dataIndex: 'timestamp', render: (timestamp) => new Date(timestamp).toLocaleString() },
    { key: 'user', title: 'User', dataIndex: 'user', render: (user) => user ? user.email : 'N/A' },
    { key: 'action', title: 'Action', dataIndex: 'action' },
    { key: 'details', title: 'Details', dataIndex: 'details' },
  ];

  const filteredPatients = patients.filter(p => {
    const q = patientSearch.toLowerCase();
    return (
      p.firstName?.toLowerCase().includes(q) ||
      p.lastName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  const filteredAppointments = appointments.filter(a => {
    const q = appointmentSearch.toLowerCase();
    return (
      (a.patient && (`${a.patient.firstName} ${a.patient.lastName}`.toLowerCase().includes(q))) ||
      (a.doctor && (`${a.doctor.firstName} ${a.doctor.lastName}`.toLowerCase().includes(q))) ||
      (a.date && new Date(a.date).toLocaleDateString().includes(q)) ||
      (a.status && a.status.toLowerCase().includes(q))
    );
  });

  // Export helpers
  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportPDF = (data, columns, filename) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(col => col.title)],
      body: data.map(row => columns.map(col => col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex])),
      styles: { fontSize: 9 },
    });
    doc.save(filename);
  };

  // Add export helpers for diagnoses
  const exportDiagnosesCSV = () => {
    if (!frequentDiagnoses.length) return;
    const csvData = frequentDiagnoses.map((d, idx) => ({
      Rank: idx + 1,
      Diagnosis: d.diagnosis,
      Count: d.count,
      Percentage: d.percentage ? `${d.percentage.toFixed(1)}%` : '',
    }));
    exportCSV(csvData, 'frequent_diagnoses.csv');
  };
  const exportDiagnosesPDF = () => {
    if (!frequentDiagnoses.length) return;
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Rank', 'Diagnosis', 'Count', 'Percentage']],
      body: frequentDiagnoses.map((d, idx) => [
        idx + 1,
        d.diagnosis,
        d.count,
        d.percentage ? `${d.percentage.toFixed(1)}%` : ''
      ]),
      styles: { fontSize: 9 },
    });
    doc.save('frequent_diagnoses.pdf');
  };

  // Debug logs
  console.log('AdminDashboard render:', { patients, appointments, auditLogs, patientStats, appointmentStats });

  return (
    <ErrorBoundary>
      <div className="admin-dashboard" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <Button variant="primary" onClick={() => navigate('/user-management')}>
            Manage Users
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#007bff' }}>Admin Dashboard</h1>
          <Button variant="secondary" onClick={() => navigate('/activity-log')}>
            View Activity Log
          </Button>
        </div>

        <Card style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#234567', marginBottom: '1.5rem' }}>Patient Management</h2>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Button variant="primary" onClick={handleOpenCreatePatientModal}>
              Add New Patient
            </Button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="auth-input"
                placeholder="Search patients..."
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
                style={{ maxWidth: 250 }}
              />
              <Button variant="secondary" onClick={() => exportCSV(filteredPatients, 'patients.csv')}>Export CSV</Button>
              <Button variant="secondary" onClick={() => exportPDF(filteredPatients, patientColumns.filter(c=>c.key!=="actions"), 'patients.pdf')}>Export PDF</Button>
            </div>
          </div>
          <Table columns={patientColumns} data={filteredPatients} loading={loading} error={error} />
        </Card>

        <Card style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#234567', marginBottom: '1.5rem' }}>Appointment Management</h2>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Button variant="primary" onClick={handleOpenCreateAppointmentModal}>
              Add New Appointment
            </Button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="auth-input"
                placeholder="Search appointments..."
                value={appointmentSearch}
                onChange={e => setAppointmentSearch(e.target.value)}
                style={{ maxWidth: 250 }}
              />
              <Button variant="secondary" onClick={() => exportCSV(filteredAppointments, 'appointments.csv')}>Export CSV</Button>
              <Button variant="secondary" onClick={() => exportPDF(filteredAppointments, appointmentColumns.filter(c=>c.key!=="actions"), 'appointments.pdf')}>Export PDF</Button>
            </div>
          </div>
          <Table columns={appointmentColumns} data={filteredAppointments} loading={loading} error={error} />
        </Card>

        <Card style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#234567', marginBottom: '1.5rem' }}>Audit Logs</h2>
          <Table columns={auditLogColumns} data={auditLogs} loading={loading} error={error} />
        </Card>

        <Card style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#234567', marginBottom: '1.5rem' }}>Reporting & Analytics</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span>Date Range:</span>
            <DatePicker
              selected={reportFrom}
              onChange={setReportFrom}
              selectsStart
              startDate={reportFrom}
              endDate={reportTo}
              dateFormat="yyyy-MM-dd"
              placeholderText="From"
              maxDate={reportTo || undefined}
              className="auth-input"
              aria-label="Report start date"
            />
            <DatePicker
              selected={reportTo}
              onChange={setReportTo}
              selectsEnd
              startDate={reportFrom}
              endDate={reportTo}
              dateFormat="yyyy-MM-dd"
              placeholderText="To"
              minDate={reportFrom || undefined}
              className="auth-input"
              aria-label="Report end date"
            />
            <Button variant="primary" onClick={handleDateFilter} disabled={!reportFrom || !reportTo || dateFilterLoading}>
              {dateFilterLoading ? 'Loading...' : 'Filter'}
            </Button>
          </div>
          {dateFilterError && <div className="table-error-state" aria-live="assertive">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>
            {dateFilterError}
          </div>}
          {dateFilteredAppointments.length > 0 && (
            <Table
              columns={appointmentColumns}
              data={dateFilteredAppointments}
              loading={dateFilterLoading}
              error={dateFilterError}
              aria-label="Filtered appointments"
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            {patientStats && (
              <Card style={{ flex: '1', minWidth: '280px', padding: '1rem', textAlign: 'center', background: '#e6f7ff' }}>
                <h3 style={{ color: '#10b3b3' }}>Patient Statistics</h3>
                <p>Total Patients: <strong>{patientStats.totalPatients}</strong></p>
                <p>New Patients Last Month: <strong>{patientStats.newPatientsLastMonth}</strong></p>
              </Card>
            )}
            {appointmentStats && (
              <Card style={{ flex: '1', minWidth: '280px', padding: '1rem', textAlign: 'center', background: '#e6f7ff' }}>
                <h3 style={{ color: '#10b3b3' }}>Appointment Statistics</h3>
                <p>Total Appointments: <strong>{appointmentStats.totalAppointments}</strong></p>
                <p>Completed Appointments: <strong>{appointmentStats.completedAppointments}</strong></p>
                <p>Upcoming Appointments: <strong>{appointmentStats.upcomingAppointments}</strong></p>
              </Card>
            )}
            {(!patientStats && !appointmentStats) && <p>No reporting data available.</p>}
          </div>
          {/* Frequent Diagnoses Analytics Section */}
          <div style={{ margin: '2rem 0' }}>
            <h3 style={{ color: '#10b3b3', marginBottom: '1rem' }}>Most Frequent Diagnoses</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <Button variant="secondary" onClick={exportDiagnosesCSV} disabled={!frequentDiagnoses.length}>Export CSV</Button>
              <Button variant="secondary" onClick={exportDiagnosesPDF} disabled={!frequentDiagnoses.length}>Export PDF</Button>
              <Button variant="secondary" onClick={fetchFrequentDiagnoses} loading={diagnosesLoading}>Refresh</Button>
            </div>
            {diagnosesLoading ? (
              <div role="status" aria-live="polite">Loading...</div>
            ) : diagnosesError ? (
              <div className="table-error-state" aria-live="assertive">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>
                {diagnosesError}
              </div>
            ) : frequentDiagnoses.length === 0 ? (
              <div className="table-empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#b6d4f7" strokeWidth="2" strokeLinecap="round"/></svg>
                No diagnoses data available.
              </div>
            ) : (
              <table className="analytics-table" aria-label="Most frequent diagnoses" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
                  <tr style={{ background: '#f0f8ff' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>#</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Diagnosis</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Count</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>Percentage</th>
          </tr>
        </thead>
        <tbody>
                  {frequentDiagnoses.map((d, idx) => (
                    <tr key={d.diagnosis}>
                      <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0' }}>{d.diagnosis}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>{d.count}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>{d.percentage ? `${d.percentage.toFixed(1)}%` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
            )}
          </div>
        </Card>

        <Modal open={showEditRoleModal} onClose={() => setShowEditRoleModal(false)} title="Edit User Role">
          {currentUserToEditRole && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>Editing role for: <strong>{currentUserToEditRole.fullName} ({currentUserToEditRole.email})</strong></p>
              <label>New Role:</label>
              <select className="auth-input" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="doctor">Doctor</option>
                <option value="user">Patient (user)</option>
              </select>
              {updateRoleError && <p className="error" aria-live="assertive">{updateRoleError}</p>}
              <Button onClick={handleUpdateRole} loading={updateRoleLoading} disabled={updateRoleLoading}>
                Update Role
              </Button>
            </div>
          )}
        </Modal>

        <Modal open={showCreatePatientModal} onClose={() => setShowCreatePatientModal(false)} title="Add New Patient">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {patientFormError && <p className="error" aria-live="assertive">{patientFormError}</p>}
            <label>First Name:</label>
            <input className="auth-input" type="text" name="firstName" value={patientFormData.firstName} onChange={handlePatientFormChange} required />
            <label>Last Name:</label>
            <input className="auth-input" type="text" name="lastName" value={patientFormData.lastName} onChange={handlePatientFormChange} required />
            <label>Date of Birth:</label>
            <input className="auth-input" type="date" name="dob" value={patientFormData.dob} onChange={handlePatientFormChange} required />
            <label>Gender:</label>
            <select className="auth-input" name="gender" value={patientFormData.gender} onChange={handlePatientFormChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label>Email:</label>
            <input className="auth-input" type="email" name="email" value={patientFormData.email} onChange={handlePatientFormChange} required />
            <label>Phone:</label>
            <input className="auth-input" type="tel" name="phone" value={patientFormData.phone} onChange={handlePatientFormChange} required />
            <label>Address:</label>
            <input className="auth-input" type="text" name="address" value={patientFormData.address} onChange={handlePatientFormChange} />
            <Button onClick={handleCreatePatient} loading={patientFormLoading} disabled={patientFormLoading}>
              Create Patient
            </Button>
          </div>
        </Modal>

        <Modal open={showEditPatientModal} onClose={() => setShowEditPatientModal(false)} title="Edit Patient">
          {currentPatient && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {patientFormError && <p className="error" aria-live="assertive">{patientFormError}</p>}
              <label>First Name:</label>
              <input className="auth-input" type="text" name="firstName" value={patientFormData.firstName} onChange={handlePatientFormChange} required />
              <label>Last Name:</label>
              <input className="auth-input" type="text" name="lastName" value={patientFormData.lastName} onChange={handlePatientFormChange} required />
              <label>Date of Birth:</label>
              <input className="auth-input" type="date" name="dob" value={patientFormData.dob} onChange={handlePatientFormChange} required />
              <label>Gender:</label>
              <select className="auth-input" name="gender" value={patientFormData.gender} onChange={handlePatientFormChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label>Email:</label>
              <input className="auth-input" type="email" name="email" value={patientFormData.email} onChange={handlePatientFormChange} required />
              <label>Phone:</label>
              <input className="auth-input" type="tel" name="phone" value={patientFormData.phone} onChange={handlePatientFormChange} required />
              <label>Address:</label>
              <input className="auth-input" type="text" name="address" value={patientFormData.address} onChange={handlePatientFormChange} />
              <Button onClick={handleUpdatePatient} loading={patientFormLoading} disabled={patientFormLoading}>
                Update Patient
              </Button>
            </div>
          )}
        </Modal>

        <Modal open={showDeletePatientModal} onClose={() => setShowDeletePatientModal(false)} title="Confirm Delete">
          {currentPatient && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>Are you sure you want to delete patient: <strong>{currentPatient.firstName} {currentPatient.lastName}</strong>?</p>
              {patientFormError && <p className="error" aria-live="assertive">{patientFormError}</p>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="secondary" onClick={() => setShowDeletePatientModal(false)}>Cancel</Button>
                <Button variant="primary" style={{ background: '#d32f2f', color: 'white' }} onClick={confirmDeletePatient} loading={patientFormLoading} disabled={patientFormLoading}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal open={showCreateAppointmentModal} onClose={() => setShowCreateAppointmentModal(false)} title="Add New Appointment">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointmentFormError && <p className="error" aria-live="assertive">{appointmentFormError}</p>}
            <label>Patient:</label>
            <select className="auth-input" name="patient" value={appointmentFormData.patient} onChange={handleAppointmentFormChange} required>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
            </select>
            <label>Doctor:</label>
            <select className="auth-input" name="doctor" value={appointmentFormData.doctor} onChange={handleAppointmentFormChange} required>
              <option value="">Select Doctor</option>
              {patients.map(d => <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>)}
            </select>
            <label>Date:</label>
            <input className="auth-input" type="date" name="date" value={appointmentFormData.date} onChange={handleAppointmentFormChange} required />
            <label>Time:</label>
            <input className="auth-input" type="time" name="time" value={appointmentFormData.time} onChange={handleAppointmentFormChange} required />
            <label>Type:</label>
            <input className="auth-input" type="text" name="type" value={appointmentFormData.type} onChange={handleAppointmentFormChange} placeholder="e.g., Check-up, Consultation" required />
            <label>Status:</label>
            <select className="auth-input" name="status" value={appointmentFormData.status} onChange={handleAppointmentFormChange} required>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <Button onClick={handleCreateAppointment} loading={appointmentFormLoading} disabled={appointmentFormLoading}>
              Create Appointment
            </Button>
          </div>
        </Modal>

        <Modal open={showEditAppointmentModal} onClose={() => setShowEditAppointmentModal(false)} title="Edit Appointment">
          {currentAppointment && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointmentFormError && <p className="error" aria-live="assertive">{appointmentFormError}</p>}
              <label>Patient:</label>
              <select className="auth-input" name="patient" value={appointmentFormData.patient} onChange={handleAppointmentFormChange} required>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
              </select>
              <label>Doctor:</label>
              <select className="auth-input" name="doctor" value={appointmentFormData.doctor} onChange={handleAppointmentFormChange} required>
                <option value="">Select Doctor</option>
                {patients.map(d => <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>)}
              </select>
              <label>Date:</label>
              <input className="auth-input" type="date" name="date" value={appointmentFormData.date} onChange={handleAppointmentFormChange} required />
              <label>Time:</label>
              <input className="auth-input" type="time" name="time" value={appointmentFormData.time} onChange={handleAppointmentFormChange} required />
              <label>Type:</label>
              <input className="auth-input" type="text" name="type" value={appointmentFormData.type} onChange={handleAppointmentFormChange} placeholder="e.g., Check-up, Consultation" required />
              <label>Status:</label>
              <select className="auth-input" name="status" value={appointmentFormData.status} onChange={handleAppointmentFormChange} required>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Button onClick={handleUpdateAppointment} loading={appointmentFormLoading} disabled={appointmentFormLoading}>
                Update Appointment
              </Button>
            </div>
          )}
        </Modal>

        <Modal open={showDeleteAppointmentModal} onClose={() => setShowDeleteAppointmentModal(false)} title="Confirm Delete">
          {currentAppointment && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>Are you sure you want to delete appointment on <strong>{new Date(currentAppointment.date).toLocaleDateString()} at {currentAppointment.time}</strong> with <strong>Dr. {currentAppointment.doctor ? currentAppointment.doctor.lastName : 'N/A'}</strong>?</p>
              {appointmentFormError && <p className="error" aria-live="assertive">{appointmentFormError}</p>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="secondary" onClick={() => setShowDeleteAppointmentModal(false)}>Cancel</Button>
                <Button variant="primary" style={{ background: '#d32f2f', color: 'white' }} onClick={confirmDeleteAppointment} loading={appointmentFormLoading} disabled={appointmentFormLoading}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>
    </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;