package com.tournamentplatform.authservice.exception;

public class InvalidCredentialsUpdateException extends ApplicationException {

    public InvalidCredentialsUpdateException() {
        super(AuthErrorCode.INVALID_CREDENTIALS_UPDATE);
    }

}
