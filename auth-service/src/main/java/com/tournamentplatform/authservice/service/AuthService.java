package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.*;
import com.tournamentplatform.authservice.exception.EmailAlreadyRegisteredException;
import com.tournamentplatform.authservice.exception.InvalidCredentialsException;
import com.tournamentplatform.authservice.exception.UserDisabledException;
import com.tournamentplatform.authservice.exception.UserNotFoundException;
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


    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException();
        }

        String passwordHash = passwordEncoder.encode(request.password());

        userRepository.save(new User(request.email(), passwordHash, true, ROLE_USER));

        return new RegisterResponse("Utente registrato correttamente");

    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);


        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                jwtService.getExpiresIn() / 1000
        );
    }

    public UserResponse getUserInfo(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.isEnabled(),
                user.getGlobalRole()
        );
    }


}
