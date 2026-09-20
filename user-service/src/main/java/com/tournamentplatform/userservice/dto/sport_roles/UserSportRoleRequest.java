package com.tournamentplatform.userservice.dto.sport_roles;

import com.tournamentplatform.userservice.entity.utils.Sport;
import com.tournamentplatform.userservice.entity.utils.SportRole;
import jakarta.validation.constraints.NotNull;

public record UserSportRoleRequest(

        @NotNull
        Sport sport,

        @NotNull
        SportRole role

) {
}