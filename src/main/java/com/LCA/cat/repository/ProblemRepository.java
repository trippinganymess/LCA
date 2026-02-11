package com.LCA.cat.repository;

import com.LCA.cat.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByTopicIdOrderByOrderIndexAsc(Long topicId);
    List<Problem> findByTopicId(Long topicId);
    List<Problem> findByTopicIdAndTitle(Long topicId, String title);
}
