import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../services/apiService';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfile();
        if (res.status === 'success' && res.data && res.data.user) {
          setProfileData(res.data.user);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');
    setLoading(true);
    try {
      const res = await updateProfile(profileData);
      if (res.status === 'success') {
        setSuccess('Profile updated successfully!');
      } else {
        setError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container error">{error}</div>;

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {success && <div className="success" style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      {profileData && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="fullName"
              value={profileData.fullName || ''}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profileData.email || ''}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone || ''}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={profileData.address || ''}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-input" style={{ background: '#10b3b3', color: 'white', fontWeight: 600 }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;