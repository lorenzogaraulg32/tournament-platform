package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.TEAM_LOGO_ERROR;

@Getter
public class TeamLogoException extends ApplicationException {

    private final HttpStatus status;

    public TeamLogoException(HttpStatus status) {
        super(TEAM_LOGO_ERROR);
        this.status = status;
    }

}