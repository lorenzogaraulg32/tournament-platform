package com.tournamentplatform.activityservice.entity.tournament_placements;


import com.tournamentplatform.activityservice.entity.Activity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "tournament_placement_activities")
@NoArgsConstructor
public class TournamentPlacementActivity extends Activity {

    private long teamId;
    private long tournamentId;
    //Il piazzamento è salvato nel tournament-service, non serve qua

    public TournamentPlacementActivity(
            long teamId,
            long tournamentId,
            UUID eventId
    ) {
        super(eventId);
        this.teamId = teamId;
        this.tournamentId = tournamentId;
    }


}
