package com.tournamentplatform.userservice.dto;

public record GeoLocationResponse(
        String label,
        Double latitude,
        Double longitude
) {
}