package com.uade.tpo.e_commerce3.dto;

import com.uade.tpo.e_commerce3.model.EstadoPedido;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoResponseDTO {
    private Long id;
    private LocalDateTime fechaCreacion;
    private EstadoPedido estado;
    private Double total;
    private Long usuarioId;
    private List<ItemPedidoResponseDTO> items;

    // PARA AGREGAR:
    // Más adelante evaluar agregar:
    // - dirección de entrega
    // - datos resumidos del usuario (nombre/email)
    // - estado más detallado del pedido
}
