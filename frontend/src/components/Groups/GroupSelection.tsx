import React, { useState } from 'react';
import { User, Group } from '../../App';
import { generateGroupKey, isValidGroupKey, getAllGroups, saveGroups } from '../../utils/groupUtils';
import './Groups.css';

interface GroupSelectionProps {
  user: User;
  onJoinGroup: (group: Group, isCreator?: boolean) => void;
}

const GroupSelection: React.FC<GroupSelectionProps> = ({ user, onJoinGroup }) => {
  const [mode, setMode] = useState<'select' | 'join' | 'create'>('select');
  const [groupKey, setGroupKey] = useState('');
  const [groupName, setGroupName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinGroup = async () => {
    if (!isValidGroupKey(groupKey)) {
      setErrors(['Group key must be exactly 8 uppercase letters']);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const groups = getAllGroups();
      const targetGroup = groups.find((g: any) => g.key === groupKey);

      if (!targetGroup) {
        setErrors(['Group not found. Please check the group key.']);
        return;
      }

      // Check if user is already a member
      if (targetGroup.members.some((m: any) => m.id === user.id)) {
        setErrors(['You are already a member of this group.']);
        return;
      }

      // Add user to group
      targetGroup.members.push(user);
      saveGroups(groups);

      onJoinGroup(targetGroup);
    } catch (error) {
      setErrors(['An error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setErrors(['Group name is required']);
      return;
    }

    // Check if user has already created a group
    if (user.createdGroupId) {
      const groups = getAllGroups();
      const existingGroup = groups.find((g: any) => g.id === user.createdGroupId);
      if (existingGroup) {
        setErrors(['You have already created a group. Leave it first to create a new one.']);
        return;
      }
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: groupName.trim(),
        key: generateGroupKey(),
        members: [user],
        creatorId: user.id
      };

      const groups = getAllGroups();
      groups.push(newGroup);
      saveGroups(groups);

      onJoinGroup(newGroup, true);  // Pass true to indicate user is creator
    } catch (error) {
      setErrors(['An error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelectMode = () => {
    // Check if user has created a group or is in a group
    const hasCreatedGroup = user.createdGroupId && getAllGroups().some((g: any) => g.id === user.createdGroupId);
    const isInGroup = user.groupId !== null && user.groupId !== undefined;
    
    return (
      <div className="group-selection-card">
        <h2>Welcome, {user.username}!</h2>
        <p>Choose how you'd like to proceed:</p>
        
        {(hasCreatedGroup || isInGroup) && (
          <div className="info-message">
            ℹ️ You {hasCreatedGroup ? 'have already created a group' : 'are currently in a group'}. 
            Leave your current group to create a new one.
          </div>
        )}
        
        <div className="group-options">
          <button 
            className="group-option-button"
            onClick={() => setMode('join')}
            disabled={isInGroup}
          >
            <div className="option-icon">🔑</div>
            <h3>Join Existing Group</h3>
            <p>Enter an 8-letter group key to join your friends</p>
            {isInGroup && <small className="disabled-text">You are already in a group</small>}
          </button>
          
          <button 
            className="group-option-button"
            onClick={() => setMode('create')}
            disabled={hasCreatedGroup || isInGroup}
          >
            <div className="option-icon">➕</div>
            <h3>Create New Group</h3>
            <p>Start a new group and get a unique group key</p>
            {(hasCreatedGroup || isInGroup) && (
              <small className="disabled-text">
                {hasCreatedGroup ? 'You already created a group' : 'Leave current group first'}
              </small>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderJoinMode = () => (
    <div className="group-action-card">
      <h2>Join a Group</h2>
      <p>Enter the 8-letter group key shared by your friend:</p>
      
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index} className="error">{error}</p>
          ))}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="groupKey">Group Key</label>
        <input
          type="text"
          id="groupKey"
          value={groupKey}
          onChange={(e) => setGroupKey(e.target.value.toUpperCase())}
          placeholder="Enter 8-letter group key (e.g., ABCD1234)"
          maxLength={8}
          className="group-key-input"
        />
        <small>Key should be exactly 8 uppercase letters</small>
      </div>
      
      <div className="button-group">
        <button 
          onClick={handleJoinGroup}
          disabled={isLoading || groupKey.length !== 8}
          className="primary-button"
        >
          {isLoading ? 'Joining...' : 'Join Group'}
        </button>
        <button 
          onClick={() => {setMode('select'); setErrors([]); setGroupKey('');}}
          className="secondary-button"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderCreateMode = () => (
    <div className="group-action-card">
      <h2>Create a New Group</h2>
      <p>Give your group a name. You'll receive a unique 8-letter key to share with friends:</p>
      
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index} className="error">{error}</p>
          ))}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="groupName">Group Name</label>
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter a name for your group"
          maxLength={50}
        />
      </div>
      
      <div className="button-group">
        <button 
          onClick={handleCreateGroup}
          disabled={isLoading || !groupName.trim()}
          className="primary-button"
        >
          {isLoading ? 'Creating...' : 'Create Group'}
        </button>
        <button 
          onClick={() => {setMode('select'); setErrors([]); setGroupName('');}}
          className="secondary-button"
        >
          Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="group-container">
      {mode === 'select' && renderSelectMode()}
      {mode === 'join' && renderJoinMode()}
      {mode === 'create' && renderCreateMode()}
    </div>
  );
};

export default GroupSelection;