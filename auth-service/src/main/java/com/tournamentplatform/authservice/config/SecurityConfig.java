package com.tournamentplatform.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

//questa classe è una classe di configurazione, il suo scopo è definire la creazione dei bean relativi alla sicurezza
@Configuration
public class SecurityConfig {

    //questo bean rappresenta la filter chain, ovvero // catena di filtri che Spring Security applica alle richieste HTTP prima che arrivino ai controller,
    //se non è valida parte eccezione
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) //dato che usiamo il JWT non serve una sessione attiva, è tutto stateless
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll() //le richieste di Login e registrazione sono tutte accettate
                        .requestMatchers("/actuator/health").permitAll()
                        .anyRequest().authenticated() //le altre richieste invece vengono accettate solo se si è autenticati
                )
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
