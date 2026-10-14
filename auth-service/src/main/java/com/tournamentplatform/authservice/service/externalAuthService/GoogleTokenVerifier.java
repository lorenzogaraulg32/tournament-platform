
package com.tournamentplatform.authservice.service.externalAuthService;

import com.tournamentplatform.authservice.entity.ExternalProvider;
import com.tournamentplatform.authservice.entity.VerifiedExternalIdentity;
import com.tournamentplatform.authservice.exception.InvalidCredentialsException;

import com.tournamentplatform.authservice.service.externalAuthService.ProviderTokenVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

@Component
public class GoogleTokenVerifier implements ProviderTokenVerifier {

    private final JwtDecoder googleDecoder;

    public GoogleTokenVerifier(
            @Value("${auth.google.client-id}") String clientId
    ) {

        NimbusJwtDecoder decoder =
                NimbusJwtDecoder.withJwkSetUri(
                        "https://www.googleapis.com/oauth2/v3/certs"
                ).build();

        OAuth2TokenValidator<Jwt> googleValidator = jwt -> {

            String issuer = jwt.getClaimAsString("iss");

            boolean validIssuer =
                    "https://accounts.google.com".equals(issuer) ||
                            "accounts.google.com".equals(issuer);

            boolean validAudience =
                    jwt.getAudience().contains(clientId);

            if (!validIssuer || !validAudience) {
                return OAuth2TokenValidatorResult.failure(
                        new OAuth2Error(
                                "invalid_token",
                                "Issuer o audience Google non validi",
                                null
                        )
                );
            }

            return OAuth2TokenValidatorResult.success();
        };

        decoder.setJwtValidator(
                new DelegatingOAuth2TokenValidator<>(
                        JwtValidators.createDefault(),
                        googleValidator
                )
        );

        this.googleDecoder = decoder;
    }

    @Override
    public ExternalProvider provider() {
        return ExternalProvider.GOOGLE;
    }

    @Override
    public VerifiedExternalIdentity verify(String idToken) {

        if (idToken == null || idToken.isBlank()) {
            throw new InvalidCredentialsException();
        }

        Jwt jwt;

        try {
            jwt = googleDecoder.decode(idToken);
        } catch (JwtException ex) {
            throw new InvalidCredentialsException();
        }

        String subject = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        Boolean emailVerified =
                jwt.getClaimAsBoolean("email_verified");

        if (subject == null || subject.isBlank() ||
                email == null || email.isBlank() ||
                !Boolean.TRUE.equals(emailVerified)) {

            throw new InvalidCredentialsException();
        }

        return new VerifiedExternalIdentity(
                ExternalProvider.GOOGLE,
                subject,
                email
        );
    }
}
