package com.uade.tpo.e_commerce3.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce3.service.FavoritoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
@Tag(name = "Favoritos", description = "Endpoints para gestionar favoritos de productos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    @PostMapping("/{productoId}")
    @Operation(summary = "Agregar producto a favoritos")
    public ResponseEntity<Void> agregarFavorito(@PathVariable Long productoId) {
        favoritoService.agregarFavorito(productoId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productoId}")
    @Operation(summary = "Eliminar producto de favoritos")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Long productoId) {
        favoritoService.eliminarFavorito(productoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "Obtener todos los productos favoritos del usuario autenticado")
    public ResponseEntity<List<ProductoResponseDTO>> obtenerFavoritos() {
        return ResponseEntity.ok(favoritoService.obtenerFavoritos());
    }

    @GetMapping("/{productoId}/es-favorito")
    @Operation(summary = "Verificar si un producto es favorito")
    public ResponseEntity<Boolean> esFavorito(@PathVariable Long productoId) {
        return ResponseEntity.ok(favoritoService.esFavorito(productoId));
    }
}

// Made with Bob
