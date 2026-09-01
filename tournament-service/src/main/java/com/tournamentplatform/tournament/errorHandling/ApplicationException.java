package com.tournamentplatform.tournament.errorHandling;

import lombok.Getter;

/**
 * Rappresenta un eccezione generica, estendendo RuntimeException
 * <li> Code rappresenta un il codice dell'eccezione. Convenzione: SERVICE_ERROR
 *
 * <li> Message rappresenta il messaggio che restituiamo al frontend
 */
@Getter
public abstract class ApplicationException extends RuntimeException {

    private final ErrorCode code;

    protected ApplicationException(
            ErrorCode code
    ) {
        super(code.getMessage());
        this.code = code;
    }

}
