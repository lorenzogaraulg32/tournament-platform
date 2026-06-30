package com.tournamentplatform.authservice;

import com.tournamentplatform.authservice.filter.JwtAuthenticationFilter;
import com.tournamentplatform.authservice.service.JwtService;
import com.tournamentplatform.authservice.user.GlobalRole;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Objects;

import static com.tournamentplatform.authservice.user.GlobalRole.ROLE_USER;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationFilterTest {

    /*
        1. Se non c’è Authorization header → lascia passare e non autentica
        2. Se il token è invalido → lascia passare ma non autentica
        3. Se il token è valido → crea Authentication e la mette nel SecurityContext
    */

    @Mock
    private JwtService jwtService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @AfterEach
    void cleanSecurityContext() {
        SecurityContextHolder.clearContext();
    }


    @Test
    void doFilterInternal_withoutAuthorizationHeader_doesNotAuthenticate() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());

        verifyNoInteractions(jwtService);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_withInvalidToken_doesNotAuthenticate() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Bearer invalid-token");

        when(jwtService.isTokenValid("invalid-token"))
                .thenReturn(false);

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());

        verify(jwtService, times(1)).isTokenValid("invalid-token");
        verify(jwtService, never()).extractId(anyString());
        verify(jwtService, never()).extractRole(anyString());
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_withValidToken_setsAuthentication() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Bearer valid-token");

        when(jwtService.isTokenValid("valid-token"))
                .thenReturn(true);

        when(jwtService.extractId("valid-token"))
                .thenReturn(1L);

        when(jwtService.extractRole("valid-token"))
                .thenReturn(ROLE_USER);

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        assertNotNull(authentication);
        assertEquals(1L, authentication.getPrincipal());
        assertTrue(authentication.isAuthenticated());

        assertTrue(authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        Objects.equals(authority.getAuthority(), GlobalRole.ROLE_USER.name())
                ));

        verify(jwtService, times(1)).isTokenValid("valid-token");
        verify(jwtService, times(1)).extractId("valid-token");
        verify(jwtService, times(1)).extractRole("valid-token");
        verify(filterChain, times(1)).doFilter(request, response);
    }
}
