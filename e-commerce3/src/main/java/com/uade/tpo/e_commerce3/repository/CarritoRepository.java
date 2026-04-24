package com.uade.tpo.e_commerce3.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.e_commerce3.model.Carrito;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuarioId(Long usuarioId);
}