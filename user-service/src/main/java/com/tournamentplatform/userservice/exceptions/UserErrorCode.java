package com.tournamentplatform.userservice.exceptions;

public enum UserErrorCode implements ErrorCode {

    /* ENUM PER I CODICI DI ERRORE */

    USER_ALREADY_EXISTS(
            "USER_USER_ALREADY_EXISTS",
            "Esiste già un utente con questo id"
    ),

    USERNAME_ALREADY_REGISTERED(
            "USER_USERNAME_ALREADY_REGISTERED",
            "Lo username è già registrato"
    ),

    INVALID_SPORT_ROLES_CONFIG(
            "USER_INVALID_SPORT_ROLES_CONFIG",
            "La configurazione di sport e ruoli scelti non è valida"
    ),

    USER_NOT_FOUND(
            "USER_USER_NOT_FOUND",
            "Utente non trovato"
    ),

    USER_INVALID_PIC(
            "USER_INVALID_PIC",
            "La foto profilo selezionata non è valida"
    ),

    USER_TOO_LARGE_PIC(
            "USER_TOO_LARGE_PIC",
            "La foto profilo selezionata è troppo grande"
    ),

    USER_PIC_NOT_FOUND(
            "USER_PIC_NOT_FOUND",
            "La foto profilo non è stata trovata"
    ),

    USER_PIC_IO_ERROR(
            "USER_PIC_IO_ERROR",
            "Errore nello storage della foto profilo"
    );


    private final String code;
    private final String message;

    UserErrorCode(
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
