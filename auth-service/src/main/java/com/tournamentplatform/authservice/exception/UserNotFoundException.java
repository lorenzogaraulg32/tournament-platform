package com.tournamentplatform.authservice.exception;

public class UserNotFoundException  extends ApplicationException {

    public UserNotFoundException() {
        super(AuthErrorCode.USER_NOT_FOUND);
    }

}
