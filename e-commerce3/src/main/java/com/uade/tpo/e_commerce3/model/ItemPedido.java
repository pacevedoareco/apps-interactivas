package com.uade.tpo.e_commerce3.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "items_pedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreProducto;

    private Integer cantidad;

    private Double precioUnitario;

    private Double subtotal;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @PrePersist
    @PreUpdate
    public void calcularSubtotal() {
        if (cantidad != null && precioUnitario != null) {
            this.subtotal = cantidad * precioUnitario;
        } else {
            this.subtotal = 0.0;
        }
    }

    // PARA AGREGAR:
    // Cuando esté lista la entidad Producto, evaluar reemplazar nombreProducto por:
    //
    // @ManyToOne
    // @JoinColumn(name = "producto_id", nullable = false)
    // private Producto producto;
    //
    // Y mantener igualmente precioUnitario para congelar el valor al momento de la compra.
}
