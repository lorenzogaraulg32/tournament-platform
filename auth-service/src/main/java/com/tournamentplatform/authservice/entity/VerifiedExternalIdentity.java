package com.tournamentplatform.authservice.entity;

public record VerifiedExternalIdentity(
        ExternalProvider provider,
        String subject,
        String email
) {
}
