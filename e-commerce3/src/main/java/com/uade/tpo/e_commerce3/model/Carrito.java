package com.uade.tpo.e_commerce3.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "carritos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Carrito {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private LocalDateTime fechaCreacion;

	@Column(nullable = false)
	private LocalDateTime fechaActualizacion;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoCarrito estado;

	@Column(nullable = false)
	private Double total;

	@ElementCollection
	@CollectionTable(name = "carrito_items", joinColumns = @JoinColumn(name = "carrito_id"))
	@Builder.Default
	private List<CarritoItem> items = new ArrayList<>();

	@PrePersist
	public void prePersist() {
		LocalDateTime ahora = LocalDateTime.now();
		this.fechaCreacion = ahora;
		this.fechaActualizacion = ahora;

		if (this.estado == null) {
			this.estado = EstadoCarrito.ACTIVO;
		}

		recalcularTotal();
	}

	@PreUpdate
	public void preUpdate() {
		this.fechaActualizacion = LocalDateTime.now();
		recalcularTotal();
	}

	public void recalcularTotal() {
		this.total = items.stream()
				.mapToDouble(CarritoItem::calcularSubtotal)
				.sum();
	}
}
