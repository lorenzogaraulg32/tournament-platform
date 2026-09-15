package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.TEAM_NAME_ALREADY;

public class TeamNameAlreadyExistsException extends ApplicationException {
    public TeamNameAlreadyExistsException() {
        super(TEAM_NAME_ALREADY);
    }
}
