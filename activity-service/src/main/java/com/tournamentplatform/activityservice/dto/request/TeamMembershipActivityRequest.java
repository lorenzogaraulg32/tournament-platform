package com.tournamentplatform.activityservice.dto.request;

import com.tournamentplatform.activityservice.entity.team_membership.SportRole;
import com.tournamentplatform.activityservice.entity.team_membership.TeamMembershipActivities;

import java.util.UUID;

public record TeamMembershipActivityRequest(
        UUID eventId,
        long userId,
        long teamId,
        TeamMembershipActivities type,
        SportRole sportRole
) {
}