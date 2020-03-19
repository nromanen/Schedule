package com.softserve.config;

import com.softserve.security.jwt.JwtConfigurer;
import com.softserve.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtTokenProvider jwtTokenProvider;

    private static final String ADMIN_ENDPOINT = "/api/v1/manager/**";
    private static final String USER_ENDPOINT = "/api/v1/user/**";
    private static final String LOGIN_ENDPOINT = "/api/v1/auth/login";
    private static final String LOGOUT_ENDPOINT = "/api/v1/auth/logout";
   // private static final String SWAGGER_ENDPOINT = "/swagge‌​r-ui.html";

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
        http
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(LOGIN_ENDPOINT).permitAll()
                .antMatchers(USER_ENDPOINT).hasAnyRole("MANAGER", "USER")
                .antMatchers(ADMIN_ENDPOINT).hasRole("MANAGER")
                .anyRequest().authenticated()
                .and()
                /*.logout()
                .logoutUrl(LOGOUT_ENDPOINT)
                // .logoutSuccessUrl(LOGOUT_ENDPOINT)
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .and()*/
                .apply(new JwtConfigurer(jwtTokenProvider));
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
