package com.LCA.cat.repository;

import com.LCA.cat.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserIdAndTopicId(String userId, Long topicId);
    List<UserProgress> findByUserId(String userId);
    List<UserProgress> findByTopicId(Long topicId);
    
    @Query("SELECT up FROM UserProgress up WHERE up.topic.roadmap.id = :roadmapId AND up.userId = :userId")
    List<UserProgress> findByRoadmapIdAndUserId(Long roadmapId, String userId);
    
    @Query("SELECT up FROM UserProgress up WHERE up.topic.roadmap.groupId = :groupId")
    List<UserProgress> findByGroupId(String groupId);
}
