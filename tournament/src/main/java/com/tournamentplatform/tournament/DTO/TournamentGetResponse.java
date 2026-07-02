package com.tournamentplatform.tournament.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TournamentGetResponse(
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer minTeams,
        Integer maxTeams,
        String format,
        String status
) {
}
