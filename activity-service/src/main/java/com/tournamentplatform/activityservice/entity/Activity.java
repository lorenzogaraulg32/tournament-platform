package com.tournamentplatform.activityservice.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "activities")
public class Activity {

    @Id
    private String id;
    private LocalDateTime issuedAt;

    //entità coinvolte
    private EntityReference actor;  //utente, squadra o torneo
    private EntityReference subject; // utente squadra o torneo

    private EntityReference context; //squadra o torneo
    //Azione svolta
    private Action action;

    //stringa aggiuntiva che indica alcuni valori
    private String details;

    @Getter
    @Setter
    public static class EntityReference {
        @NotBlank(message = "L'identificativo è obbligatorio")
        private String id;

        @NotBlank(message = "Il nome dell'entità è obbligatorio")
        private String entityName;

        @NotNull(message = "Il tipo dell'entità è obbligatorio")
        private EntityType type;
    }

    public enum EntityType {
        USER,
        TEAM,
        TOURNAMENT
    }

    public enum Action {
        JOINED_TEAM,
        LEFT_TEAM,
        MODIFIED_TEAM,
        DELETED_TEAM,
        CREATED_TEAM,
        REFRESHED_INVITATION_TEAM,
        JOINED_TOURNAMENT,
        LEFT_TOURNAMENT,
        REMOVED_TOURNAMENT_TEAM,
        CREATED_TOURNAMENT,
        MODIFIED_TOURNAMENT,
        DELETE_TOURNAMENT,
        UPDATED_TOURNAMENT_STATE,
        TOURNAMENT_PLACEMENT,
        PROMOTED_ADMIN,
        DEMOTED_ADMIN,
        MODIFIED_PROFILE,
        DELETED_PROFILE,
    }


}




