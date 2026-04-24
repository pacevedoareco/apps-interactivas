package com.uade.tpo.e_commerce3.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarritoResumenResponseDTO {
    private Double total;
    private List<CarritoItemResponseDTO> items;
    private boolean stockValido;
    private List<StockErrorDTO> erroresStock;
}