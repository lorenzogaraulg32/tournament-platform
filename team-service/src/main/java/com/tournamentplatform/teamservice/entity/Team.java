package com.tournamentplatform.teamservice.entity;

import com.tournamentplatform.teamservice.entity.utils.GeoLocation;
import com.tournamentplatform.teamservice.entity.utils.RecruitmentStatus;
import com.tournamentplatform.teamservice.entity.utils.Sport;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @Column(name = "description")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl = null;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "recruitment_status",
            nullable = false,
            length = 10
    )
    private RecruitmentStatus status;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(
                    name = "label",
                    column = @Column(name = "location_label")
            ),
            @AttributeOverride(
                    name = "latitude",
                    column = @Column(name = "location_latitude")
            ),
            @AttributeOverride(
                    name = "longitude",
                    column = @Column(name = "location_longitude")
            )
    })
    private GeoLocation location;

    @Column(name = "invitation_code", nullable = false, unique = true)
    private String invitationCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "sport", nullable = false)
    private Sport sport;


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

    @Embedded
    private Formation formation;


    public Team(String name, String description, String creatorId, Set<String> playerIds, Set<String> adminIds, RecruitmentStatus status, GeoLocation location, String invitationCode, Sport sport) {
        this.name = name;
        this.description = description;
        this.creatorId = creatorId;
        this.playerIds = playerIds;
        this.adminIds = adminIds;
        this.status = status;
        this.location = location;
        this.invitationCode = invitationCode;
        this.sport = sport;
    }

}
