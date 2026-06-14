package com.uade.tpo.e_commerce3.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce3.dto.ProductoRequestDTO;
import com.uade.tpo.e_commerce3.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce3.service.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    /*
     * Endpoint: POST /api/productos
     * Descripción: Crea un nuevo producto en el sistema.
     * Recibe un ProductoRequestDTO con los datos del producto.
     * Retorna el producto creado en formato ProductoResponseDTO.
     */
    @PostMapping
    public ResponseEntity<ProductoResponseDTO> crearProducto(@RequestBody ProductoRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crearProducto(request));
    }

    /*
     * Endpoint: GET /api/productos
     * Descripción: Obtiene el listado completo de productos.
     * Retorna una lista de ProductoResponseDTO.
     * Es un endpoint público para visualización de productos.
     */
    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> getAllProductos() {
        return ResponseEntity.ok(productoService.getAllProductos());
    }

    /*
    * Endpoint: GET /api/productos/mis-productos
    * Descripción: Obtiene los productos publicados por el vendedor autenticado.
    * Retorna una lista de ProductoResponseDTO.
    */
    @GetMapping("/mis-productos")
    public ResponseEntity<List<ProductoResponseDTO>> getMisProductos() {
        return ResponseEntity.ok(productoService.getMisProductos());
    }

    /*
     * Endpoint: GET /api/productos/{id}
     * Descripción: Obtiene el detalle de un producto específico por ID.
     * Retorna un ProductoResponseDTO.
     * Si el producto no existe, se lanza una excepción controlada.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> getProductoById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getProductoById(id));
    }

    /*
     * Endpoint: PUT /api/productos/{id}
     * Descripción: Actualiza los datos de un producto existente.
     * Recibe un ProductoRequestDTO con los nuevos valores.
     * Retorna el producto actualizado en formato ProductoResponseDTO.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> updateProducto(
            @PathVariable Long id,
            @RequestBody ProductoRequestDTO request) {
        return ResponseEntity.ok(productoService.updateProducto(id, request));
    }

    /*
     * Endpoint: DELETE /api/productos/{id}
     * Descripción: Elimina un producto del sistema.
     * No retorna contenido (HTTP 204).
     * Se utiliza generalmente para baja lógica o física según implementación.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}