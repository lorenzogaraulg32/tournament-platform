package com.tournamentplatform.activityservice.repository;

import com.tournamentplatform.activityservice.entity.team_authority.TeamAuthorityActivity;
import com.tournamentplatform.activityservice.entity.team_mod.TeamModActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeamModRepository extends JpaRepository<TeamModActivity, Long> {

    boolean existsByEventId(UUID eventId);

    List<TeamModActivity> findAllByUserIdOrderByOccurredAtDesc(long userId);

    List<TeamModActivity> findAllByTeamIdOrderByOccurredAtDesc(long teamId);

}
