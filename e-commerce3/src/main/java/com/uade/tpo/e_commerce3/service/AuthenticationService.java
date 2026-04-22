/* 
package com.uade.tpo.e_commerce3.service;

import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.LoginRequest;
import com.uade.tpo.e_commerce3.dto.RegisterRequest;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;
import com.uade.tpo.e_commerce3.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// CONFIGURAR con usuario, EXCEPCIONES 
@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;


    public String register(RegisterRequest ususarioRegisterDTO) {

        if (usuarioRepository.existsByEmail(ususarioRegisterDTO.getEmail())) {
            throw new RuntimeException("El email ya existe en la base de datos");
        }

        Usuario usuario = Usuario.builder()
                .nombre(ususarioRegisterDTO.getNombre())
                .apellido(ususarioRegisterDTO.getApellido())
                .email(ususarioRegisterDTO.getEmail())
                .password(passwordEncoder.encode(ususarioRegisterDTO.getPassword()))
                .role(Role.USER)
                .build();

        usuarioRepository.save(usuario);
        return "User registered successfully";
    }

    public String authenticate(LoginRequest request) {
    
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        Usuario user = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        
        Set<String> roles = user.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toSet());
        return jwtUtil.generateToken(user.getEmail(), roles);
    }
}

*/