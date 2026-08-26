package com.tournamentplatform.authservice.exception;

public class EmailAlreadyRegisteredException extends ApplicationException{

    public EmailAlreadyRegisteredException() {
        super(AuthErrorCode.EMAIL_ALREADY_REGISTERED);
    }

}
