package com.softserve.config;

import com.softserve.entity.User;
import com.softserve.exception.SocialClientRegistrationException;
import com.softserve.security.jwt.JwtConfigurer;
import com.softserve.security.jwt.JwtTokenProvider;
import com.softserve.service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
@EnableWebSecurity
@EnableOAuth2Client
@PropertySource({"classpath:social.properties", "classpath:cors.properties"})
@ComponentScan(basePackages = {"com.softserve.*"})
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtTokenProvider jwtTokenProvider;

    private final Environment env;
    private final UserService userService;

    private static final String CLIENT_PROPERTY_KEY = "spring.security.oauth2.client.registration.";
    private static final String GOOGLE = "google";
    private static final String FACEBOOK = "facebook";

    private static final String MANAGER_ENDPOINT = "/managers/**";
    private static final String CLASSES_ENDPOINT = "/classes/**";
    private static final String GROUPS_ENDPOINT = "/groups/**";
    private static final String LESSONS_ENDPOINT = "/lessons/**";
    private static final String ROOMS_ENDPOINT = "/rooms/**";
    private static final String SUBJECTS_ENDPOINT = "/subjects/**";
    private static final String TEACHERS_ENDPOINT = "/teachers/**";
    private static final String AUTH_ENDPOINT = "/auth/**";
    private static final String SCHEDULE_ENDPOINT = "/schedules/*";
    private static final String SCHEDULE_FOR_USERS_ENDPOINT = "/schedules/full/*";
    private static final String ALL_GROUPS_PUBLIC_ENDPOINT = "/groups/public";
    private static final String ALL_TEACHERS_PUBLIC_ENDPOINT = "/teachers/public";
    private static final String ALL_CLASSES_PUBLIC_ENDPOINT = "/classes/public";
    private static final String ALL_SEMESTERS_PUBLIC_ENDPOINT = "/semesters/public";
    private static final String SEMESTERS_ENDPOINT = "/semesters/**";
    private static final String USERS_ENDPOINT = "/users/**";
    private static final String ROOM_TYPES_ENDPOINT = "/room-types/**";
    private static final String SOCIAL_ENDPOINT = "/social/**";


    @Autowired
    public SecurityConfig(JwtTokenProvider jwtTokenProvider, Environment env, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.env = env;
        this.userService = userService;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/","/login",SOCIAL_ENDPOINT, AUTH_ENDPOINT, SCHEDULE_FOR_USERS_ENDPOINT, ALL_GROUPS_PUBLIC_ENDPOINT, ALL_TEACHERS_PUBLIC_ENDPOINT,
                        ALL_GROUPS_PUBLIC_ENDPOINT, ALL_CLASSES_PUBLIC_ENDPOINT, ALL_SEMESTERS_PUBLIC_ENDPOINT).permitAll()
                .antMatchers(MANAGER_ENDPOINT, CLASSES_ENDPOINT, GROUPS_ENDPOINT, LESSONS_ENDPOINT,
                        ROOMS_ENDPOINT, SUBJECTS_ENDPOINT, TEACHERS_ENDPOINT, SCHEDULE_ENDPOINT, SEMESTERS_ENDPOINT, USERS_ENDPOINT, ROOM_TYPES_ENDPOINT).hasRole("MANAGER")
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .authorizationEndpoint()
                .baseUri("/oauth_login")
                .and()
                .clientRegistrationRepository(clientRegistrationRepository())
                .authorizedClientService(clientService())
                .userInfoEndpoint()
                .and()
                .successHandler(authenticationSuccessHandler())
                .and()
                .apply(new JwtConfigurer(jwtTokenProvider));

        http
                .exceptionHandling()
                .authenticationEntryPoint((request, response, e) ->
                        {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write(new JSONObject()
                                    .put("message", "Access denied")
                                    .toString());
                        }
                );
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**", "/","/login");
    }

    @Bean
    public OAuth2AuthorizedClientService clientService() {
        return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository());
    }

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        List<ClientRegistration> registrations = Stream.of(FACEBOOK, GOOGLE)
                .map(this::getRegistration)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return new InMemoryClientRegistrationRepository(registrations);
    }

    private Optional<ClientRegistration> getRegistration(String client) {
        if (isKnownClient(client)) {
            String clientId = env.getProperty(CLIENT_PROPERTY_KEY + client + ".client-id");
            String clientSecret = env.getProperty(CLIENT_PROPERTY_KEY + client + ".client-secret");
            ClientRegistration registration = getBuilderOfClient(client)
                    .clientId(clientId)
                    .clientSecret(clientSecret)
                    .build();
            return Optional.of(registration);
        }
        return Optional.empty();
    }

    private boolean isKnownClient(String client) {
        return Arrays.asList(GOOGLE, FACEBOOK)
                .contains(client);
    }

    private ClientRegistration.Builder getBuilderOfClient(String client) {
        switch (client) {
            case GOOGLE:
                return CommonOAuth2Provider.GOOGLE.getBuilder(client);
            case FACEBOOK:
                return CommonOAuth2Provider.FACEBOOK.getBuilder(client);
            default:
                throw new SocialClientRegistrationException("Unknown client");
        }
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            User user = userService.createSocialUser(oAuth2User);

            String url = env.getProperty("backend.url");
            String jwtToken = jwtTokenProvider.createToken(user.getEmail(), user.getRole().toString());
            response.sendRedirect(url + "social/loginSuccess?token=" + jwtToken);
        };
    }
}
