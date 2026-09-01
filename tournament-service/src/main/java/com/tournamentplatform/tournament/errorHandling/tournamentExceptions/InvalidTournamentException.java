package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.INVALID_TOURNAMENT_FIELD;

public class InvalidTournamentException extends ApplicationException {
    public InvalidTournamentException() {
        super(INVALID_TOURNAMENT_FIELD);
    }
}
