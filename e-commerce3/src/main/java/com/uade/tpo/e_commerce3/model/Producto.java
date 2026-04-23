package com.uade.tpo.e_commerce3.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;

    private String nombre;

    private String descripcion;

    private Double precio;

    private Integer stock;

    private String marca;

    @Enumerated(EnumType.STRING)
    private EstadoProducto estadoProducto;

    @Enumerated(EnumType.STRING)
    private CondicionPublicacion condicionPublicacion;

    private LocalDate fechaPublicacion;

    // Un producto pertenece a un único vendedor.
    // Si más adelante se necesita, se puede agregar la relación inversa en Usuario.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Usuario vendedor;

    // Un producto puede pertenecer a varias categorías.
    // Se mantiene ManyToMany porque en el dominio del marketplace
    // un mismo producto puede clasificarse, por ejemplo, como "Relojes" y "Lujo".
    @ManyToMany
    @JoinTable(
        name = "producto_categoria",
        joinColumns = @JoinColumn(name = "id_producto"),
        inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    private Set<Categoria> categorias = new HashSet<>();
}