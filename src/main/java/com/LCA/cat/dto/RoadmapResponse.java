package com.LCA.cat.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RoadmapResponse {
    private Long id;
    private String name;
    private String description;
    private String groupId;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TopicResponse> topics;

    public RoadmapResponse() {}

    public RoadmapResponse(Long id, String name, String description, String groupId, String createdBy, LocalDateTime createdAt, LocalDateTime updatedAt, List<TopicResponse> topics) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.groupId = groupId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.topics = topics;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<TopicResponse> getTopics() { return topics; }
    public void setTopics(List<TopicResponse> topics) { this.topics = topics; }
}
