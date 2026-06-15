package com.uade.tpo.e_commerce3.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoRequestDTO;
import com.uade.tpo.e_commerce3.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce3.exception.PrecioNegativoException;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.exception.ResourceNotFoundException;
import com.uade.tpo.e_commerce3.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.CondicionPublicacion;
import com.uade.tpo.e_commerce3.model.EstadoProducto;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public ProductoResponseDTO crearProducto(ProductoRequestDTO request) {
        validarProducto(request);

        Usuario vendedor = obtenerUsuarioAutenticado();
        Set<Categoria> categorias = obtenerCategorias(request.getCategoriasIds());

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setMarca(request.getMarca());
        producto.setImagenUrl(normalizarImagenUrl(request.getImagenUrl()));
        producto.setFechaPublicacion(LocalDate.now());
        producto.setEstadoProducto(obtenerEstadoProducto(request.getEstadoProducto()));
        producto.setCondicionPublicacion(obtenerCondicionPublicacion(request.getCondicionPublicacion()));
        producto.setVendedor(vendedor);
        producto.setCategorias(categorias);

        Producto guardado = productoRepository.save(producto);
        return mapToProductoResponseDTO(guardado);
    }

    public List<ProductoResponseDTO> getAllProductos() {
        return productoRepository.findByCondicionPublicacion(CondicionPublicacion.ACTIVA)
                .stream()
                .map(this::mapToProductoResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoResponseDTO> getMisProductos() {
        Usuario vendedor = obtenerUsuarioAutenticado();
        return productoRepository.findByVendedorId(vendedor.getId())
                .stream()
                .filter(producto -> producto.getCondicionPublicacion() != CondicionPublicacion.ELIMINADA)
                .map(this::mapToProductoResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoResponseDTO> getAllProductosAdmin() {
        return productoRepository.findAll()
                .stream()
                .sorted(
                        Comparator
                                .comparing(Producto::getFechaPublicacion, Comparator.nullsLast(Comparator.reverseOrder()))
                                .thenComparing(Producto::getIdProducto, Comparator.nullsLast(Comparator.reverseOrder()))
                )
                .map(this::mapToProductoResponseDTO)
                .collect(Collectors.toList());
    }

    public ProductoResponseDTO getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        return mapToProductoResponseDTO(producto);
    }

    public ProductoResponseDTO updateProducto(Long id, ProductoRequestDTO request) {
        validarProducto(request);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        Usuario usuarioActual = obtenerUsuarioAutenticado();
        if (!producto.getVendedor().getId().equals(usuarioActual.getId())) {
            throw new IllegalArgumentException("No tenes permiso para editar este producto");
        }

        Set<Categoria> categorias = obtenerCategorias(request.getCategoriasIds());

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setMarca(request.getMarca());
        producto.setImagenUrl(normalizarImagenUrl(request.getImagenUrl()));
        producto.setEstadoProducto(obtenerEstadoProducto(request.getEstadoProducto()));
        producto.setCondicionPublicacion(obtenerCondicionPublicacion(request.getCondicionPublicacion()));
        producto.setCategorias(categorias);

        Producto actualizado = productoRepository.save(producto);
        return mapToProductoResponseDTO(actualizado);
    }

    public void deleteProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        Usuario usuarioActual = obtenerUsuarioAutenticado();
        if (!producto.getVendedor().getId().equals(usuarioActual.getId())) {
            throw new IllegalArgumentException("No tenes permiso para eliminar este producto");
        }

        producto.setCondicionPublicacion(CondicionPublicacion.ELIMINADA);
        productoRepository.save(producto);
    }

    private void validarProducto(ProductoRequestDTO request) {
        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }

        if (request.getPrecio() == null || request.getPrecio() < 0) {
            throw new PrecioNegativoException();
        }

        if (request.getStock() == null || request.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }

        if (request.getCategoriasIds() == null || request.getCategoriasIds().isEmpty()) {
            throw new IllegalArgumentException("El producto debe tener al menos una categoria");
        }

        if (request.getImagenUrl() != null && !request.getImagenUrl().isBlank()) {
            try {
                URI uri = new URI(request.getImagenUrl().trim());
                String scheme = uri.getScheme();
                if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                    throw new IllegalArgumentException("La imagen debe ser una URL valida http o https");
                }
            } catch (URISyntaxException exception) {
                throw new IllegalArgumentException("La imagen debe ser una URL valida http o https");
            }
        }
    }

    private Set<Categoria> obtenerCategorias(List<Long> categoriasIds) {
        return categoriasIds.stream()
                .map(id -> categoriaRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada con id: " + id)))
                .collect(Collectors.toSet());
    }

    private EstadoProducto obtenerEstadoProducto(String estadoProducto) {
        if (estadoProducto == null || estadoProducto.isBlank()) {
            return EstadoProducto.NUEVO;
        }

        return EstadoProducto.valueOf(estadoProducto);
    }

    private CondicionPublicacion obtenerCondicionPublicacion(String condicionPublicacion) {
        if (condicionPublicacion == null || condicionPublicacion.isBlank()) {
            return CondicionPublicacion.ACTIVA;
        }

        return CondicionPublicacion.valueOf(condicionPublicacion);
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

    private String normalizarImagenUrl(String imagenUrl) {
        if (imagenUrl == null || imagenUrl.isBlank()) {
            return null;
        }

        return imagenUrl.trim();
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
