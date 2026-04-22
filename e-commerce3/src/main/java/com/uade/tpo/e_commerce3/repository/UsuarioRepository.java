package com.uade.tpo.e_commerce3.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce3.model.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    //Spring Security
    Optional<Usuario> findByEmail(String email);
    
    Boolean existsByEmail(String email);
}
