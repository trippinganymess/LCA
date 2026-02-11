package com.LCA.cat.repository;

import com.LCA.cat.entity.ProblemCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemCompletionRepository extends JpaRepository<ProblemCompletion, Long> {
    Optional<ProblemCompletion> findByUserIdAndProblemId(String userId, Long problemId);
    List<ProblemCompletion> findByUserIdAndProblemTopicId(String userId, Long topicId);
    Long countByUserIdAndProblemTopicIdAndCompletedTrue(String userId, Long topicId);

    @Query("SELECT pc FROM ProblemCompletion pc WHERE pc.userId IN :userIds AND pc.completed = true AND pc.completedAt IS NOT NULL")
    List<ProblemCompletion> findCompletedByUserIds(@Param("userIds") List<String> userIds);
}
