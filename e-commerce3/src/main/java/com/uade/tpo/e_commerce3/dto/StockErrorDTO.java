package com.uade.tpo.e_commerce3.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockErrorDTO {
    private Long itemId;
    private Long productoId;
    private String nombreProducto;
    private Integer cantidadSolicitada;
    private Integer stockDisponible;
}