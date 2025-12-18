// src/pages/ClubRequests.tsx
import React, { useState } from 'react';
import NavigationBar from '../components/Navbar';
import './ClubRequests.css';

interface ClubRequestsProps {
  onLogout?: () => void;
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
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const userDataStr = localStorage.getItem('userData');
  if (!userDataStr) {
    return (
      <div className="club-requests-page">
        <NavigationBar onLogout={onLogout} />
        <div className="club-requests-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Please log in to submit requests.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="btn-submit-request"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userData = JSON.parse(userDataStr);
  const clubId = userData.club_id;

  const getClubName = () => {
    if (clubId === 1) return 'NIMUN';
    if (clubId === 2) return 'RPM';
    if (clubId === 3) return 'ICPC';
    if (clubId === 4) return 'IEEE';
    return 'Club';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setMessageType(null);

    try {
      const requestData: any = {
        user_id: userData.user_id,
        club_id: clubId,
        title: title.trim(),
        description: description.trim(),
        request_type: requestType
      };

      if (eventDate) requestData.event_date = eventDate;
      if (startTime) requestData.start_time = startTime;
      if (endTime) requestData.end_time = endTime;
      if (location.trim()) requestData.location = location.trim();
      if (roomId.trim()) requestData.room_id = parseInt(roomId.trim());

      if (!requestData.title) {
        setMessage('Title is required');
        setMessageType('error');
        setSubmitting(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Request submitted successfully! Request ID: ${result.request_id}`);
        setMessageType('success');
        
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
        setMessage(errorData.error || 'Failed to submit request. Please try again.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Network error. Please make sure the Flask server is running.');
      setMessageType('error');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Form Section */}
        <div className="request-form-container">
          {message && (
            <div className={`message-container message-${messageType}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="requestType">Request Type *</label>
              <select
                id="requestType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as any)}
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
                </div>

                <div className="form-row">
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

                  <div className="form-group">
                    <label htmlFor="roomId">Room ID (optional)</label>
                    <input
                      type="number"
                      id="roomId"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="form-control"
                      placeholder="e.g., 1"
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
                    placeholder="e.g., Campus Lawn"
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
              className="btn-submit-request-alt"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Keep your existing request types section */}
        <div className="request-types-section">
          <h3 className="request-types-title">Request Types</h3>
          
          <div className="request-type-cards">
            <div className="request-type-card">
              <h4 className="card-title">Book a room</h4>
              <p className="card-description">
                Request funding, book rooms, or submit new event proposals to the SU
              </p>
            </div>
            
            <div className="request-type-card">
              <h4 className="card-title">Request funding</h4>
              <p className="card-description">
                See all scheduled club activities and avoid conflicts with other events
              </p>
            </div>
            
            <div className="request-type-card">
              <h4 className="card-title">New event request</h4>
              <p className="card-description">
                Track the status of your submitted requests and approvals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubRequests;