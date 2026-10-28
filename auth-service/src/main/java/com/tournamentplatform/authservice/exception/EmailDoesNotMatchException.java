package com.tournamentplatform.authservice.exception;

public class EmailDoesNotMatchException extends ApplicationException{

    public EmailDoesNotMatchException() {
        super(AuthErrorCode.EMAIL_DOES_NOT_MATCH);
    }

}
