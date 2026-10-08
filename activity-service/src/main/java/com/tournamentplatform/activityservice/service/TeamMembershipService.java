package com.tournamentplatform.activityservice.service;

import com.tournamentplatform.activityservice.dto.request.TeamMembershipActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TeamMembershipActivityResponse;
import com.tournamentplatform.activityservice.entity.team_membership.TeamMembershipActivity;
import com.tournamentplatform.activityservice.mapper.ActivityMapper;
import com.tournamentplatform.activityservice.repository.TeamMembershipRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class TeamMembershipService {

    private final TeamMembershipRepository repo;


    public void postNewActivity(TeamMembershipActivityRequest request) {

        if (repo.existsByEventId(request.eventId())) {
            return;
        }

        TeamMembershipActivity activity = ActivityMapper.toEntity(request);
        repo.save(activity);
    }

    public List<TeamMembershipActivityResponse> getAllActivitiesByUserId(String userId) {
        List<TeamMembershipActivity> activities = repo.findAllByUserIdOrderByOccurredAtDesc(Long.parseLong(userId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

    public List<TeamMembershipActivityResponse> getAllActivitiesByTeamId(String teamId) {
        List<TeamMembershipActivity> activities = repo.findAllByTeamIdOrderByOccurredAtDesc(Long.parseLong(teamId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }


}
