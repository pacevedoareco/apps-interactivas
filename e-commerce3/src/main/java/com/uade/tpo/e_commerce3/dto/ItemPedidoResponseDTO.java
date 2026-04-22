package com.uade.tpo.e_commerce3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemPedidoResponseDTO {
    private Long id;
    private String nombreProducto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;

    // PARA AGREGAR:
    // Cuando exista la entidad Producto integrada al pedido,
    // evaluar agregar productoId en la respuesta.
}
