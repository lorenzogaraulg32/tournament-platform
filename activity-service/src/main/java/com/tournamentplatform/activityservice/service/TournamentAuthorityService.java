package com.tournamentplatform.activityservice.service;

import com.tournamentplatform.activityservice.dto.request.TournamentAuthorityActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TournamentAuthorityActivityResponse;
import com.tournamentplatform.activityservice.entity.tournament_authorities.TournamentAuthorityActivity;
import com.tournamentplatform.activityservice.mapper.ActivityMapper;
import com.tournamentplatform.activityservice.repository.TournamentAuthorityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class TournamentAuthorityService {

    private final TournamentAuthorityRepository repo;

    public void postNewActivity(TournamentAuthorityActivityRequest request) {
        TournamentAuthorityActivity activity = ActivityMapper.toEntity(request);
        repo.save(activity);
    }

    public List<TournamentAuthorityActivityResponse> getAllActivitiesByUserId(String userId) {
        List<TournamentAuthorityActivity> activities = repo.findAllByUserIdOrderByOccurredAtDesc(Long.parseLong(userId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

    public List<TournamentAuthorityActivityResponse> getAllActivitiesByTournamentId(String tournamentId) {
        List<TournamentAuthorityActivity> activities = repo.findAllByTournamentIdOrderByOccurredAtDesc(Long.parseLong(tournamentId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }


}
