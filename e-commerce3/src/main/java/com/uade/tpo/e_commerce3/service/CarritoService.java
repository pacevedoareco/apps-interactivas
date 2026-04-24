package com.uade.tpo.e_commerce3.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.AgregarItemRequestDTO;
import com.uade.tpo.e_commerce3.dto.CarritoItemResponseDTO;
import com.uade.tpo.e_commerce3.dto.CarritoResponseDTO;
import com.uade.tpo.e_commerce3.dto.CarritoResumenResponseDTO;
import com.uade.tpo.e_commerce3.dto.ItemPedidoResponseDTO;
import com.uade.tpo.e_commerce3.dto.ModificarItemRequest;
import com.uade.tpo.e_commerce3.dto.PedidoResponseDTO;
import com.uade.tpo.e_commerce3.dto.StockErrorDTO;
import com.uade.tpo.e_commerce3.exception.CheckoutStockException;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce3.model.Carrito;
import com.uade.tpo.e_commerce3.model.CarritoItem;
import com.uade.tpo.e_commerce3.model.EstadoCarrito;
import com.uade.tpo.e_commerce3.model.EstadoPedido;
import com.uade.tpo.e_commerce3.model.ItemPedido;
import com.uade.tpo.e_commerce3.model.Pedido;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.repository.PedidoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;

    public CarritoResponseDTO obtenerCarritoAutenticado() {
        Usuario usuario = obtenerUsuarioAutenticado();
        Carrito carrito = obtenerOCrearCarrito(usuario);
        return mapearCarrito(carrito, false);
    }

    public void vaciarCarritoAutenticado() {
        Usuario usuario = obtenerUsuarioAutenticado();
        Carrito carrito = obtenerOCrearCarrito(usuario);
        carrito.getItems().clear();
        carrito.setEstado(EstadoCarrito.ACTIVO);
        carrito.recalcularTotal();
        carritoRepository.save(carrito);
    }

    public CarritoResponseDTO agregarItem(AgregarItemRequestDTO request) {
        validarCantidad(request.getCantidad());

        Usuario usuario = obtenerUsuarioAutenticado();
        Carrito carrito = obtenerOCrearCarrito(usuario);

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ProductoNotFoundException(request.getProductoId()));

        Optional<CarritoItem> itemExistente = carrito.getItems().stream()
                .filter(item -> Objects.equals(item.getProducto().getIdProducto(), producto.getIdProducto()))
                .findFirst();

        if (itemExistente.isPresent()) {
            CarritoItem item = itemExistente.get();
            item.setCantidad(item.getCantidad() + request.getCantidad());
            item.setPrecioUnitario(producto.getPrecio());
            item.calcularSubtotal();
        } else {
            CarritoItem nuevoItem = CarritoItem.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .cantidad(request.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .subtotal(producto.getPrecio() * request.getCantidad())
                    .build();
            carrito.getItems().add(nuevoItem);
        }

        carrito.setEstado(EstadoCarrito.ACTIVO);
        carrito.recalcularTotal();
        return mapearCarrito(carritoRepository.save(carrito), false);
    }

    public CarritoResponseDTO modificarCantidadItem(Long itemId, ModificarItemRequest request) {
        validarCantidad(request.getCantidad());

        Usuario usuario = obtenerUsuarioAutenticado();
        Carrito carrito = obtenerOCrearCarrito(usuario);

        CarritoItem item = buscarItemEnCarrito(carrito, itemId);
        item.setCantidad(request.getCantidad());
        item.setPrecioUnitario(item.getProducto().getPrecio());
        item.calcularSubtotal();

        carrito.setEstado(EstadoCarrito.ACTIVO);
        carrito.recalcularTotal();
        return mapearCarrito(carritoRepository.save(carrito), false);
    }

    public CarritoResponseDTO eliminarItem(Long itemId) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Carrito carrito = obtenerOCrearCarrito(usuario);

        boolean removed = carrito.getItems().removeIf(item -> Objects.equals(item.getId(), itemId));
        if (!removed) {
            throw new IllegalArgumentException("No existe el item " + itemId + " en el carrito actual");
        }

        carrito.setEstado(EstadoCarrito.ACTIVO);
        carrito.recalcularTotal();
        return mapearCarrito(carritoRepository.save(carrito), false);
    }

    public CarritoResumenResponseDTO obtenerResumenCheckout() {
        Usuario usuario = obtenerUsuarioAutenticado();
        Carrito carrito = obtenerOCrearCarrito(usuario);

        List<StockErrorDTO> erroresStock = calcularErroresStock(carrito);
        CarritoResponseDTO carritoDTO = mapearCarrito(carrito, true);

        return CarritoResumenResponseDTO.builder()
                .total(carritoDTO.getTotal())
                .items(carritoDTO.getItems())
                .stockValido(erroresStock.isEmpty())
                .erroresStock(erroresStock)
                .build();
    }

    public PedidoResponseDTO checkout() {
        Usuario usuario = obtenerUsuarioAutenticado();
        Carrito carrito = obtenerOCrearCarrito(usuario);

        if (carrito.getItems().isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío");
        }

        List<StockErrorDTO> erroresStock = calcularErroresStock(carrito);
        if (!erroresStock.isEmpty()) {
            throw new CheckoutStockException(erroresStock);
        }

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .estado(EstadoPedido.CONFIRMADO)
                .total(0.0)
                .build();

        List<ItemPedido> itemsPedido = new ArrayList<>();
        for (CarritoItem itemCarrito : carrito.getItems()) {
            Producto producto = itemCarrito.getProducto();
            producto.setStock(producto.getStock() - itemCarrito.getCantidad());

            ItemPedido itemPedido = ItemPedido.builder()
                    .pedido(pedido)
                    .producto(producto)
                    .cantidad(itemCarrito.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .build();
            itemPedido.calcularSubtotal();
            itemsPedido.add(itemPedido);
        }

        double totalPedido = itemsPedido.stream()
                .mapToDouble(item -> {
                    Double subtotal = item.getSubtotal();
                    if (subtotal == null) {
                        return 0.0;
                    }
                    return subtotal;
                })
                .sum();

        pedido.setItems(itemsPedido);
        pedido.setTotal(totalPedido);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        carrito.getItems().clear();
        carrito.setEstado(EstadoCarrito.CHECKOUT_REALIZADO);
        carrito.recalcularTotal();
        carritoRepository.save(carrito);

        return mapearPedido(pedidoGuardado);
    }

    private CarritoItem buscarItemEnCarrito(Carrito carrito, Long itemId) {
        return carrito.getItems().stream()
                .filter(item -> Objects.equals(item.getId(), itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No existe el item " + itemId + " en el carrito actual"));
    }

    private void validarCantidad(Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }
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

    private Carrito obtenerOCrearCarrito(Usuario usuario) {
        return carritoRepository.findByUsuarioId(usuario.getId())
                .orElseGet(() -> {
                    Carrito carrito = Carrito.builder()
                            .usuario(usuario)
                            .estado(EstadoCarrito.ACTIVO)
                            .total(0.0)
                            .items(new ArrayList<>())
                            .build();
                    return carritoRepository.save(carrito);
                });
    }

    private List<StockErrorDTO> calcularErroresStock(Carrito carrito) {
        return carrito.getItems().stream()
                .filter(item -> item.getProducto().getStock() < item.getCantidad())
                .map(item -> StockErrorDTO.builder()
                        .itemId(item.getId())
                        .productoId(item.getProducto().getIdProducto())
                        .nombreProducto(item.getProducto().getNombre())
                        .cantidadSolicitada(item.getCantidad())
                        .stockDisponible(item.getProducto().getStock())
                        .build())
                .collect(Collectors.toList());
    }

    private CarritoResponseDTO mapearCarrito(Carrito carrito, boolean incluirStock) {
        List<CarritoItemResponseDTO> items = carrito.getItems().stream()
                .map(item -> {
                    Integer stock = item.getProducto().getStock();
                    boolean stockSuficiente = stock >= item.getCantidad();
                    return CarritoItemResponseDTO.builder()
                            .id(item.getId())
                            .productoId(item.getProducto().getIdProducto())
                            .nombreProducto(item.getProducto().getNombre())
                            .cantidad(item.getCantidad())
                            .precioUnitario(item.getPrecioUnitario())
                            .subtotal(item.getSubtotal())
                            .stockDisponible(incluirStock ? stock : null)
                            .stockSuficiente(incluirStock ? stockSuficiente : null)
                            .build();
                })
                .collect(Collectors.toList());

        return new CarritoResponseDTO(
                carrito.getId(),
                carrito.getTotal(),
                carrito.getEstado().name(),
                carrito.getFechaCreacion() != null ? carrito.getFechaCreacion().toString() : null,
                carrito.getFechaActualizacion() != null ? carrito.getFechaActualizacion().toString() : null,
                items
        );
    }

    private PedidoResponseDTO mapearPedido(Pedido pedido) {
        List<ItemPedidoResponseDTO> items = pedido.getItems().stream()
                .map(item -> new ItemPedidoResponseDTO(
                        item.getId(),
                        item.getProducto().getIdProducto(),
                        item.getProducto().getNombre(),
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getFechaCreacion(),
                pedido.getEstado(),
                pedido.getTotal(),
                pedido.getUsuario().getId(),
                items
        );
    }
}