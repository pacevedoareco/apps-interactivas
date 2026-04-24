package com.uade.tpo.e_commerce3.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.AgregarItemRequestDTO;
import com.uade.tpo.e_commerce3.dto.CarritoResponseDTO;
import com.uade.tpo.e_commerce3.dto.CarritoResumenResponseDTO;
import com.uade.tpo.e_commerce3.dto.ModificarItemRequest;
import com.uade.tpo.e_commerce3.dto.PedidoResponseDTO;
import com.uade.tpo.e_commerce3.service.CarritoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;

    @GetMapping
    public ResponseEntity<CarritoResponseDTO> obtenerCarrito() {
        return ResponseEntity.ok(carritoService.obtenerCarritoAutenticado());
    }

    @DeleteMapping
    public ResponseEntity<Void> vaciarCarrito() {
        carritoService.vaciarCarritoAutenticado();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/items")
    public ResponseEntity<CarritoResponseDTO> agregarItem(@RequestBody AgregarItemRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carritoService.agregarItem(request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CarritoResponseDTO> modificarItem(@PathVariable Long itemId,
            @RequestBody ModificarItemRequest request) {
        return ResponseEntity.ok(carritoService.modificarCantidadItem(itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CarritoResponseDTO> eliminarItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(carritoService.eliminarItem(itemId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<PedidoResponseDTO> checkout() {
        return ResponseEntity.ok(carritoService.checkout());
    }

    @GetMapping("/resumen")
    public ResponseEntity<CarritoResumenResponseDTO> obtenerResumen() {
        return ResponseEntity.ok(carritoService.obtenerResumenCheckout());
    }
}