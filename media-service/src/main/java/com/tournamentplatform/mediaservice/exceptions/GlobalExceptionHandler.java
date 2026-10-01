package com.tournamentplatform.mediaservice.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidMediaFileException.class)
    public ResponseEntity<String> handleInvalidMediaFile(
            InvalidMediaFileException exception
    ) {
        return ResponseEntity
                .badRequest()
                .body(exception.getMessage());
    }

    @ExceptionHandler(MediaStorageException.class)
    public ResponseEntity<String> handleMediaStorage(
            MediaStorageException exception
    ) {
        return ResponseEntity
                .internalServerError()
                .body(exception.getMessage());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxUploadSize(
            MaxUploadSizeExceededException exception
    ) {
        return ResponseEntity
                .badRequest()
                .body(exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(
            Exception exception
    ) {
        return ResponseEntity
                .internalServerError()
                .body(exception.getMessage());
    }
}