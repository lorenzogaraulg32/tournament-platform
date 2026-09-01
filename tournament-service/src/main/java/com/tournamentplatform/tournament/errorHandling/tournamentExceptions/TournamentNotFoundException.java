package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURNAMENT_NOT_FOUND;


public class TournamentNotFoundException extends ApplicationException {
    public TournamentNotFoundException() {
        super(TOURNAMENT_NOT_FOUND);
    }
}
