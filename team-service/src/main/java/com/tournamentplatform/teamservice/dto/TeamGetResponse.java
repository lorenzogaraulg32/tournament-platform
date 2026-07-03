package com.tournamentplatform.teamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TeamGetResponse {

    private Long id;

    private String name;

    private String logoUrl;

    private String creatorId;

    private Set<String> playerIds = new HashSet<>();

    private Set<String> adminIds = new HashSet<>();

}
