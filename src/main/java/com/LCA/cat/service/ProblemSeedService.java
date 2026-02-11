package com.LCA.cat.service;

import com.LCA.cat.entity.Problem;
import com.LCA.cat.entity.Topic;
import com.LCA.cat.repository.ProblemRepository;
import com.LCA.cat.repository.TopicRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProblemSeedService {
    
    @Autowired
    private ProblemRepository problemRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    // Map problem categories from liveProblems.json to topic name patterns
    private static final Map<String, String> CATEGORY_TO_TOPIC_PATTERN = new HashMap<>();
    static {
        CATEGORY_TO_TOPIC_PATTERN.put("Basics & Math", "Basic");
        CATEGORY_TO_TOPIC_PATTERN.put("Arrays & Hashing", "Array");
        CATEGORY_TO_TOPIC_PATTERN.put("Sorting", "Sort");
        CATEGORY_TO_TOPIC_PATTERN.put("Two Pointers", "Two Pointer");
        CATEGORY_TO_TOPIC_PATTERN.put("Sliding Window", "Sliding Window");
        CATEGORY_TO_TOPIC_PATTERN.put("Linked Lists", "Linked List");
        CATEGORY_TO_TOPIC_PATTERN.put("Stacks & Queues", "Stack");
        CATEGORY_TO_TOPIC_PATTERN.put("Binary Search", "Binary Search");
        CATEGORY_TO_TOPIC_PATTERN.put("Heaps / Priority Queues", "Heap");
        CATEGORY_TO_TOPIC_PATTERN.put("Binary Trees", "Binary Tree");
        CATEGORY_TO_TOPIC_PATTERN.put("Binary Search Trees", "BST");
        CATEGORY_TO_TOPIC_PATTERN.put("Tries", "Trie");
        CATEGORY_TO_TOPIC_PATTERN.put("Recursion & Backtracking", "Backtracking");
        CATEGORY_TO_TOPIC_PATTERN.put("Greedy Algorithms", "Greedy");
        CATEGORY_TO_TOPIC_PATTERN.put("Graphs", "Graph");
        CATEGORY_TO_TOPIC_PATTERN.put("Disjoint Set Union", "DSU");
        CATEGORY_TO_TOPIC_PATTERN.put("Dynamic Programming", "DP");
        CATEGORY_TO_TOPIC_PATTERN.put("Bit Manipulation", "Bit");
        CATEGORY_TO_TOPIC_PATTERN.put("Intervals", "Interval");
        CATEGORY_TO_TOPIC_PATTERN.put("Math & Geometry", "Math");
    }
    
    @Transactional
    public Map<String, Object> seedProblemsForRoadmap(Long roadmapId) throws IOException {
        // Find all topics for this roadmap
        List<Topic> topics = topicRepository.findByRoadmapIdOrderByOrderIndexAsc(roadmapId);
        
        if (topics.isEmpty()) {
            return Map.of("success", false, "message", "No topics found for roadmap");
        }
        
        // Load problems from liveProblems.json from classpath
        ObjectMapper mapper = new ObjectMapper();
        Resource resource = new ClassPathResource("liveProblems.json");
        JsonNode problemsJson = mapper.readTree(resource.getInputStream());
        
        int totalSeeded = 0;
        Map<String, Integer> categoryCount = new HashMap<>();
        
        // For each problem in JSON
        for (JsonNode problemNode : problemsJson) {
            String title = problemNode.get("title").asText();
            String difficulty = problemNode.get("difficulty").asText();
            String url = problemNode.get("url").asText();
            String category = problemNode.get("category").asText();
            
            // Find matching topic based on category
            String topicPattern = CATEGORY_TO_TOPIC_PATTERN.getOrDefault(category, category);
            Topic matchingTopic = topics.stream()
                    .filter(t -> t.getName().toLowerCase().contains(topicPattern.toLowerCase()) ||
                                 topicPattern.toLowerCase().contains(t.getName().toLowerCase()))
                    .findFirst()
                    .orElse(null);
            
            if (matchingTopic != null) {
                // Check if problem already exists for this topic
                List<Problem> existing = problemRepository.findByTopicIdAndTitle(
                        matchingTopic.getId(), title);
                
                if (existing.isEmpty()) {
                    Problem problem = new Problem();
                    problem.setTitle(title);
                    problem.setDifficulty(Problem.Difficulty.valueOf(difficulty));
                    problem.setProblemUrl(url);
                    problem.setTopic(matchingTopic);
                    problem.setOrderIndex(categoryCount.getOrDefault(category, 0));
                    
                    problemRepository.save(problem);
                    totalSeeded++;
                    categoryCount.put(category, categoryCount.getOrDefault(category, 0) + 1);
                }
            }
        }
        
        return Map.of(
                "success", true,
                "message", "Problems seeded successfully",
                "totalSeeded", totalSeeded,
                "topicsProcessed", topics.size()
        );
    }
}
