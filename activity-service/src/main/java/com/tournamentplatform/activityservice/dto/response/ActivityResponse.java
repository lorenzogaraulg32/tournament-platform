package com.tournamentplatform.activityservice.dto.response;

import java.time.LocalDateTime;

public record ActivityResponse(
        String id,
        LocalDateTime issuedAt,
        String label
) {
}
