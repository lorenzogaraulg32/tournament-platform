package com.tournamentplatform.userservice.dto.position;

public record GeoLocationResponse(
        String label,
        Double latitude,
        Double longitude
) {
}