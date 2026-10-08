package com.tournamentplatform.activityservice.entity.tournament_authorities;

import com.tournamentplatform.activityservice.entity.Activity;
import com.tournamentplatform.activityservice.entity.AuthorityActivities;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "tournament_authority_activities")
public class TournamentAuthorityActivity extends Activity {


    private long userId;
    private long tournamentId;

    @Enumerated(EnumType.STRING)
    private AuthorityActivities tipo;

    public TournamentAuthorityActivity(
            long userId,
            long tournamentId,
            AuthorityActivities tipo,
            UUID eventId

    ) {
        super(eventId);
        this.userId = userId;
        this.tournamentId = tournamentId;
        this.tipo = tipo;
    }

}
