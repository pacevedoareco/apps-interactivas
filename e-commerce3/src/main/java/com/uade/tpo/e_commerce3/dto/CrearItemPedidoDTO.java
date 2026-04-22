package com.uade.tpo.e_commerce3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearItemPedidoDTO {
    private String nombreProducto;
    private Integer cantidad;
    private Double precioUnitario;

    // PARA AGREGAR:
    // reemplazar nombreProducto por productoId
    // o agregar productoId manteniendo nombreProducto solo para respuesta.
}
