package com.uade.tpo.e_commerce3.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.e_commerce3.model.Favorito;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    
    Optional<Favorito> findByUsuarioAndProducto(Usuario usuario, Producto producto);
    
    List<Favorito> findByUsuario(Usuario usuario);
    
    @Query("SELECT f.producto FROM Favorito f WHERE f.usuario = :usuario")
    List<Producto> findProductosFavoritosByUsuario(@Param("usuario") Usuario usuario);
    
    boolean existsByUsuarioAndProducto(Usuario usuario, Producto producto);
    
    void deleteByUsuarioAndProducto(Usuario usuario, Producto producto);
}

// Made with Bob
