package com.tournamentplatform.authservice;

import com.tournamentplatform.authservice.service.JwtService;
import com.tournamentplatform.authservice.user.GlobalRole;
import com.tournamentplatform.authservice.user.User;
import org.junit.jupiter.api.Test;

import static com.tournamentplatform.authservice.user.GlobalRole.ROLE_USER;
import static org.junit.jupiter.api.Assertions.*;


public class JwtSeriveTest {

    private final String secret =
            "MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=";

    private final long expiration = 3600000L;

    private final JwtService jwtService = new JwtService(secret, expiration);

    @Test
    void generateJwtTokenValidToken() {
        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        user.setId(1L);

        String token = jwtService.generateJwtToken(user);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void extractIdReturnsUserId() {
        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        user.setId(1L);

        String token = jwtService.generateJwtToken(user);

        Long userId = jwtService.extractId(token);

        assertEquals(1L, userId);
    }

    @Test
    void extractRoleReturnsUserRole() {
        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        user.setId(1L);

        String token = jwtService.generateJwtToken(user);

        GlobalRole role = jwtService.extractRole(token);

        assertEquals(ROLE_USER, role);
    }

    @Test
    void isTokenValidFalseForTamperedToken() {
        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        user.setId(1L);

        String token = jwtService.generateJwtToken(user);

        String tamperedToken = token + "abc";

        assertFalse(jwtService.isTokenValid(tamperedToken));
    }
    @Test
    void isTokenValidFalseForExpiredToken() {
        JwtService expiredJwtService = new JwtService(secret, -1000L);

        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        user.setId(1L);

        String token = expiredJwtService.generateJwtToken(user);

        assertFalse(expiredJwtService.isTokenValid(token));
    }

}
