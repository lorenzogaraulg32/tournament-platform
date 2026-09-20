package com.tournamentplatform.teamservice.dto.position;

public record GeoLocationResponse(
        String label,
        Double latitude,
        Double longitude
) {
}