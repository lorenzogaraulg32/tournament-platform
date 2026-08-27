package com.tournamentplatform.authservice.exception;

import com.tournamentplatform.authservice.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.*;


/**
 * Per tutti gli handler:
 * <li>ApplicationException indica la nostra eccezione custom</li>
 * <li>HttpServletRequest contiene le informazioni sulla request che ha generato l'errore</li>
 */


@RestControllerAdvice
public class GlobalExceptionHandler {


    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /*----------------- BUILDERs DELLE ECCEZIONI IN ApiResponseError -------------------*/

    /**
     * Costruisce la risposta per le eccezioni applicative custom.
     */
    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            ApplicationException exception,
            HttpServletRequest request
    ) {
        String traceId = UUID.randomUUID().toString();
        String code = exception.getCode().getCode();
        String path = request.getRequestURI();

        log.error("""
                        Errore applicativo:
                                 traceId: {}
                                 status: {}
                                 code: {}
                                 path: {}
                        """,
                traceId,
                status.value(),
                code,
                path
        );


        ApiErrorResponse response = new ApiErrorResponse(
                Instant.now(),
                status.value(),
                code,
                exception.getMessage(),
                Map.of(),
                path,
                traceId
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }


    /**
     * Costruisce la risposta comune anche per le eccezioni generate da Spring.
     */
    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            String code,
            String message,
            Map<String, List<String>> errors,
            HttpServletRequest request,
            Exception exception
    ) {
        String traceId = UUID.randomUUID().toString();
        String path = request.getRequestURI();

        if (status.is5xxServerError()) {
            log.error("""
                            Errore interno:
                              traceId: {}
                              status: {}
                              code: {}
                              path: {}
                            """,
                    traceId,
                    status.value(),
                    code,
                    path,
                    exception
            );
        } else {
            log.error("""
                            Errore gestito:
                              traceId: {}
                              status: {}
                              code: {}
                              path: {}
                            """,
                    traceId,
                    status.value(),
                    code,
                    path
            );
        }

        ApiErrorResponse response = new ApiErrorResponse(
                Instant.now(),
                status.value(),
                code,
                message,
                errors,
                path,
                traceId
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }



    /*----------------- Gestione eccezioni applicative custom  -------------------*/


    @ExceptionHandler({
            InvalidCredentialsException.class,
            UserDisabledException.class
    })
    public ResponseEntity<ApiErrorResponse> handleUnauthorized(
            ApplicationException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                exception,
                request
        );
    }


    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(
            EmailAlreadyRegisteredException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                exception,
                request
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(
            UserNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception,
                request
        );
    }

    /*----------------- Gestione eccezioni Spring e infrastrutturali  -------------------*/


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        Map<String, List<String>> errors = new LinkedHashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.computeIfAbsent(
                        error.getField(),
                        ignored -> new ArrayList<>()
                ).add(error.getDefaultMessage() != null
                        ? error.getDefaultMessage()
                        : "Valore non valido")
        );

        exception.getBindingResult().getGlobalErrors().forEach(error ->
                errors.computeIfAbsent(
                        "_global",
                        ignored -> new ArrayList<>()
                ).add(error.getDefaultMessage() != null
                        ? error.getDefaultMessage()
                        : "Richiesta non valida")
        );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "Uno o piu campi non sono validi",
                errors,
                request,
                exception
        );
    }


    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodValidation(
            HandlerMethodValidationException exception,
            HttpServletRequest request
    ) {
        Map<String, List<String>> errors = new LinkedHashMap<>();

        exception.getParameterValidationResults().forEach(result -> {
            String parameterName = result.getMethodParameter().getParameterName();
            String key = parameterName != null ? parameterName : "request";

            result.getResolvableErrors().forEach(error ->
                    errors.computeIfAbsent(
                            key,
                            ignored -> new ArrayList<>()
                    ).add(error.getDefaultMessage() != null
                            ? error.getDefaultMessage()
                            : "Valore non valido")
            );
        });

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "Uno o piu parametri non sono validi",
                errors,
                request,
                exception
        );
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleMessageNotReadable(
            HttpMessageNotReadableException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "MALFORMED_REQUEST",
                "Il corpo della richiesta non e valido",
                Map.of(),
                request,
                exception
        );
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException exception,
            HttpServletRequest request
    ) {
        Map<String, List<String>> errors = Map.of(
                exception.getName(),
                List.of("Il valore fornito non ha un formato valido")
        );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "TYPE_MISMATCH",
                "Uno o piu parametri hanno un formato non valido",
                errors,
                request,
                exception
        );
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                "DATA_INTEGRITY_VIOLATION",
                "L'operazione e in conflitto con i dati esistenti",
                Map.of(),
                request,
                exception
        );
    }


    @ExceptionHandler(DataAccessResourceFailureException.class)
    public ResponseEntity<ApiErrorResponse> handleDatabaseUnavailable(
            DataAccessResourceFailureException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "DATABASE_UNAVAILABLE",
                "Servizio momentaneamente non disponibile",
                Map.of(),
                request,
                exception
        );
    }


    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiErrorResponse> handleGenericDatabaseError(
            DataAccessException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "DATABASE_ERROR",
                "Si e verificato un errore interno",
                Map.of(),
                request,
                exception
        );
    }




    /*----------------- Gestione eccezioni fallback -------------------*/

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericError(
            Exception exception,
            HttpServletRequest request
    ) {
        /*
         * Le eccezioni MVC standard di Spring espongono gia lo status HTTP
         * corretto tramite ErrorResponse. Questa diramazione conserva quindi
         * status come 404, 405 e 415, uniformando solamente il body.
         */
        if (exception instanceof ErrorResponse springError) {
            HttpStatus status = HttpStatus.resolve(
                    springError.getStatusCode().value()
            );

            if (status != null) {
                return buildResponse(
                        status,
                        getSpringErrorCode(status),
                        getSpringErrorMessage(status),
                        Map.of(),
                        request,
                        exception
                );
            }
        }

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                "Si e verificato un errore interno",
                Map.of(),
                request,
                exception
        );
    }


    private String getSpringErrorCode(HttpStatus status) {
        return switch (status) {
            case NOT_FOUND -> "ENDPOINT_NOT_FOUND";
            case METHOD_NOT_ALLOWED -> "METHOD_NOT_ALLOWED";
            case NOT_ACCEPTABLE -> "NOT_ACCEPTABLE";
            case UNSUPPORTED_MEDIA_TYPE -> "UNSUPPORTED_MEDIA_TYPE";
            case BAD_REQUEST -> "BAD_REQUEST";
            default -> status.is4xxClientError()
                    ? "HTTP_REQUEST_ERROR"
                    : "INTERNAL_SERVER_ERROR";
        };
    }


    private String getSpringErrorMessage(HttpStatus status) {
        return switch (status) {
            case NOT_FOUND -> "Endpoint non trovato";
            case METHOD_NOT_ALLOWED -> "Metodo HTTP non supportato";
            case NOT_ACCEPTABLE -> "Formato di risposta non supportato";
            case UNSUPPORTED_MEDIA_TYPE -> "Formato della richiesta non supportato";
            case BAD_REQUEST -> "La richiesta non puo essere elaborata";
            default -> status.is4xxClientError()
                    ? "La richiesta non puo essere elaborata"
                    : "Si e verificato un errore interno";
        };
    }


}






