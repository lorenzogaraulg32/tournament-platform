package com.tournamentplatform.authservice.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final BearerTokenAccessDeniedHandler delegate =
            new BearerTokenAccessDeniedHandler();

    private final SecurityErrorResponseWriter responseWriter;

    public RestAccessDeniedHandler(
            SecurityErrorResponseWriter responseWriter
    ) {
        this.responseWriter = responseWriter;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException exception
    ) throws IOException, ServletException {
        // Mantiene gli header OAuth2 standard previsti per un Bearer token.
        delegate.handle(request, response, exception);

        responseWriter.write(
                request,
                response,
                HttpStatus.FORBIDDEN,
                "ACCESS_DENIED",
                "Non hai i permessi necessari per eseguire questa operazione"
        );
    }
}
