package com.tournamentplatform.tournament.dto.position;

public record GeoLocationResponse(
        String label,
        Double latitude,
        Double longitude
) {
}