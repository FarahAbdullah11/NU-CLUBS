// src/pages/ClubRequests.tsx
import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/Navbar';
import './ClubRequests.css';

interface ClubRequestsProps {
  onLogout?: () => void;
}

interface UserData {
  user_id: number;
  fullname: string;
  role: string;
  club_id?: number;
}

const ClubRequests: React.FC<ClubRequestsProps> = ({ onLogout }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState<'ROOM_BOOKING' | 'EVENT' | 'FUNDING'>('ROOM_BOOKING');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [roomId, setRoomId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Handle user data parsing on mount
  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const parsedData = JSON.parse(userDataStr) as UserData;
        setUserData(parsedData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        // Will redirect to login below
      }
    }
  }, []);

  // Get club name for display
  const getClubName = () => {
    if (!userData?.club_id) return 'Club';
    switch (userData.club_id) {
      case 1: return 'NIMUN';
      case 2: return 'RPM';
      case 3: return 'ICPC';
      case 4: return 'IEEE';
      default: return 'Club';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setSubmitting(true);
    setMessage('');

    try {
      const requestData = {
        user_id: userData.user_id,
        club_id: userData.club_id,
        title: title.trim(),
        description: description.trim(),
        request_type: requestType,
        ...(eventDate && { event_date: eventDate }),
        ...(startTime && { start_time: startTime }),
        ...(endTime && { end_time: endTime }),
        ...(location.trim() && { location: location.trim() }),
        ...(roomId.trim() && { room_id: parseInt(roomId.trim(), 10) })
      };

      // Validate required fields
      if (!requestData.title) {
        setMessage('❌ Title is required');
        setSubmitting(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ Request submitted successfully! Request ID: ${result.request_id}`);
        
        // Reset form
        setTitle('');
        setDescription('');
        setEventDate('');
        setStartTime('');
        setEndTime('');
        setLocation('');
        setRoomId('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(`❌ Error: ${errorData.error || 'Failed to submit request. Please try again.'}`);
      }
    } catch (err) {
      setMessage('❌ Network error. Please make sure the Flask server is running.');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect to login if no user data
  if (!userData) {
    return (
      <div className="club-requests-page">
        <NavigationBar onLogout={onLogout} />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Please log in to submit requests.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#1a73e8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="club-requests-page">
      <NavigationBar onLogout={onLogout} />

      <div className="club-requests-content">
        <div className="club-requests-hero">
          <h2 className="club-requests-title">Submit a New Request</h2>
          <p className="club-requests-subtitle">
            Submit requests for your club: <strong>{getClubName()}</strong>
          </p>
        </div>

        <div className="request-form-container">
          {message && (
            <div 
              style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
                color: message.includes('✅') ? '#155724' : '#721c24',
                borderRadius: '4px',
                border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="request-form">
            <div className="form-group">
              <label htmlFor="requestType">Request Type *</label>
              <select
                id="requestType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as 'ROOM_BOOKING' | 'EVENT' | 'FUNDING')}
                required
                className="form-control"
              >
                <option value="ROOM_BOOKING">Room Booking</option>
                <option value="EVENT">Event</option>
                <option value="FUNDING">Funding Request</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-control"
                placeholder="e.g., Annual MUN Conference"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                placeholder="Provide details about your request"
                rows={3}
              />
            </div>

            {/* Event/Booking Details (only for ROOM_BOOKING and EVENT) */}
            {(requestType === 'ROOM_BOOKING' || requestType === 'EVENT') && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="eventDate">Event Date</label>
                    <input
                      type="date"
                      id="eventDate"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location (optional)</label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-control"
                    placeholder="e.g., Campus Lawn, Auditorium A, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="roomId">Room ID (optional)</label>
                  <input
                    type="number"
                    id="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="form-control"
                    placeholder="e.g., 1 for Auditorium A"
                    min="1"
                  />
                  <small className="form-text">
                    Room IDs: 1=Auditorium A, 2=Conference Room B, 3=Lab 101, 4=Hall C, 5=Seminar Room D
                  </small>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-submit-request"
              style={{
                backgroundColor: submitting ? '#6c757d' : '#1a73e8',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClubRequests;