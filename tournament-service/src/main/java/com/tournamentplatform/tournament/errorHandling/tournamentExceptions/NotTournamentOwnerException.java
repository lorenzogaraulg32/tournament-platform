package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.NOT_TOURNAMENT_OWNER;

public class NotTournamentOwnerException extends ApplicationException {
    public NotTournamentOwnerException() {
        super(NOT_TOURNAMENT_OWNER);
    }
}
