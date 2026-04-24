package com.uade.tpo.e_commerce3.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce3.dto.CategoriaRequestDTO;
import com.uade.tpo.e_commerce3.dto.CategoriaResponseDTO;
import com.uade.tpo.e_commerce3.service.CategoriaService;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    /*
     * Endpoint: GET /api/categorias
     * Descripción: Obtiene el listado completo de categorías.
     * Retorna una lista de CategoriaResponseDTO.
     * Es un endpoint público utilizado para clasificar productos.
     */
    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> getAllCategorias() {
        return ResponseEntity.ok(categoriaService.getAllCategorias());
    }

    /*
     * Endpoint: GET /api/categorias/{id}
     * Descripción: Obtiene el detalle de una categoría por ID.
     * Retorna un CategoriaResponseDTO.
     * Si la categoría no existe, se lanza una excepción controlada.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> getCategoriaById(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.getCategoriaById(id));
    }

    /*
     * Endpoint: POST /api/categorias
     * Descripción: Crea una nueva categoría en el sistema.
     * Recibe un CategoriaRequestDTO con los datos de la categoría.
     * Retorna la categoría creada en formato CategoriaResponseDTO.
     */
    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> crearCategoria(@RequestBody CategoriaRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crearCategoria(request));
    }

    /*
     * Endpoint: PUT /api/categorias/{id}
     * Descripción: Actualiza una categoría existente.
     * Recibe un CategoriaRequestDTO con los nuevos valores.
     * Retorna la categoría actualizada.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> updateCategoria(
            @PathVariable Long id,
            @RequestBody CategoriaRequestDTO request) {
        return ResponseEntity.ok(categoriaService.updateCategoria(id, request));
    }

    /*
     * Endpoint: GET /api/categorias/{id}/productos
     * Descripción: Obtiene los nombres de los productos asociados a una categoría.
     * Retorna una lista de String con los nombres de los productos.
     * Se utiliza para navegar productos por categoría.
     */
    @GetMapping("/{id}/productos")
    public ResponseEntity<List<String>> getProductosByCategoriaId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.getProductosByCategoriaId(id));
    }
}