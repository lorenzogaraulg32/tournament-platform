package com.tournamentplatform.teamservice.errorHandling.imageExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.TEAM_TOO_LARGE_PIC;

public class ProfilePictureTooLargeException extends ApplicationException {
    public ProfilePictureTooLargeException() {
        super(TEAM_TOO_LARGE_PIC);
    }
}
