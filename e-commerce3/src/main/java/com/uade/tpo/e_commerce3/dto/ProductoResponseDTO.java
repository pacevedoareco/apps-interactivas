package com.uade.tpo.e_commerce3.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductoResponseDTO {

    private Long idProducto;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String marca;
    private String imagenUrl;
    private String estadoProducto;
    private String condicionPublicacion;
    private LocalDate fechaPublicacion;
    private Long vendedorId;
    private List<String> categorias;
}
