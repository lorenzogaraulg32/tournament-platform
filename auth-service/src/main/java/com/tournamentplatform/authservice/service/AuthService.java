package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.AuthResponse;
import com.tournamentplatform.authservice.dto.RegisterRequest;
import com.tournamentplatform.authservice.dto.UserResponse;
import com.tournamentplatform.authservice.user.User;
import com.tournamentplatform.authservice.user.UserRepository;
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


    public AuthResponse register(RegisterRequest request) throws IllegalArgumentException {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email già registrata");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username già registrato");
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = userRepository.save(new User(request.email(), passwordHash, request.username(), true, ROLE_USER));


        return new AuthResponse(
                jwtService.generateJwtToken(user),
                "Bearer",
                jwtService.getExpiration() / 1000,
                new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.isEnabled(),
                        user.getGlobalRole()
                )
        );
    }

}
