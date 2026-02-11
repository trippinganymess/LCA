package com.LCA.cat.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "problems")
public class Problem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "problem_url", nullable = false)
    private String problemUrl; // LeetCode or other platform URL
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    @JsonIgnore
    private Topic topic;
    
    @Column(name = "order_index")
    private Integer orderIndex; // Display order within topic
    
    @Column(name = "is_premium")
    private Boolean isPremium = false;
    
    @Column(length = 1000)
    private String notes; // Optional hints or notes

    public Problem() {}

    public Problem(Long id, String title, String problemUrl, Difficulty difficulty, Topic topic, Integer orderIndex, Boolean isPremium, String notes) {
        this.id = id;
        this.title = title;
        this.problemUrl = problemUrl;
        this.difficulty = difficulty;
        this.topic = topic;
        this.orderIndex = orderIndex;
        this.isPremium = isPremium;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getProblemUrl() { return problemUrl; }
    public void setProblemUrl(String problemUrl) { this.problemUrl = problemUrl; }
    
    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    
    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}
