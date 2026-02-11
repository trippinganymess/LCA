package com.LCA.cat.controller;

import com.LCA.cat.dto.*;
import com.LCA.cat.entity.Topic;
import com.LCA.cat.repository.TopicRepository;
import com.LCA.cat.service.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/roadmaps")
@CrossOrigin(origins = "*")
public class RoadmapController {
    
    @Autowired
    private RoadmapService roadmapService;

    @Autowired
    private TopicRepository topicRepository;
    
    @PostMapping
    public ResponseEntity<ApiResponse<RoadmapResponse>> createRoadmap(@RequestBody RoadmapRequest request) {
        try {
            RoadmapResponse response = roadmapService.createRoadmap(request);
            return ResponseEntity.ok(ApiResponse.success("Roadmap created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create roadmap: " + e.getMessage()));
        }
    }
    
    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<RoadmapResponse>>> getRoadmapsByGroup(
            @PathVariable String groupId,
            @RequestParam(required = false) String userId) {
        try {
            List<RoadmapResponse> roadmaps = roadmapService.getRoadmapsByGroup(groupId, userId);
            return ResponseEntity.ok(ApiResponse.success("Roadmaps retrieved successfully", roadmaps));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve roadmaps: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoadmapResponse>> getRoadmapById(
            @PathVariable Long id,
            @RequestParam(required = false) String userId) {
        try {
            RoadmapResponse response = roadmapService.getRoadmapById(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Roadmap retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Roadmap not found: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoadmapResponse>> updateRoadmap(
            @PathVariable Long id,
            @RequestBody RoadmapRequest request) {
        try {
            RoadmapResponse response = roadmapService.updateRoadmap(id, request);
            return ResponseEntity.ok(ApiResponse.success("Roadmap updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update roadmap: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoadmap(@PathVariable Long id) {
        try {
            roadmapService.deleteRoadmap(id);
            return ResponseEntity.ok(ApiResponse.success("Roadmap deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete roadmap: " + e.getMessage()));
        }
    }

    @PutMapping("/topics/{topicId}/position")
    public ResponseEntity<ApiResponse<Void>> updateTopicPosition(
            @PathVariable Long topicId,
            @RequestBody Map<String, Integer> position) {
        try {
            Optional<Topic> optionalTopic = topicRepository.findById(topicId);
            if (!optionalTopic.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Topic not found"));
            }
            Topic topic = optionalTopic.get();
            topic.setPositionX(position.get("positionX"));
            topic.setPositionY(position.get("positionY"));
            topicRepository.save(topic);
            return ResponseEntity.ok(ApiResponse.success("Position updated", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update position: " + e.getMessage()));
        }
    }
}
