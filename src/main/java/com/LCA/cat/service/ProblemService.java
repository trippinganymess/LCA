package com.LCA.cat.service;

import com.LCA.cat.entity.Problem;
import com.LCA.cat.entity.ProblemCompletion;
import com.LCA.cat.repository.ProblemRepository;
import com.LCA.cat.repository.ProblemCompletionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {
    
    @Autowired
    private ProblemRepository problemRepository;
    
    @Autowired
    private ProblemCompletionRepository problemCompletionRepository;
    
    public List<Problem> getProblemsByTopic(Long topicId) {
        return problemRepository.findByTopicIdOrderByOrderIndexAsc(topicId);
    }
    
    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }
    
    @Transactional
    public ProblemCompletion toggleProblemCompletion(String userId, Long problemId) {
        Optional<ProblemCompletion> existing = problemCompletionRepository
                .findByUserIdAndProblemId(userId, problemId);
        
        if (existing.isPresent()) {
            ProblemCompletion completion = existing.get();
            completion.setCompleted(!completion.getCompleted());
            if (completion.getCompleted()) {
                completion.setCompletedAt(LocalDateTime.now());
                completion.setAttempts(completion.getAttempts() + 1);
            } else {
                completion.setCompletedAt(null);
            }
            return problemCompletionRepository.save(completion);
        } else {
            ProblemCompletion newCompletion = new ProblemCompletion();
            newCompletion.setUserId(userId);
            newCompletion.setProblem(problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found")));
            newCompletion.setCompleted(true);
            newCompletion.setCompletedAt(LocalDateTime.now());
            newCompletion.setAttempts(1);
            return problemCompletionRepository.save(newCompletion);
        }
    }
    
    public List<ProblemCompletion> getUserCompletions(String userId, Long topicId) {
        return problemCompletionRepository.findByUserIdAndProblemTopicId(userId, topicId);
    }
}
