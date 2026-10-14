
package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.*;
import com.tournamentplatform.authservice.entity.User;
import com.tournamentplatform.authservice.entity.VerifiedExternalIdentity;
import com.tournamentplatform.authservice.exception.EmailAlreadyRegisteredException;
import com.tournamentplatform.authservice.exception.InvalidCredentialsException;
import com.tournamentplatform.authservice.exception.UserDisabledException;
import com.tournamentplatform.authservice.exception.UserNotFoundException;
import com.tournamentplatform.authservice.repository.UserRepository;
import com.tournamentplatform.authservice.service.externalAuthService.ExternalTokenVerifier;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static com.tournamentplatform.authservice.entity.GlobalRole.ROLE_USER;

@Service
@AllArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExternalTokenVerifier externalTokenVerifier;


    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException();
        }

        String passwordHash =
                passwordEncoder.encode(request.password());

        userRepository.save(
                new User(
                        request.email(),
                        passwordHash,
                        true,
                        ROLE_USER
                )
        );

        return new RegisterResponse(
                "Utente registrato correttamente"
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

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse authenticateExternal(
            ExternalAuthRequest request
    ) {
        VerifiedExternalIdentity identity =
                externalTokenVerifier.verify(request);

        User user = userRepository
                .findByExternalProviderAndExternalSubject(
                        identity.provider(),
                        identity.subject()
                )
                .orElseGet(() -> registerExternal(identity));

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        return generateAuthResponse(user);
    }

    private User registerExternal(
            VerifiedExternalIdentity identity
    ) {
        if (userRepository.existsByEmail(identity.email())) {
            throw new EmailAlreadyRegisteredException();
        }

        User user = new User(
                identity.email(),
                null,
                true,
                ROLE_USER
        );

        user.setExternalProvider(identity.provider());
        user.setExternalSubject(identity.subject());

        return userRepository.save(user);
    }

    @Transactional
    public void linkExternalProvider(
            Long userId,
            ExternalAuthRequest request
    ) {
        VerifiedExternalIdentity identity =
                externalTokenVerifier.verify(request);

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        if (user.hasExternalAuthentication()) {
            boolean sameIdentity =
                    user.getExternalProvider() == identity.provider()
                            && user.getExternalSubject()
                            .equals(identity.subject());

            if (sameIdentity) {
                return;
            }

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Un provider esterno è già collegato"
            );
        }

        boolean identityAlreadyLinked = userRepository
                .findByExternalProviderAndExternalSubject(
                        identity.provider(),
                        identity.subject()
                )
                .isPresent();

        if (identityAlreadyLinked) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Questo account esterno è già collegato"
            );
        }

        user.setExternalProvider(identity.provider());
        user.setExternalSubject(identity.subject());

        userRepository.save(user);
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

    private AuthResponse generateAuthResponse(User user) {

        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                jwtService.getExpiresIn() / 1000
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
