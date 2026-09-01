package com.tournamentplatform.teamservice.errorHandling;

public enum TeamErrorCode implements ErrorCode {

    /* ENUM PER I CODICI DI ERRORE */

    TEAM_NOT_FOUND(
            "TEAM_NOT_FOUND",
            "Team non trovato"
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
            "L'utente non fa parte della squadra"
    ),

    TEAM_INVALID_PIC(
            "TOURNAMENT_INVALID_PIC",
            "La foto profilo selezionata non è valida"
    ),

    TEAM_TOO_LARGE_PIC(
            "TOURNAMENT_TOO_LARGE_PIC",
            "La foto profilo selezionata è troppo grande"
    ),

    TEAM_PIC_NOT_FOUND(
            "TOURNAMENT_PIC_NOT_FOUND",
            "La foto profilo non è stata trovata"
    ),

    TEAM_PIC_IO_ERROR(
            "TOURNAMENT_PIC_IO_ERROR",
            "Errore nello storage della foto profilo"
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
