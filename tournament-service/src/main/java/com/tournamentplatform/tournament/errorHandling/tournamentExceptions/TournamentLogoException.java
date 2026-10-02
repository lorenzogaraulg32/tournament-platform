package com.tournamentplatform.tournament.errorHandling.tournamentExceptions;

import com.tournamentplatform.tournament.errorHandling.ApplicationException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static com.tournamentplatform.tournament.errorHandling.TournamentErrorCode.TOURAMENT_LOGO_ERROR;


@Getter
public class TournamentLogoException extends ApplicationException {

    private final HttpStatus status;

    public TournamentLogoException(HttpStatus status) {
        super(TOURAMENT_LOGO_ERROR);
        this.status = status;
    }

}