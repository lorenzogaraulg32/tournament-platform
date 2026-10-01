package com.tournamentplatform.mediaservice.config;

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

@Component
public class InternalServiceAuthenticationFilter
        extends OncePerRequestFilter {

    private static final String INTERNAL_TOKEN_HEADER =
            "X-Internal-Service-Token";

    private final String expectedToken;

    public InternalServiceAuthenticationFilter(
            @Value("${internal.media-service.token}")
            String expectedToken
    ) {
        this.expectedToken = expectedToken;
    }

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {
        return !request.getRequestURI()
                .startsWith("/internal/media/");
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