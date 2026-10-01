package com.tournamentplatform.teamservice.errorHandling;

public enum TeamErrorCode implements ErrorCode {

    /* ENUM PER I CODICI DI ERRORE */

    TEAM_NOT_FOUND(
            "TEAM_NOT_FOUND",
            "Team non trovato"
    ),

    TEAM_NAME_ALREADY(
            "TEAM_NAME_ALREADY",
            "Esiste già una squadra con questo nome"
    ),

    ADMIN_REMOVES_ADMIN(
            "ADMIN_REMOVES_ADMIN",
            "Solo il creatore può rimuovere gli admin dalla squadra"
    ),

    USER_IS_NOT_ADMIN(
            "TEAM_USER_IS_NOT_ADMIN",
            "L'utente non è un amministratore della squadra, non può effettuare quest'operazione"
    ),

    USER_IS_NOT_OWNER(
            "TEAM_USER_IS_NOT_OWNER",
            "L'utente non è il creatore della squadra, non può effettuare quest'operazione"
    ),

    USER_IS_NOT_MEMBER_OF_TEAM(
            "TEAM_USER_IS_NOT_MEMBER_OF_TEAM",
            "L'utente non fa parte della squadra"
    ),

    OWNER_REMOVAL(
            "TEAM_OWNER_REMOVAL",
            "Impossibile rimuovere il proprietario della squadra"
    ),

    TEAM_LOGO_ERROR(
            "TEAM_LOGO_ERROR",
            "La foto profilo selezionata non è valida"
    );


    private final String code;
    private final String message;

    TeamErrorCode(
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
