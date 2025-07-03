import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchAppointments, updateAppointmentStatus, getPatientById, updatePatient, createProject, startAnalysis, getAnalysisResult } from '../../services/apiService';
import Button from '../Button';
import Modal from '../Modal';
import NotificationCard from '../NotificationCard';
import ErrorBoundary from '../../components/ErrorBoundary';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: '', url: '', description: '' });
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAppointments();
        if (res.status === 'success' && res.data && Array.isArray(res.data.appointments)) {
          // Filter appointments assigned to this doctor
          const doctorAppointments = res.data.appointments.filter(a => a.assignedTo === user.id || (a.doctor && a.doctor._id === user.id));
          setAppointments(doctorAppointments);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.id) fetchData();
  }, [user]);

  const handleStatusChange = async (appointmentId, status) => {
    setLoading(true);
    setError(null);
    try {
      await updateAppointmentStatus(appointmentId, status);
      // Refresh appointments
      const res = await fetchAppointments();
      if (res.status === 'success' && res.data && Array.isArray(res.data.appointments)) {
        const doctorAppointments = res.data.appointments.filter(a => a.assignedTo === user.id || (a.doctor && a.doctor._id === user.id));
        setAppointments(doctorAppointments);
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const openHistoryModal = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    setHistoryError(null);
    setNewNote('');
    try {
      const res = await getPatientById(appointment.patient._id);
      if (res.status === 'success' && res.data && res.data.patient) {
        setHistoryEntries(res.data.patient.medicalHistory || []);
      } else {
        setHistoryEntries([]);
      }
    } catch (err) {
      setHistoryError(err.message || 'Failed to fetch medical history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await getPatientById(selectedAppointment.patient._id);
      let history = [];
      if (res.status === 'success' && res.data && res.data.patient) {
        history = res.data.patient.medicalHistory || [];
      }
      const updatedHistory = [...history, { date: new Date().toISOString(), type: 'Doctor Note', notes: newNote }];
      await updatePatient(selectedAppointment.patient._id, { medicalHistory: updatedHistory });
      setHistoryEntries(updatedHistory);
      setNewNote('');
    } catch (err) {
      setHistoryError(err.message || 'Failed to add note');
    } finally {
      setHistoryLoading(false);
    }
  };

  const openPatientModal = async (patientId) => {
    setShowPatientModal(true);
    setPatientDetails(null);
    try {
      const res = await getPatientById(patientId);
      if (res.status === 'success' && res.data && res.data.patient) {
        setPatientDetails(res.data.patient);
      }
    } catch (err) {
      setPatientDetails(null);
    }
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setPatientDetails(null);
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(a => {
    const q = appointmentSearch.toLowerCase();
    return (
      (a.patient && (`${a.patient.firstName} ${a.patient.lastName}`.toLowerCase().includes(q))) ||
      (a.date && new Date(a.date).toLocaleDateString().includes(q)) ||
      (a.status && a.status.toLowerCase().includes(q))
    );
  });

  // Find next upcoming appointment
  const now = new Date();
  const nextAppointment = appointments
    .filter(a => a.status === 'Scheduled' && new Date(a.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // Project Handlers
  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setProjectLoading(true);
    setProjectError('');
    try {
      const res = await createProject(projectForm);
      if (res.status === 'success' && res.project) {
        setProjects(prev => [...prev, res.project]);
        setProjectForm({ name: '', url: '', description: '' });
      } else {
        setProjectError(res.message || 'Failed to create project');
      }
    } catch (err) {
      setProjectError(err.message || 'Failed to create project');
    } finally {
      setProjectLoading(false);
    }
  };
  // Analysis Handlers
  const handleStartAnalysis = async (projectId, url) => {
    setAnalysisLoading(true);
    setAnalysisError('');
    setAnalysisResult(null);
    try {
      const res = await startAnalysis(projectId, url);
      if (res.status === 'success' && res.result_id) {
        // Fetch result after a delay or let user fetch manually
        setTimeout(() => fetchAnalysisResult(projectId, res.result_id), 2000);
      } else {
        setAnalysisError(res.message || 'Failed to start analysis');
      }
    } catch (err) {
      setAnalysisError(err.message || 'Failed to start analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };
  const fetchAnalysisResult = async (projectId, resultId) => {
    setAnalysisLoading(true);
    setAnalysisError('');
    setAnalysisResult(null);
    try {
      const res = await getAnalysisResult(projectId, resultId);
      if (res.status === 'success' && res.result) {
        setAnalysisResult(res.result);
      } else {
        setAnalysisError(res.message || 'Failed to fetch analysis result');
      }
    } catch (err) {
      setAnalysisError(err.message || 'Failed to fetch analysis result');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Debug logs
  console.log('DoctorDashboard render:', { user, appointments, patientDetails });

  if (loading) return <div className="doctor-dashboard">Loading...</div>;
  if (error) return <div className="doctor-dashboard">Error: {error}</div>;

  return (
    <ErrorBoundary>
      <div className="doctor-dashboard">
        {nextAppointment && (
          <NotificationCard
            icon="⏰"
            title="Upcoming Appointment:"
            message={`${nextAppointment.date ? new Date(nextAppointment.date).toLocaleString() : ''} with ${nextAppointment.patient ? `${nextAppointment.patient.firstName} ${nextAppointment.patient.lastName}` : 'Patient'} (Status: ${nextAppointment.status})`}
            type="warning"
          />
        )}
        <h1>Welcome, Dr. {user.fullName || user.name}</h1>
        <h2>Your Appointments</h2>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          <input
            type="text"
            className="auth-input"
            placeholder="Search appointments..."
            value={appointmentSearch}
            onChange={e => setAppointmentSearch(e.target.value)}
            style={{ maxWidth: 250 }}
          />
        </div>
        {filteredAppointments.length === 0 ? (
          <div className="table-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#b6d4f7" strokeWidth="2" strokeLinecap="round"/></svg>
            No appointments found.
          </div>
        ) : (
          <table className="doctor-appointments-table" aria-label="Doctor appointments list">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appt => (
                <tr key={appt._id}>
                  <td>
                    {appt.patient ? (
                      <Button variant="link" onClick={() => openPatientModal(appt.patient._id)}>{appt.patient.firstName} {appt.patient.lastName}</Button>
                    ) : 'N/A'}
                  </td>
                  <td>{new Date(appt.date).toLocaleString()}</td>
                  <td>{appt.status}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="primary" onClick={() => openHistoryModal(appt)}>
                      Medical History
                    </Button>
                    {appt.status !== 'Completed' && (
                      <Button variant="secondary" onClick={() => handleStatusChange(appt._id, 'Completed')}>Mark Completed</Button>
                    )}
                    {appt.status !== 'Cancelled' && (
                      <Button variant="secondary" onClick={() => handleStatusChange(appt._id, 'Cancelled')}>Cancel</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Medical History Modal */}
        <Modal open={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Patient Medical History">
          {historyLoading ? (
            <div role="status" aria-live="polite">Loading...</div>
          ) : historyError ? (
            <div className="table-error-state" aria-live="assertive">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>
              {historyError}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>History Entries</h3>
              {historyEntries.length === 0 ? <div className="table-empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#b6d4f7" strokeWidth="2" strokeLinecap="round"/></svg>
                No history entries.
              </div> : (
                <ul>
                  {historyEntries.map((entry, idx) => (
                    <li key={idx}>
                      <strong>{entry.date ? new Date(entry.date).toLocaleDateString() : ''}</strong> - {entry.type}: {entry.notes}
                    </li>
                  ))}
                </ul>
              )}
              <textarea
                className="auth-input"
                rows={3}
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                aria-label="Add a new note"
              />
              <Button onClick={handleAddNote} loading={historyLoading} disabled={historyLoading || !newNote.trim()} aria-label="Add note">
                Add Note
              </Button>
            </div>
          )}
        </Modal>
        {/* Patient Details Modal */}
        <Modal open={showPatientModal} onClose={closePatientModal} title="Patient Details">
          {patientDetails ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p><strong>Name:</strong> {patientDetails.firstName} {patientDetails.lastName}</p>
              <p><strong>Email:</strong> {patientDetails.email}</p>
              <p><strong>Phone:</strong> {patientDetails.phone}</p>
              <p><strong>Gender:</strong> {patientDetails.gender}</p>
              <p><strong>Date of Birth:</strong> {new Date(patientDetails.dob).toLocaleDateString()}</p>
              <p><strong>Address:</strong> {patientDetails.address}</p>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </Modal>
        {/* Projects & Analysis Section */}
        <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2>Projects & Analysis</h2>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <input
              className="auth-input"
              type="text"
              name="name"
              value={projectForm.name}
              onChange={handleProjectFormChange}
              placeholder="Project Name"
              required
            />
            <input
              className="auth-input"
              type="url"
              name="url"
              value={projectForm.url}
              onChange={handleProjectFormChange}
              placeholder="Project URL"
              required
            />
            <input
              className="auth-input"
              type="text"
              name="description"
              value={projectForm.description}
              onChange={handleProjectFormChange}
              placeholder="Description"
            />
            <Button type="submit" variant="primary" loading={projectLoading} disabled={projectLoading}>Create Project</Button>
          </form>
          {projectError && <div className="error" aria-live="assertive">{projectError}</div>}
          <div>
            {projects.length === 0 ? <p>No projects yet.</p> : (
              <table className="doctor-projects-table" style={{ width: '100%', marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                      <td><a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a></td>
                      <td>{project.description}</td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => handleStartAnalysis(project._id, project.url)}
                          loading={analysisLoading}
                          disabled={analysisLoading}
                        >
                          Start Analysis
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {analysisError && <div className="error" aria-live="assertive">{analysisError}</div>}
          {analysisResult && (
            <div style={{ marginTop: '1rem', background: '#f0f8ff', padding: '1rem', borderRadius: 8 }}>
              <h3>Analysis Result</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(analysisResult, null, 2)}</pre>
            </div>
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default DoctorDashboard;