package com.tournamentplatform.tournament.errorHandling.imageExceptions;


import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURNAMENT_INVALID_PIC;

public class InvalidProfilePictureException extends ApplicationException {
    public InvalidProfilePictureException() {
        super(TOURNAMENT_INVALID_PIC);
    }
}
