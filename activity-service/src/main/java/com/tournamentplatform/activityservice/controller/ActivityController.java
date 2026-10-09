package com.tournamentplatform.activityservice.controller;

import com.tournamentplatform.activityservice.dto.request.ActivityRequest;
import com.tournamentplatform.activityservice.dto.request.ActivityRequestPOST;
import com.tournamentplatform.activityservice.dto.response.ActivityResponse;
import com.tournamentplatform.activityservice.entity.Activity;
import com.tournamentplatform.activityservice.service.ActivityService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/activities")
@AllArgsConstructor
public class ActivityController {


    private final ActivityService service;


    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getActivities(
            @RequestParam("entityId") String entityId,
            @RequestParam("entityType") Activity.EntityType entityType,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        if (entityId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "L'identificativo dell'entità è obbligatorio"
            );
        }

        if (page < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La pagina non può essere negativa"
            );
        }

        if (size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La dimensione della pagina deve essere compresa tra 1 e 100"
            );
        }

        ActivityRequest request = new ActivityRequest(entityId, entityType);

        return ResponseEntity.ok(
                service.getActivityByEntity(request, page, size)
        );

    }


    @PostMapping("/internal")
    public ResponseEntity<Void> postActivity(
            @RequestBody @Valid ActivityRequestPOST request
    ) {
        service.postActivity(request);
        return ResponseEntity.ok().build();

    }
}
