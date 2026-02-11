import React, { useState, useEffect } from 'react';
import './ProblemList.css';

interface Problem {
  id: number;
  title: string;
  problemUrl: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  orderIndex: number;
  isPremium: boolean;
  notes?: string;
}

interface ProblemCompletion {
  id: number;
  completed: boolean;
  completedAt?: string;
  attempts: number;
}

interface ProblemWithCompletion {
  problem: Problem;
  completion?: ProblemCompletion;
}

interface ProblemListProps {
  topicId: number;
  topicName: string;
  userId: string;
  onClose: () => void;
}

const ProblemList: React.FC<ProblemListProps> = ({ topicId, topicName, userId, onClose }) => {
  const [problems, setProblems] = useState<ProblemWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    loadProblems();
  }, [topicId, userId]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/problems/topic/${topicId}?userId=${userId}`);
      const result = await response.json();
      if (result.success) {
        setProblems(result.data);
      }
    } catch (error) {
      console.error('Failed to load problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (problemId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/problems/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, problemId })
      });
      const result = await response.json();
      if (result.success) {
        // Refresh problems to get updated completion status
        loadProblems();
      }
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    }
  };

  const filteredProblems = problems.filter(({ completion }) => {
    if (filter === 'completed') return completion?.completed === true;
    if (filter === 'pending') return !completion?.completed;
    return true;
  });

  const stats = {
    total: problems.length,
    completed: problems.filter(p => p.completion?.completed).length,
    easy: problems.filter(p => p.problem.difficulty === 'EASY').length,
    medium: problems.filter(p => p.problem.difficulty === 'MEDIUM').length,
    hard: problems.filter(p => p.problem.difficulty === 'HARD').length,
  };

  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="problem-list-modal">
        <div className="problem-list-content">
          <div className="loading">⟳ LOADING...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-list-modal">
      <div className="problem-list-content">
        <div className="problem-header">
          <div>
            <h2>⊞ {topicName}</h2>
            <p className="problem-subtitle">Practice Problems</p>
          </div>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        <div className="problem-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.completed}/{stats.total}</span>
            <span className="stat-label">SOLVED</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{progressPercentage}%</span>
            <span className="stat-label">PROGRESS</span>
          </div>
          <div className="stat-card difficulty-easy">
            <span className="stat-value">{stats.easy}</span>
            <span className="stat-label">EASY</span>
          </div>
          <div className="stat-card difficulty-medium">
            <span className="stat-value">{stats.medium}</span>
            <span className="stat-label">MEDIUM</span>
          </div>
          <div className="stat-card difficulty-hard">
            <span className="stat-value">{stats.hard}</span>
            <span className="stat-label">HARD</span>
          </div>
        </div>

        <div className="problem-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            ALL ({stats.total})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            ✓ COMPLETED ({stats.completed})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            ○ PENDING ({stats.total - stats.completed})
          </button>
        </div>

        <div className="problems-container">
          {filteredProblems.length === 0 ? (
            <div className="empty-state">
              <p>⊘ No problems found</p>
              <small>Problems will appear here once added to this topic</small>
            </div>
          ) : (
            filteredProblems.map(({ problem, completion }) => (
              <div 
                key={problem.id} 
                className={`problem-item ${completion?.completed ? 'completed' : ''}`}
              >
                <div className="problem-checkbox">
                  <input
                    type="checkbox"
                    checked={completion?.completed || false}
                    onChange={() => toggleCompletion(problem.id)}
                  />
                </div>
                
                <div className="problem-info">
                  <div className="problem-title-row">
                    <span className="problem-number">#{problem.orderIndex + 1}</span>
                    <a 
                      href={problem.problemUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="problem-title"
                    >
                      {problem.title}
                    </a>
                    {problem.isPremium && <span className="premium-badge">★ PREMIUM</span>}
                  </div>
                  
                  <div className="problem-meta">
                    <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                    {completion?.attempts && (
                      <span className="attempts">⟳ {completion.attempts} attempts</span>
                    )}
                    {completion?.completedAt && (
                      <span className="completed-date">
                        ✓ {new Date(completion.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {problem.notes && (
                    <div className="problem-notes">{problem.notes}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="progress-text">{progressPercentage}% COMPLETE</span>
        </div>
      </div>
    </div>
  );
};

export default ProblemList;
