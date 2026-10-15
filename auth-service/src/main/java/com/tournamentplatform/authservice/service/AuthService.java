package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.*;
import com.tournamentplatform.authservice.entity.User;
import com.tournamentplatform.authservice.exception.*;
import com.tournamentplatform.authservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

import static com.tournamentplatform.authservice.entity.GlobalRole.ROLE_USER;

@Service
@AllArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException();
        }

        String passwordHash = passwordEncoder.encode(request.newPassword());

        userRepository.save(
                new User(
                        request.email(),
                        passwordHash,
                        true,
                        ROLE_USER
                )
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.hasLocalAuthentication() ||
                !passwordEncoder.matches(
                        request.password(),
                        user.getPasswordHash()
                )) {
            throw new InvalidCredentialsException();
        }

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        return jwtService.generateAuthResponse(user);
    }


    /**
     * Per il momento questo metodo non richiede verifiche di identità aggiuntive, si basa sul jwt che arriva con la request
     *
     * @param userId
     * @param request
     */
    @Transactional
    public void updateCredentials(Long userId, ModUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        boolean updateEmail = request.email() != null;
        boolean updatePassword = request.newPassword() != null;

        if (!updateEmail && !updatePassword) {
            throw new InvalidCredentialsUpdateException();
        }

        if (updateEmail) {

            String newEmail = request.email()
                    .trim()
                    .toLowerCase(Locale.ROOT);

            if (!newEmail.equals(user.getEmail())) {

                if (userRepository.existsByEmail(newEmail)) {
                    throw new EmailAlreadyRegisteredException();
                }
                user.setEmail(newEmail);
            }
        }


        if (updatePassword) {
            user.setPasswordHash(
                    passwordEncoder.encode(request.newPassword())
            );
        }


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

        Long id = Long.valueOf(userId);

        if (!userRepository.existsById(id)) {
            return;
        }

        userRepository.deleteById(id);
    }


}
