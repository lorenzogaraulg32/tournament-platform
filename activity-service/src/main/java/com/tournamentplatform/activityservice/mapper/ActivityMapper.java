package com.tournamentplatform.activityservice.mapper;

import com.tournamentplatform.activityservice.dto.request.ActivityRequestPOST;
import com.tournamentplatform.activityservice.dto.response.ActivityResponse;
import com.tournamentplatform.activityservice.entity.Activity;
import com.tournamentplatform.activityservice.entity.Activity.EntityReference;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Objects;

@Component
public class ActivityMapper {

    public ActivityResponse toResponse(Activity activity) {
        Objects.requireNonNull(activity, "L'attività è obbligatoria");

        return new ActivityResponse(
                activity.getId(),
                activity.getIssuedAt(),
                buildLabel(activity)
        );
    }

    public Activity toEntity(ActivityRequestPOST request) {
        Objects.requireNonNull(request, "La richiesta è obbligatoria");

        Activity activity = new Activity();

        activity.setIssuedAt(
                request.issuedAt() != null
                        ? request.issuedAt()
                        : LocalDateTime.now()
        );

        activity.setActor(request.actor());
        activity.setSubject(request.subject());
        activity.setContext(request.context());
        activity.setAction(request.action());
        activity.setDetails(request.details());

        return activity;
    }

    private String buildLabel(Activity activity) {
        Objects.requireNonNull(
                activity.getAction(),
                "L'azione è obbligatoria"
        );

        EntityReference actor = activity.getActor();
        EntityReference subject = activity.getSubject();
        EntityReference context = activity.getContext();

        String label = switch (activity.getAction()) {

            case JOINED_TEAM -> name(subject) + " è entrato nella squadra "
                    + name(context);

            case LEFT_TEAM -> name(subject) + " ha lasciato la squadra "
                    + name(context);

            case MODIFIED_TEAM -> name(actor) + " ha modificato la squadra "
                    + name(subject);

            case DELETED_TEAM -> name(actor) + " ha eliminato la squadra "
                    + name(subject);

            case CREATED_TEAM -> name(actor) + " ha creato la squadra "
                    + name(subject);

            case REFRESHED_INVITATION_TEAM -> name(actor)
                    + " ha rigenerato il codice di invito della squadra "
                    + name(subject);

            case JOINED_TOURNAMENT -> "La squadra " + name(subject)
                    + " si è iscritta al torneo "
                    + name(context);

            case LEFT_TOURNAMENT -> "La squadra " + name(subject)
                    + " si è ritirata dal torneo "
                    + name(context);

            case REMOVED_TOURNAMENT_TEAM -> name(actor) + " ha rimosso la squadra "
                    + name(subject) + " dal torneo "
                    + name(context);

            case CREATED_TOURNAMENT -> name(actor) + " ha creato il torneo "
                    + name(subject);

            case MODIFIED_TOURNAMENT -> name(actor) + " ha modificato il torneo "
                    + name(subject);

            case DELETE_TOURNAMENT -> name(actor) + " ha eliminato il torneo "
                    + name(subject);

            case UPDATED_TOURNAMENT_STATE -> name(actor) + " ha aggiornato lo stato del torneo "
                    + name(subject);

            case TOURNAMENT_PLACEMENT -> "La squadra " + name(subject)
                    + " ha ottenuto un piazzamento nel torneo "
                    + name(context);

            case PROMOTED_ADMIN -> name(actor) + " ha nominato "
                    + name(subject) + " amministratore"
                    + contextSuffix(context);

            case DEMOTED_ADMIN -> name(actor) + " ha revocato il ruolo di amministratore a "
                    + name(subject)
                    + contextSuffix(context);

            case MODIFIED_PROFILE -> name(actor) + " ha modificato il profilo di "
                    + name(subject);

            case DELETED_PROFILE -> name(actor) + " ha eliminato il profilo di "
                    + name(subject);
        };

        String details = activity.getDetails();

        return details == null || details.isBlank()
                ? label
                : label + ": " + details.strip();
    }

    private String name(EntityReference reference) {
        if (reference == null
                || reference.getEntityName() == null
                || reference.getEntityName().isBlank()) {

            throw new IllegalArgumentException(
                    "Manca il nome di un'entità richiesta dall'azione"
            );
        }

        return reference.getEntityName();
    }

    private String contextSuffix(EntityReference context) {
        if (context == null || context.getType() == null) {
            throw new IllegalArgumentException(
                    "Il contesto è obbligatorio per questa azione"
            );
        }

        return switch (context.getType()) {
            case TEAM -> " nella squadra " + name(context);
            case TOURNAMENT -> " nel torneo " + name(context);
            case USER -> throw new IllegalArgumentException(
                    "Il contesto deve essere una squadra o un torneo"
            );
        };
    }
}