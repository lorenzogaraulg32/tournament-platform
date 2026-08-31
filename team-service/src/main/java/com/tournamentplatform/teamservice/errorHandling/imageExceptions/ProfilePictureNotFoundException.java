package com.tournamentplatform.teamservice.errorHandling.imageExceptions;


import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.TEAM_PIC_NOT_FOUND;

public class ProfilePictureNotFoundException extends ApplicationException {
    public ProfilePictureNotFoundException() {
        super(TEAM_PIC_NOT_FOUND);
    }
}
