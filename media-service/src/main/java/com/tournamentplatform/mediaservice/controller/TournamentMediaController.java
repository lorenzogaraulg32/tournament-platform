package com.tournamentplatform.mediaservice.controller;


import com.tournamentplatform.mediaservice.entity.MediaCategory;
import com.tournamentplatform.mediaservice.service.MediaService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;

@RestController
@RequestMapping("/internal/media/tournament")
@AllArgsConstructor
public class TournamentMediaController {

    private static final String PATH_PREFIX = "tournaments";

    private final MediaService mediaService;




    @PutMapping(
            value = "/{id}/logo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> putTournamentLogo(@PathVariable String id, @RequestParam("file") MultipartFile file) {

        mediaService.put(id, file, MediaCategory.TOURNAMENT_LOGO, PATH_PREFIX);

        return ResponseEntity.noContent().build();

    }

    @PutMapping(
            value = "/{id}/rules",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> putTournamentRules(@PathVariable String id, @RequestParam("file") MultipartFile file) {

        mediaService.put(id, file, MediaCategory.TOURNAMENT_RULES, PATH_PREFIX);

        return ResponseEntity.noContent().build();

    }



    @GetMapping("/{id}/logo")
    public ResponseEntity<Resource> getTournamentLogo(@PathVariable String id) {

        Resource resource =  mediaService.get(id, MediaCategory.TOURNAMENT_LOGO, PATH_PREFIX);

        MediaType contentType = MediaTypeFactory
                .getMediaType(resource)
                .orElse(APPLICATION_OCTET_STREAM);

        return ResponseEntity
                .ok()
                .contentType(contentType)
                .cacheControl(CacheControl.noStore())
                .body(resource);

    }

    @GetMapping("/{id}/rules")
    public ResponseEntity<Resource> getTournamentRules(@PathVariable String id) {

        Resource resource =  mediaService.get(id, MediaCategory.TOURNAMENT_RULES, PATH_PREFIX);

        MediaType contentType = MediaTypeFactory
                .getMediaType(resource)
                .orElse(APPLICATION_OCTET_STREAM);

        return ResponseEntity
                .ok()
                .contentType(contentType)
                .cacheControl(CacheControl.noStore())
                .body(resource);

    }



    @DeleteMapping("/{id}/logo")
    public ResponseEntity<Void> deleteTournamentLogo(@PathVariable String id){

        mediaService.delete(id, MediaCategory.TOURNAMENT_LOGO, PATH_PREFIX);

        return ResponseEntity.noContent().build();

    }

    @DeleteMapping("/{id}/rules")
    public ResponseEntity<Void> deleteTournamentRules(@PathVariable String id){

        mediaService.delete(id, MediaCategory.TOURNAMENT_RULES, PATH_PREFIX);

        return ResponseEntity.noContent().build();

    }
}