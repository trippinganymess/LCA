import React, { useState } from 'react';
import { roadmapAPI, Topic } from '../../services/roadmapAPI';
import './RoadmapBuilder.css';

interface RoadmapBuilderProps {
  groupId: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RoadmapBuilder: React.FC<RoadmapBuilderProps> = ({ groupId, userId, onClose, onSuccess }) => {
  const [step, setStep] = useState<'info' | 'builder'>('info');
  const [roadmapName, setRoadmapName] = useState('');
  const [roadmapDescription, setRoadmapDescription] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [draggedTopic, setDraggedTopic] = useState<Topic | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [saving, setSaving] = useState(false);

  const topicTemplates = [
    { name: 'Basics & Math', difficulty: 'SIMPLE' as const },
    { name: 'Arrays & Hashing', difficulty: 'SIMPLE' as const },
    { name: 'Sorting', difficulty: 'SIMPLE' as const },
    { name: 'Two Pointers', difficulty: 'MEDIUM' as const },
    { name: 'Sliding Window', difficulty: 'MEDIUM' as const },
    { name: 'Linked Lists', difficulty: 'MEDIUM' as const },
    { name: 'Stacks & Queues', difficulty: 'MEDIUM' as const },
    { name: 'Binary Search', difficulty: 'MEDIUM' as const },
    { name: 'Heaps / Priority Queues', difficulty: 'MEDIUM' as const },
    { name: 'Binary Trees', difficulty: 'ADVANCED' as const },
    { name: 'Binary Search Trees (BST)', difficulty: 'ADVANCED' as const },
    { name: 'Tries (Prefix Trees)', difficulty: 'ADVANCED' as const },
    { name: 'Recursion & Backtracking', difficulty: 'ADVANCED' as const },
    { name: 'Greedy Algorithms', difficulty: 'ADVANCED' as const },
    { name: 'Graphs (BFS/DFS, Shortest Path)', difficulty: 'ADVANCED' as const },
    { name: 'Disjoint Set Union (DSU)', difficulty: 'ADVANCED' as const },
    { name: 'Dynamic Programming (1D, 2D, Strings, Stocks)', difficulty: 'ADVANCED' as const },
    { name: 'Bit Manipulation', difficulty: 'MEDIUM' as const },
    { name: 'Intervals', difficulty: 'MEDIUM' as const },
    { name: 'Math & Geometry', difficulty: 'MEDIUM' as const },
  ];

  const handleInfoNext = () => {
    if (!roadmapName.trim()) {
      alert('Please enter a roadmap name');
      return;
    }
    setStep('builder');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    if (draggedTopic) {
      const newTopic: Topic = {
        ...draggedTopic,
        positionX: x - 75,
        positionY: y - 40,
        orderIndex: topics.length,
        description: `Learn ${draggedTopic.name} fundamentals and patterns`,
        dependsOn: []
      };
      setTopics([...topics, newTopic]);
      setDraggedTopic(null);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleAddDependency = (topicIndex: number, dependsOnIndex: number) => {
    const updatedTopics = [...topics];
    const dependsOnId = dependsOnIndex;
    if (!updatedTopics[topicIndex].dependsOn.includes(dependsOnId)) {
      updatedTopics[topicIndex].dependsOn.push(dependsOnId);
      setTopics(updatedTopics);
    }
  };

  const handleRemoveTopic = (index: number) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    setTopics(updatedTopics);
    setSelectedTopic(null);
  };

  const handleSave = async () => {
    if (topics.length === 0) {
      alert('Please add at least one topic');
      return;
    }

    try {
      setSaving(true);
      await roadmapAPI.createRoadmap({
        name: roadmapName,
        description: roadmapDescription,
        groupId,
        createdBy: userId,
        topics: topics.map((topic, index) => ({
          ...topic,
          orderIndex: index
        }))
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create roadmap:', error);
      alert('Failed to create roadmap. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Info Step UI
  if (step === 'info') {
    return (
      <div className="roadmap-builder-modal">
        <div className="roadmap-info-card">
          <div className="builder-header">
            <h2>⊕ CREATE ROADMAP</h2>
            <button onClick={onClose} className="close-button">✕</button>
          </div>

          <div className="info-content">
            <div className="form-group">
              <label>ROADMAP NAME *</label>
              <input
                type="text"
                value={roadmapName}
                onChange={(e) => setRoadmapName(e.target.value)}
                placeholder="e.g., DSA Mastery Path"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea
                value={roadmapDescription}
                onChange={(e) => setRoadmapDescription(e.target.value)}
                placeholder="Describe your learning roadmap..."
                rows={4}
              />
            </div>

            <div className="info-actions">
              <button onClick={onClose} className="cancel-button">
                ◂ CANCEL
              </button>
              <button onClick={handleInfoNext} className="next-button">
                NEXT ▸
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Builder Step UI
  return (
    <div className="roadmap-builder-modal">
      <div className="roadmap-builder-content">
        <div className="builder-header">
          <div>
            <h2>⟐ {roadmapName}</h2>
            <p className="roadmap-subtitle">{roadmapDescription || 'Building your learning path...'}</p>
          </div>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        <div className="builder-workspace">
          <div className="topic-palette">
            <h3>⟐ TOPICS</h3>
            <div className="topic-list">
              {topicTemplates.map((template, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => setDraggedTopic(template as Topic)}
                  className={`topic-template difficulty-${template.difficulty.toLowerCase()}`}
                >
                  <span className="topic-icon">◉</span>
                  {template.name}
                </div>
              ))}
            </div>
          </div>

          <div
            className="canvas-area"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="canvas-grid">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className={`placed-topic difficulty-${topic.difficulty.toLowerCase()} ${selectedTopic === topic ? 'selected' : ''}`}
                  style={{
                    left: topic.positionX,
                    top: topic.positionY
                  }}
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="topic-name">{topic.name}</div>
                  <div className="topic-difficulty">{topic.difficulty}</div>
                  <button
                    className="remove-topic"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTopic(index);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedTopic && (
            <div className="topic-properties">
              <h3>⚙ PROPERTIES</h3>
              <div className="property-item">
                <strong>Name:</strong> {selectedTopic.name}
              </div>
              <div className="property-item">
                <strong>Difficulty:</strong> {selectedTopic.difficulty}
              </div>
              <div className="property-item">
                <strong>Dependencies:</strong>
                <select
                  onChange={(e) => {
                    const topicIndex = topics.indexOf(selectedTopic);
                    handleAddDependency(topicIndex, Number(e.target.value));
                  }}
                  value=""
                >
                  <option value="">Add dependency...</option>
                  {topics.map((topic, index) => (
                    topic !== selectedTopic && (
                      <option key={index} value={index}>
                        {topic.name}
                      </option>
                    )
                  ))}
                </select>
              </div>
              <div className="dependency-list">
                {selectedTopic.dependsOn.map((depIndex, i) => (
                  <div key={i} className="dependency-item">
                    ⟐ {topics[depIndex]?.name || 'Unknown'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="builder-actions">
          <button onClick={() => setStep('info')} className="back-button">
            ◂ BACK
          </button>
          <button onClick={handleSave} className="save-button" disabled={saving}>
            {saving ? 'SAVING...' : '⊕ CREATE ROADMAP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapBuilder;
