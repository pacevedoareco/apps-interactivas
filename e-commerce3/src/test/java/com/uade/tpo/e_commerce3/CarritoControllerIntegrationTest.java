package com.uade.tpo.e_commerce3;

import com.uade.tpo.e_commerce3.model.CondicionPublicacion;
import com.uade.tpo.e_commerce3.model.EstadoProducto;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.PedidoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CarritoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    private Usuario comprador;
    private Usuario vendedor;

    @BeforeEach
    void setUp() {
        pedidoRepository.deleteAll();
        productoRepository.deleteAll();
        usuarioRepository.deleteAll();

        comprador = usuarioRepository.save(Usuario.builder()
                .nombre("Juan")
                .apellido("Comprador")
                .email("comprador@test.com")
                .password("1234")
                .activo(true)
                .role(Role.USER)
                .build());

        vendedor = usuarioRepository.save(Usuario.builder()
                .nombre("Ana")
                .apellido("Vendedora")
                .email("vendedora@test.com")
                .password("1234")
                .activo(true)
                .role(Role.USER)
                .build());
    }

    @Test
    void checkoutExitoso_descuentaStock_generaPedido_yVaciaCarrito() throws Exception {
        Producto producto = guardarProducto("Notebook", 1500.0, 10);

        mockMvc.perform(post("/api/carrito/items")
                        .with(user(comprador.getEmail()).roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productoId\":" + producto.getIdProducto() + ",\"cantidad\":2}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.total").value(3000.0));

        mockMvc.perform(post("/api/carrito/checkout")
                        .with(user(comprador.getEmail()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CONFIRMADO"))
                .andExpect(jsonPath("$.total").value(3000.0))
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.items[0].cantidad").value(2))
                .andExpect(jsonPath("$.items[0].precioUnitario").value(1500.0));

        mockMvc.perform(get("/api/carrito")
                        .with(user(comprador.getEmail()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CHECKOUT_REALIZADO"))
                .andExpect(jsonPath("$.total").value(0.0))
                .andExpect(jsonPath("$.items.length()").value(0));

        Producto productoActualizado = productoRepository.findById(producto.getIdProducto()).orElseThrow();
        assertThat(productoActualizado.getStock()).isEqualTo(8);
        assertThat(pedidoRepository.findAll()).hasSize(1);
    }

    @Test
    void checkoutConStockInsuficiente_rechazaCompleto_eInformaErrores() throws Exception {
        Producto producto = guardarProducto("Mouse", 100.0, 1);

        mockMvc.perform(post("/api/carrito/items")
                        .with(user(comprador.getEmail()).roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productoId\":" + producto.getIdProducto() + ",\"cantidad\":2}"))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/carrito/checkout")
                        .with(user(comprador.getEmail()).roles("USER")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.errores.length()").value(1))
                .andExpect(jsonPath("$.errores[0].productoId").value(producto.getIdProducto()))
                .andExpect(jsonPath("$.errores[0].stockDisponible").value(1))
                .andExpect(jsonPath("$.errores[0].cantidadSolicitada").value(2));

        Producto productoSinCambios = productoRepository.findById(producto.getIdProducto()).orElseThrow();
        assertThat(productoSinCambios.getStock()).isEqualTo(1);
        assertThat(pedidoRepository.findAll()).isEmpty();

        mockMvc.perform(get("/api/carrito")
                        .with(user(comprador.getEmail()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.total").value(200.0));
    }

    private Producto guardarProducto(String nombre, Double precio, Integer stock) {
        return productoRepository.save(Producto.builder()
                .nombre(nombre)
                .descripcion("Producto de prueba")
                .precio(precio)
                .stock(stock)
                .marca("Marca Test")
                .estadoProducto(EstadoProducto.NUEVO)
                .condicionPublicacion(CondicionPublicacion.ACTIVA)
                .fechaPublicacion(LocalDate.now())
                .vendedor(vendedor)
                .build());
    }
}