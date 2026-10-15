package com.tournamentplatform.authservice.exception;

import static com.tournamentplatform.authservice.exception.AuthErrorCode.EMAIL_ALREADY_REGISTERED_EXTERNAL;

public class EmailAlreadyRegisteredExternalException extends ApplicationException {
    public EmailAlreadyRegisteredExternalException() {
        super(EMAIL_ALREADY_REGISTERED_EXTERNAL);
    }
}
