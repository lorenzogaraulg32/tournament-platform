package com.tournamentplatform.activityservice.dto.response;

import java.time.LocalDateTime;

public record TeamModActivityResponse(

        long userId,
        long teamId,
        LocalDateTime occurredAt
) {
}