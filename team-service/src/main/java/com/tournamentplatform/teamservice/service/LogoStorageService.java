package com.tournamentplatform.teamservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;

@Service
public class LogoStorageService {

    private static final long MAX_FILE_SIZE =
            2L * 1024 * 1024; // 2 MB

    private static final String PUBLIC_LOGO_PATH =
            "/teams/logos/";

    private final Path uploadDir;

    public LogoStorageService(
            @Value("${app.uploads.team-logos-dir}")
            String uploadDir
    ) {
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

    public String storeTeamLogo(
            Long teamId,
            MultipartFile file
    ) {
        if (teamId == null) {
            throw new IllegalArgumentException(
                    "L'ID della squadra è obbligatorio"
            );
        }

        validateFile(file);

        ImageFormat imageFormat = detectImageFormat(file);

        validateDeclaredContentType(
                file.getContentType(),
                imageFormat
        );

        String filename =
                "team-" +
                        teamId +
                        "-logo" +
                        imageFormat.getExtension();

        Path destination = uploadDir
                .resolve(filename)
                .normalize();

        // Protezione aggiuntiva contro percorsi esterni alla cartella.
        if (!destination.startsWith(uploadDir)) {
            throw new IllegalArgumentException(
                    "Percorso del logo non valido"
            );
        }

        try (
                InputStream inputStream =
                        file.getInputStream()
        ) {
            Files.copy(
                    inputStream,
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );


            deleteOtherTeamLogoFiles(
                    teamId,
                    filename
            );

            return PUBLIC_LOGO_PATH + filename;

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Errore durante il salvataggio del logo",
                    exception
            );
        }
    }

    public void deleteTeamLogo(Long teamId) {
        if (teamId == null) {
            return;
        }

        String pattern =
                "team-" + teamId + "-logo.*";

        try (
                DirectoryStream<Path> files =
                        Files.newDirectoryStream(
                                uploadDir,
                                pattern
                        )
        ) {
            for (Path file : files) {
                Files.deleteIfExists(file);
            }

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Errore durante l'eliminazione del logo",
                    exception
            );
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Il file del logo è vuoto"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "Il logo non può superare i 2 MB"
            );
        }
    }

    private ImageFormat detectImageFormat(
            MultipartFile file
    ) {
        try (
                InputStream inputStream =
                        file.getInputStream()
        ) {
            byte[] header =
                    inputStream.readNBytes(12);

            if (isPng(header)) {
                return ImageFormat.PNG;
            }

            if (isJpeg(header)) {
                return ImageFormat.JPEG;
            }

            if (isWebp(header)) {
                return ImageFormat.WEBP;
            }

            throw new IllegalArgumentException(
                    "Il file non è un'immagine PNG, JPEG o WEBP valida"
            );

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Impossibile leggere il file del logo",
                    exception
            );
        }
    }

    private void validateDeclaredContentType(
            String contentType,
            ImageFormat detectedFormat
    ) {
        /*
         * Alcuni client possono inviare null oppure
         * application/octet-stream. In quel caso ci basiamo
         * sul contenuto binario già analizzato.
         */
        if (
                contentType == null ||
                        contentType.isBlank() ||
                        contentType.equalsIgnoreCase(
                                "application/octet-stream"
                        )
        ) {
            return;
        }

        String normalizedContentType =
                contentType.toLowerCase(Locale.ROOT);

        if (
                !detectedFormat
                        .getAllowedContentTypes()
                        .contains(normalizedContentType)
        ) {
            throw new IllegalArgumentException(
                    "Il tipo dichiarato del file non corrisponde al suo contenuto"
            );
        }
    }

    private void deleteOtherTeamLogoFiles(
            Long teamId,
            String currentFilename
    ) throws IOException {
        String pattern =
                "team-" + teamId + "-logo.*";

        try (
                DirectoryStream<Path> files =
                        Files.newDirectoryStream(
                                uploadDir,
                                pattern
                        )
        ) {
            for (Path existingFile : files) {
                String existingFilename =
                        existingFile
                                .getFileName()
                                .toString();

                if (!existingFilename.equals(currentFilename)) {
                    Files.deleteIfExists(existingFile);
                }
            }
        }
    }

    private boolean isPng(byte[] header) {
        return header.length >= 8
                && (header[0] & 0xFF) == 0x89
                && header[1] == 0x50
                && header[2] == 0x4E
                && header[3] == 0x47
                && header[4] == 0x0D
                && header[5] == 0x0A
                && header[6] == 0x1A
                && header[7] == 0x0A;
    }

    private boolean isJpeg(byte[] header) {
        return header.length >= 3
                && (header[0] & 0xFF) == 0xFF
                && (header[1] & 0xFF) == 0xD8
                && (header[2] & 0xFF) == 0xFF;
    }

    private boolean isWebp(byte[] header) {
        if (header.length < 12) {
            return false;
        }

        String riff = new String(
                header,
                0,
                4,
                StandardCharsets.US_ASCII
        );

        String webp = new String(
                header,
                8,
                4,
                StandardCharsets.US_ASCII
        );

        return riff.equals("RIFF")
                && webp.equals("WEBP");
    }

    private enum ImageFormat {

        PNG(
                ".png",
                Set.of("image/png")
        ),

        JPEG(
                ".jpg",
                Set.of(
                        "image/jpeg",
                        "image/jpg"
                )
        ),

        WEBP(
                ".webp",
                Set.of("image/webp")
        );

        private final String extension;
        private final Set<String> allowedContentTypes;

        ImageFormat(
                String extension,
                Set<String> allowedContentTypes
        ) {
            this.extension = extension;
            this.allowedContentTypes =
                    allowedContentTypes;
        }

        public String getExtension() {
            return extension;
        }

        public Set<String> getAllowedContentTypes() {
            return allowedContentTypes;
        }
    }
}