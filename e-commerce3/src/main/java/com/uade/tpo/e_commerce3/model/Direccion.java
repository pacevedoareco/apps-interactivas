package com.uade.tpo.e_commerce3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;

@Data
@Entity
@Table(name = "direccion")
@Builder
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String calle;
    private String numero;
    private String piso;
    private String departamento;
    private String ciudad;
    private String provincia;
    private String codigoPostal;
    private String pais;
    
    @OneToOne(mappedBy = "direccion")
    private Usuario usuario;

}