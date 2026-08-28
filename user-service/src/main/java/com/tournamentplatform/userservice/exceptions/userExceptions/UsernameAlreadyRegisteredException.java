package com.tournamentplatform.userservice.exceptions.userExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;
import com.tournamentplatform.userservice.exceptions.UserErrorCode;

public class UsernameAlreadyRegisteredException extends ApplicationException {

    public UsernameAlreadyRegisteredException() {
        super(UserErrorCode.USERNAME_ALREADY_REGISTERED);
    }

}
