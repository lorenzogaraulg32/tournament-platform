package com.tournamentplatform.authservice.entity;

/**
 * Rappresenta l'identità di un utente dopo la verifica con il provider esterno
 * @param provider l'ente che fornisce la validazione ( google, apple ecc.)
 * @param subject il token
 * @param email l'email
 */
public record ExternalProviderIdentity(
        ExternalProvider provider,
        String subject,
        String email
) {
}
