package com.tournamentplatform.tournament.errorHandling.imageExceptions;


import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURNAMENT_TOO_LARGE_PIC;

public class ProfilePictureTooLargeException extends ApplicationException {
    public ProfilePictureTooLargeException() {
        super(TOURNAMENT_TOO_LARGE_PIC);
    }
}
