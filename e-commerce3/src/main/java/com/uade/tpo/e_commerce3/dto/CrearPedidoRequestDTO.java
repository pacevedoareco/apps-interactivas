package com.uade.tpo.e_commerce3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearPedidoRequestDTO {
    private Long usuarioId;

    private List<CrearItemPedidoDTO> items;

    // PARA AGREGAR:
    // Más adelante, cuando esté seguridad/JWT completamente integrada,
    // este usuarioId probablemente no sea necesario
}
