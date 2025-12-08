import React from 'react';
import NavigationBar from '../components/Navbar';
import './ClubRequests.css';

interface ClubRequestsProps {
  onLogout?: () => void;
}

const ClubRequests: React.FC<ClubRequestsProps> = ({ onLogout }) => {
  return (
    <div className="club-requests-page">
      <NavigationBar onLogout={onLogout} />

      <div className="club-requests-content">
        <div className="club-requests-hero">
          <h2 className="club-requests-title">Club Requests</h2>
          <p className="club-requests-subtitle">
            Submit and track requests for resources and support
          </p>
          
          <div className="club-requests-buttons">
            <button className="btn-submit-request">Submit Request</button>
            <button className="btn-view-request">View my Request</button>
          </div>
        </div>

        <div className="request-types-section">
          <h3 className="request-types-title">Select Request Type</h3>
          
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

