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
public class UsuarioCreateDTO {
    
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String telefono;
    private Date fechaNacimiento;
    private DireccionDTO direccion;
    private String role; // "USER" o "ADMIN"

}

