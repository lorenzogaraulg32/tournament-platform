package com.tournamentplatform.activityservice.repository;

import com.tournamentplatform.activityservice.entity.tournament_placements.TournamentPlacementActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TournamentPlacementsRepository extends JpaRepository<TournamentPlacementActivity, Long> {

    boolean existsByEventId(UUID eventId);

    List<TournamentPlacementActivity> findAllByTeamIdOrderByOccurredAtDesc(long teamId);

    List<TournamentPlacementActivity> findAllByTournamentIdOrderByOccurredAtDesc(long tournamentId);

}
