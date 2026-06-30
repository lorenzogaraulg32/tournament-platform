package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.*;
import com.tournamentplatform.authservice.excpetion.LoginException;
import com.tournamentplatform.authservice.user.User;
import com.tournamentplatform.authservice.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.tournamentplatform.authservice.user.GlobalRole.ROLE_USER;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email già registrata");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username già registrato");
        }

        String passwordHash = passwordEncoder.encode(request.password());

        userRepository.save(new User(request.email(), passwordHash, request.username(), true, ROLE_USER));

        return new RegisterResponse("Utente registrato correttamente");

    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new LoginException(
                        HttpStatus.UNAUTHORIZED,
                        "Dati di accesso non validi"
                ));


        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new LoginException(HttpStatus.UNAUTHORIZED, "Dati di accesso non validi");
        }

        if (!user.isEnabled()) {
            throw new LoginException(HttpStatus.UNAUTHORIZED, "Utente non abilitato");
        }

        return new AuthResponse(
                jwtService.generateJwtToken(user),
                "Bearer",
                jwtService.getExpiration() / 1000
        );
    }

    public UserResponse getUserInfo(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Nessun utente associato all'id")
                );

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.isEnabled(),
                user.getGlobalRole()
        );
    }


}
