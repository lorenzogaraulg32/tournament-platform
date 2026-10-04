package com.tournamentplatform.mediaservice.service;

import com.tournamentplatform.mediaservice.entity.MediaCategory;
import com.tournamentplatform.mediaservice.exceptions.MediaNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class MediaService {

    private final MediaServiceHelper mediaServiceHelper;

    private final Path uploadDir;

    public MediaService(@Value("${app.storage.root-dir}") String uploadDir, MediaServiceHelper mediaServiceHelper) {

        this.mediaServiceHelper = mediaServiceHelper;

        this.uploadDir = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Impossibile creare la cartella dei loghi",
                    exception
            );
        }
    }


    public void put(String id, MultipartFile file, MediaCategory category, String pathPrefix) {

        Path destination = uploadDir
                .resolve(pathPrefix)
                .resolve(id)
                .normalize();


        mediaServiceHelper.saveFile(destination, file, category);


    }

    public Resource get(String id, MediaCategory category, String pathPrefix) {

        Path source = uploadDir
                .resolve(pathPrefix)
                .resolve(id)
                .normalize();


        Path filePath = mediaServiceHelper.getFile(source, category)
                .orElseThrow(() ->
                        new MediaNotFoundException(
                                "File non trovato"
                        )
                );
        

        return new FileSystemResource(filePath);

    }

    public void delete(String id, MediaCategory category, String pathPrefix) {

        Path destination = uploadDir
                .resolve(pathPrefix)
                .resolve(id)
                .normalize();


        mediaServiceHelper.deleteFile(destination, category);


    }


}
