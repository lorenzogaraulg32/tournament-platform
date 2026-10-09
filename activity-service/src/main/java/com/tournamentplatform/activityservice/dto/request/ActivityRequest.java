package com.tournamentplatform.activityservice.dto.request;

import com.tournamentplatform.activityservice.entity.Activity;

public record ActivityRequest(
        String id, //Indica l'id dell'entità della quale vogliamo mostrare le attività
        Activity.EntityType entityType
) {
}
