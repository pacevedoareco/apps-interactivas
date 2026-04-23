package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.DireccionDTO;
import com.uade.tpo.e_commerce3.dto.UsuarioResponseDTO;
import com.uade.tpo.e_commerce3.dto.UsuarioUpdateDTO;
import com.uade.tpo.e_commerce3.model.Direccion;
//import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// CONFIGURAR EXCEPCIONES 

@Service
@Transactional
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // ==================== PERFIL ====================

    //Lógica para: GET /api/usuarios/{id}
    public UsuarioResponseDTO getUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapToUsuarioResponseDTO(usuario);
    }

    //Lógica para: PUT /api/usuarios/{id}
    public UsuarioResponseDTO updateUsuario(Long id, UsuarioUpdateDTO request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setTelefono(request.getTelefono());
        usuario.setFechaNacimiento(request.getFechaNacimiento());

        if (request.getDireccion() != null) {
            Direccion direccion = usuario.getDireccion();
            direccion.setCalle(request.getDireccion().getCalle());
            direccion.setNumero(request.getDireccion().getNumero());
            direccion.setPiso(request.getDireccion().getPiso());
            direccion.setDepartamento(request.getDireccion().getDepartamento());
            direccion.setCiudad(request.getDireccion().getCiudad());
            direccion.setProvincia(request.getDireccion().getProvincia());
            direccion.setCodigoPostal(request.getDireccion().getCodigoPostal());
            direccion.setPais(request.getDireccion().getPais());
        }

        usuarioRepository.save(usuario);
        return mapToUsuarioResponseDTO(usuario);
    }

    //Lógica para: PUT /api/usuarios/{id}/desactivar
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    /* 
    //Lógica para: GET /api/usuarios/{id}/productos
    public List<Producto> getProductosPublicados(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getProductosPublicados();
    }
    */

    /* 
    //Lógica para: GET /api/usuarios/{id}/pedidos
    public List<Pedido> getPedidos(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getPedidos();
    }
    */

    // ==================== ADMIN ====================

    //Lógica para: GET /api/admin/usuarios
    public List<UsuarioResponseDTO> getAllUsuariosAdmin() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::mapToUsuarioResponseDTO)
                .collect(Collectors.toList());
    }

    //Lógica para: GET /api/admin/usuarios/{id}
    public UsuarioResponseDTO getUsuarioByIdAdmin(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapToUsuarioResponseDTO(usuario);
    }

    //Lógica para: PUT /api/admin/usuarios/{id}/desactivar
    public void desactivarUsuarioAdmin(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    //Lógica para: PUT /api/admin/usuarios/{id}/activar
    public void activarUsuarioAdmin(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }

    // ==================== MAPPERS ====================
    private UsuarioResponseDTO mapToUsuarioResponseDTO(Usuario usuario) {
        DireccionDTO direccionDTO = null;
        if (usuario.getDireccion() != null) {
            direccionDTO = DireccionDTO.builder()
                    .calle(usuario.getDireccion().getCalle())
                    .numero(usuario.getDireccion().getNumero())
                    .piso(usuario.getDireccion().getPiso())
                    .departamento(usuario.getDireccion().getDepartamento())
                    .ciudad(usuario.getDireccion().getCiudad())
                    .provincia(usuario.getDireccion().getProvincia())
                    .codigoPostal(usuario.getDireccion().getCodigoPostal())
                    .pais(usuario.getDireccion().getPais())
                    .build();
        }

        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .activo(usuario.isActivo())
                .role(usuario.getRole().name())
                .direccion(direccionDTO)
                .build();
    }

}