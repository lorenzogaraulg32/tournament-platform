package com.tournamentplatform.activityservice.dto.response;

import com.tournamentplatform.activityservice.entity.team_membership.SportRole;
import com.tournamentplatform.activityservice.entity.team_membership.TeamMembershipActivities;

import java.time.LocalDateTime;
import java.util.UUID;

public record TeamMembershipActivityResponse(
        Long id,
        UUID eventId,
        long userId,
        long teamId,
        TeamMembershipActivities type,
        SportRole sportRole,
        LocalDateTime occurredAt
) {
}