package com.tournamentplatform.authservice.exception;

public class InvalidCurrentPasswordException extends ApplicationException {

    public InvalidCurrentPasswordException() {
        super(AuthErrorCode.INVALID_CURRENT_PASSWORD_MOD);
    }

}
