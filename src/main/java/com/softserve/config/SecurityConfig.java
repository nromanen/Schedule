package com.softserve.config;

import com.softserve.security.jwt.JwtTokenFilter;
import com.softserve.security.jwt.JwtTokenProvider;
import com.softserve.security.jwt.JwtTokenRefreshFilter;
import com.softserve.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Value("${app.backend.url}")
    private String backendUrl;

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http))
                .httpBasic(httpBasic -> httpBasic.disable())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorize -> authorize
                        // Static resources (React build)
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/static/**",
                                "/assets/**",
                                "/*.js", "/*.css", "/*.ico", "/*.json", "/*.png", "/*.map", "/*.html"
                        ).permitAll()

                        // SPA routes (React Router)
                        .requestMatchers(
                                "/login", "/admin", "/schedule", "/activation-page"
                        ).permitAll()

                        // Public API endpoints
                        .requestMatchers(
                                "/auth/**", "/public/**", "/schedules/full/*",
                                "/semesters/default", "/semesters/default/groups",
                                "/semesters/current/groups", "/semesters/{semesterId}/groups",
                                "/download/**",
                                "/departments"
                        ).permitAll()

                        // Swagger endpoints
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        // Role-based access
                        .requestMatchers("/groups/teacher/**", "/groups/*/with-students")
                        .hasAnyRole("MANAGER", "TEACHER")
                        .requestMatchers(
                                "/managers/**", "/classes/**", "/groups/**",
                                "/lessons/**", "/rooms/**", "/subjects/**",
                                "/teachers/**", "/semesters/**", "/room-types/**",
                                "/departments/**"
                        ).hasRole("MANAGER")

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint ->
                                endpoint.baseUri("/oauth_login")
                        )
                        .successHandler(authenticationSuccessHandler())
                )
                .addFilterBefore(
                        new JwtTokenFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, e) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"message\": \"Access denied\"}");
                        })
                )
                .addFilterAfter(
                        new JwtTokenRefreshFilter(jwtTokenProvider),
                        JwtTokenFilter.class
                );

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            var user = userService.createSocialUser(oAuth2User);
            String jwtToken = jwtTokenProvider.createToken(
                    user.getEmail(), user.getRole().toString()
            );
            response.sendRedirect(backendUrl + "login?social=true&token=" + jwtToken);
        };
    }
}
