package com.LCA.cat.controller;

import com.LCA.cat.dto.ApiResponse;
import com.LCA.cat.dto.InvitationRequest;
import com.LCA.cat.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling group invitation requests
 */
@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    @Autowired
    private EmailService emailService;

    /**
     * Send group invitation email
     * @param request Invitation request containing group and recipient details
     * @return ApiResponse with success status and message
     */
    @PostMapping("/send")
    public ResponseEntity<ApiResponse> sendInvitation(@RequestBody InvitationRequest request) {
        try {
            // Validate request
            if (request.getRecipientEmail() == null || request.getRecipientEmail().trim().isEmpty()) {
                return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Recipient email is required"));
            }

            if (request.getGroupName() == null || request.getGroupName().trim().isEmpty()) {
                return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Group name is required"));
            }

            if (request.getGroupKey() == null || request.getGroupKey().trim().isEmpty()) {
                return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Group key is required"));
            }

            // Send invitation email
            emailService.sendInvitation(
                request.getGroupName(),
                request.getGroupKey(),
                request.getInviterName(),
                request.getInviterEmail(),
                request.getRecipientEmail()
            );

            return ResponseEntity
                .ok()
                .body(new ApiResponse(true, "Invitation sent successfully!"));

        } catch (Exception e) {
            // Log the error (in production, use proper logging framework)
            System.err.println("Error sending invitation: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Failed to send invitation. Please try again later."));
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse> healthCheck() {
        return ResponseEntity.ok(new ApiResponse(true, "Invitation service is running"));
    }
}
