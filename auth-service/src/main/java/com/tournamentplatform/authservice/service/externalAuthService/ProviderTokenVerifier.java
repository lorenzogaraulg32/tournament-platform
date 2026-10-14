package com.tournamentplatform.authservice.service.externalAuthService;

import com.tournamentplatform.authservice.entity.ExternalProvider;
import com.tournamentplatform.authservice.entity.VerifiedExternalIdentity;

public interface ProviderTokenVerifier {

    ExternalProvider provider();

    VerifiedExternalIdentity verify(String idToken);

}
