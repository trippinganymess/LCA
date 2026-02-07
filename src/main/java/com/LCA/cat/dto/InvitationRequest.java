package com.LCA.cat.dto;

/**
 * Data Transfer Object for group invitation requests
 */
public class InvitationRequest {
    private String groupName;
    private String groupKey;
    private String inviterName;
    private String inviterEmail;
    private String recipientEmail;

    // Constructors
    public InvitationRequest() {
    }

    public InvitationRequest(String groupName, String groupKey, String inviterName, 
                            String inviterEmail, String recipientEmail) {
        this.groupName = groupName;
        this.groupKey = groupKey;
        this.inviterName = inviterName;
        this.inviterEmail = inviterEmail;
        this.recipientEmail = recipientEmail;
    }

    // Getters and Setters
    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupKey() {
        return groupKey;
    }

    public void setGroupKey(String groupKey) {
        this.groupKey = groupKey;
    }

    public String getInviterName() {
        return inviterName;
    }

    public void setInviterName(String inviterName) {
        this.inviterName = inviterName;
    }

    public String getInviterEmail() {
        return inviterEmail;
    }

    public void setInviterEmail(String inviterEmail) {
        this.inviterEmail = inviterEmail;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    @Override
    public String toString() {
        return "InvitationRequest{" +
                "groupName='" + groupName + '\'' +
                ", groupKey='" + groupKey + '\'' +
                ", inviterName='" + inviterName + '\'' +
                ", inviterEmail='" + inviterEmail + '\'' +
                ", recipientEmail='" + recipientEmail + '\'' +
                '}';
    }
}
