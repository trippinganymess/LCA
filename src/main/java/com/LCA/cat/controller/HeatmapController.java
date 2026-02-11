package com.LCA.cat.controller;

import com.LCA.cat.dto.ApiResponse;
import com.LCA.cat.entity.ProblemCompletion;
import com.LCA.cat.repository.ProblemCompletionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/heatmap")
@CrossOrigin(origins = "*")
public class HeatmapController {

    @Autowired
    private ProblemCompletionRepository problemCompletionRepository;

    /**
     * Returns heatmap data for a group.
     * A "contribution" on a given day counts only when ALL specified members
     * have solved at least one problem on that day.
     * The value is the minimum number of problems solved by any member on that day
     * (i.e. the group's collective count).
     *
     * Query params: memberIds - comma-separated list of user IDs in the group
     * Response: Map of date string -> contribution count
     */
    @GetMapping("/group")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getGroupHeatmap(
            @RequestParam String memberIds) {

        List<String> members = Arrays.asList(memberIds.split(","));
        int memberCount = members.size();

        // Get all completed problem completions for these users
        List<ProblemCompletion> completions = problemCompletionRepository.findCompletedByUserIds(members);

        // Group by date -> userId -> count
        // date is derived from completedAt (LocalDateTime -> LocalDate)
        Map<LocalDate, Map<String, Long>> dateUserCounts = completions.stream()
                .collect(Collectors.groupingBy(
                        pc -> pc.getCompletedAt().toLocalDate(),
                        Collectors.groupingBy(
                                ProblemCompletion::getUserId,
                                Collectors.counting()
                        )
                ));

        // For each date, check if ALL members have at least 1 completion
        // If so, the contribution value = min count across all members
        Map<String, Integer> heatmapData = new HashMap<>();

        for (Map.Entry<LocalDate, Map<String, Long>> entry : dateUserCounts.entrySet()) {
            LocalDate date = entry.getKey();
            Map<String, Long> userCounts = entry.getValue();

            // Only count days where ALL members participated
            if (userCounts.size() >= memberCount) {
                long minCount = userCounts.values().stream()
                        .mapToLong(Long::longValue)
                        .min()
                        .orElse(0);
                heatmapData.put(date.toString(), (int) minCount);
            }
        }

        return ResponseEntity.ok(ApiResponse.success("Heatmap data retrieved", heatmapData));
    }
}
