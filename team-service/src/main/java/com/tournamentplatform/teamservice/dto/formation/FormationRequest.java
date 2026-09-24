package com.tournamentplatform.teamservice.dto.formation;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public record FormationRequest(
        String name,

        @NotNull
        Map<String, String> slotAssignment,

        @NotNull
        List<String> benchOrder
) {
}
