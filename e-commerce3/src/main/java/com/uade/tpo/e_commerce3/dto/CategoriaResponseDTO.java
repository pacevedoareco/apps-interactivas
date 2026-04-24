package com.uade.tpo.e_commerce3.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoriaResponseDTO {

    private Long idCategoria;
    private String nombre;
    private String descripcion;
}
