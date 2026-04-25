package com.uade.tpo.e_commerce3.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.uade.tpo.e_commerce3.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;
import com.uade.tpo.e_commerce3.security.JwtFilter;

import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UsuarioRepository usuarioRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsuarioNotFoundException(username));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                    .csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth
                        // Públicos - Register/Login
                        .requestMatchers("/api/auth/**").permitAll()
                        
                        // Productos - GET Público, resto authenticated
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/productos").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").authenticated()
                        
                        // Usuarios - GET público para ver perfil de vendedor, resto autenticado
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").authenticated()
                        
                         // Carrito
                        .requestMatchers("/api/carrito/**").authenticated()

                        // Pedidos
                        .requestMatchers("/api/pedidos/**").authenticated()
                        
                        // Admin - solo rol ADMIN
                        .requestMatchers("/api/admin/**").hasRole(Role.ADMIN.name())
                        
                        // swagger
                        .requestMatchers(
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/v3/api-docs/**",
                            "/v3/api-docs.yaml",
                            "/swagger-resources/**",
                            "/webjars/**"
                        ).permitAll()

                        .anyRequest().authenticated())
                    .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

