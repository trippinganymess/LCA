package com.LCA.cat.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "topics")
public class Topic {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;
    
    @Column(name = "position_x")
    private Integer positionX;
    
    @Column(name = "position_y")
    private Integer positionY;
    
    @Column(name = "order_index")
    private Integer orderIndex;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    @JsonIgnore
    private Roadmap roadmap;
    
    @ElementCollection
    @CollectionTable(name = "topic_dependencies", joinColumns = @JoinColumn(name = "topic_id"))
    @Column(name = "depends_on_topic_id")
    private List<Long> dependsOn = new ArrayList<>();
    
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserProgress> userProgress = new ArrayList<>();
    
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Problem> problems = new ArrayList<>();

    public Topic() {}

    public Topic(Long id, String name, String description, DifficultyLevel difficulty, Integer positionX, Integer positionY, Integer orderIndex, Roadmap roadmap, List<Long> dependsOn, List<UserProgress> userProgress) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.positionX = positionX;
        this.positionY = positionY;
        this.orderIndex = orderIndex;
        this.roadmap = roadmap;
        this.dependsOn = dependsOn;
        this.userProgress = userProgress;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public DifficultyLevel getDifficulty() { return difficulty; }
    public void setDifficulty(DifficultyLevel difficulty) { this.difficulty = difficulty; }
    
    public Integer getPositionX() { return positionX; }
    public void setPositionX(Integer positionX) { this.positionX = positionX; }
    
    public Integer getPositionY() { return positionY; }
    public void setPositionY(Integer positionY) { this.positionY = positionY; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public Roadmap getRoadmap() { return roadmap; }
    public void setRoadmap(Roadmap roadmap) { this.roadmap = roadmap; }
    
    public List<Long> getDependsOn() { return dependsOn; }
    public void setDependsOn(List<Long> dependsOn) { this.dependsOn = dependsOn; }
    
    public List<UserProgress> getUserProgress() { return userProgress; }
    public void setUserProgress(List<UserProgress> userProgress) { this.userProgress = userProgress; }
    
    public List<Problem> getProblems() { return problems; }
    public void setProblems(List<Problem> problems) { this.problems = problems; }
    
    public enum DifficultyLevel {
        SIMPLE, MEDIUM, ADVANCED
    }
}
