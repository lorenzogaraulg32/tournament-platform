package com.tournamentplatform.authservice.service.externalAuthService;

import com.tournamentplatform.authservice.entity.ExternalProvider;
import com.tournamentplatform.authservice.entity.ExternalProviderIdentity;

public interface ProviderTokenVerifier {

    ExternalProvider provider();

    ExternalProviderIdentity verify(String idToken);

}
