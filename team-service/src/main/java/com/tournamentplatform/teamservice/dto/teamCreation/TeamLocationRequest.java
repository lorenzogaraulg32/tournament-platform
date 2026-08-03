package com.tournamentplatform.teamservice.dto.teamCreation;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class TeamLocationRequest {

    @NotBlank(message = "La posizione è obbligatoria")
    @Size(
            max = 120,
            message = "La posizione non può superare i 120 caratteri"
    )
    private String label;

    @NotNull(message = "La latitudine è obbligatoria")
    @DecimalMin(
            value = "-90.0",
            message = "La latitudine non è valida"
    )
    @DecimalMax(
            value = "90.0",
            message = "La latitudine non è valida"
    )
    private BigDecimal latitude;

    @NotNull(message = "La longitudine è obbligatoria")
    @DecimalMin(
            value = "-180.0",
            message = "La longitudine non è valida"
    )
    @DecimalMax(
            value = "180.0",
            message = "La longitudine non è valida"
    )
    private BigDecimal longitude;
}