package com.tournamentplatform.authservice.service;

import com.tournamentplatform.authservice.dto.AuthResponse;
import com.tournamentplatform.authservice.dto.ExternalAuthRequest;
import com.tournamentplatform.authservice.entity.ExternalProviderIdentity;
import com.tournamentplatform.authservice.entity.User;
import com.tournamentplatform.authservice.exception.*;
import com.tournamentplatform.authservice.repository.UserRepository;
import com.tournamentplatform.authservice.service.externalAuthService.ExternalTokenVerifiers;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static com.tournamentplatform.authservice.entity.GlobalRole.ROLE_USER;

/** REGOLE DI BUSINESS
 *
 * Un utente può avere 1 solo servizio esterno collegato per volta,
 * e può modificarli tramite link/unlink quando ha una password impostata nel servizio di auth interno.
 *
 * Un utente registrato tramite provider esterno avrà impostata come mail quella del provider Esterno
 *
 * Un utente registrato tramite processo interno,
 * se vuole collegare un account esterno deve o modificare la sua email per matchare quella dell'auth service esterno,
 * quindi le due email devono essere uguali.
 *
 */
@Service
@AllArgsConstructor
public class ExternalProviderService {


    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ExternalTokenVerifiers externalTokenVerifiers;

    /**
     * Se l'utente risulta già registrato lo registra, altrimenti login
     * @param request richiesta di auth da parte di un provider esterno
     * @return
     */
    @Transactional
    public AuthResponse authenticateExternal(
            ExternalAuthRequest request
    ) {
        ExternalProviderIdentity identity =
                externalTokenVerifiers.verify(request);

        /*
            1) Verifichiamo se esiste già un utente con auth esterna uguale a quella ricevuta
            2) Verifichiamo se la mail dell
         */
        User user = userRepository
                .findByExternalProviderAndExternalSubject(
                        identity.provider(),
                        identity.subject()
                )
                .orElseGet(() -> registerExternal(identity));

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        return jwtService.generateAuthResponse(user);
    }

    private User registerExternal(
            ExternalProviderIdentity identity
    ) {
        if (userRepository.existsByEmail(identity.email())) {
            throw new EmailAlreadyRegisteredExternalException();
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
        ExternalProviderIdentity identity =
                externalTokenVerifiers.verify(request);

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        //la mail del provider esterno deve matchare con quella interna
        validateEmailMatch(user, identity);

        //caso in cui l'utente è già collegato a un provider esterno (max 1 per volta)
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

        //caso in cui il provider esterno è già collegato a un account
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

    @Transactional
    public void unlinkExternalProvider(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (!user.isEnabled()) {
            throw new UserDisabledException();
        }

        // 1. Verifica che esista un provider collegato
        if (!user.hasExternalAuthentication()) {
            throw new ExternalProviderNotLinkedException();
        }


        // 2. Verifica che esista un altro metodo di autenticazione
        if (!user.hasLocalAuthentication()) {
            throw new LastAuthMethodException();
        }

        // 3. Scollega il provider
        user.setExternalProvider(null);
        user.setExternalSubject(null);


    }

    private void validateEmailMatch(
            User user,
            ExternalProviderIdentity identity
    ) {
        if (!user.getEmail().equalsIgnoreCase(identity.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "L'email del provider esterno non coincide con quella JoinCup"
            );
        }
    }


}
