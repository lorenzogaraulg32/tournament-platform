package com.tournamentplatform.activityservice.service;

import com.tournamentplatform.activityservice.dto.request.TeamMembershipActivityRequest;
import com.tournamentplatform.activityservice.dto.request.TeamModActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TeamMembershipActivityResponse;
import com.tournamentplatform.activityservice.dto.response.TeamModActivityResponse;
import com.tournamentplatform.activityservice.entity.team_membership.TeamMembershipActivity;
import com.tournamentplatform.activityservice.entity.team_mod.TeamModActivity;
import com.tournamentplatform.activityservice.mapper.ActivityMapper;
import com.tournamentplatform.activityservice.repository.TeamAuthorityRepository;
import com.tournamentplatform.activityservice.repository.TeamModRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TeamModService {

    private final TeamModRepository repo;


    public void postNewActivity(TeamModActivityRequest request) {
        TeamModActivity activity = ActivityMapper.toEntity(request);
        repo.save(activity);
    }

    public List<TeamModActivityResponse> getAllActivitiesByUserId(String userId) {
        List<TeamModActivity> activities = repo.findAllByUserIdOrderByOccurredAtDesc(Long.parseLong(userId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

    public List<TeamModActivityResponse> getAllActivitiesByTeamId(String teamId) {
        List<TeamModActivity> activities = repo.findAllByTeamIdOrderByOccurredAtDesc(Long.parseLong(teamId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

}
