package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;
import com.tournamentplatform.tournament.errorHandling.ErrorCode;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURNAMENT_IN_PROGRESS;

public class TournamentInProgressException extends ApplicationException {
    public TournamentInProgressException() {
        super(TOURNAMENT_IN_PROGRESS);
    }
}
