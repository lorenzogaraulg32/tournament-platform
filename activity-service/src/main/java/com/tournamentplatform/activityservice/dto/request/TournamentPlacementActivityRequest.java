package com.tournamentplatform.activityservice.dto.request;

import java.util.UUID;

public record TournamentPlacementActivityRequest(
        UUID eventId,
        long teamId,
        long tournamentId
) {
}