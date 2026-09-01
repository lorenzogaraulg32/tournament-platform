package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.USER_ALREADY_ADMIN;

public class UserAlreadyAdminException extends ApplicationException {
    public UserAlreadyAdminException() {
        super(USER_ALREADY_ADMIN);
    }
}
