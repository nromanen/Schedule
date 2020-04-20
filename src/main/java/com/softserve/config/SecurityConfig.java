package com.softserve.config;

import com.softserve.security.jwt.JwtConfigurer;
import com.softserve.security.jwt.JwtTokenProvider;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

import javax.servlet.http.HttpServletResponse;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtTokenProvider jwtTokenProvider;

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




    @Autowired
    public SecurityConfig(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and()
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
//                .authorizeRequests()
//                .antMatchers(LOGIN_ENDPOINT, REGISTRATION_ENDPOINT, ACTIVATION_ACCOUNT_ENDPOINT,
//                        RESET_PASSWORD_ENDPOINT, SCHEDULE_FOR_USERS_ENDPOINT, ALL_GROUPS_PUBLIC_ENDPOINT).permitAll()
//                .antMatchers(MANAGER_ENDPOINT, CLASSES_ENDPOINT, GROUPS_ENDPOINT, LESSONS_ENDPOINT,
//                        ROOMS_ENDPOINT, SUBJECTS_ENDPOINT, TEACHERS_ENDPOINT, SCHEDULE_ENDPOINT).hasRole("MANAGER")
//                .anyRequest().authenticated()
//                .and()
               // .apply(new JwtConfigurer(jwtTokenProvider))
        ;

//        http
//                .exceptionHandling()
//                .authenticationEntryPoint((request, response, e) ->
//                        {
//                            response.setContentType("application/json;charset=UTF-8");
//                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//                            response.getWriter().write(new JSONObject()
//                                    .put("message", "Access denied")
//                                    .toString());
//                        }
//                );
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**");
    }
}
