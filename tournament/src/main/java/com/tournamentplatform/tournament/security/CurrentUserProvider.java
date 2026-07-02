package com.tournamentplatform.tournament.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;



@Component
public class CurrentUserProvider {

    public String getCurretUserId(){

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Utente non autorizzato per l'operazione");
        }

        return authentication.getName();


    }
}
