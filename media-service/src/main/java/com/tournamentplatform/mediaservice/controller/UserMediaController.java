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
@RequestMapping("/internal/media/user")
@AllArgsConstructor
public class UserMediaController {

    private static final String PATH_PREFIX = "users";
    private final MediaService mediaService;

    @PutMapping(
            value = "/{id}/avatar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> putUserAvatar(@PathVariable String id, @RequestParam("file") MultipartFile file) {

        mediaService.put(id, file, MediaCategory.USER_AVATAR, PATH_PREFIX);

        return ResponseEntity.noContent().build();

    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<Resource> getUserAvatar(@PathVariable String id) {

        Resource resource =  mediaService.get(id, MediaCategory.USER_AVATAR, PATH_PREFIX);

        MediaType contentType = MediaTypeFactory
                .getMediaType(resource)
                .orElse(APPLICATION_OCTET_STREAM);

        return ResponseEntity
                .ok()
                .contentType(contentType)
                .cacheControl(CacheControl.noStore())
                .body(resource);

    }

    @DeleteMapping("/{id}/avatar")
    public ResponseEntity<Void> deleteUserAvatar(@PathVariable String id){

        mediaService.delete(id, MediaCategory.USER_AVATAR, PATH_PREFIX);

        return ResponseEntity.noContent().build();

    }

}