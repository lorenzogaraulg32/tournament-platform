package com.tournamentplatform.activityservice.repository;

import com.tournamentplatform.activityservice.entity.team_authority.TeamAuthorityActivity;
import com.tournamentplatform.activityservice.entity.team_membership.TeamMembershipActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TeamAuthorityRepository extends JpaRepository<TeamAuthorityActivity, Long> {

    boolean existsByEventId(UUID eventId);

    List<TeamAuthorityActivity> findAllByUserIdOrderByOccurredAtDesc(long userId);

    List<TeamAuthorityActivity> findAllByTeamIdOrderByOccurredAtDesc(long teamId);

}
