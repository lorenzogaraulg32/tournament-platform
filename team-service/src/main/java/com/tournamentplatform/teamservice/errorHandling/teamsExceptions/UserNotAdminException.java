package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.USER_IS_NOT_ADMIN;


public class UserNotAdminException extends ApplicationException {

    public UserNotAdminException() {
        super(USER_IS_NOT_ADMIN);
    }
}
