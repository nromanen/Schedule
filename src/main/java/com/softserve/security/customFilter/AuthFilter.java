package com.softserve.security.customFilter;

import com.softserve.exception.AuthGoogleEmailDontExistException;
import com.softserve.exception.apierror.ApiError;
import com.softserve.exception.handler.GlobalExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;


@Component
public class AuthFilter extends OncePerRequestFilter {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;
//    private GlobalExceptionHandler globalExceptionHandler;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            filterChain.doFilter(request,response);
        }catch (AuthGoogleEmailDontExistException ex){
            log.error("Spring Security AuthFilter Exception:",ex);
            resolver.resolveException(request, response, null, ex);
        }

    }
}
