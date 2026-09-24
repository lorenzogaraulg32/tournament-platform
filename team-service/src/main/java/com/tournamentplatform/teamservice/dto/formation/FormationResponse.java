package com.tournamentplatform.teamservice.dto.formation;

import java.util.List;
import java.util.Map;

public record FormationResponse(
        String name,
        Map<String, String> slotAssignment,
        List<String> benchOrder
) {
}
