package com.tournamentplatform.activityservice.service;

import com.tournamentplatform.activityservice.dto.request.TournamentModActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TournamentModActivityResponse;
import com.tournamentplatform.activityservice.entity.tournament_mod.TournamentModActivity;
import com.tournamentplatform.activityservice.mapper.ActivityMapper;
import com.tournamentplatform.activityservice.repository.TournamentModRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TournamentModService {

    private final TournamentModRepository repo;

    public void postNewActivity(TournamentModActivityRequest request) {

        if (repo.existsByEventId(request.eventId())) {
            return;
        }

        TournamentModActivity activity = ActivityMapper.toEntity(request);
        repo.save(activity);
    }


    public List<TournamentModActivityResponse> getAllActivitiesByUserId(String userId) {
        List<TournamentModActivity> activities = repo.findAllByUserIdOrderByOccurredAtDesc(Long.parseLong(userId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

    public List<TournamentModActivityResponse> getAllActivitiesByTournamentId(String tournamentId) {
        List<TournamentModActivity> activities = repo.findAllByTournamentIdOrderByOccurredAtDesc(Long.parseLong(tournamentId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

}
