package com.uade.tpo.e_commerce3.model;

import java.sql.Date;
//import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
@Builder
public class Usuario implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String email; // (único) (username)

    @Column(nullable = false)
    private String password;

    private String telefono;
    private boolean activo; // para suspender/eliminar sin borrar
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
    private Date fechaNacimiento;

    //Relaciones:
    @OneToOne(mappedBy = "usuario", fetch = FetchType.LAZY)
    private Direccion direccion;
    /*  En Direccion tendré:
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    */

    //@OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    //private List<Producto> productosPublicados = new ArrayList<>(); 
    /*  En Producto tendré:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    */

    //@OneToOne(mappedBy = "usuario", fetch = FetchType.LAZY)
    //private Carrito carrito;
    /*  En Carrito tendré:
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    */

    //@OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    //private List<Pedido> pedidos = new ArrayList<>(); 
    /*  En Pedido tendré:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    */


    //SpringSecurity
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // resultado ROLE_USER o ROLE_ADMIN
        return List.of(new SimpleGrantedAuthority("ROLE_" + (role != null ? role.name() : "USER")));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}