package org.backend.filters;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.backend.domain.User;
import org.backend.utils.JwtTokenUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        step 1: check if we have Authorization: Bearer
        String header = request.getHeader("Authorization");
        if (!hasAuthorizationToken(header)) {
            filterChain.doFilter(request, response);
            return;
        }
//        step 2: validate the token
        if (!validateToken(header)) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = header.substring(7);

//        step 3. populate Authentication securitycontext
        setAuthenticationContext(token);
        filterChain.doFilter(request, response);
    }

    private boolean hasAuthorizationToken(String header) {
        return header != null && header.startsWith("Bearer ");
    }

    private boolean validateToken(String header) {
        return jwtTokenUtil.validateToken(header.substring(7));
    }

    private void setAuthenticationContext(String token) {
        UserDetails userDetails = populateUserDetails(token);
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
    }

    private UserDetails populateUserDetails(String token) {
        Claims claims = jwtTokenUtil.parseToken(token);
        String[] subject = claims.getSubject().split(",");
        User u = new User();
        u.setId(Long.parseLong(subject[0]));
        u.setEmail(subject[1]);
        u.setRole(subject[2]);
        return u;
    }
}
