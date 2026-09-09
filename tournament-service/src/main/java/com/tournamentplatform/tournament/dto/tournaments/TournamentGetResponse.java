package com.tournamentplatform.tournament.dto.tournaments;

import com.tournamentplatform.tournament.entity.TournamentMatch;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record TournamentGetResponse(
        Long id,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer minTeams,
        Integer maxTeams,
        String format,
        String status,
        String rulesUrl,
        String createdById,
        List<String> adminsId,
        Set<Long> registeredTeamIds,
        List<TournamentMatch> matches,
        String logoUrl,
        String locationLabel,
        BigDecimal latitude,
        BigDecimal longitude,
        String invitationCode
) {
}


