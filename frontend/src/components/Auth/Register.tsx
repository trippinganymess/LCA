import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../App';
import './Auth.css';

interface RegisterProps {
  onRegister: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.username.trim()) {
      newErrors.push('Username is required');
    }
    
    if (!formData.email.trim()) {
      newErrors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Email format is invalid');
    }
    
    if (!formData.password) {
      newErrors.push('Password is required');
    } else if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('lca_users') || '[]');
      const userExists = existingUsers.some((u: any) => 
        u.username === formData.username || u.email === formData.email
      );
      
      if (userExists) {
        setErrors(['Username or email already exists']);
        return;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(), // Simple ID generation
        username: formData.username,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        groupId: null,
        createdGroupId: null
      };
      
      // Save to localStorage (mock database)
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('lca_users', JSON.stringify(updatedUsers));
      
      // Remove password before passing to parent
      const { password, ...userWithoutPassword } = newUser;
      onRegister(userWithoutPassword);
      
    } catch (error) {
      setErrors(['An error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for LCA</h2>
        
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error">{error}</p>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password (min 6 characters)"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;