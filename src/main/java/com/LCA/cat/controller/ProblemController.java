package com.LCA.cat.controller;

import com.LCA.cat.dto.ApiResponse;
import com.LCA.cat.entity.Problem;
import com.LCA.cat.entity.ProblemCompletion;
import com.LCA.cat.service.ProblemService;
import com.LCA.cat.service.ProblemSeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:3000")
public class ProblemController {
    
    @Autowired
    private ProblemService problemService;
    
    @Autowired
    private ProblemSeedService problemSeedService;
    
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<ApiResponse<List<ProblemWithCompletion>>> getProblemsByTopic(
            @PathVariable Long topicId,
            @RequestParam(required = false) String userId) {
        
        List<Problem> problems = problemService.getProblemsByTopic(topicId);
        
        if (userId != null) {
            List<ProblemCompletion> completions = problemService.getUserCompletions(userId, topicId);
            Map<Long, ProblemCompletion> completionMap = completions.stream()
                    .collect(Collectors.toMap(c -> c.getProblem().getId(), c -> c));
            
            List<ProblemWithCompletion> result = problems.stream()
                    .map(p -> new ProblemWithCompletion(p, completionMap.get(p.getId())))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success("Problems retrieved successfully", result));
        } else {
            List<ProblemWithCompletion> result = problems.stream()
                    .map(p -> new ProblemWithCompletion(p, null))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success("Problems retrieved successfully", result));
        }
    }
    
    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<ProblemCompletion>> toggleCompletion(
            @RequestBody CompletionRequest request) {
        
        ProblemCompletion completion = problemService.toggleProblemCompletion(
                request.getUserId(), request.getProblemId());
        
        return ResponseEntity.ok(ApiResponse.success("Completion toggled successfully", completion));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Problem>> createProblem(@RequestBody Problem problem) {
        Problem created = problemService.createProblem(problem);
        return ResponseEntity.ok(ApiResponse.success("Problem created successfully", created));
    }
    
    @PostMapping("/seed/{roadmapId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> seedProblemsForRoadmap(
            @PathVariable Long roadmapId) {
        try {
            Map<String, Object> result = problemSeedService.seedProblemsForRoadmap(roadmapId);
            return ResponseEntity.ok(ApiResponse.success("Seeding completed", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Failed to seed problems: " + e.getMessage()));
        }
    }
    
    // DTOs
    public static class ProblemWithCompletion {
        private Problem problem;
        private ProblemCompletion completion;
        
        public ProblemWithCompletion(Problem problem, ProblemCompletion completion) {
            this.problem = problem;
            this.completion = completion;
        }
        
        public Problem getProblem() { return problem; }
        public void setProblem(Problem problem) { this.problem = problem; }
        
        public ProblemCompletion getCompletion() { return completion; }
        public void setCompletion(ProblemCompletion completion) { this.completion = completion; }
    }
    
    public static class CompletionRequest {
        private String userId;
        private Long problemId;
        
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        
        public Long getProblemId() { return problemId; }
        public void setProblemId(Long problemId) { this.problemId = problemId; }
    }
}
