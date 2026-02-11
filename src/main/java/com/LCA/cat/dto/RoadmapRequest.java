package com.LCA.cat.dto;

import java.util.List;

public class RoadmapRequest {
    private String name;
    private String description;
    private String groupId;
    private String createdBy;
    private List<TopicRequest> topics;

    public RoadmapRequest() {}

    public RoadmapRequest(String name, String description, String groupId, String createdBy, List<TopicRequest> topics) {
        this.name = name;
        this.description = description;
        this.groupId = groupId;
        this.createdBy = createdBy;
        this.topics = topics;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public List<TopicRequest> getTopics() { return topics; }
    public void setTopics(List<TopicRequest> topics) { this.topics = topics; }
}
