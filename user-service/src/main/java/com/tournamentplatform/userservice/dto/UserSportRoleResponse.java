package com.tournamentplatform.userservice.dto;

import com.tournamentplatform.userservice.entity.utils.Sport;
import com.tournamentplatform.userservice.entity.utils.SportRole;

public record UserSportRoleResponse(
        Sport sport,
        SportRole role
) {
}