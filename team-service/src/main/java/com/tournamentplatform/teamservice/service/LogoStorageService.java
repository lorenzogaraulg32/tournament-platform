package com.tournamentplatform.teamservice.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;


@Service
public class LogoStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".png", ".jpg", ".jpeg", ".webp");

    private final Path uploadDir;

    public LogoStorageService(@Value("${app.uploads.team-logos-dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir);
    }

    public String storeTeamLogo(String teamId, MultipartFile file){

        //controllo se vuoto
        if(file == null || file.isEmpty()){
            throw new IllegalArgumentException("Il file del logo è vuoto");
        }

        //controllo il tipo di file
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Il file deve essere un'immagine");
        }

        //controllo l'estensione
        String extension = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Formato immagine non supportato");
        }

        try{
            Files.createDirectories(uploadDir);
            String filename = "team-" + teamId + "-" + "logo" + extension;
            Path dest =  uploadDir.resolve(filename);


            file.transferTo(dest);

            return "/uploads/team-logos/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Errore durante il salvataggio del logo", e);
        }
    }


    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}
