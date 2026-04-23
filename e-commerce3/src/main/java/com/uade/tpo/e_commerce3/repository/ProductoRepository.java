package com.uade.tpo.e_commerce3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.e_commerce3.model.CondicionPublicacion;
import com.uade.tpo.e_commerce3.model.EstadoProducto;
import com.uade.tpo.e_commerce3.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findAllByOrderByNombreAsc();

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByCategorias_IdCategoria(Long idCategoria);

    List<Producto> findByPrecioBetween(Double precioMin, Double precioMax);

    List<Producto> findByVendedorId(Long vendedorId);

    List<Producto> findByEstadoProducto(EstadoProducto estadoProducto);

    List<Producto> findByCondicionPublicacion(CondicionPublicacion condicionPublicacion);

    List<Producto> findByStockGreaterThan(Integer stock);
}

