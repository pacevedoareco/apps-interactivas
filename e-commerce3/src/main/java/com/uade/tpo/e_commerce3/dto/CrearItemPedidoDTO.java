package com.uade.tpo.e_commerce3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearItemPedidoDTO {
    private Long productoId;
    private Integer cantidad;

    // PARA AGREGAR:
    // Por ahora no recibimos precioUnitario desde el request.
    // Se tomará desde Producto al crear el pedido.
}
