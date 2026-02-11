package com.LCA.cat.controller;

import com.LCA.cat.dto.ApiResponse;
import com.LCA.cat.dto.ProgressUpdateRequest;
import com.LCA.cat.entity.UserProgress;
import com.LCA.cat.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {
    
    @Autowired
    private ProgressService progressService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<UserProgress>> updateProgress(@RequestBody ProgressUpdateRequest request) {
        try {
            UserProgress progress = progressService.updateProgress(request);
            return ResponseEntity.ok(ApiResponse.success("Progress updated successfully", progress));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update progress: " + e.getMessage()));
        }
    }
    
    @GetMapping("/roadmap/{roadmapId}/user/{userId}")
    public ResponseEntity<ApiResponse<List<UserProgress>>> getUserProgress(
            @PathVariable Long roadmapId,
            @PathVariable String userId) {
        try {
            List<UserProgress> progress = progressService.getUserProgressByRoadmap(roadmapId, userId);
            return ResponseEntity.ok(ApiResponse.success("Progress retrieved successfully", progress));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve progress: " + e.getMessage()));
        }
    }
    
    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<UserProgress>>> getGroupProgress(@PathVariable String groupId) {
        try {
            List<UserProgress> progress = progressService.getGroupProgress(groupId);
            return ResponseEntity.ok(ApiResponse.success("Group progress retrieved successfully", progress));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve group progress: " + e.getMessage()));
        }
    }
}
