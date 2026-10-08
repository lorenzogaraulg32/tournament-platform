package com.tournamentplatform.activityservice.service;

import com.tournamentplatform.activityservice.dto.request.TeamAuthorityActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TeamAuthorityActivityResponse;
import com.tournamentplatform.activityservice.entity.team_authority.TeamAuthorityActivity;
import com.tournamentplatform.activityservice.mapper.ActivityMapper;
import com.tournamentplatform.activityservice.repository.TeamAuthorityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TeamAuthorityService {

    private final TeamAuthorityRepository repo;


    public void postNewActivity(TeamAuthorityActivityRequest request) {

        if (repo.existsByEventId(request.eventId())) {
            return;
        }

        TeamAuthorityActivity activity = ActivityMapper.toEntity(request);
        repo.save(activity);
    }

    public List<TeamAuthorityActivityResponse> getAllActivitiesByUserId(String userId) {
        List<TeamAuthorityActivity> activities = repo.findAllByUserIdOrderByOccurredAtDesc(Long.parseLong(userId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

    public List<TeamAuthorityActivityResponse> getAllActivitiesByTeamId(String teamId) {
        List<TeamAuthorityActivity> activities = repo.findAllByTeamIdOrderByOccurredAtDesc(Long.parseLong(teamId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

}
