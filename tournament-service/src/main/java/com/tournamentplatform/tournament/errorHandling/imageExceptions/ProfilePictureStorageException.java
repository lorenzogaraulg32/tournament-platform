package com.tournamentplatform.tournament.errorHandling.imageExceptions;


import com.tournamentplatform.tournament.errorHandling.ApplicationException;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURNAMENT_PIC_IO_ERROR;

public class ProfilePictureStorageException extends ApplicationException {
    public ProfilePictureStorageException() {
        super(TOURNAMENT_PIC_IO_ERROR);
    }
}
