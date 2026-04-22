package com.uade.tpo.e_commerce3.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@Component
//este filtro se ejecuta antes de llamar al controller
//fue configurado en SecurityConfig en la instrucción `addFilterBefore`
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Este método se ejecuta en cada petición HTTP para verificar si existe un token JWT válido.
     * Dónde se utiliza:
     * - Se configura en `SecurityConfig` para que se ejecute antes que el filtro de autenticación de Spring Security.
     * - Intercepta todas las peticiones entrantes a la API.
     */
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Obtiene el encabezado "Authorization" de la petición.
        String header = request.getHeader("Authorization");

        // Verifica si el encabezado existe y si comienza con "Bearer ".
        if (header != null && header.startsWith("Bearer ")) {
            //extrae la parte del JWT de la cabecera de autorización, eliminando el prefijo "Bearer ".
            String token = header.substring(7);
            // Valida el token 
            if (jwtUtil.validateToken(token)) {
                // Si el token es válido, extrae el nombre de usuario y los roles del token.
                String username = jwtUtil.getUsername(token);
                Set<String> roles = jwtUtil.getRoles(token);

                // transformar el conjunto de roles (cadenas de texto)  en la lista de autoridades (permisos) que Spring Security necesita para verificar si el usuario tiene acceso a un recurso.
                var authorities = roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

                // crea un objeto de autenticación con los detalles del usuario y sus roles
                var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
                // Finalmente, pasa la petición al siguiente filtro en la cadena.
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}