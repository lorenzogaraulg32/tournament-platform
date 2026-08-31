package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.TEAM_NOT_FOUND;


public class TeamNotFoundException extends ApplicationException {

    public TeamNotFoundException() {
        super(TEAM_NOT_FOUND);
    }
}
