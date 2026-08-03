package com.tournamentplatform.teamservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter

@NoArgsConstructor
public class Team {


    private static final String DEFAULT_TEAM_LOGO_URL = "/uploads/team-logos/default_team_logo.png";

    //Open -> accetta nuovi partecipanti
    //closed -> non accetta nuovi partecipanti
    public enum RecruitmentStatus {
        OPEN,
        CLOSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;


    @Column(name = "logo_url", length = 500)
    private String logoUrl = null;

    @Column(name = "creator_id")
    private String creatorId;

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ElementCollection
    @CollectionTable(
            name = "team_players",
            joinColumns = @JoinColumn(name = "team_id")
    )
    @Column(name = "player_id")
    private Set<String> playerIds = new HashSet<>();

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ElementCollection
    @CollectionTable(
            name = "team_admins",
            joinColumns = @JoinColumn(name = "team_id")
    )
    @Column(name = "admin_id")
    private Set<String> adminIds = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(
            name = "recruitment_status",
            nullable = false,
            length = 10
    )
    private RecruitmentStatus status;

    @Column(name = "location_label", length = 120)
    private String locationLabel;

    @Column(
            name = "latitude",
            precision = 9,
            scale = 6
    )
    private BigDecimal latitude;

    @Column(
            name = "longitude",
            precision = 9,
            scale = 6
    )
    private BigDecimal longitude;


    public Team(String name, String description, String creatorId, Set<String> playerIds, Set<String> adminIds, RecruitmentStatus status, String locationLabel, BigDecimal latitude, BigDecimal longitude) {
        this.name = name;
        this.description = description;
        this.creatorId = creatorId;
        this.playerIds = playerIds;
        this.adminIds = adminIds;
        this.status = status;
        this.locationLabel = locationLabel;
        this.latitude = latitude;
        this.longitude = longitude;
    }

}
