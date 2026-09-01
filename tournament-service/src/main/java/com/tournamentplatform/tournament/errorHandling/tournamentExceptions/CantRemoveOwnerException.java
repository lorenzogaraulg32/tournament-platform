package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.CANT_REMOVE_OWNER;

public class CantRemoveOwnerException extends ApplicationException {
    public CantRemoveOwnerException() {
        super(CANT_REMOVE_OWNER);
    }
}
