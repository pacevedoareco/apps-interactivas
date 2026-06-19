package com.uade.tpo.e_commerce3.controller;

import com.uade.tpo.e_commerce3.dto.CrearPedidoRequestDTO;
import com.uade.tpo.e_commerce3.dto.PedidoResponseDTO;
import com.uade.tpo.e_commerce3.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")

public class PedidoController {
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> obtenerTodos() {
        List<PedidoResponseDTO> pedidos = pedidoService.obtenerTodos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<PedidoResponseDTO>> obtenerMisPedidos() {
        List<PedidoResponseDTO> pedidos = pedidoService.obtenerMisPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> obtenerPorId(@PathVariable Long id) {
        PedidoResponseDTO pedido = pedidoService.obtenerPorId(id);
        return ResponseEntity.ok(pedido);
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> crearPedido(@RequestBody CrearPedidoRequestDTO requestDTO) {
        PedidoResponseDTO pedidoCreado = pedidoService.crearPedido(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCreado);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PedidoResponseDTO> cancelarPedido(@PathVariable Long id) {
        PedidoResponseDTO pedidoCancelado = pedidoService.cancelarPedido(id);
        return ResponseEntity.ok(pedidoCancelado);
    }

    // A AGREGAR
    // Más adelante evaluar agregar:
    // - GET /api/pedidos/usuario/{usuarioId}
    // - PUT /api/admin/pedidos/{id}/estado
    // - integración con seguridad para obtener usuario desde el token
}
