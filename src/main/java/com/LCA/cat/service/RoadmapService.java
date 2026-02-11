package com.LCA.cat.service;

import com.LCA.cat.entity.Roadmap;
import com.LCA.cat.entity.Topic;
import com.LCA.cat.entity.UserProgress;
import com.LCA.cat.repository.RoadmapRepository;
import com.LCA.cat.repository.TopicRepository;
import com.LCA.cat.repository.UserProgressRepository;
import com.LCA.cat.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoadmapService {
    
    @Autowired
    private RoadmapRepository roadmapRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private UserProgressRepository userProgressRepository;
    
    @Autowired
    private ProblemSeedService problemSeedService;
    
    @Transactional
    public RoadmapResponse createRoadmap(RoadmapRequest request) {
        Roadmap roadmap = new Roadmap();
        roadmap.setName(request.getName());
        roadmap.setDescription(request.getDescription());
        roadmap.setGroupId(request.getGroupId());
        roadmap.setCreatedBy(request.getCreatedBy());
        roadmap.setIsActive(true);
        
        Roadmap savedRoadmap = roadmapRepository.save(roadmap);
        
        // Create topics first without dependencies
        List<Topic> savedTopics = new ArrayList<>();
        if (request.getTopics() != null) {
            for (TopicRequest topicReq : request.getTopics()) {
                Topic topic = new Topic();
                topic.setName(topicReq.getName());
                topic.setDescription(topicReq.getDescription());
                topic.setDifficulty(Topic.DifficultyLevel.valueOf(topicReq.getDifficulty()));
                topic.setPositionX(topicReq.getPositionX());
                topic.setPositionY(topicReq.getPositionY());
                topic.setOrderIndex(topicReq.getOrderIndex());
                topic.setRoadmap(savedRoadmap);
                savedTopics.add(topicRepository.save(topic));
            }
            
            // Now update dependencies using actual topic IDs
            for (int i = 0; i < request.getTopics().size(); i++) {
                TopicRequest topicReq = request.getTopics().get(i);
                if (topicReq.getDependsOn() != null && !topicReq.getDependsOn().isEmpty()) {
                    Topic topic = savedTopics.get(i);
                    List<Long> actualDependencyIds = new ArrayList<>();
                    for (Long indexOrId : topicReq.getDependsOn()) {
                        // Map index to actual topic ID
                        if (indexOrId < savedTopics.size()) {
                            actualDependencyIds.add(savedTopics.get(indexOrId.intValue()).getId());
                        }
                    }
                    topic.setDependsOn(actualDependencyIds);
                    topicRepository.save(topic);
                }
            }
        }
        
        // Auto-seed problems from liveProblems.json
        try {
            problemSeedService.seedProblemsForRoadmap(savedRoadmap.getId());
        } catch (Exception e) {
            // Log error but don't fail roadmap creation
            System.err.println("Warning: Failed to auto-seed problems: " + e.getMessage());
        }
        
        return convertToResponse(roadmapRepository.findById(savedRoadmap.getId()).orElseThrow(), null);
    }
    
    public List<RoadmapResponse> getRoadmapsByGroup(String groupId, String userId) {
        List<Roadmap> roadmaps = roadmapRepository.findByGroupIdAndIsActive(groupId, true);
        return roadmaps.stream()
                .map(roadmap -> convertToResponse(roadmap, userId))
                .collect(Collectors.toList());
    }
    
    public RoadmapResponse getRoadmapById(Long id, String userId) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));
        return convertToResponse(roadmap, userId);
    }
    
    @Transactional
    public RoadmapResponse updateRoadmap(Long id, RoadmapRequest request) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));
        
        roadmap.setName(request.getName());
        roadmap.setDescription(request.getDescription());
        
        // Delete existing topics
        topicRepository.deleteAll(roadmap.getTopics());
        roadmap.getTopics().clear();
        
        // Create new topics
        if (request.getTopics() != null) {
            for (TopicRequest topicReq : request.getTopics()) {
                Topic topic = new Topic();
                topic.setName(topicReq.getName());
                topic.setDescription(topicReq.getDescription());
                topic.setDifficulty(Topic.DifficultyLevel.valueOf(topicReq.getDifficulty()));
                topic.setPositionX(topicReq.getPositionX());
                topic.setPositionY(topicReq.getPositionY());
                topic.setOrderIndex(topicReq.getOrderIndex());
                topic.setDependsOn(topicReq.getDependsOn());
                topic.setRoadmap(roadmap);
                roadmap.getTopics().add(topic);
            }
        }
        
        Roadmap saved = roadmapRepository.save(roadmap);
        return convertToResponse(saved, null);
    }
    
    @Transactional
    public void deleteRoadmap(Long id) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));
        roadmap.setIsActive(false);
        roadmapRepository.save(roadmap);
    }
    
    private RoadmapResponse convertToResponse(Roadmap roadmap, String userId) {
        List<Topic> topics = topicRepository.findByRoadmapIdOrderByOrderIndexAsc(roadmap.getId());
        
        List<TopicResponse> topicResponses = topics.stream().map(topic -> {
            TopicResponse response = new TopicResponse();
            response.setId(topic.getId());
            response.setName(topic.getName());
            response.setDescription(topic.getDescription());
            response.setDifficulty(topic.getDifficulty().name());
            response.setPositionX(topic.getPositionX());
            response.setPositionY(topic.getPositionY());
            response.setOrderIndex(topic.getOrderIndex());
            response.setDependsOn(topic.getDependsOn());
            
            if (userId != null) {
                Optional<UserProgress> progress = userProgressRepository
                        .findByUserIdAndTopicId(userId, topic.getId());
                if (progress.isPresent()) {
                    UserProgress up = progress.get();
                    TopicResponse.ProgressSummary summary = new TopicResponse.ProgressSummary();
                    summary.setStatus(up.getStatus().name());
                    summary.setProblemsSolved(up.getProblemsSolved());
                    summary.setTotalProblems(up.getTotalProblems());
                    summary.setCompletionPercentage(
                        up.getTotalProblems() > 0 ? 
                        (up.getProblemsSolved() * 100.0 / up.getTotalProblems()) : 0.0
                    );
                    response.setProgress(summary);
                }
            }
            
            return response;
        }).collect(Collectors.toList());
        
        RoadmapResponse response = new RoadmapResponse();
        response.setId(roadmap.getId());
        response.setName(roadmap.getName());
        response.setDescription(roadmap.getDescription());
        response.setGroupId(roadmap.getGroupId());
        response.setCreatedBy(roadmap.getCreatedBy());
        response.setCreatedAt(roadmap.getCreatedAt());
        response.setUpdatedAt(roadmap.getUpdatedAt());
        response.setTopics(topicResponses);
        
        return response;
    }
}
