import React, { useState } from 'react';
import { User, Group } from '../App';
import { PROFILE_AVATARS } from '../utils/profileUtils';
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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);

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

  const handleInviteClick = () => {
    // Check if group is full
    if (group.members.length >= 10) {
      alert('Group is full! Maximum 10 members allowed.');
      return;
    }
    setShowInviteModal(true);
    setInviteEmail('');
    setInviteStatus(null);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      setInviteStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSendingInvite(true);
    setInviteStatus(null);

    try {
      // Call backend API to send email
      const response = await fetch('http://localhost:8080/api/invitations/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName: group.name,
          groupKey: group.key,
          inviterName: user.username,
          inviterEmail: user.email,
          recipientEmail: inviteEmail,
        }),
      });

      if (response.ok) {
        setInviteStatus({ type: 'success', message: 'Invitation sent successfully!' });
        setTimeout(() => {
          setShowInviteModal(false);
          setInviteEmail('');
          setInviteStatus(null);
        }, 2000);
      } else {
        const error = await response.text();
        setInviteStatus({ type: 'error', message: error || 'Failed to send invitation' });
      }
    } catch (error) {
      setInviteStatus({ type: 'error', message: 'Unable to connect to server. Please try again.' });
    } finally {
      setIsSendingInvite(false);
    }
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteStatus(null);
  };

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="header-content">
          <h1>LCA</h1>
          <div className="user-info">
            {user.avatarIndex !== undefined && (
              <img 
                src={PROFILE_AVATARS[user.avatarIndex].image} 
                alt={PROFILE_AVATARS[user.avatarIndex].name}
                className="user-profile-avatar"
              />
            )}
            <span>⟁ {user.username}</span>
            <button onClick={onLogout} className="logout-button">
              ⏻ LOGOUT
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
                  {showGroupKey ? '◉' : '◎'}
                </button>
                <button 
                  onClick={copyGroupKey}
                  className="copy-button"
                  title="Copy group key"
                >
                  ⟐
                </button>
              </div>
              <small>Share this key with friends to invite them to your group</small>
              <button 
                onClick={handleInviteClick}
                className="invite-button"
                disabled={group.members.length >= 10}
              >
                ⟁ TRANSMIT INVITE
              </button>
              {group.members.length >= 10 && (
                <small className="warning-text">Group is full (10/10 members)</small>
              )}
            </div>
            
            <div className="members-section">
              <h3>Group Members ({group.members.length})</h3>
              <div className="members-list">
                {group.members.map((member, index) => {
                  const avatarIndex = member.avatarIndex !== undefined ? member.avatarIndex : index % 9;
                  return (
                    <div key={member.id} className="member-item">
                      <div className="member-avatar-container">
                        {PROFILE_AVATARS[avatarIndex] && (
                          <img 
                            src={PROFILE_AVATARS[avatarIndex].image} 
                            alt={PROFILE_AVATARS[avatarIndex].name}
                            className="member-avatar-image"
                          />
                        )}
                      </div>
                      <div className="member-info">
                        <span className="member-name">{member.username}</span>
                        <small className="member-email">{member.email}</small>
                      </div>
                      {member.id === user.id && (
                        <span className="you-indicator">(You)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="group-actions">
              <button onClick={handleLeaveGroup} className="leave-group-button">
                ⏻ DISCONNECT
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
          <h3>⟁ LINK ESTABLISHED</h3>
          <p>
            You've successfully synced with node "{group.name}". 
            This is where the core system modules will be deployed.
          </p>
          <div className="feature-list">
            <h4>Modules in pipeline:</h4>
            <ul>
              <li>Encrypted group comms</li>
              <li>Shared data vault</li>
              <li>Task orchestration</li>
              <li>Chrono event planner</li>
              <li>Real-time sync tools</li>
            </ul>
          </div>
        </div>
      </main>

      {showLeaveConfirm && (
        <div className="modal-overlay" onClick={cancelLeave}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠ Disconnect?</h3>
            <p>Confirm disconnection from node "{group.name}"?</p>
            {user.id === group.creatorId && group.members.length === 1 && (
              <p className="warning-text">
                ⚠ You are the creator and last member. The group will be permanently deleted.
              </p>
            )}
            <div className="modal-buttons">
              <button onClick={confirmLeave} className="confirm-button">
                ⏻ CONFIRM
              </button>
              <button onClick={cancelLeave} className="cancel-button">
                ◂ ABORT
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="modal-overlay" onClick={closeInviteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⟁ TRANSMIT SIGNAL</h3>
            <p>Send a signal invite to join "{group.name}"</p>
            
            {inviteStatus && (
              <div className={`status-message ${inviteStatus.type}`}>
                {inviteStatus.message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="inviteEmail">Friend's Email Address</label>
              <input
                type="email"
                id="inviteEmail"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                disabled={isSendingInvite}
              />
              <small>They'll receive an email with your group key and instructions</small>
            </div>
            
            <div className="modal-buttons">
              <button 
                onClick={handleSendInvite} 
                className="confirm-button"
                disabled={isSendingInvite || !inviteEmail}
              >
                {isSendingInvite ? 'Sending...' : 'Send Invitation'}
              </button>
              <button 
                onClick={closeInviteModal} 
                className="cancel-button"
                disabled={isSendingInvite}
              >
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