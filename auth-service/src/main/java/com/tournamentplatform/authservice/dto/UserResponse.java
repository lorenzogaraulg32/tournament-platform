package com.tournamentplatform.authservice.dto;

import com.tournamentplatform.authservice.entity.ExternalProvider;
import com.tournamentplatform.authservice.entity.GlobalRole;

public record UserResponse (
        Long id,
        String email,
        boolean enabled,
        boolean hasLocalAuthentication,
        ExternalProvider externalProvider
){
}
