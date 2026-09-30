package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;


import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURNAMENT_NAME_ALREADY;

public class TournamentNameAlreadyExistsException extends ApplicationException {
    public TournamentNameAlreadyExistsException() {
        super(TOURNAMENT_NAME_ALREADY);
    }
}
