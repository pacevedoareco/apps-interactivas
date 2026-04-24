package com.uade.tpo.e_commerce3.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarritoResponseDTO {
    private Long id;
    private Double total;
    private String estado;
    private String fechaCreacion;
    private String fechaActualizacion;
    private List<CarritoItemResponseDTO> items;

}
