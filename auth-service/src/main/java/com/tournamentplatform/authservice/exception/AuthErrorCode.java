package com.tournamentplatform.authservice.exception;

public enum AuthErrorCode implements ErrorCode {

    /* ENUM PER I CODICI DI ERRORE */

    INVALID_CREDENTIALS(
            "AUTH_INVALID_CREDENTIALS",
            "Dati di accesso non validi"
    ),

    INVALID_CREDENTIALS_UPDATE(
            "AUTH_INVALID_CREDENTIALS",
            "Nessuna modifica specificata"
    ),

    EMAIL_ALREADY_REGISTERED(
            "AUTH_EMAIL_ALREADY_REGISTERED",
            "L'indirizzo email è già registrato"
    ),

    EMAIL_ALREADY_REGISTERED_EXTERNAL(
            "AUTH_EMAIL_ALREADY_REGISTERED_EXTERNAL",
            "L'indirizzo email è già registrato, effettua il login e collegalo al provider esterno nella sezione profilo"
    ),

    EXTERNAL_PROVIDER_NOT_LINKED(
            "EXTERNAL_PROVIDER_NOT_LINKED",
            "Il profilo non ha un provider di autenticazione esterno associato al suo account"
    ),

    LAST_AUTH_METHOD(
            "LAST_AUTH_METHOD",
            "Il profilo non ha un altro metodo di autenticazione"
    ),

    USER_DISABLED(
            "AUTH_USER_DISABLED",
            "L'utente non è abilitato"
    ),

    USER_NOT_FOUND(
            "AUTH_USER_NOT_FOUND",
            "Utente non trovato"
    ),


    INVALID_CURRENT_PASSWORD_MOD(
            "INVALID_CURRENT_PASSWORD_MOD",
            "La vecchia password non è corretta"
    ),

    EMAIL_DOES_NOT_MATCH(
            "EMAIL_DOES_NOT_MATCH",
                    "La mail del provider esterno non corrisponde a quella che utilizza il tuo account."
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
