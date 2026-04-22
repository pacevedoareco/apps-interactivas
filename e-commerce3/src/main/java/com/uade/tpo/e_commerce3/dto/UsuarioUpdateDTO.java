package com.uade.tpo.e_commerce3.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioUpdateDTO {
    
    private String nombre;
    private String apellido;
    private String telefono;
    private Date fechaNacimiento;
    private DireccionDTO direccion;

}
