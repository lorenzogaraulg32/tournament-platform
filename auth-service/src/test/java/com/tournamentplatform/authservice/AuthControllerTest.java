package com.tournamentplatform.authservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tournamentplatform.authservice.controller.AuthController;
import com.tournamentplatform.authservice.dto.AuthResponse;
import com.tournamentplatform.authservice.dto.LoginRequest;
import com.tournamentplatform.authservice.dto.RegisterRequest;
import com.tournamentplatform.authservice.dto.RegisterResponse;
import com.tournamentplatform.authservice.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;


    @Test
    void register_success_returns201() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "testuser",
                "prova@gmail.com",
                "Password123"
        );

        RegisterResponse response = new RegisterResponse(
                "Utente registrato correttamente"
        );

        when(authService.register(request))
                .thenReturn(response);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Utente registrato correttamente"));
    }

    @Test
    void login_success_returns200() throws Exception {
        LoginRequest request = new LoginRequest(
                "prova@gmail.com",
                "Password123"
        );

        AuthResponse response = new AuthResponse(
                "fake-jwt-token",
                "Bearer",
                3600L
        );

        when(authService.login(request))
                .thenReturn(response);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("fake-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(3600));
    }

    @Test
    void login_invalidEmail_returns400() throws Exception {
        LoginRequest request = new LoginRequest(
                "email-non-valida",
                "Password123"
        );

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
