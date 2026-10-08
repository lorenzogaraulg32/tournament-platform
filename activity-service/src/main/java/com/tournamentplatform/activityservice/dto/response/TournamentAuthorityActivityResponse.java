package com.tournamentplatform.activityservice.dto.response;

import com.tournamentplatform.activityservice.entity.AuthorityActivities;

import java.time.LocalDateTime;
import java.util.UUID;

public record TournamentAuthorityActivityResponse(
        Long id,
        UUID eventId,
        long userId,
        long tournamentId,
        AuthorityActivities type,
        LocalDateTime occurredAt
) {
}