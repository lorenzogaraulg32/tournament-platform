
package com.tournamentplatform.authservice.service.externalAuthService;

import com.tournamentplatform.authservice.dto.ExternalAuthRequest;
import com.tournamentplatform.authservice.entity.VerifiedExternalIdentity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Component
public class ExternalTokenVerifier {

    private final List<ProviderTokenVerifier> verifiers;

    public ExternalTokenVerifier(
            List<ProviderTokenVerifier> verifiers
    ) {
        this.verifiers = verifiers;
    }

    public VerifiedExternalIdentity verify(
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
