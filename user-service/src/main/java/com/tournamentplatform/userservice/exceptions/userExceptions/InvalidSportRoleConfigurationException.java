package com.tournamentplatform.userservice.exceptions.userExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;

import static com.tournamentplatform.userservice.exceptions.UserErrorCode.INVALID_SPORT_ROLES_CONFIG;

public class InvalidSportRoleConfigurationException extends ApplicationException {

    public InvalidSportRoleConfigurationException() {
        super(INVALID_SPORT_ROLES_CONFIG);
    }
}
