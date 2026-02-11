package com.LCA.cat.service;

import com.LCA.cat.entity.Topic;
import com.LCA.cat.entity.UserProgress;
import com.LCA.cat.repository.TopicRepository;
import com.LCA.cat.repository.UserProgressRepository;
import com.LCA.cat.dto.ProgressUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProgressService {
    
    @Autowired
    private UserProgressRepository userProgressRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Transactional
    public UserProgress updateProgress(ProgressUpdateRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        UserProgress progress = userProgressRepository
                .findByUserIdAndTopicId(request.getUserId(), request.getTopicId())
                .orElse(new UserProgress());
        
        progress.setUserId(request.getUserId());
        progress.setTopic(topic);
        progress.setStatus(UserProgress.ProgressStatus.valueOf(request.getStatus()));
        progress.setProblemsSolved(request.getProblemsSolved());
        progress.setTotalProblems(request.getTotalProblems());
        
        return userProgressRepository.save(progress);
    }
    
    public List<UserProgress> getUserProgressByRoadmap(Long roadmapId, String userId) {
        return userProgressRepository.findByRoadmapIdAndUserId(roadmapId, userId);
    }
    
    public List<UserProgress> getGroupProgress(String groupId) {
        return userProgressRepository.findByGroupId(groupId);
    }
}
