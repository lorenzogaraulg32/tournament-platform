package com.tournamentplatform.activityservice.service;

import com.tournamentplatform.activityservice.dto.request.TournamentPlacementActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TournamentPlacementActivityResponse;
import com.tournamentplatform.activityservice.entity.tournament_placements.TournamentPlacementActivity;
import com.tournamentplatform.activityservice.mapper.ActivityMapper;
import com.tournamentplatform.activityservice.repository.TournamentPlacementsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class TournamentPlacementsService {

    private final TournamentPlacementsRepository repo;


    public void postNewActivity(TournamentPlacementActivityRequest request) {

        if (repo.existsByEventId(request.eventId())) {
            return;
        }

        TournamentPlacementActivity activity = ActivityMapper.toEntity(request);
        repo.save(activity);
    }

    public List<TournamentPlacementActivityResponse> getAllActivitiesByTeamId(String teamId) {
        List<TournamentPlacementActivity> activities = repo.findAllByTeamIdOrderByOccurredAtDesc(Long.parseLong(teamId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }

    public List<TournamentPlacementActivityResponse> getAllActivitiesByTournamentId(String tournamentId) {
        List<TournamentPlacementActivity> activities = repo.findAllByTournamentIdOrderByOccurredAtDesc(Long.parseLong(tournamentId));
        return activities.stream().map(ActivityMapper::toResponse).toList();
    }
}
