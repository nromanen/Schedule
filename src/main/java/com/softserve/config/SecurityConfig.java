package com.softserve.config;

import com.softserve.security.jwt.JwtConfigurer;
import com.softserve.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtTokenProvider jwtTokenProvider;

    private static final String MANAGER_ENDPOINT = "/test/**";
    private static final String CLASSES_ENDPOINT = "/classes/**";
    private static final String GROUPS_ENDPOINT = "/groups/**";
    private static final String LESSONS_ENDPOINT = "/lessons/**";
    private static final String ROOMS_ENDPOINT = "/rooms/**";
    private static final String SUBJECTS_ENDPOINT = "/subjects/**";
    private static final String TEACHERS_ENDPOINT = "/teachers/**";
    private static final String LOGIN_ENDPOINT = "/auth/login";


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

        //TODO security
        http.cors().and()
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(LOGIN_ENDPOINT).permitAll()
                .antMatchers(MANAGER_ENDPOINT, CLASSES_ENDPOINT, GROUPS_ENDPOINT, LESSONS_ENDPOINT,
                ROOMS_ENDPOINT, SUBJECTS_ENDPOINT, TEACHERS_ENDPOINT).hasRole("MANAGER")
                // .anyRequest().authenticated()
                .and()
                .apply(new JwtConfigurer(jwtTokenProvider));
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(HttpMethod.PUT, "/**");
        web.ignoring().antMatchers(HttpMethod.DELETE, "/**");
        web.ignoring().antMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**");
    }
}
