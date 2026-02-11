package com.LCA.cat.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic_id"}))
public class UserProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    @JsonIgnore
    private Topic topic;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProgressStatus status;
    
    @Column(name = "problems_solved")
    private Integer problemsSolved = 0;
    
    @Column(name = "total_problems")
    private Integer totalProblems = 0;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public UserProgress() {}

    public UserProgress(Long id, String userId, Topic topic, ProgressStatus status, Integer problemsSolved, Integer totalProblems, LocalDateTime startedAt, LocalDateTime completedAt, LocalDateTime lastUpdated) {
        this.id = id;
        this.userId = userId;
        this.topic = topic;
        this.status = status;
        this.problemsSolved = problemsSolved;
        this.totalProblems = totalProblems;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.lastUpdated = lastUpdated;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }
    
    public ProgressStatus getStatus() { return status; }
    public void setStatus(ProgressStatus status) { this.status = status; }
    
    public Integer getProblemsSolved() { return problemsSolved; }
    public void setProblemsSolved(Integer problemsSolved) { this.problemsSolved = problemsSolved; }
    
    public Integer getTotalProblems() { return totalProblems; }
    public void setTotalProblems(Integer totalProblems) { this.totalProblems = totalProblems; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
        if (status == ProgressStatus.IN_PROGRESS && startedAt == null) {
            startedAt = LocalDateTime.now();
        }
        if (status == ProgressStatus.COMPLETED && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
    
    public enum ProgressStatus {
        NOT_STARTED, IN_PROGRESS, COMPLETED
    }
}
