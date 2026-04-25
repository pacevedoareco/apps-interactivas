package com.uade.tpo.e_commerce3.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.UsuarioCreateDTO;
import com.uade.tpo.e_commerce3.dto.UsuarioResponseDTO;
import com.uade.tpo.e_commerce3.dto.UsuarioUpdateDTO;
import com.uade.tpo.e_commerce3.service.UsuarioService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // ==================== PERFIL ====================

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.getUsuarioById(id));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioResponseDTO> updateUsuario(@PathVariable Long id, @RequestBody UsuarioUpdateDTO request) {
        return ResponseEntity.ok(usuarioService.updateUsuario(id, request));
    }

    @PutMapping("/usuarios/{id}/desactivar")
    public ResponseEntity<String> desactivarUsuario(@PathVariable Long id) {
        usuarioService.desactivarUsuario(id);
        return ResponseEntity.ok("Usuario desactivado correctamente");
    }
/* 
    @GetMapping("/usuarios/{id}/productos")
    public ResponseEntity<List<Producto>> getProductosPublicados(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.getProductosPublicados(id));
    }
*/
/* 
    //@GetMapping("/api/usuarios/{id}/carrito")
    //public ResponseEntity<Carrito> getCarrito(@PathVariable Long id) {
    //    return ResponseEntity.ok(usuarioService.getCarrito(id));
    //}
*/
/* 
    @GetMapping("/usuarios/{id}/pedidos")
    public ResponseEntity<List<Pedido>> getPedidos(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.getPedidos(id));
    }
*/
    // ==================== ADMIN ====================

    @PostMapping("/admin/usuarios")
    public ResponseEntity<UsuarioResponseDTO> createUsuario(@RequestBody UsuarioCreateDTO request) {
        UsuarioResponseDTO usuario = usuarioService.createUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping("/admin/usuarios")
    public ResponseEntity<List<UsuarioResponseDTO>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuariosAdmin());
    }

    @GetMapping("/admin/usuarios/{id}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioByIdAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.getUsuarioByIdAdmin(id));
    }

    @PutMapping("/admin/usuarios/{id}/desactivar")
    public ResponseEntity<String> desactivarUsuarioAdmin(@PathVariable Long id) {
        usuarioService.desactivarUsuarioAdmin(id);
        return ResponseEntity.ok("Usuario desactivado correctamente");
    }

    @PutMapping("/admin/usuarios/{id}/activar")
    public ResponseEntity<String> activarUsuario(@PathVariable Long id) {
        usuarioService.activarUsuarioAdmin(id);
        return ResponseEntity.ok("Usuario activado correctamente");
    }

}


