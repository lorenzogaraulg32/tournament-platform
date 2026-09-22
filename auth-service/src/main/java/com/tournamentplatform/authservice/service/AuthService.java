package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.*;
import com.tournamentplatform.authservice.exception.EmailAlreadyRegisteredException;
import com.tournamentplatform.authservice.exception.InvalidCredentialsException;
import com.tournamentplatform.authservice.exception.UserDisabledException;
import com.tournamentplatform.authservice.exception.UserNotFoundException;
import com.tournamentplatform.authservice.entity.User;
import com.tournamentplatform.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.tournamentplatform.authservice.entity.GlobalRole.ROLE_USER;

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


    @Transactional
    public void deleteUser(String userId) {

        if (!userRepository.existsById(Long.valueOf(userId))) {
            return;
        }

        userRepository.deleteById(Long.valueOf(userId));
    }


}
