package com.LCA.cat.repository;

import com.LCA.cat.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByGroupId(String groupId);
    List<Roadmap> findByGroupIdAndIsActive(String groupId, Boolean isActive);
    Optional<Roadmap> findByIdAndGroupId(Long id, String groupId);
}
