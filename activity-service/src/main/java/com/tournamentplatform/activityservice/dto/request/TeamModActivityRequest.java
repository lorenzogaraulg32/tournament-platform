package com.tournamentplatform.activityservice.dto.request;

import java.util.UUID;

public record TeamModActivityRequest(
        UUID eventId,
        long userId,
        long teamId
) {
}