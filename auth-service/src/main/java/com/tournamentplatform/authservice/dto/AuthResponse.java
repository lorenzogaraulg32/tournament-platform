package com.tournamentplatform.authservice.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Long expiresIn,
        UserResponse userResponse
) {
}
