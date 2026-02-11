package com.LCA.cat.dto;

public class ProgressUpdateRequest {
    private String userId;
    private Long topicId;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
    private Integer problemsSolved;
    private Integer totalProblems;

    public ProgressUpdateRequest() {}

    public ProgressUpdateRequest(String userId, Long topicId, String status, Integer problemsSolved, Integer totalProblems) {
        this.userId = userId;
        this.topicId = topicId;
        this.status = status;
        this.problemsSolved = problemsSolved;
        this.totalProblems = totalProblems;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getProblemsSolved() { return problemsSolved; }
    public void setProblemsSolved(Integer problemsSolved) { this.problemsSolved = problemsSolved; }
    
    public Integer getTotalProblems() { return totalProblems; }
    public void setTotalProblems(Integer totalProblems) { this.totalProblems = totalProblems; }
}
