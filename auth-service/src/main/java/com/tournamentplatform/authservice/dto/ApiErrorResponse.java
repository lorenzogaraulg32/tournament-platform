package com.tournamentplatform.authservice.dto;


import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String code,
        String message,
        //mappa con campo errore: lista di errori
        Map<String, List<String>> errors,
        String path,
        String traceId
) {
}


  /* esempio di ApiErrorResponse
    {
  "timestamp": "2026-08-26T16:15:30Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Alcuni campi non sono validi",
  "errors": {
    "email": [
      "Inserisci un indirizzo email valido"
    ],
    "password": [
      "La password deve contenere almeno 8 caratteri"
    ]
  },
  "path": "/auth/register",
  "traceId": "93192ba2-e02f-4f84-a2b0-1f73d48050fb"
}
    */