package com.tournamentplatform.activityservice.repository;

import com.tournamentplatform.activityservice.entity.team_membership.TeamMembershipActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TeamMembershipRepository extends JpaRepository<TeamMembershipActivity,Long> {

    boolean existsByEventId(UUID eventId);

    List<TeamMembershipActivity> findAllByUserIdOrderByOccurredAtDesc(long userId);

    List<TeamMembershipActivity> findAllByTeamIdOrderByOccurredAtDesc(long teamId);

}
