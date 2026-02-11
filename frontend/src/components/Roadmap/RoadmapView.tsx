import React, { useState, useEffect, useRef, useCallback } from 'react';
import { roadmapAPI, Roadmap, Topic } from '../../services/roadmapAPI';
import ProblemList from '../Problem/ProblemList';
import './RoadmapView.css';

interface RoadmapViewProps {
  roadmap?: Roadmap;
  groupId?: string;
  userId: string;
  onProgressUpdate?: () => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, groupId, userId, onProgressUpdate }) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(roadmap || null);
  const [selectedTopicForProblems, setSelectedTopicForProblems] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(!roadmap);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef<{ topic: Topic; offsetX: number; offsetY: number } | null>(null);
  const isDraggingRef = useRef(false);

  const loadRoadmaps = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const data = await roadmapAPI.getRoadmapsByGroup(groupId, userId);
      setRoadmaps(data);
      if (data.length > 0) {
        setSelectedRoadmap(data[0]);
      }
    } catch (error) {
      console.error('Failed to load roadmaps:', error);
    } finally {
      setLoading(false);
    }
  }, [groupId, userId]);

  useEffect(() => {
    if (!roadmap && groupId) {
      loadRoadmaps();
    }
  }, [roadmap, groupId, loadRoadmaps]);

  useEffect(() => {
    if (roadmap) {
      setSelectedRoadmap(roadmap);
    }
  }, [roadmap]);

  const drawRoadmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedRoadmap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections (dependencies)
    selectedRoadmap.topics.forEach(topic => {
      if (topic.dependsOn && topic.dependsOn.length > 0) {
        topic.dependsOn.forEach(depId => {
          const depTopic = selectedRoadmap.topics.find(t => t.id === depId);
          if (depTopic) {
            drawConnection(ctx, depTopic, topic);
          }
        });
      }
    });

    // Draw topics
    selectedRoadmap.topics.forEach(topic => {
      drawTopic(ctx, topic);
    });
  }, [selectedRoadmap]);

  useEffect(() => {
    if (selectedRoadmap && canvasRef.current) {
      drawRoadmap();
    }
  }, [selectedRoadmap, drawRoadmap]);

  const drawConnection = (ctx: CanvasRenderingContext2D, from: Topic, to: Topic) => {
    ctx.beginPath();
    ctx.moveTo(from.positionX + 75, from.positionY + 40);
    ctx.lineTo(to.positionX + 75, to.positionY + 40);
    ctx.strokeStyle = 'rgba(255, 0, 136, 0.8)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw arrow
    const angle = Math.atan2(to.positionY - from.positionY, to.positionX - from.positionX);
    const arrowSize = 14;
    ctx.beginPath();
    ctx.moveTo(to.positionX + 75, to.positionY + 40);
    ctx.lineTo(
      to.positionX + 75 - arrowSize * Math.cos(angle - Math.PI / 6),
      to.positionY + 40 - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      to.positionX + 75 - arrowSize * Math.cos(angle + Math.PI / 6),
      to.positionY + 40 - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 0, 136, 0.85)';
    ctx.fill();
  };

  const drawTopic = (ctx: CanvasRenderingContext2D, topic: Topic) => {
    const x = topic.positionX;
    const y = topic.positionY;
    const width = 150;
    const height = 80;

    // Determine color based on difficulty and progress
    let bgColor = 'rgba(15, 15, 25, 0.9)';
    let borderColor = '#ff0088';
    
    if (topic.progress) {
      switch (topic.progress.status) {
        case 'IN_PROGRESS':
          borderColor = '#ffaa00';
          break;
        case 'COMPLETED':
          borderColor = '#00ff88';
          break;
      }
    }

    // Draw card background
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);

    // Draw border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Draw topic name
    ctx.fillStyle = '#ff0088';
    ctx.font = 'bold 14px Orbitron';
    ctx.fillText(topic.name.substring(0, 15), x + 10, y + 25);

    // Draw difficulty
    ctx.fillStyle = '#dd00ee';
    ctx.font = '10px Rajdhani';
    ctx.fillText(topic.difficulty, x + 10, y + 45);

    // Draw progress if available
    if (topic.progress) {
      ctx.fillStyle = '#888';
      ctx.font = '10px Rajdhani';
      ctx.fillText(
        `${topic.progress.problemsSolved}/${topic.progress.totalProblems}`,
        x + 10,
        y + 65
      );

      // Progress bar
      const progressWidth = (width - 20) * (topic.progress.completionPercentage / 100);
      ctx.fillStyle = 'rgba(255, 0, 136, 0.3)';
      ctx.fillRect(x + 10, y + 70, width - 20, 5);
      ctx.fillStyle = borderColor;
      ctx.fillRect(x + 10, y + 70, progressWidth, 5);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    if (!topic.id) return;
    setSelectedTopicForProblems(topic);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const findTopicAt = (x: number, y: number): Topic | undefined => {
    if (!selectedRoadmap) return undefined;
    // Search in reverse so top-drawn topics are found first
    return [...selectedRoadmap.topics].reverse().find(topic =>
      x >= topic.positionX && x <= topic.positionX + 150 &&
      y >= topic.positionY && y <= topic.positionY + 80
    );
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const topic = findTopicAt(x, y);
    if (topic) {
      draggingRef.current = {
        topic,
        offsetX: x - topic.positionX,
        offsetY: y - topic.positionY
      };
      isDraggingRef.current = false;
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || !selectedRoadmap) return;

    isDraggingRef.current = true;
    const { x, y } = getCanvasCoords(e);
    const { topic, offsetX, offsetY } = draggingRef.current;

    // Update topic position in state
    const newX = Math.max(0, Math.min(1200 - 150, x - offsetX));
    const newY = Math.max(0, Math.min(800 - 80, y - offsetY));

    const updatedTopics = selectedRoadmap.topics.map(t =>
      t.id === topic.id ? { ...t, positionX: newX, positionY: newY } : t
    );

    setSelectedRoadmap({ ...selectedRoadmap, topics: updatedTopics });

    // Update the dragging ref to track the new position
    draggingRef.current = {
      ...draggingRef.current,
      topic: { ...topic, positionX: newX, positionY: newY }
    };
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingRef.current) {
      const draggedTopic = draggingRef.current.topic;
      const wasDragging = isDraggingRef.current;

      draggingRef.current = null;
      isDraggingRef.current = false;

      if (wasDragging && draggedTopic.id) {
        // Persist the new position to the backend
        roadmapAPI.updateTopicPosition(
          draggedTopic.id,
          draggedTopic.positionX,
          draggedTopic.positionY
        ).catch(err => console.error('Failed to save position:', err));
      } else if (!wasDragging) {
        // It was a click, not a drag - open problems
        const { x, y } = getCanvasCoords(e);
        const topic = findTopicAt(x, y);
        if (topic) {
          handleTopicClick(topic);
        }
      }
    }
  };

  const handleCloseProblemList = () => {
    setSelectedTopicForProblems(null);
    // Reload roadmaps to get updated completion stats
    if (onProgressUpdate) {
      onProgressUpdate();
    } else {
      loadRoadmaps();
    }
  };

  if (loading) {
    return <div className="roadmap-loading">⟁ Loading roadmaps...</div>;
  }

  if (roadmaps.length === 0 && !selectedRoadmap) {
    return (
      <div className="roadmap-empty">
        <h3>⚠ No roadmaps found</h3>
        <p>Create a roadmap to get started with your learning path.</p>
      </div>
    );
  }

  return (
    <div className="roadmap-view">
      <div className="roadmap-header">
        <h2>⟐ ROADMAPS</h2>
        {roadmaps.length > 1 && !roadmap && (
          <select 
            value={selectedRoadmap?.id || ''} 
            onChange={(e) => {
              const roadmap = roadmaps.find(r => r.id === Number(e.target.value));
              setSelectedRoadmap(roadmap || null);
            }}
            className="roadmap-selector"
          >
            {roadmaps.map(roadmap => (
              <option key={roadmap.id} value={roadmap.id}>
                {roadmap.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedRoadmap && (
        <>
          <div className="roadmap-info">
            <h3>{selectedRoadmap.name}</h3>
            <p>{selectedRoadmap.description}</p>
          </div>

          <div className="roadmap-canvas-container">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              className="roadmap-canvas"
              style={{ cursor: draggingRef.current ? 'grabbing' : 'pointer' }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={() => {
                if (draggingRef.current) {
                  const topic = draggingRef.current.topic;
                  draggingRef.current = null;
                  isDraggingRef.current = false;
                  if (topic.id) {
                    roadmapAPI.updateTopicPosition(topic.id, topic.positionX, topic.positionY)
                      .catch(err => console.error('Failed to save position:', err));
                  }
                }
              }}
            />
          </div>

          <div className="roadmap-legend">
            <div className="legend-item">
              <div className="legend-color" style={{borderColor: '#ff0088'}}></div>
              <span>Not Started</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{borderColor: '#ffaa00'}}></div>
              <span>In Progress</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{borderColor: '#00ff88'}}></div>
              <span>Completed</span>
            </div>
          </div>
        </>
      )}

      {selectedTopicForProblems && (
        <ProblemList
          topicId={selectedTopicForProblems.id!}
          topicName={selectedTopicForProblems.name}
          userId={userId}
          onClose={handleCloseProblemList}
        />
      )}
    </div>
  );
};

export default RoadmapView;
