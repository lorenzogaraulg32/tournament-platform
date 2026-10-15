package com.tournamentplatform.authservice.exception;

import static com.tournamentplatform.authservice.exception.AuthErrorCode.EXTERNAL_PROVIDER_NOT_LINKED;

public class ExternalProviderNotLinkedException extends ApplicationException {
    public ExternalProviderNotLinkedException() {
        super(EXTERNAL_PROVIDER_NOT_LINKED);
    }
}
