package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.Favorito;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.FavoritoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public void agregarFavorito(Long productoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ProductoNotFoundException(productoId));

        if (!favoritoRepository.existsByUsuarioAndProducto(usuario, producto)) {
            Favorito favorito = Favorito.builder()
                    .usuario(usuario)
                    .producto(producto)
                    .build();
            favoritoRepository.save(favorito);
        }
    }

    public void eliminarFavorito(Long productoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ProductoNotFoundException(productoId));

        favoritoRepository.deleteByUsuarioAndProducto(usuario, producto);
    }

    public List<ProductoResponseDTO> obtenerFavoritos() {
        Usuario usuario = obtenerUsuarioAutenticado();
        List<Producto> productos = favoritoRepository.findProductosFavoritosByUsuario(usuario);
        
        return productos.stream()
                .map(this::mapToProductoResponseDTO)
                .collect(Collectors.toList());
    }

    public boolean esFavorito(Long productoId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ProductoNotFoundException(productoId));

        return favoritoRepository.existsByUsuarioAndProducto(usuario, producto);
    }

    private ProductoResponseDTO mapToProductoResponseDTO(Producto producto) {
        return ProductoResponseDTO.builder()
                .idProducto(producto.getIdProducto())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .marca(producto.getMarca())
                .imagenUrl(producto.getImagenUrl())
                .estadoProducto(producto.getEstadoProducto() != null ? producto.getEstadoProducto().name() : null)
                .condicionPublicacion(producto.getCondicionPublicacion() != null ? producto.getCondicionPublicacion().name() : null)
                .fechaPublicacion(producto.getFechaPublicacion())
                .vendedorId(producto.getVendedor() != null ? producto.getVendedor().getId() : null)
                .categorias(
                        producto.getCategorias()
                                .stream()
                                .map(Categoria::getNombre)
                                .collect(Collectors.toList())
                )
                .build();
    }

    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("No hay usuario autenticado");
        }

        String email = authentication.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException(email));
    }
}

// Made with Bob
