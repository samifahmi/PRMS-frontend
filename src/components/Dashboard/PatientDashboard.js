import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getAppointmentsForPatient, getProfile, getPatientById, updateProfile } from '../../services/apiService';
import './PatientDashboard.css';
import NotificationCard from '../NotificationCard';
import { FaUserCircle, FaCalendarAlt, FaNotesMedical, FaQuestionCircle } from 'react-icons/fa';

// ErrorBoundary for robust error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="patient-dashboard table-error-state" style={{ color: '#d32f2f', padding: '2rem' }}>
        <h2>Something went wrong.</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#d32f2f' }}>{this.state.error && this.state.error.toString()}</pre>
      </div>;
    }
    return this.props.children;
  }
}

const WelcomeCard = ({ name }) => (
  <div style={{ background: '#e6f7ff', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 16 }}>
    <FaUserCircle size={48} color="#10b3b3" style={{ marginRight: 16 }} />
    <div>
      <h2 style={{ margin: 0, color: '#234567' }}>Welcome, {name}!</h2>
      <p style={{ margin: 0, color: '#555' }}>This is your personal dashboard. Here you can view your profile, appointments, and medical history.</p>
    </div>
  </div>
);

const HelpCard = () => (
  <div style={{ background: '#f8fafc', borderRadius: 16, padding: '1.5rem', marginTop: '2rem', display: 'flex', alignItems: 'center', gap: 16, border: '1px solid #e0e0e0' }}>
    <FaQuestionCircle size={36} color="#10b3b3" style={{ marginRight: 16 }} />
    <div>
      <h3 style={{ margin: 0, color: '#234567' }}>Need help?</h3>
      <p style={{ margin: 0, color: '#555' }}>Contact our clinic at <a href="mailto:info@drseidnur.com" style={{ color: '#10b3b3' }}>info@drseidnur.com</a> or call (555) 123-4567.</p>
    </div>
  </div>
);

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Debug logs
  console.log('PatientDashboard render:', { user, profile, appointments, medicalHistory });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setProfileError(null);
      setProfileLoading(true);
      try {
        // Fetch this user's appointments using the correct endpoint
        const apptRes = await getAppointmentsForPatient(user.id);
        let appts = [];
        if (apptRes.status === 'success' && apptRes.data && Array.isArray(apptRes.data.appointments)) {
          appts = apptRes.data.appointments;
        }
        setAppointments(appts);

        // Fetch patient profile and medical history
        try {
          const profileRes = await getProfile();
          console.log('Profile fetch response:', profileRes);
          if (profileRes.status === 'success' && profileRes.data && profileRes.data.user) {
            setProfile(profileRes.data.user);
            setProfileForm(profileRes.data.user);
          } else {
            setProfile(null);
            setProfileError('Profile not found.');
          }
        } catch (err) {
          setProfile(null);
          setProfileError(err.message || 'Failed to fetch profile');
        }

        const patientRes = await getPatientById(user.id);
        if (patientRes.status === 'success' && patientRes.data && patientRes.data.patient) {
          setMedicalHistory(patientRes.data.patient.medicalHistory || []);
        }
        // Debug logs
        console.log('Fetched data:', { appts, profile, medicalHistory: patientRes.data?.patient?.medicalHistory });
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching patient dashboard data:', err);
      } finally {
        setLoading(false);
        setProfileLoading(false);
      }
    };
    if (user && user.id) fetchData();
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess('');
    try {
      const res = await updateProfile(profileForm);
      if (res.status === 'success') {
        setProfileSuccess('Profile updated successfully!');
        setProfile(profileForm);
        setProfileEditMode(false);
      } else {
        setProfileError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Ensure edit form is always populated from profile
  const handleEditProfile = () => {
    setProfileForm(profile);
    setProfileEditMode(true);
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(a => {
    const q = appointmentSearch.toLowerCase();
    return (
      (a.doctor && (`${a.doctor.firstName} ${a.doctor.lastName}`.toLowerCase().includes(q))) ||
      (a.date && new Date(a.date).toLocaleDateString().includes(q)) ||
      (a.status && a.status.toLowerCase().includes(q))
    );
  });
  // Filtered medical history
  const filteredHistory = medicalHistory.filter(entry => {
    const q = historySearch.toLowerCase();
    return (
      (entry.type && entry.type.toLowerCase().includes(q)) ||
      (entry.notes && entry.notes.toLowerCase().includes(q)) ||
      (entry.date && new Date(entry.date).toLocaleDateString().includes(q))
    );
  });

  // Find next upcoming appointment
  const now = new Date();
  const nextAppointment = appointments
    .filter(a => a.status === 'Scheduled' && new Date(a.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  if (loading) return <div className="patient-dashboard" role="status" aria-live="polite">Loading...</div>;
  if (error) return <div className="patient-dashboard table-error-state" aria-live="assertive">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10" stroke="#b6d4f7" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>
    {error}
  </div>;

  return (
    <ErrorBoundary>
      <div className="patient-dashboard">
        <WelcomeCard name={profile ? `${profile.firstName} ${profile.lastName}` : user.fullName || user.name} />
        {nextAppointment && (
          <NotificationCard
            icon="⏰"
            title="Upcoming Appointment:"
            message={`${nextAppointment.date ? new Date(nextAppointment.date).toLocaleString() : ''} with ${nextAppointment.doctor ? `${nextAppointment.doctor.firstName} ${nextAppointment.doctor.lastName}` : 'Doctor'} (Status: ${nextAppointment.status})`}
            type="warning"
          />
        )}
        <section className="patient-profile-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaUserCircle color="#10b3b3" /> Your Profile</h2>
          {profileLoading ? (
            <div className="profile-skeleton">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line" />
            </div>
          ) : profileEditMode ? (
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profileError && <div className="error">{profileError}</div>}
              {profileSuccess && <div className="success" style={{ color: 'green' }}>{profileSuccess}</div>}
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileForm?.fullName || ''}
                  onChange={handleProfileChange}
                  className="auth-input"
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm?.email || ''}
                  onChange={handleProfileChange}
                  className="auth-input"
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm?.phone || ''}
                  onChange={handleProfileChange}
                  className="auth-input"
                />
              </div>
              <div>
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={profileForm?.address || ''}
                  onChange={handleProfileChange}
                  className="auth-input"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="auth-input" style={{ background: '#10b3b3', color: 'white', fontWeight: 600 }} disabled={profileLoading}>
                  {profileLoading ? 'Updating...' : 'Save'}
                </button>
                <button type="button" className="auth-input" style={{ background: '#eee', color: '#234567' }} onClick={() => setProfileEditMode(false)} disabled={profileLoading}>
                  Cancel
                </button>
              </div>
            </form>
          ) : profile ? (
            <ul>
              <li><strong>Email:</strong> {profile?.email || 'N/A'}</li>
              <li><strong>Phone:</strong> {profile?.phone || 'N/A'}</li>
              <li><strong>Gender:</strong> {profile?.gender || 'N/A'}</li>
              <li><strong>Date of Birth:</strong> {profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</li>
              <li><strong>Address:</strong> {profile?.address || 'N/A'}</li>
              <li style={{ marginTop: 12 }}><button className="auth-input" style={{ background: '#10b3b3', color: 'white', fontWeight: 600 }} onClick={handleEditProfile}>Edit Profile</button></li>
            </ul>
          ) : profileError ? (
            <div className="table-error-state">{profileError}</div>
          ) : (
            <div className="table-empty-state">Profile not found.</div>
          )}
        </section>
        <section className="patient-appointments-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaCalendarAlt color="#10b3b3" /> Your Appointments</h2>
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
          {filteredAppointments.length === 0 ? <div className="table-empty-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" stroke="#b6d4f7" strokeWidth="4"/><path d="M25 50c0-8 10-12 15-12s15 4 15 12" stroke="#10b3b3" strokeWidth="3" strokeLinecap="round"/><circle cx="40" cy="36" r="6" stroke="#10b3b3" strokeWidth="3"/></svg>
            <div style={{ marginTop: 12, color: '#555' }}>You have no appointments yet.<br />Please contact the clinic to book your first appointment.</div>
          </div> : (
            <table className="patient-appointments-table" aria-label="Patient appointments list">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appt => (
                  <tr key={appt._id}>
                    <td>{appt.date ? new Date(appt.date).toLocaleDateString() : ''}</td>
                    <td>{appt.time || (appt.date ? new Date(appt.date).toLocaleTimeString() : '')}</td>
                    <td>{appt.doctor ? `${appt.doctor.firstName} ${appt.doctor.lastName}` : 'N/A'}</td>
                    <td>{appt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className="patient-history-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaNotesMedical color="#10b3b3" /> Your Medical History</h2>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            <input
              type="text"
              className="auth-input"
              placeholder="Search history..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              style={{ maxWidth: 250 }}
            />
          </div>
          {filteredHistory.length === 0 ? <div className="table-empty-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="38" stroke="#b6d4f7" strokeWidth="4"/><rect x="28" y="30" width="24" height="20" rx="4" stroke="#10b3b3" strokeWidth="3"/><path d="M40 38v8M36 42h8" stroke="#10b3b3" strokeWidth="3" strokeLinecap="round"/></svg>
            <div style={{ marginTop: 12, color: '#555' }}>No medical history entries yet.<br />Your records will appear here after your first visit.</div>
          </div> : (
            <ul>
              {filteredHistory.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.date ? new Date(entry.date).toLocaleDateString() : ''}</strong> - {entry.type}: {entry.notes}
                </li>
              ))}
            </ul>
          )}
        </section>
        <HelpCard />
      </div>
    </ErrorBoundary>
  );
};

export default PatientDashboard;