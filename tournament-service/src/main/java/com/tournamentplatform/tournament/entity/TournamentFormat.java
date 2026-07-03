package com.tournamentplatform.tournament.entity;

/**
 * Formato del torneo
 * Formati previsiti:
 * <ul>
 *     <li>Gironi</li>
 *     <li>Eliminazione diretta</li>
 *     <li>Gironi + Eliminazione diretta</li>
 * </ul>
 */
public enum TournamentFormat {
    GROUPS,
    KNOWCKOUT,
    GROUPS_AND_KNOCKOUT
}
