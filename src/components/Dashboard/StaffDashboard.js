import React, { useEffect, useState } from 'react';
import { getUsers, createPatient, updatePatient, deletePatient, fetchAppointments, createAppointment, updateAppointment, deleteAppointment, fetchDoctors } from '../../services/apiService';
import Card from '../Card';
import Table from '../Table';
import Button from '../Button';
import Modal from '../Modal';
import '../../styles/main.css';
import './StaffDashboard.css';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorBoundary from '../../components/ErrorBoundary';

const StaffDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Patient CRUD modal state
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showDeletePatientModal, setShowDeletePatientModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [patientFormData, setPatientFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '', email: '', phone: '', address: '', age: '',
  });
  const [patientFormError, setPatientFormError] = useState(null);
  const [patientFormLoading, setPatientFormLoading] = useState(false);

  // Appointment CRUD modal state
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [showDeleteAppointmentModal, setShowDeleteAppointmentModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointmentFormData, setAppointmentFormData] = useState({
    patient: '', doctor: '', date: '', time: '', type: '', status: 'Scheduled',
  });
  const [appointmentFormError, setAppointmentFormError] = useState(null);
  const [appointmentFormLoading, setAppointmentFormLoading] = useState(false);

  // Add state for medical history modal
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [medicalHistoryEntries, setMedicalHistoryEntries] = useState([]);
  const [medicalHistoryPatient, setMedicalHistoryPatient] = useState(null);
  const [medicalHistoryError, setMedicalHistoryError] = useState(null);
  const [medicalHistoryLoading, setMedicalHistoryLoading] = useState(false);

  // Add search/filter functionality
  const [patientSearch, setPatientSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [patientsRes, appointmentsRes, doctorsRes] = await Promise.all([
        getUsers(), fetchAppointments(), fetchDoctors()
      ]);
      setPatients(patientsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Patient CRUD handlers
  const handleOpenCreatePatientModal = () => {
    setPatientFormData({ firstName: '', lastName: '', dob: '', gender: '', email: '', phone: '', address: '', age: '' });
    setPatientFormError(null);
    setShowCreatePatientModal(true);
  };
  const handleEditPatient = (patient) => {
    setCurrentPatient(patient);
    const dobFormatted = patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '';
    setPatientFormData({
      firstName: patient.firstName || '', lastName: patient.lastName || '', dob: dobFormatted,
      gender: patient.gender || '', email: patient.email || '', phone: patient.phone || '', address: patient.address || '', age: patient.age || '',
    });
    setPatientFormError(null);
    setShowEditPatientModal(true);
  };
  const handlePatientFormChange = (e) => {
    const { name, value } = e.target;
    setPatientFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleCreatePatient = async () => {
    setPatientFormLoading(true);
    setPatientFormError(null);
    try {
      const res = await createPatient(patientFormData);
      if (res.status === 'success') {
        setShowCreatePatientModal(false);
        fetchAll();
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
        fetchAll();
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
        fetchAll();
      } else {
        throw new Error(res.message || 'Failed to delete patient');
      }
    } catch (err) {
      setPatientFormError(err.message || 'Failed to delete patient');
    } finally {
      setPatientFormLoading(false);
    }
  };

  // Appointment CRUD handlers
  const handleOpenCreateAppointmentModal = () => {
    setAppointmentFormData({ patient: '', doctor: '', date: '', time: '', type: '', status: 'Scheduled' });
    setAppointmentFormError(null);
    setShowCreateAppointmentModal(true);
  };
  const handleEditAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    const appointmentDate = appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '';
    setAppointmentFormData({
      patient: appointment.patient._id || '', doctor: appointment.doctor._id || '', date: appointmentDate,
      time: appointment.time || '', type: appointment.type || '', status: appointment.status || 'Scheduled',
    });
    setAppointmentFormError(null);
    setShowEditAppointmentModal(true);
  };
  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleCreateAppointment = async () => {
    setAppointmentFormLoading(true);
    setAppointmentFormError(null);
    try {
      const res = await createAppointment(appointmentFormData);
      if (res.status === 'success') {
        setShowCreateAppointmentModal(false);
        fetchAll();
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
        fetchAll();
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
        fetchAll();
      } else {
        throw new Error(res.message || 'Failed to delete appointment');
      }
    } catch (err) {
      setAppointmentFormError(err.message || 'Failed to delete appointment');
    } finally {
      setAppointmentFormLoading(false);
    }
  };

  // Today's Appointments
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => {
    const dateStr = a.date ? new Date(a.date).toISOString().split('T')[0] : '';
    return dateStr === todayStr;
  });

  // Handler to open medical history modal (support both string and object entries)
  const handleOpenMedicalHistoryModal = (patient) => {
    setMedicalHistoryPatient(patient);
    setMedicalHistoryEntries(
      Array.isArray(patient.medicalHistory)
        ? patient.medicalHistory.map(entry =>
            typeof entry === 'string'
              ? { date: '', type: '', notes: entry }
              : { date: entry.date || '', type: entry.type || '', notes: entry.notes || '' }
          )
        : []
    );
    setMedicalHistoryError(null);
    setShowMedicalHistoryModal(true);
  };

  // Handlers for editing structured medical history
  const handleMedicalHistoryFieldChange = (idx, field, value) => {
    setMedicalHistoryEntries(prev =>
      prev.map((entry, i) => (i === idx ? { ...entry, [field]: value } : entry))
    );
  };
  const handleAddMedicalHistoryEntry = () => {
    setMedicalHistoryEntries(prev => [...prev, { date: '', type: '', notes: '' }]);
  };
  const handleRemoveMedicalHistoryEntry = (idx) => {
    setMedicalHistoryEntries(prev => prev.filter((_, i) => i !== idx));
  };
  const handleSaveMedicalHistory = async () => {
    if (!medicalHistoryPatient) return;
    setMedicalHistoryLoading(true);
    setMedicalHistoryError(null);
    try {
      const updatedPatient = { ...medicalHistoryPatient, medicalHistory: medicalHistoryEntries };
      const res = await updatePatient(medicalHistoryPatient._id, updatedPatient);
      if (res.status === 'success') {
        setShowMedicalHistoryModal(false);
        fetchAll();
      } else {
        throw new Error(res.message || 'Failed to update medical history');
      }
    } catch (err) {
      setMedicalHistoryError(err.message || 'Failed to update medical history');
    } finally {
      setMedicalHistoryLoading(false);
    }
  };

  // Filtered patients
  const filteredPatients = patients.filter(p => {
    const q = patientSearch.toLowerCase();
    return (
      p.firstName?.toLowerCase().includes(q) ||
      p.lastName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });
  // Filtered appointments
  const filteredAppointments = appointments.filter(a => {
    const q = appointmentSearch.toLowerCase();
    return (
      (a.patient && (`${a.patient.firstName} ${a.patient.lastName}`.toLowerCase().includes(q))) ||
      (a.doctor && (`${a.doctor.firstName} ${a.doctor.lastName}`.toLowerCase().includes(q))) ||
      (a.date && new Date(a.date).toLocaleDateString().includes(q)) ||
      (a.status && a.status.toLowerCase().includes(q))
    );
  });

  // Table columns
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
          <Button variant="primary" onClick={() => handleEditPatient(item)}>
            Edit
          </Button>
          <Button variant="secondary" style={{ background: '#10b3b3', color: 'white' }} onClick={() => handleOpenMedicalHistoryModal(item)}>
            Medical History
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

  // Debug logs
  console.log('StaffDashboard render:', { patients, appointments, doctors });

  return (
    <ErrorBoundary>
      <div className="staff-dashboard" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#10b3b3' }}>Staff Dashboard</h1>
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

        <Card>
          <h2 style={{ color: '#234567', marginBottom: '1.5rem' }}>Today's Appointments</h2>
          <Table columns={appointmentColumns} data={todaysAppointments} loading={loading} error={error} />
        </Card>

        {/* Create/Edit/Delete Patient Modals */}
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

        {/* Create/Edit/Delete Appointment Modals */}
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
              {doctors.map(d => <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>)}
            </select>
            <label>Date:</label>
            <DatePicker
              selected={appointmentFormData.date ? new Date(appointmentFormData.date) : null}
              onChange={date => setAppointmentFormData(prev => ({ ...prev, date: date ? date.toISOString().split('T')[0] : '' }))}
              dateFormat="yyyy-MM-dd"
              className="auth-input"
              placeholderText="Select date"
              required
              aria-label="Appointment date"
            />
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
                {doctors.map(d => <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>)}
              </select>
              <label>Date:</label>
              <DatePicker
                selected={appointmentFormData.date ? new Date(appointmentFormData.date) : null}
                onChange={date => setAppointmentFormData(prev => ({ ...prev, date: date ? date.toISOString().split('T')[0] : '' }))}
                dateFormat="yyyy-MM-dd"
                className="auth-input"
                placeholderText="Select date"
                required
                aria-label="Appointment date"
              />
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
            </div>
          )}
        </Modal>

        {/* Medical History Modal */}
        <Modal open={showMedicalHistoryModal} onClose={() => setShowMedicalHistoryModal(false)} title="Edit Medical History">
          {medicalHistoryPatient && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><strong>Patient:</strong> {medicalHistoryPatient.firstName} {medicalHistoryPatient.lastName}</div>
              {medicalHistoryError && <div className="table-error-state" aria-live="assertive">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>
                {medicalHistoryError}
              </div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {medicalHistoryEntries.length === 0 ? (
                  <div className="table-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#b6d4f7" strokeWidth="2" strokeLinecap="round"/></svg>
                    No medical history entries.
                  </div>
                ) : (
                  medicalHistoryEntries.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        className="auth-input"
                        type="date"
                        value={entry.date}
                        onChange={e => handleMedicalHistoryFieldChange(idx, 'date', e.target.value)}
                        placeholder="Date"
                        style={{ minWidth: 120 }}
                        aria-label="Medical history date"
                      />
                      <input
                        className="auth-input"
                        type="text"
                        value={entry.type}
                        onChange={e => handleMedicalHistoryFieldChange(idx, 'type', e.target.value)}
                        placeholder="Type (e.g., Diagnosis, Surgery)"
                        style={{ minWidth: 120 }}
                        aria-label="Medical history type"
                      />
                      <input
                        className="auth-input"
                        type="text"
                        value={entry.notes}
                        onChange={e => handleMedicalHistoryFieldChange(idx, 'notes', e.target.value)}
                        placeholder="Notes"
                        style={{ flex: 1 }}
                        aria-label="Medical history notes"
                      />
                      <Button variant="secondary" style={{ background: '#d32f2f', color: 'white', minWidth: 32 }} onClick={() => handleRemoveMedicalHistoryEntry(idx)} aria-label="Remove entry">
                        X
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Button variant="primary" onClick={handleAddMedicalHistoryEntry} aria-label="Add entry">Add Entry</Button>
                <Button variant="secondary" onClick={handleSaveMedicalHistory} loading={medicalHistoryLoading} disabled={medicalHistoryLoading} aria-label="Save medical history">
                  Save
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default StaffDashboard; 