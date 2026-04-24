package com.uade.tpo.e_commerce3.exception;

import java.util.List;

import com.uade.tpo.e_commerce3.dto.StockErrorDTO;

public class CheckoutStockException extends RuntimeException {

    private final List<StockErrorDTO> errores;

    public CheckoutStockException(List<StockErrorDTO> errores) {
        super("El checkout fue rechazado por stock insuficiente en uno o más productos");
        this.errores = errores;
    }

    public List<StockErrorDTO> getErrores() {
        return errores;
    }
}