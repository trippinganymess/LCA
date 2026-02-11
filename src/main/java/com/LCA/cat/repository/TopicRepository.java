package com.LCA.cat.repository;

import com.LCA.cat.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByRoadmapIdOrderByOrderIndexAsc(Long roadmapId);
    List<Topic> findByRoadmapId(Long roadmapId);
}
