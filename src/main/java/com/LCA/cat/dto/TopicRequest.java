package com.LCA.cat.dto;

import java.util.List;

public class TopicRequest {
    private String name;
    private String description;
    private String difficulty; // SIMPLE, MEDIUM, ADVANCED
    private Integer positionX;
    private Integer positionY;
    private Integer orderIndex;
    private List<Long> dependsOn;

    public TopicRequest() {}

    public TopicRequest(String name, String description, String difficulty, Integer positionX, Integer positionY, Integer orderIndex, List<Long> dependsOn) {
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.positionX = positionX;
        this.positionY = positionY;
        this.orderIndex = orderIndex;
        this.dependsOn = dependsOn;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    
    public Integer getPositionX() { return positionX; }
    public void setPositionX(Integer positionX) { this.positionX = positionX; }
    
    public Integer getPositionY() { return positionY; }
    public void setPositionY(Integer positionY) { this.positionY = positionY; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public List<Long> getDependsOn() { return dependsOn; }
    public void setDependsOn(List<Long> dependsOn) { this.dependsOn = dependsOn; }
}
