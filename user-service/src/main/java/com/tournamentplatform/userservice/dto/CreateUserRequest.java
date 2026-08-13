package com.tournamentplatform.userservice.dto;


import com.tournamentplatform.userservice.entity.utils.Gender;
import com.tournamentplatform.userservice.entity.utils.Sport;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.Set;

public record CreateUserRequest(

        @NotBlank
        @Size(max = 20)
        String username,

        @NotBlank
        @Size(max = 20)
        String firstName,

        @NotBlank
        @Size(max = 20)
        String lastName,

        @NotNull
        @Past
        LocalDate birthDate,

        @NotNull
        Gender gender,

        @NotEmpty
        Set<Sport> sports,

        @Valid
        @NotEmpty
        Set<UserSportRoleRequest> roles,

        @Valid
        GeoLocationRequest location

) {
}