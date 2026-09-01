package com.tournamentplatform.tournament.errorHandling.imageExceptions;



import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURNAMENT_PIC_NOT_FOUND;

public class ProfilePictureNotFoundException extends ApplicationException {
    public ProfilePictureNotFoundException() {
        super(TOURNAMENT_PIC_NOT_FOUND);
    }
}
