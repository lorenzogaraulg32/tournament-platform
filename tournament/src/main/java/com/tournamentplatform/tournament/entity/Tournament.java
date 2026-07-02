package com.tournamentplatform.tournament.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Setter
@Getter
@Table(name = "tournaments")
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* INFORMAZIONI GENERALI */
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "created_by_user_id")
    private String createdByUserId;

    @ElementCollection
    @CollectionTable(
            name = "tournament_admins",
            joinColumns = @JoinColumn(name = "tournament_id")
    )
    @Column(name = "user_id")
    private List<String> adminsById = new ArrayList<>();

    /* DATE */
    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /* INDICAZIONI SQUADRE */

    @Column(name = "min_teams")
    private Integer minTeams;

    @Column(name = "max_teams")
    private Integer maxTeams;

    /* STATO TORNEO */
    @Enumerated(EnumType.STRING)
    @Column(name = "format", nullable = false)
    private TournamentFormat format;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TournamentStatus status = TournamentStatus.CREATED;

    //costruttore per la creazione dell'entity a partire dalla request
    public Tournament(String name, String description, String userId, ArrayList<String> adminsById, LocalDate startDate, LocalDate endDate, Integer minTeams, Integer maxTeams, TournamentFormat format) {
        this.name = name;
        this.description = description;
        this.createdByUserId = userId;
        this.adminsById = adminsById;
        this.startDate = startDate;
        this.endDate = endDate;
        this.minTeams = minTeams;
        this.maxTeams = maxTeams;
        this.format = format;
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) {
            this.status = TournamentStatus.CREATED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
