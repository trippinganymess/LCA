import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import GroupSelection from './components/Groups/GroupSelection';
import MainApp from './components/MainApp';
import './App.css';

export interface User {
  id: string;
  username: string;
  email: string;
  groupId?: string | null;  // Track which group user belongs to
  createdGroupId?: string | null;  // Track which group user created
}

export interface Group {
  id: string;
  name: string;
  key: string;
  members: User[];
  creatorId: string;  // Track who created the group
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('lca_user');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Load user's group if they have one
      if (userData.groupId) {
        const allGroups = JSON.parse(localStorage.getItem('lca_groups') || '[]');
        const userGroup = allGroups.find((g: Group) => g.id === userData.groupId);
        if (userGroup) {
          setCurrentGroup(userGroup);
        }
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('lca_user', JSON.stringify(userData));
    
    // Load user's group if they have one
    if (userData.groupId) {
      const allGroups = JSON.parse(localStorage.getItem('lca_groups') || '[]');
      const userGroup = allGroups.find((g: Group) => g.id === userData.groupId);
      if (userGroup) {
        setCurrentGroup(userGroup);
      }
    }
  };

  const handleJoinGroup = (groupData: Group, isCreator: boolean = false) => {
    // Update user with group information
    const updatedUser = {
      ...user!,
      groupId: groupData.id,
      createdGroupId: isCreator ? groupData.id : user!.createdGroupId
    };
    
    setUser(updatedUser);
    setCurrentGroup(groupData);
    
    // Save to localStorage
    localStorage.setItem('lca_user', JSON.stringify(updatedUser));
    
    // Update user in users database
    const allUsers = JSON.parse(localStorage.getItem('lca_users') || '[]');
    const userIndex = allUsers.findIndex((u: any) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], groupId: groupData.id, createdGroupId: isCreator ? groupData.id : allUsers[userIndex].createdGroupId };
      localStorage.setItem('lca_users', JSON.stringify(allUsers));
    }
  };

  const handleLeaveGroup = () => {
    if (!user || !currentGroup) return;
    
    // Update user - remove group association
    const updatedUser = {
      ...user,
      groupId: null
      // Keep createdGroupId if they created it
    };
    
    setUser(updatedUser);
    setCurrentGroup(null);
    
    // Save to localStorage
    localStorage.setItem('lca_user', JSON.stringify(updatedUser));
    
    // Update user in users database
    const allUsers = JSON.parse(localStorage.getItem('lca_users') || '[]');
    const userIndex = allUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], groupId: null };
      localStorage.setItem('lca_users', JSON.stringify(allUsers));
    }
    
    // Remove user from group members
    const allGroups = JSON.parse(localStorage.getItem('lca_groups') || '[]');
    const groupIndex = allGroups.findIndex((g: Group) => g.id === currentGroup.id);
    if (groupIndex !== -1) {
      allGroups[groupIndex].members = allGroups[groupIndex].members.filter((m: User) => m.id !== user.id);
      
      // If group is empty and user was the creator, delete the group
      if (allGroups[groupIndex].members.length === 0) {
        allGroups.splice(groupIndex, 1);
        // Clear user's createdGroupId
        updatedUser.createdGroupId = null;
        setUser(updatedUser);
        localStorage.setItem('lca_user', JSON.stringify(updatedUser));
        allUsers[userIndex].createdGroupId = null;
        localStorage.setItem('lca_users', JSON.stringify(allUsers));
      }
      
      localStorage.setItem('lca_groups', JSON.stringify(allGroups));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentGroup(null);
    localStorage.removeItem('lca_user');
    // Don't remove group from storage - it's persistent
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? (currentGroup ? <Navigate to="/app" replace /> : <Navigate to="/groups" replace />) : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? (currentGroup ? <Navigate to="/app" replace /> : <Navigate to="/groups" replace />) : 
              <Register onRegister={handleLogin} />
            } 
          />
          <Route 
            path="/groups" 
            element={
              !user ? <Navigate to="/login" replace /> :
              currentGroup ? <Navigate to="/app" replace /> :
              <GroupSelection user={user} onJoinGroup={handleJoinGroup} />
            } 
          />
          <Route 
            path="/app" 
            element={
              !user ? <Navigate to="/login" replace /> :
              !currentGroup ? <Navigate to="/groups" replace /> :
              <MainApp user={user} group={currentGroup} onLogout={handleLogout} onLeaveGroup={handleLeaveGroup} />
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
