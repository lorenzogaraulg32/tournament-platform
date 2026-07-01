package com.tournamentplatform.authservice;

import com.tournamentplatform.authservice.service.JwtService;
import com.tournamentplatform.authservice.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;

import static com.tournamentplatform.authservice.user.GlobalRole.ROLE_USER;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Test
    void generateToken_createsValidToken() {
        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        user.setId(1L);

        String token = jwtService.generateToken(user);

        assertNotNull(token);

        Jwt decodedJwt = jwtDecoder.decode(token);

        assertEquals("1", decodedJwt.getSubject());
        assertEquals("prova@gmail.com", decodedJwt.getClaimAsString("email"));
        assertEquals("ROLE_USER", decodedJwt.getClaimAsStringList("roles").get(0));
    }

    @Test
    void decoder_rejectsTamperedToken() {
        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        user.setId(1L);

        String token = jwtService.generateToken(user);
        String tamperedToken = token + "abc";

        assertThrows(Exception.class, () -> jwtDecoder.decode(tamperedToken));
    }
}