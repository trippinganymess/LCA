import React, { useState } from 'react';
import { User, Group } from '../App';
import './MainApp.css';

interface MainAppProps {
  user: User;
  group: Group;
  onLogout: () => void;
  onLeaveGroup: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, group, onLogout, onLeaveGroup }) => {
  const [showGroupKey, setShowGroupKey] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const copyGroupKey = () => {
    navigator.clipboard.writeText(group.key);
    alert('Group key copied to clipboard!');
  };

  const handleLeaveGroup = () => {
    setShowLeaveConfirm(true);
  };

  const confirmLeave = () => {
    onLeaveGroup();
    setShowLeaveConfirm(false);
  };

  const cancelLeave = () => {
    setShowLeaveConfirm(false);
  };

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="header-content">
          <h1>LCA Application</h1>
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-content">
        <div className="group-info-card">
          <h2>Group: {group.name}</h2>
          
          <div className="group-details">
            <div className="group-key-section">
              <label>Group Key:</label>
              <div className="key-display">
                <span className="group-key">
                  {showGroupKey ? group.key : '••••••••'}
                </span>
                <button 
                  onClick={() => setShowGroupKey(!showGroupKey)}
                  className="toggle-key-button"
                >
                  {showGroupKey ? '🙈' : '👁️'}
                </button>
                <button 
                  onClick={copyGroupKey}
                  className="copy-button"
                  title="Copy group key"
                >
                  📋
                </button>
              </div>
              <small>Share this key with friends to invite them to your group</small>
            </div>
            
            <div className="members-section">
              <h3>Group Members ({group.members.length})</h3>
              <div className="members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-avatar">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.username}</span>
                      <small className="member-email">{member.email}</small>
                    </div>
                    {member.id === user.id && (
                      <span className="you-indicator">(You)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="group-actions">
              <button onClick={handleLeaveGroup} className="leave-group-button">
                🚪 Leave Group
              </button>
              {user.id === group.creatorId && (
                <small className="creator-note">
                  Note: As the creator, leaving will delete the group if you're the last member.
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="app-placeholder">
          <h3>🎉 Welcome to your group!</h3>
          <p>
            You've successfully joined the group "{group.name}". 
            This is where the main application features would be implemented.
          </p>
          <div className="feature-list">
            <h4>Features that could be added:</h4>
            <ul>
              <li>Group chat or messaging</li>
              <li>Shared documents or files</li>
              <li>Task management for the group</li>
              <li>Calendar or event planning</li>
              <li>Real-time collaboration tools</li>
            </ul>
          </div>
        </div>
      </main>

      {showLeaveConfirm && (
        <div className="modal-overlay" onClick={cancelLeave}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Leave Group?</h3>
            <p>Are you sure you want to leave "{group.name}"?</p>
            {user.id === group.creatorId && group.members.length === 1 && (
              <p className="warning-text">
                ⚠️ You are the creator and last member. The group will be permanently deleted.
              </p>
            )}
            <div className="modal-buttons">
              <button onClick={confirmLeave} className="confirm-button">
                Yes, Leave Group
              </button>
              <button onClick={cancelLeave} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainApp;