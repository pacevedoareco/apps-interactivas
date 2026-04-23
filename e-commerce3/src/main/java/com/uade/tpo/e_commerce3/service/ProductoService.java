package com.uade.tpo.e_commerce3.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoRequestDTO;
import com.uade.tpo.e_commerce3.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.exception.ResourceNotFoundException;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.CondicionPublicacion;
import com.uade.tpo.e_commerce3.model.EstadoProducto;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public ProductoResponseDTO crearProducto(ProductoRequestDTO dto) {

        if (dto.getPrecio() < 0) {
            throw new IllegalArgumentException("El precio no puede ser negativo");
        }

        Usuario vendedor = usuarioRepository.findById(dto.getVendedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));

        Set<Categoria> categorias = dto.getCategoriasIds().stream()
                .map(id -> categoriaRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + id)))
                .collect(Collectors.toSet());

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setMarca(dto.getMarca());

        /*
         * fechaPublicacion se genera automáticamente al crear el producto.
         */
        producto.setFechaPublicacion(LocalDate.now());

        /*
         * Si no se informa estadoProducto, se asigna NUEVO por defecto.
         */
        producto.setEstadoProducto(
                dto.getEstadoProducto() != null && !dto.getEstadoProducto().isBlank()
                        ? EstadoProducto.valueOf(dto.getEstadoProducto())
                        : EstadoProducto.NUEVO
        );

        /*
         * Si no se informa condicionPublicacion, se asigna ACTIVA por defecto.
         */
        producto.setCondicionPublicacion(
                dto.getCondicionPublicacion() != null && !dto.getCondicionPublicacion().isBlank()
                        ? CondicionPublicacion.valueOf(dto.getCondicionPublicacion())
                        : CondicionPublicacion.ACTIVA
        );

        producto.setVendedor(vendedor);
        producto.setCategorias(categorias);

        Producto guardado = productoRepository.save(producto);

        return mapToResponse(guardado);
    }

    public List<ProductoResponseDTO> getAllProductos() {
        return productoRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductoResponseDTO getProductoById(Long id) {
    Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ProductoNotFoundException(id));

    return mapToResponse(producto);
}

    private ProductoResponseDTO mapToResponse(Producto producto) {
        return ProductoResponseDTO.builder()
                .idProducto(producto.getIdProducto())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .marca(producto.getMarca())
                .estadoProducto(producto.getEstadoProducto() != null ? producto.getEstadoProducto().name() : null)
                .condicionPublicacion(producto.getCondicionPublicacion() != null ? producto.getCondicionPublicacion().name() : null)
                .fechaPublicacion(producto.getFechaPublicacion())
                .vendedorId(producto.getVendedor().getId())
                .categorias(
                        producto.getCategorias()
                                .stream()
                                .map(Categoria::getNombre)
                                .collect(Collectors.toList())
                )
                .build();
    }

    
}