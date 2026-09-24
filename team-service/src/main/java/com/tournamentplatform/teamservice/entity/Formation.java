package com.tournamentplatform.teamservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Embeddable
@Getter
@Setter
@NoArgsConstructor

public class Formation {

    @Column(name = "formation_name")
    String name;


    @ElementCollection
    @CollectionTable(
            name = "team_formation_slots",
            joinColumns = @JoinColumn(name = "team_id")
    )
    @MapKeyColumn(name = "role")
    @Column(name = " player_id", nullable = false)
    Map<String, String> slotAssignment = new HashMap<>();

    @ElementCollection
    @CollectionTable(
            name = "team_bench_order",
            joinColumns = @JoinColumn(name = "team_id")
    )
    @OrderColumn(name = "order_position")
    @Column(name = "player_id", nullable = false)
    private List<String> benchOrder = new ArrayList<>();
}
