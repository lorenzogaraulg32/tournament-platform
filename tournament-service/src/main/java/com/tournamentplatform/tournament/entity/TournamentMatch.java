package com.tournamentplatform.tournament.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "tournament_matches",
        indexes = {
                @Index(
                        name = "idx_match_tournament",
                        columnList = "tournament_id"
                )
        }
)
@Getter
@Setter
public class TournamentMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(name = "team1_id", nullable = false)
    private Long team1Id;

    @Column(name = "team2_id", nullable = false)
    private Long team2Id;
}