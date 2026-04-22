package com.uade.tpo.e_commerce3.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// HACER

//TODO: ssanchez - es buena práctica crear excepciones personalizadas para cada categoría error, y manejarlas en un controlador de excepciones global con @ControllerAdvice, para centralizar el manejo de errores y evitar repetir código en cada controlador. Por ejemplo, se podría crear una excepción ProductoNotFoundException para manejar el caso cuando no se encuentra un producto, y otra excepción PrecioNegativoException para manejar el caso cuando se intenta guardar un producto con precio negativo. Luego, en el controlador de excepciones global, se podrían manejar estas excepciones y devolver una respuesta adecuada al cliente, como un código de estado HTTP 404 (Not Found) para ProductoNotFoundException, o un código de estado HTTP 400 (Bad Request) para PrecioNegativoException.

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductoNotFoundException.class)
    public ResponseEntity<String> manejarProductoNoEncontrado(ProductoNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());   
    }

    @ExceptionHandler(PrecioNegativoException.class)
    public ResponseEntity<String> manejarPrecioNegativo(PrecioNegativoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> manejarArgumentoInvalido(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> manejarErroresGenerales(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + ex.getMessage());
    }
}
