package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.AuthResponse;
import com.tournamentplatform.authservice.dto.RegisterRequest;
import com.tournamentplatform.authservice.dto.UserResponse;
import com.tournamentplatform.authservice.user.AppUser;
import com.tournamentplatform.authservice.user.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.tournamentplatform.authservice.user.GlobalRole.ROLE_USER;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(JwtService jwtService, AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public AuthResponse register(RegisterRequest request) throws IllegalArgumentException {
        if (appUserRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email già registrata");
        }
        if (appUserRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username già registrato");
        }

        //hashing della password
        String passwordHash = passwordEncoder.encode(request.password());

        //salvataggio utente nel db e generazione ID
        AppUser user = appUserRepository.save(new AppUser(request.email(), passwordHash, request.username(), true, ROLE_USER));

        //creazione userResponse
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.isEnabled(),
                user.getGlobalRole()
        );

        //creazione auth response
        return new AuthResponse(
                jwtService.generateJwtToken(user),
                "Bearer",
                jwtService.getExpiration() / 1000,
                userResponse
        );
    }

}
