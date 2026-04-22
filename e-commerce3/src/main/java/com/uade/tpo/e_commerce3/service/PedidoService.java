package com.uade.tpo.e_commerce3.service;

import com.uade.tpo.e_commerce3.dto.CrearPedidoRequestDTO;
import com.uade.tpo.e_commerce3.dto.ItemPedidoResponseDTO;
import com.uade.tpo.e_commerce3.dto.PedidoResponseDTO;
import com.uade.tpo.e_commerce3.model.EstadoPedido;
import com.uade.tpo.e_commerce3.model.ItemPedido;
import com.uade.tpo.e_commerce3.model.Pedido;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.ItemPedidoRepository;
import com.uade.tpo.e_commerce3.repository.PedidoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                        ItemPedidoRepository itemPedidoRepository,
                        UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<PedidoResponseDTO> obtenerTodos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::convertirAPedidoResponseDTO)
                .collect(Collectors.toList());
    }

    public PedidoResponseDTO obtenerPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + id));

        return convertirAPedidoResponseDTO(pedido);
    }

    public PedidoResponseDTO crearPedido(CrearPedidoRequestDTO requestDTO) {
        // IMPLEMENTACIÓN PROVISORIA
        // Este método crea pedidos sin validar stock ni integrar Producto/Carrito.
        // Se utiliza únicamente para pruebas.

        Usuario usuario = usuarioRepository.findById(requestDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .estado(EstadoPedido.PENDIENTE)
                .total(0.0)
                .build();

        List<ItemPedido> items = requestDTO.getItems().stream().map(itemDTO ->
                ItemPedido.builder()
                        .nombreProducto(itemDTO.getNombreProducto())
                        .cantidad(itemDTO.getCantidad())
                        .precioUnitario(itemDTO.getPrecioUnitario())
                        .pedido(pedido)
                        .build()
        ).collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(item -> item.getCantidad() * item.getPrecioUnitario())
                .sum();

        pedido.setItems(items);
        pedido.setTotal(total);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        
        return convertirAPedidoResponseDTO(pedidoGuardado);
    }

    public PedidoResponseDTO cancelarPedido(Long id) {
        // IMPLEMENTACIÓN PROVISORIA
        // No valida estados previos ni reglas de negocio

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + id));

        pedido.setEstado(EstadoPedido.CANCELADO);

        Pedido pedidoActualizado = pedidoRepository.save(pedido);

        return convertirAPedidoResponseDTO(pedidoActualizado);
    }

    private PedidoResponseDTO convertirAPedidoResponseDTO(Pedido pedido) {
        List<ItemPedidoResponseDTO> itemsDTO = pedido.getItems()
                .stream()
                .map(item -> new ItemPedidoResponseDTO(
                        item.getId(),
                        item.getNombreProducto(),
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
                itemsDTO
        );
    }

    // PARA AGREGAR:
    // Más adelante crear métodos auxiliares privados para:
    // - calcular total del pedido
    // - validar items
    // - mapear requestDTO a entidades
    // - integrar producto/carrito/checkout
}
