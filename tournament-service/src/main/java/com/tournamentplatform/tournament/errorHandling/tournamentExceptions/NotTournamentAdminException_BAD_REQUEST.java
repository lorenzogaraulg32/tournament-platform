package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.NOT_TOURNAMENT_ADMIN;

public class NotTournamentAdminException_BAD_REQUEST extends ApplicationException {
    public NotTournamentAdminException_BAD_REQUEST() {
        super(NOT_TOURNAMENT_ADMIN);
    }
}
