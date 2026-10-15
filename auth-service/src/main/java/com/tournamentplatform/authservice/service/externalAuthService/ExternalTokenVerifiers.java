
package com.tournamentplatform.authservice.service.externalAuthService;

import com.tournamentplatform.authservice.dto.ExternalAuthRequest;
import com.tournamentplatform.authservice.entity.ExternalProviderIdentity;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


/**
 * Questo componente rappresenta la lista di verifiers
 * Vengono creati automaticamente tutti i bean che estendono l'interfaccia.
 */
@Component
@AllArgsConstructor
public class ExternalTokenVerifiers {

    private final List<ProviderTokenVerifier> verifiers;


    /**
     * Verifica la richiesta di autenticazione di un provider esterno, in maniera generica senza bisogno di specificare quale.
     * Se il provider non è supportato lancia 400
     * Delega la verifica al provider.
     * @param request richiesta di autenticazione di un provider esterno
     * @return
     */
    public ExternalProviderIdentity verify(
            ExternalAuthRequest request
    ) {
        ProviderTokenVerifier verifier = verifiers.stream()
                .filter(v -> v.provider() == request.provider())
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Provider non supportato"
                ));

        return verifier.verify(request.idToken());
    }
}
