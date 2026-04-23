package com.uade.tpo.e_commerce3.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.DireccionDTO;
import com.uade.tpo.e_commerce3.dto.LoginRequest;
import com.uade.tpo.e_commerce3.dto.RegisterRequest;
import com.uade.tpo.e_commerce3.model.Direccion;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;
import com.uade.tpo.e_commerce3.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// CONFIGURAR EXCEPCIONES 
@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

private final UsuarioRepository usuarioRepository;
private final PasswordEncoder passwordEncoder;
private final AuthenticationManager authenticationManager;
private final JwtUtil jwtUtil;

    //Lógica para: POST /api/auth/register
    public void register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe en la base de datos");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .activo(true)
                .telefono(request.getTelefono())
                .fechaNacimiento(request.getFechaNacimiento())
                .direccion(mapToDireccion(request.getDireccion()))
                .build();

        usuarioRepository.save(usuario);
    }

    // Lógica para: POST /api/auth/login
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

    // ==================== MAPPERS ====================
    private Direccion mapToDireccion(DireccionDTO dto) {
        if (dto == null) return null;
        return Direccion.builder()
                .calle(dto.getCalle())
                .numero(dto.getNumero())
                .piso(dto.getPiso())
                .departamento(dto.getDepartamento())
                .ciudad(dto.getCiudad())
                .provincia(dto.getProvincia())
                .codigoPostal(dto.getCodigoPostal())
                .pais(dto.getPais())
                .build();
    }

}

