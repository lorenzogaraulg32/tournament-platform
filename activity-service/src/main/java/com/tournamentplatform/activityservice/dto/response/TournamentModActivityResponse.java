package com.tournamentplatform.activityservice.dto.response;

import java.time.LocalDateTime;

public record TournamentModActivityResponse(

        long userId,
        long tournamentId,
        LocalDateTime occurredAt
) {
}