package com.tournamentplatform.activityservice.dto.request;

import com.tournamentplatform.activityservice.entity.AuthorityActivities;

import java.util.UUID;

public record TeamAuthorityActivityRequest(
        UUID eventId,
        long userId,
        long teamId,
        AuthorityActivities type
) {
}