package com.tournamentplatform.authservice.exception;

public class UserDisabledException  extends ApplicationException {

    public UserDisabledException() {
        super(AuthErrorCode.USER_DISABLED);
    }

}
