package com.tournamentplatform.authservice.exception;

public class InvalidCredentialsException extends ApplicationException {

    public InvalidCredentialsException() {
        super(AuthErrorCode.INVALID_CREDENTIALS);
    }

}
