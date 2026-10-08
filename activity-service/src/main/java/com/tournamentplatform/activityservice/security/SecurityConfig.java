package com.tournamentplatform.activityservice.security;

import com.tournamentplatform.activityservice.config.InternalServiceAuthenticationFilter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            InternalServiceAuthenticationFilter internalFilter
    ) throws Exception {

        return http
                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/team-mod/internal",
                                "/team-authority/internal",
                                "/team-membership/internal",
                                "/tournament-mod/internal",
                                "/tournament-authority/internal",
                                "/tournament-placements/internal"
                        ).permitAll()

                        .requestMatchers("/actuator/health").permitAll()

                        .anyRequest().authenticated()
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(Customizer.withDefaults())
                )

                .addFilterBefore(
                        internalFilter,
                        BearerTokenAuthenticationFilter.class
                )

                .build();
    }

    @Bean
    public FilterRegistrationBean<InternalServiceAuthenticationFilter>
    internalFilterRegistration(
            InternalServiceAuthenticationFilter filter
    ) {
        FilterRegistrationBean<InternalServiceAuthenticationFilter>
                registration = new FilterRegistrationBean<>(filter);

        registration.setEnabled(false);

        return registration;
    }
}