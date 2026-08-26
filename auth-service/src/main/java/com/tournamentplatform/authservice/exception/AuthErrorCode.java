package com.tournamentplatform.authservice.exception;

public enum AuthErrorCode implements ErrorCode {

    /* ENUM PER I CODICI DI ERRORE */

    INVALID_CREDENTIALS(
            "AUTH_INVALID_CREDENTIALS",
            "Dati di accesso non validi"
    ),

    EMAIL_ALREADY_REGISTERED(
            "AUTH_EMAIL_ALREADY_REGISTERED",
            "L'indirizzo email è già registrato"
    ),

    USER_DISABLED(
            "AUTH_USER_DISABLED",
            "L'utente non è abilitato"
    ),

    USER_NOT_FOUND(
            "AUTH_USER_NOT_FOUND",
            "Utente non trovato"
    );


    private final String code;
    private final String message;

    AuthErrorCode(
            String code,
            String message
    ) {
        this.code = code;
        this.message = message;
    }


    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }




}
