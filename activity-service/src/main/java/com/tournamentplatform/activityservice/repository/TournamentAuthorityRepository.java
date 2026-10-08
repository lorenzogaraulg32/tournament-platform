package com.tournamentplatform.activityservice.repository;

import com.tournamentplatform.activityservice.entity.tournament_authorities.TournamentAuthorityActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TournamentAuthorityRepository extends JpaRepository<TournamentAuthorityActivity, Long> {
    boolean existsByEventId(UUID eventId);

    List<TournamentAuthorityActivity> findAllByUserIdOrderByOccurredAtDesc(long userId);

    List<TournamentAuthorityActivity> findAllByTournamentIdOrderByOccurredAtDesc(long tournamentId);

}
