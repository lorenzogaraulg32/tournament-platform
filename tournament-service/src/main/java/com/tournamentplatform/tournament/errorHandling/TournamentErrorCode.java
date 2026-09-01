package com.tournamentplatform.tournament.errorHandling;

public enum TournamentErrorCode implements ErrorCode {

    /* ENUM PER I CODICI DI ERRORE */

    TOURNAMENT_NOT_FOUND(
            "TOURNAMENT_NOT_FOUND",
            "Torneo non trovato"
    ),

    USER_ALREADY_ADMIN(
            "TOURNAMENT_USER_IS_ALREADY_ADMIN",
            "L'utente è già un'amministratore del torneo"
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



    TOURNAMENT_INVALID_PIC(
            "TOURNAMENT_INVALID_PIC",
            "La foto profilo selezionata non è valida"
    ),

    TOURNAMENT_TOO_LARGE_PIC(
            "TOURNAMENT_TOO_LARGE_PIC",
            "La foto profilo selezionata è troppo grande"
    ),

    TOURNAMENT_PIC_NOT_FOUND(
            "TOURNAMENT_PIC_NOT_FOUND",
            "La foto profilo non è stata trovata"
    ),

    TOURNAMENT_PIC_IO_ERROR(
            "TOURNAMENT_PIC_IO_ERROR",
            "Errore nello storage della foto profilo"
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
