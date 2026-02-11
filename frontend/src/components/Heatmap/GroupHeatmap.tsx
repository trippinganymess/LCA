import React, { useState, useEffect, useRef, useCallback } from 'react';
import { roadmapAPI } from '../../services/roadmapAPI';
import './GroupHeatmap.css';

interface GroupHeatmapProps {
  memberIds: string[];
  groupName: string;
}

const GroupHeatmap: React.FC<GroupHeatmapProps> = ({ memberIds, groupName }) => {
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadHeatmapData = useCallback(async () => {
    if (memberIds.length === 0) return;
    try {
      setLoading(true);
      const data = await roadmapAPI.getGroupHeatmap(memberIds);
      setHeatmapData(data);
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
    } finally {
      setLoading(false);
    }
  }, [memberIds]);

  useEffect(() => {
    loadHeatmapData();
  }, [loadHeatmapData]);

  // Generate the last 365 days grid (like GitHub)
  const generateCalendarDays = () => {
    const days: { date: string; count: number }[] = [];
    const today = new Date();
    
    // Go back ~52 weeks (364 days) + pad to start on Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    // Align to the previous Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const current = new Date(startDate);
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        count: heatmapData[dateStr] || 0
      });
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getColorForCount = (count: number): string => {
    if (count === 0) return 'rgba(255, 255, 255, 0.05)';
    if (count === 1) return 'rgba(255, 0, 136, 0.3)';
    if (count === 2) return 'rgba(255, 0, 136, 0.5)';
    if (count === 3) return 'rgba(255, 0, 136, 0.7)';
    return 'rgba(255, 0, 136, 0.95)';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getMonthLabels = (days: { date: string; count: number }[]) => {
    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    days.forEach((day, index) => {
      const date = new Date(day.date + 'T00:00:00');
      const month = date.getMonth();
      const dayOfWeek = date.getDay();
      
      if (month !== lastMonth && dayOfWeek === 0) {
        months.push({
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: Math.floor(index / 7)
        });
        lastMonth = month;
      }
    });

    return months;
  };

  const totalContributions = Object.values(heatmapData).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="group-heatmap">
        <h4>⟁ GROUP SYNC HEATMAP</h4>
        <p className="heatmap-loading">Loading heatmap data...</p>
      </div>
    );
  }

  const days = generateCalendarDays();
  const monthLabels = getMonthLabels(days);

  // Organize days into weeks (columns)
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="group-heatmap" ref={containerRef}>
      <div className="heatmap-header">
        <h4>⟁ GROUP SYNC HEATMAP</h4>
        <span className="heatmap-total">
          {totalContributions} group sync{totalContributions !== 1 ? 's' : ''} in the last year
        </span>
      </div>

      <p className="heatmap-description">
        A sync counts when <strong>all {memberIds.length} member{memberIds.length !== 1 ? 's' : ''}</strong> solve at least one problem on the same day. Brighter = more synced solves.
      </p>

      <div className="heatmap-container">
        <div className="heatmap-months">
          {monthLabels.map((month, i) => (
            <span
              key={i}
              className="month-label"
              style={{ gridColumnStart: month.weekIndex + 1 }}
            >
              {month.label}
            </span>
          ))}
        </div>

        <div className="heatmap-grid-wrapper">
          <div className="heatmap-day-labels">
            <span></span>
            <span>Mon</span>
            <span></span>
            <span>Wed</span>
            <span></span>
            <span>Fri</span>
            <span></span>
          </div>

          <div className="heatmap-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="heatmap-week">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className="heatmap-cell"
                    style={{ backgroundColor: getColorForCount(day.count) }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const containerRect = containerRef.current?.getBoundingClientRect();
                      if (containerRect) {
                        setHoveredDay({
                          date: day.date,
                          count: day.count,
                          x: rect.left - containerRect.left + rect.width / 2,
                          y: rect.top - containerRect.top - 10
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="heatmap-legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="heatmap-cell legend-cell"
              style={{ backgroundColor: getColorForCount(level) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {hoveredDay && (
        <div
          className="heatmap-tooltip"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y
          }}
        >
          <strong>{hoveredDay.count} group sync{hoveredDay.count !== 1 ? 's' : ''}</strong>
          <span>{formatDate(hoveredDay.date)}</span>
        </div>
      )}
    </div>
  );
};

export default GroupHeatmap;
