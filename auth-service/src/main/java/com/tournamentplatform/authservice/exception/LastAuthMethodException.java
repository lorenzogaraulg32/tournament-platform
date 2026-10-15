package com.tournamentplatform.authservice.exception;

import static com.tournamentplatform.authservice.exception.AuthErrorCode.EMAIL_ALREADY_REGISTERED_EXTERNAL;
import static com.tournamentplatform.authservice.exception.AuthErrorCode.LAST_AUTH_METHOD;

public class LastAuthMethodException extends ApplicationException {
    public LastAuthMethodException() {
        super(LAST_AUTH_METHOD);
    }
}
