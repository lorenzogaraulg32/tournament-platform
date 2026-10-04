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
        printException(exception);

        return ResponseEntity
                .badRequest()
                .body(exception.getMessage());
    }

    @ExceptionHandler(MediaStorageException.class)
    public ResponseEntity<String> handleMediaStorage(
            MediaStorageException exception
    ) {
        printException(exception);

        return ResponseEntity
                .internalServerError()
                .body(exception.getMessage());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxUploadSize(
            MaxUploadSizeExceededException exception
    ) {
        printException(exception);

        return ResponseEntity
                .badRequest()
                .body(exception.getMessage());
    }


    @ExceptionHandler(MediaNotFoundException.class)
    public ResponseEntity<String> handleMediaNotFound(
            MediaNotFoundException exception
    ) {

        System.out.println("File not found");

        return ResponseEntity
                .notFound().build();
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(
            Exception exception
    ) {
        printException(exception);

        return ResponseEntity
                .internalServerError()
                .body(exception.getMessage());
    }


    private void printException(Exception e) {
        System.err.println("=== EXCEPTION ===");
        System.err.println("Type: " + e.getClass().getName());
        System.err.println("Message: " + e.getMessage());

        if (e.getCause() != null) {
            System.err.println("Cause: " + e.getCause().getClass().getName());
            System.err.println("Cause message: " + e.getCause().getMessage());
        }

        System.err.println("Stack trace:");
        e.printStackTrace(System.err);

        System.err.println("=================");
    }


}