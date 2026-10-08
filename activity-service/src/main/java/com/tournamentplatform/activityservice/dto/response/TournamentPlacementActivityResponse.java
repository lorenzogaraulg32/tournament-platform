package com.tournamentplatform.activityservice.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record TournamentPlacementActivityResponse(
        Long id,
        UUID eventId,
        long teamId,
        long tournamentId,
        LocalDateTime occurredAt
) {
}
