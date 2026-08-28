package com.tournamentplatform.userservice.exceptions.userExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;
import com.tournamentplatform.userservice.exceptions.UserErrorCode;

public class UserAlreadyExistException extends ApplicationException {
    public UserAlreadyExistException() {
        super(UserErrorCode.USER_ALREADY_EXISTS);
    }
}
