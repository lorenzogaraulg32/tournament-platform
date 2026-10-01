package com.tournamentplatform.mediaservice.service;

import com.tournamentplatform.mediaservice.entity.MediaCategory;
import com.tournamentplatform.mediaservice.exceptions.InvalidMediaFileException;
import com.tournamentplatform.mediaservice.exceptions.MediaStorageException;
import lombok.Getter;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;

@Component
public class MediaServiceHelper {

    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;

    public void saveFile(
            Path destination,
            MultipartFile file,
            MediaCategory category
    ) {

        MediaFormat format = validateFile(file, category);

        String mediaName = buildMediaName(category);
        String fileName = mediaName + format.getExtension();

        try {
            Files.createDirectories(destination);

            Path filePath = destination.resolve(fileName);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(
                        inputStream,
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

            deleteOtherMediaFiles(
                    destination,
                    mediaName,
                    fileName
            );

        } catch (IOException exception) {
            throw new MediaStorageException(
                    "Errore durante il salvataggio del file",
                    exception
            );
        }
    }


    public void deleteFile(
            Path destination,
            MediaCategory category
    ) {

        String mediaName = buildMediaName(category);

        try (
                DirectoryStream<Path> files =
                        Files.newDirectoryStream(
                                destination,
                                mediaName + ".*"
                        )
        ) {

            boolean deleted = false;

            for (Path file : files) {
                Files.deleteIfExists(file);
                deleted = true;
            }

            if (!deleted) {
                throw new InvalidMediaFileException(
                        "File non trovato"
                );
            }

        } catch (IOException exception) {
            throw new MediaStorageException(
                    "Errore durante l'eliminazione del file",
                    exception
            );
        }
    }

    public Path getFile(
            Path destination,
            MediaCategory category
    ) {

        String mediaName = buildMediaName(category);

        try (
                DirectoryStream<Path> files =
                        Files.newDirectoryStream(
                                destination,
                                mediaName + ".*"
                        )
        ) {

            for (Path file : files) {
                return file;
            }

            throw new InvalidMediaFileException(
                    "File non trovato"
            );

        } catch (IOException exception) {
            throw new MediaStorageException(
                    "Errore durante il recupero del file",
                    exception
            );
        }
    }

    private void deleteOtherMediaFiles(
            Path directory,
            String mediaName,
            String currentFileName
    ) throws IOException {

        try (
                DirectoryStream<Path> files =
                        Files.newDirectoryStream(
                                directory,
                                mediaName + ".*"
                        )
        ) {
            for (Path existingFile : files) {

                String existingFilename =
                        existingFile
                                .getFileName()
                                .toString();

                if (!existingFilename.equals(currentFileName)) {
                    Files.deleteIfExists(existingFile);
                }
            }
        }
    }


    private String buildMediaName(MediaCategory category) {

        switch (category) {
            case TEAM_LOGO, TOURNAMENT_LOGO -> {
                return "logo";
            }
            case USER_AVATAR -> {
                return "avatar";
            }
            case TOURNAMENT_RULES -> {
                return "rules";
            }
        }

        return null;
    }


    private MediaFormat validateFile(
            MultipartFile file,
            MediaCategory category
    ) {

        if (file == null || file.isEmpty()) {
            throw new InvalidMediaFileException("File vuoto");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidMediaFileException("File troppo grande");
        }

        MediaFormat format = detectMediaFormat(file);

        validateDeclaredContentType(
                file.getContentType(),
                format
        );

        validateFormatForCategory(
                category,
                format
        );

        return format;
    }


    private MediaFormat detectMediaFormat(
            MultipartFile file
    ) {

        try (InputStream inputStream = file.getInputStream()) {

            byte[] header = inputStream.readNBytes(12);

            if (isPng(header)) {
                return MediaFormat.PNG;
            }

            if (isJpeg(header)) {
                return MediaFormat.JPEG;
            }

            if (isWebp(header)) {
                return MediaFormat.WEBP;
            }

            if (isPdf(header)) {
                return MediaFormat.PDF;
            }

            throw new InvalidMediaFileException(
                    "Formato file non riconosciuto"
            );

        } catch (IOException exception) {
            throw new MediaStorageException(
                    "Errore durante la lettura del file",
                    exception
            );
        }
    }


    private void validateDeclaredContentType(
            String contentType,
            MediaFormat detectedFormat
    ) {

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
            throw new InvalidMediaFileException("Content Type invalido");
        }
    }

    private void validateFormatForCategory(
            MediaCategory category,
            MediaFormat format
    ) {

        switch (category) {

            case USER_AVATAR,
                 TEAM_LOGO,
                 TOURNAMENT_LOGO -> {

                if (
                        format != MediaFormat.PNG &&
                                format != MediaFormat.JPEG &&
                                format != MediaFormat.WEBP
                ) {
                    throw new InvalidMediaFileException(
                            "Formato immagine non supportato"
                    );
                }
            }

            case TOURNAMENT_RULES -> {

                if (format != MediaFormat.PDF) {
                    throw new InvalidMediaFileException(
                            "Il regolamento deve essere un PDF"
                    );
                }
            }
        }
    }

    @Getter
    private enum MediaFormat {

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
        ),

        PDF(
                ".pdf",
                Set.of("application/pdf")
        );

        private final String extension;
        private final Set<String> allowedContentTypes;

        MediaFormat(
                String extension,
                Set<String> allowedContentTypes
        ) {
            this.extension = extension;
            this.allowedContentTypes = allowedContentTypes;
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

    private boolean isPdf(byte[] header) {

        if (header.length < 5) {
            return false;
        }

        return header[0] == '%'
                && header[1] == 'P'
                && header[2] == 'D'
                && header[3] == 'F'
                && header[4] == '-';
    }

}
