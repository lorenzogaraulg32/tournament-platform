package com.tournamentplatform.activityservice.repository;

import com.tournamentplatform.activityservice.entity.tournament_mod.TournamentModActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TournamentModRepository extends JpaRepository<TournamentModActivity, Long> {


    boolean existsByEventId(UUID eventId);

    List<TournamentModActivity> findAllByUserIdOrderByOccurredAtDesc(long userId);

    List<TournamentModActivity> findAllByTournamentIdOrderByOccurredAtDesc(long tournamentId);

}
