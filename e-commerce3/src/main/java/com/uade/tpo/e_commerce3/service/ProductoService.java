package com.uade.tpo.e_commerce3.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoRequestDTO;
import com.uade.tpo.e_commerce3.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce3.exception.PrecioNegativoException;
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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    /*
     * Lógica para: POST /api/productos
     * Crea una nueva publicación de producto.
     * Valida los datos recibidos, busca el vendedor, asocia las categorías,
     * asigna fecha de publicación automática y guarda el producto en la base.
     */
    public ProductoResponseDTO crearProducto(ProductoRequestDTO request) {
        validarProducto(request);

        Usuario vendedor = obtenerVendedor(request.getVendedorId());
        Set<Categoria> categorias = obtenerCategorias(request.getCategoriasIds());

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setMarca(request.getMarca());
        producto.setFechaPublicacion(LocalDate.now());
        producto.setEstadoProducto(obtenerEstadoProducto(request.getEstadoProducto()));
        producto.setCondicionPublicacion(obtenerCondicionPublicacion(request.getCondicionPublicacion()));
        producto.setVendedor(vendedor);
        producto.setCategorias(categorias);

        Producto guardado = productoRepository.save(producto);

        return mapToProductoResponseDTO(guardado);
    }

    /*
     * Lógica para: GET /api/productos
     * Devuelve el listado completo de productos.
     * Se usa ProductoResponseDTO para no exponer directamente la entidad.
     */
    public List<ProductoResponseDTO> getAllProductos() {
        return productoRepository.findAll()
                .stream()
                .map(this::mapToProductoResponseDTO)
                .collect(Collectors.toList());
    }

    /*
     * Lógica para: GET /api/productos/{id}
     * Devuelve el detalle de un producto específico.
     * Si el producto no existe, lanza ProductoNotFoundException.
     */
    public ProductoResponseDTO getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        return mapToProductoResponseDTO(producto);
    }

    /*
     * Lógica para: PUT /api/productos/{id}
     * Actualiza los datos de un producto existente.
     * Revalida precio, stock, vendedor y categorías antes de guardar los cambios.
     */
    public ProductoResponseDTO updateProducto(Long id, ProductoRequestDTO request) {
        validarProducto(request);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        Usuario vendedor = obtenerVendedor(request.getVendedorId());
        Set<Categoria> categorias = obtenerCategorias(request.getCategoriasIds());

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setMarca(request.getMarca());
        producto.setEstadoProducto(obtenerEstadoProducto(request.getEstadoProducto()));
        producto.setCondicionPublicacion(obtenerCondicionPublicacion(request.getCondicionPublicacion()));
        producto.setVendedor(vendedor);
        producto.setCategorias(categorias);

        Producto actualizado = productoRepository.save(producto);

        return mapToProductoResponseDTO(actualizado);
    }

    /*
     * Lógica para: DELETE /api/productos/{id}
     * Realiza una baja lógica del producto.
     * No elimina físicamente el registro para evitar problemas con futuras
     * relaciones de carrito, pedidos o historial de compras.
     */
    public void deleteProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));

        producto.setCondicionPublicacion(CondicionPublicacion.ELIMINADA);
        productoRepository.save(producto);
    }

    /*
     * Valida los datos obligatorios de un producto antes de crear o actualizar.
     */
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

        if (request.getVendedorId() == null) {
            throw new IllegalArgumentException("El producto debe tener un vendedor");
        }

        if (request.getCategoriasIds() == null || request.getCategoriasIds().isEmpty()) {
            throw new IllegalArgumentException("El producto debe tener al menos una categoría");
        }
    }

    /*
     * Busca el usuario vendedor asociado al producto.
     * Si no existe, devuelve error 404 mediante ResourceNotFoundException.
     */
    private Usuario obtenerVendedor(Long vendedorId) {
        return usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado con id: " + vendedorId));
    }

    /*
     * Busca las categorías recibidas por id y las asocia al producto.
     */
    private Set<Categoria> obtenerCategorias(List<Long> categoriasIds) {
        return categoriasIds.stream()
                .map(id -> categoriaRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id)))
                .collect(Collectors.toSet());
    }

    /*
     * Define el estado del producto.
     * Si no se informa, por defecto se asigna NUEVO.
     */
    private EstadoProducto obtenerEstadoProducto(String estadoProducto) {
        if (estadoProducto == null || estadoProducto.isBlank()) {
            return EstadoProducto.NUEVO;
        }

        return EstadoProducto.valueOf(estadoProducto);
    }

    /*
     * Define la condición de publicación.
     * Si no se informa, por defecto se asigna ACTIVA.
     */
    private CondicionPublicacion obtenerCondicionPublicacion(String condicionPublicacion) {
        if (condicionPublicacion == null || condicionPublicacion.isBlank()) {
            return CondicionPublicacion.ACTIVA;
        }

        return CondicionPublicacion.valueOf(condicionPublicacion);
    }

    /*
     * Convierte la entidad Producto en ProductoResponseDTO.
     * Esto evita exponer directamente la entidad JPA en las respuestas HTTP.
     */
    private ProductoResponseDTO mapToProductoResponseDTO(Producto producto) {
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
                .vendedorId(producto.getVendedor() != null ? producto.getVendedor().getId() : null)
                .categorias(
                        producto.getCategorias()
                                .stream()
                                .map(Categoria::getNombre)
                                .collect(Collectors.toList())
                )
                .build();
    }
}