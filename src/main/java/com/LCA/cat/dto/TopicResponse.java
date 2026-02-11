package com.LCA.cat.dto;

import java.util.List;

public class TopicResponse {
    private Long id;
    private String name;
    private String description;
    private String difficulty;
    private Integer positionX;
    private Integer positionY;
    private Integer orderIndex;
    private List<Long> dependsOn;
    private ProgressSummary progress;

    public TopicResponse() {}

    public TopicResponse(Long id, String name, String description, String difficulty, Integer positionX, Integer positionY, Integer orderIndex, List<Long> dependsOn, ProgressSummary progress) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.positionX = positionX;
        this.positionY = positionY;
        this.orderIndex = orderIndex;
        this.dependsOn = dependsOn;
        this.progress = progress;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public ProgressSummary getProgress() { return progress; }
    public void setProgress(ProgressSummary progress) { this.progress = progress; }
    
    public static class ProgressSummary {
        private String status;
        private Integer problemsSolved;
        private Integer totalProblems;
        private Double completionPercentage;

        public ProgressSummary() {}

        public ProgressSummary(String status, Integer problemsSolved, Integer totalProblems, Double completionPercentage) {
            this.status = status;
            this.problemsSolved = problemsSolved;
            this.totalProblems = totalProblems;
            this.completionPercentage = completionPercentage;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public Integer getProblemsSolved() { return problemsSolved; }
        public void setProblemsSolved(Integer problemsSolved) { this.problemsSolved = problemsSolved; }
        
        public Integer getTotalProblems() { return totalProblems; }
        public void setTotalProblems(Integer totalProblems) { this.totalProblems = totalProblems; }
        
        public Double getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
    }
}
