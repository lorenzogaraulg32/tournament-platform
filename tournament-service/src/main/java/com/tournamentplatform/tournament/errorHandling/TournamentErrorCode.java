package com.tournamentplatform.tournament.errorHandling;

public enum TournamentErrorCode implements ErrorCode {

    /* ENUM PER I CODICI DI ERRORE */

    TOURNAMENT_NOT_FOUND(
            "TOURNAMENT_NOT_FOUND",
            "Torneo non trovato"
    ),

    TOURNAMENT_NAME_ALREADY(
            "TOURNAMENT_NAME_ALREADY",
            "Esiste già un torneo con questo nome"
    ),

    USER_ALREADY_ADMIN(
            "TOURNAMENT_USER_IS_ALREADY_ADMIN",
            "L'utente è già un'amministratore del torneo"
    ),

    TOURNAMENT_IN_PROGRESS(
            "TOURNAMENT_IN_PROGRESS",
            "Impossibile eliminare la squadra, è iscritta ad un torneo in corso"
    ),


    CANT_REMOVE_OWNER(
            "TOURNAMENT_CANT_REMOVE_OWNER",
            "Impossibile rimuovere il creatore del torneo dagli admin"
    ),

    NOT_TOURNAMENT_ADMIN(
            "TORUNAMENT_NOT_AN_ADMIN",
            "L'utente non è un amministratore del torneo"
    ),

    NOT_TOURNAMENT_OWNER(
            "TORUNAMENT_NOT_AN_OWNER",
            "L'utente non è il creatore del torneo"
    ),


    INVALID_TOURNAMENT_FIELD(
            "TORUNAMENT_INVALID_FIELD",
            "Il campo inserito nel torneo non è valido"
    ),



    TOURAMENT_LOGO_ERROR(
            "TOURAMENT_LOGO_ERROR",
            "Errore logo torneo"
    );



    private final String code;
    private final String message;

    TournamentErrorCode(
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
