package com.tournamentplatform.tournament.entity;

/**
 * Possibili stati del torneo:
 * <ul>
 *     <Li>Creazione preliminare (ancora non pubblicato)</li>
 *     <li>Registrazioni aperte</li>
 *     <li>Registrazioni chiuse</li>
 *     <li>Sorteggi in corso</li>
 *     <li>In corso</li>
 *     <li>Terminato</li>
 *     <li>Completato</li>
 *     <li>Cancellato</li>
 * </ul>
 */
public enum TournamentStatus {

    CREATED,
    REG_OPEN,
    REP_CLOSED,
    DRAFTING_MATCHES,
    IN_PROGRESS,
    ENDED,
    COMPLETED,
    CANCELLED
}
