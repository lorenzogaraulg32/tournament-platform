package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.user.GlobalRole;
import com.tournamentplatform.authservice.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    @Getter
    private final long expiration;

    public JwtService(
            @Value("${security.jwt.secret}") String encodedKey,
            @Value("${security.jwt.expiration}") long expiration
    ) {
        byte[] decodedKey = Base64.getDecoder().decode(encodedKey);
        this.secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA256");
        this.expiration = expiration;
    }


    public String generateJwtToken(User user) {
        /*
         * Come viene generato il JWT:
         * Calcolare la data di scadenza usando expiration
         * Inserire email come subject
         * Inserire userId come claim
         * Firmare il token con secretKey
         * Restituire il token come String
         */
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("role", user.getGlobalRole().name())
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(secretKey)
                .compact();
    }

    /*
     * L'utente viene recuperato dal DB solo quando servono dati completi
     * o controlli aggiornati. Per autorizzazioni semplici bastano i claims del token (il ruolo quindi).
     */

    /**
     * @return {@code true} se il token è valido, {@code false} altrimenti
     */
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public GlobalRole extractRole(String token) {
        return GlobalRole.valueOf(extractAllClaims(token).get("role", String.class));
    }

    public Long extractId(String token) {
        return (Long.valueOf(extractAllClaims(token).getSubject()));
    }

    private Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }


}
