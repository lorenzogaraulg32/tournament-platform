package com.tournamentplatform.teamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TeamGetResponse {

    private Long id;

    private String name;

    private String logoUrl;

    private long numberOfPlayers;

}
