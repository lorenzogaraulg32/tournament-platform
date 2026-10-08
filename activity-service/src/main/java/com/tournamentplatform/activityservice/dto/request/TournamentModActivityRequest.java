package com.tournamentplatform.activityservice.dto.request;

import java.util.UUID;

public record TournamentModActivityRequest(
        UUID eventId,
        long userId,
        long tournamentId
) {
}