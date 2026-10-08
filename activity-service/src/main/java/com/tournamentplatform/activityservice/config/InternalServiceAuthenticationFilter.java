package com.tournamentplatform.activityservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Set;

@Component
public class InternalServiceAuthenticationFilter
        extends OncePerRequestFilter {

    private static final String INTERNAL_TOKEN_HEADER =
            "X-Internal-Service-Token";

    //Aggiungere qua gli endpoint in caso di nuove attività
    private static final Set<String> INTERNAL_ENDPOINTS = Set.of(
            "/team-mod/internal",
            "/team-authority/internal",
            "/team-membership/internal",
            "/tournament-mod/internal",
            "/tournament-authority/internal",
            "/tournament-placements/internal"
    );

    private final String expectedToken;

    public InternalServiceAuthenticationFilter(
            @Value("${internal.activity-service.token}")
            String expectedToken
    ) {
        if (expectedToken == null || expectedToken.isBlank()) {
            throw new IllegalStateException(
                    "Internal activity-service token not configured"
            );
        }

        this.expectedToken = expectedToken;
    }

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {
        return !INTERNAL_ENDPOINTS.contains(
                request.getServletPath()
        );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String receivedToken =
                request.getHeader(INTERNAL_TOKEN_HEADER);

        if (!isValidToken(receivedToken)) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized internal request"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isValidToken(String receivedToken) {

        if (receivedToken == null) {
            return false;
        }

        return MessageDigest.isEqual(
                receivedToken.getBytes(StandardCharsets.UTF_8),
                expectedToken.getBytes(StandardCharsets.UTF_8)
        );
    }
}