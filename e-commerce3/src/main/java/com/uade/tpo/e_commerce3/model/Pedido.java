package com.uade.tpo.e_commerce3.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaCreacion;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    private Double total;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> items = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();

        if (this.estado == null) {
            this.estado = EstadoPedido.PENDIENTE;
        }

        if (this.total == null) {
            this.total = 0.0;
        }
    }

    // PARA AGREGAR:
    // Más adelante evaluar si conviene agregar:
    // - dirección de entrega
    // - observaciones
    // - método de pago
    // - relación con carrito/checkout
}
