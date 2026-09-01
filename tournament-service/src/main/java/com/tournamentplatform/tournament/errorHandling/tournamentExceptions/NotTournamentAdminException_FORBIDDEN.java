package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.NOT_TOURNAMENT_ADMIN;

public class NotTournamentAdminException_FORBIDDEN extends ApplicationException {
    public NotTournamentAdminException_FORBIDDEN() {
        super(NOT_TOURNAMENT_ADMIN);
    }
}
