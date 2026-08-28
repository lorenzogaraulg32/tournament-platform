package com.tournamentplatform.userservice.exceptions.userExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;
import com.tournamentplatform.userservice.exceptions.UserErrorCode;

public class UserNotFoundException extends ApplicationException {

    public UserNotFoundException() {
        super(UserErrorCode.USER_NOT_FOUND);
    }

}
