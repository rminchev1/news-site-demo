import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [preferences, setPreferences] = useState({
    newsletter: true,
    notifications: true,
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      setPreferences({
        newsletter: user.preferences?.newsletter ?? true,
        notifications: user.preferences?.notifications ?? true,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userAPI.updateProfile(profileData);
      if (response.data.success) {
        updateUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userAPI.updatePreferences(preferences);
      if (response.data.success) {
        setSuccess('Preferences updated successfully!');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="app">
        <Header />
        <div className="profile-container">
          <div className="loading">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <h2>{user.fullName}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
          
          <nav className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-section-header">
                <h3>Profile Information</h3>
                {!isEditing && (
                  <button
                    className="edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSave} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          firstName: user.firstName || '',
                          lastName: user.lastName || '',
                          email: user.email || '',
                        });
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="save-button"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="profile-section">
              <div className="profile-section-header">
                <h3>Preferences</h3>
              </div>

              <form onSubmit={handlePreferencesSave} className="preferences-form">
                <div className="preference-group">
                  <div className="preference-item">
                    <label className="preference-label">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={preferences.newsletter}
                        onChange={handlePreferenceChange}
                      />
                      <span className="preference-text">
                        <strong>Newsletter Subscription</strong>
                        <small>Receive our weekly newsletter with the latest news and updates</small>
                      </span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <label className="preference-label">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={preferences.notifications}
                        onChange={handlePreferenceChange}
                      />
                      <span className="preference-text">
                        <strong>Push Notifications</strong>
                        <small>Get notified about breaking news and important updates</small>
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;