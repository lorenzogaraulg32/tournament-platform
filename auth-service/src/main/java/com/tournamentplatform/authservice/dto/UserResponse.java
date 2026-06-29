package com.tournamentplatform.authservice.dto;

import com.tournamentplatform.authservice.user.GlobalRole;

public record UserResponse (
        Long id,
        String username,
        String email,
        boolean enabled,
        GlobalRole globalRole
){
}
