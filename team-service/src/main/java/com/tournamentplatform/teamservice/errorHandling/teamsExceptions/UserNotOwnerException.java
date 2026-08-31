package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.USER_IS_NOT_OWNER;


public class UserNotOwnerException extends ApplicationException {

    public UserNotOwnerException() {
        super(USER_IS_NOT_OWNER);
    }
}
