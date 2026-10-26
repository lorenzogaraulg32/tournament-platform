package com.tournamentplatform.authservice.controller;

import com.tournamentplatform.authservice.dto.AuthResponse;
import com.tournamentplatform.authservice.dto.ExternalAuthRequest;
import com.tournamentplatform.authservice.service.ExternalProviderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/auth/external-provider")
public class ExternalProviderAuthController {


    private final ExternalProviderService externalProviderService;

    /*
        Questo endpoint è responsabile sia per la gestione del login che della registrazione

     */
    @PostMapping()
    public ResponseEntity<AuthResponse> authenticate(
            @Valid @RequestBody ExternalAuthRequest request
    ) {
        AuthResponse response = externalProviderService.authenticateExternal(request);
        return ResponseEntity.ok(response);
    }

    //Nel futuro quando ci sono più provider potrebbe essere necessario includere quale provider nella richesta
    @PostMapping("/link")
    public ResponseEntity<Void> link(
            Authentication authentication,
            @Valid @RequestBody ExternalAuthRequest request
    ) {

        Long userId = Long.valueOf(authentication.getName());

        externalProviderService.linkExternalProvider(userId, request);
        return ResponseEntity.ok().build();
    }

    //Nel futuro quando ci sono più provider potrebbe essere necessario includere quale provider nella richesta
    @DeleteMapping("/link")
    public ResponseEntity<Void> unlink(Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        externalProviderService.unlinkExternalProvider(userId);
        return ResponseEntity.noContent().build();
    }
}
