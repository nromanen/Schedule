package com.softserve.security.jwt;

import com.softserve.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;


public class JwtTokenFilter extends GenericFilterBean {

    private final JwtTokenProvider jwtTokenProvider;

    private UserService userService;
    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }
    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, jakarta.servlet.ServletException {
        String token = jwtTokenProvider.resolveToken((HttpServletRequest) request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            Authentication auth = JwtTokenProvider.getAuthentication(userService.loadUserByUsername(token));

            if (auth != null) {
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } else {
            Map<String, String> map = new HashMap<>();
            Enumeration<String> headerNames = ((HttpServletRequest) request).getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String key = headerNames.nextElement();
                String value = ((HttpServletRequest) request).getHeader(key);
                map.put(key, value);
                if (map.containsKey("authorization")) {
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write(new JSONObject()
                                                       .put("message", "The access token provided is invalid")
                                                       .toString() + "\n");
                    response.getWriter().flush();
                    break;
                }
            }
        }
        chain.doFilter(request, response);
    }
}
