package com.tournamentplatform.teamservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "creator_id")
    private String creatorId;

    @ElementCollection
    @CollectionTable(
            name = "team_players",
            joinColumns = @JoinColumn(name = "team_id")
    )
    @Column(name = "player_id")
    private Set<String> playerIds = new HashSet<>();

    @ElementCollection
    @CollectionTable(
            name = "team_admins",
            joinColumns = @JoinColumn(name = "team_id")
    )
    @Column(name = "admin_id")
    private Set<String> adminIds = new HashSet<>();


}
