package com.tournamentplatform.teamservice.errorHandling.imageExceptions;


import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.TEAM_PIC_IO_ERROR;

public class ProfilePictureStorageException extends ApplicationException {
    public ProfilePictureStorageException() {
        super(TEAM_PIC_IO_ERROR);
    }
}
