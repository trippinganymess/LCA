package com.LCA.cat.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "problem_completions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "problem_id"}))
public class ProblemCompletion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnore
    private Problem problem;
    
    @Column(name = "completed", nullable = false)
    private Boolean completed = false;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "attempts")
    private Integer attempts = 0;

    public ProblemCompletion() {}

    public ProblemCompletion(Long id, String userId, Problem problem, Boolean completed, LocalDateTime completedAt, Integer attempts) {
        this.id = id;
        this.userId = userId;
        this.problem = problem;
        this.completed = completed;
        this.completedAt = completedAt;
        this.attempts = attempts;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { 
        this.completed = completed;
        if (completed && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        if (completed && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
}
