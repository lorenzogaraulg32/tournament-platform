package com.tournamentplatform.teamservice.errorHandling.imageExceptions;


import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.TEAM_INVALID_PIC;

public class InvalidProfilePictureException extends ApplicationException {
    public InvalidProfilePictureException() {
        super(TEAM_INVALID_PIC);
    }
}
