package com.uade.tpo.e_commerce3.config;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.CondicionPublicacion;
import com.uade.tpo.e_commerce3.model.Direccion;
import com.uade.tpo.e_commerce3.model.EstadoProducto;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepository,
            CategoriaRepository categoriaRepository,
            ProductoRepository productoRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Verificar si ya hay datos
            if (usuarioRepository.count() > 0) {
                return; // Ya hay datos, no insertar
            }

            // ==================== USUARIOS ====================
            
            // Usuario 1: Juan
            Direccion dir1 = Direccion.builder()
                    .calle("Av. Corrientes")
                    .numero("1234")
                    .piso("5")
                    .departamento("A")
                    .ciudad("Buenos Aires")
                    .provincia("CABA")
                    .codigoPostal("1043")
                    .pais("Argentina")
                    .build();
            
            Usuario juan = Usuario.builder()
                    .nombre("Juan")
                    .apellido("Pérez")
                    .email("juan@mail.com")
                    .password(passwordEncoder.encode("password123"))
                    .telefono("1234567890")
                    .activo(true)
                    .role(Role.USER)
                    .fechaNacimiento(Date.valueOf("1990-01-15"))
                    .direccion(dir1)
                    .build();
            dir1.setUsuario(juan);
            usuarioRepository.save(juan);

            // Usuario 2: María
            Direccion dir2 = Direccion.builder()
                    .calle("Calle Falsa")
                    .numero("456")
                    .piso("2")
                    .departamento("B")
                    .ciudad("Córdoba")
                    .provincia("Córdoba")
                    .codigoPostal("5000")
                    .pais("Argentina")
                    .build();
            
            Usuario maria = Usuario.builder()
                    .nombre("María")
                    .apellido("González")
                    .email("maria@mail.com")
                    .password(passwordEncoder.encode("password123"))
                    .telefono("0987654321")
                    .activo(true)
                    .role(Role.USER)
                    .fechaNacimiento(Date.valueOf("1992-05-20"))
                    .direccion(dir2)
                    .build();
            dir2.setUsuario(maria);
            usuarioRepository.save(maria);

            // Usuario 3: Admin
            Direccion dir3 = Direccion.builder()
                    .calle("Av. Libertador")
                    .numero("789")
                    .ciudad("Buenos Aires")
                    .provincia("CABA")
                    .codigoPostal("1425")
                    .pais("Argentina")
                    .build();
            
            Usuario admin = Usuario.builder()
                    .nombre("Admin")
                    .apellido("Sistema")
                    .email("admin@mail.com")
                    .password(passwordEncoder.encode("password123"))
                    .telefono("1122334455")
                    .activo(true)
                    .role(Role.ADMIN)
                    .fechaNacimiento(Date.valueOf("1985-03-10"))
                    .direccion(dir3)
                    .build();
            dir3.setUsuario(admin);
            usuarioRepository.save(admin);

            // Usuario 4: Carlos
            Direccion dir4 = Direccion.builder()
                    .calle("San Martín")
                    .numero("321")
                    .piso("1")
                    .departamento("C")
                    .ciudad("Rosario")
                    .provincia("Santa Fe")
                    .codigoPostal("2000")
                    .pais("Argentina")
                    .build();
            
            Usuario carlos = Usuario.builder()
                    .nombre("Carlos")
                    .apellido("Rodríguez")
                    .email("carlos@mail.com")
                    .password(passwordEncoder.encode("password123"))
                    .telefono("5566778899")
                    .activo(true)
                    .role(Role.USER)
                    .fechaNacimiento(Date.valueOf("1988-11-25"))
                    .direccion(dir4)
                    .build();
            dir4.setUsuario(carlos);
            usuarioRepository.save(carlos);

            // ==================== CATEGORÍAS ====================
            
            Categoria electronica = Categoria.builder()
                    .nombre("Tecnología Premium")
                    .descripcion("Dispositivos de alta gama y tecnología exclusiva")
                    .build();
            categoriaRepository.save(electronica);

            Categoria ropa = Categoria.builder()
                    .nombre("Moda de Lujo")
                    .descripcion("Alta costura y accesorios de diseñador")
                    .build();
            categoriaRepository.save(ropa);

            Categoria hogar = Categoria.builder()
                    .nombre("Diseño de Interiores")
                    .descripcion("Mobiliario y decoración de autor")
                    .build();
            categoriaRepository.save(hogar);

            Categoria deportes = Categoria.builder()
                    .nombre("Deportes de Elite")
                    .descripcion("Equipamiento deportivo profesional y exclusivo")
                    .build();
            categoriaRepository.save(deportes);

            Categoria libros = Categoria.builder()
                    .nombre("Colección Literaria")
                    .descripcion("Ediciones especiales y libros de colección")
                    .build();
            categoriaRepository.save(libros);

            // ==================== PRODUCTOS ====================
            
            Set<Categoria> catElectronica = new HashSet<>();
            catElectronica.add(electronica);
            
            Set<Categoria> catRopa = new HashSet<>();
            catRopa.add(ropa);
            
            Set<Categoria> catHogar = new HashSet<>();
            catHogar.add(hogar);
            
            Set<Categoria> catDeportes = new HashSet<>();
            catDeportes.add(deportes);
            
            Set<Categoria> catLibros = new HashSet<>();
            catLibros.add(libros);
            
            productoRepository.save(Producto.builder()
                    .nombre("MacBook Pro 16\" M3 Max")
                    .descripcion("MacBook Pro 16\" con chip M3 Max, 48GB RAM, 2TB SSD. Edición limitada Space Black. Incluye AppleCare+ y accesorios premium.")
                    .precio(4850.00)
                    .stock(3)
                    .marca("Apple")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(juan)
                    .categorias(catElectronica)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("iPhone 15 Pro Max 1TB Titanio")
                    .descripcion("iPhone 15 Pro Max en titanio natural, 1TB de almacenamiento. Edición exclusiva con grabado personalizado disponible.")
                    .precio(2299.00)
                    .stock(5)
                    .marca("Apple")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(juan)
                    .categorias(catElectronica)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Bang & Olufsen Beosound Theatre")
                    .descripcion("Sistema de sonido premium con tecnología Dolby Atmos. Acabado en aluminio y roble. Pieza de colección danesa.")
                    .precio(8500.00)
                    .stock(2)
                    .marca("Bang & Olufsen")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(maria)
                    .categorias(catElectronica)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Hermès Birkin 35 Togo")
                    .descripcion("Cartera Hermès Birkin 35 en cuero Togo color Étoupe. Herrajes en oro rosa. Certificado de autenticidad incluido.")
                    .precio(18500.00)
                    .stock(1)
                    .marca("Hermès")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(maria)
                    .categorias(catRopa)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Traje Ermenegildo Zegna Couture")
                    .descripcion("Traje de tres piezas confeccionado a medida en lana Super 180s. Colección Couture XXX. Incluye camisa de seda italiana.")
                    .precio(12800.00)
                    .stock(2)
                    .marca("Ermenegildo Zegna")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(carlos)
                    .categorias(catRopa)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Rolex Submariner Date Oro Amarillo")
                    .descripcion("Rolex Submariner Date ref. 126618LN en oro amarillo de 18 quilates. Esfera negra, bisel Cerachrom. Edición 2024 con papeles y caja.")
                    .precio(45900.00)
                    .stock(1)
                    .marca("Rolex")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(carlos)
                    .categorias(catRopa)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Sillón Barcelona de Knoll")
                    .descripcion("Réplica autorizada del icónico sillón Barcelona de Mies van der Rohe. Cuero italiano premium y estructura cromada. Edición numerada.")
                    .precio(8900.00)
                    .stock(4)
                    .marca("Knoll")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(juan)
                    .categorias(catHogar)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Lámpara Arco de Flos")
                    .descripcion("Lámpara de pie Arco diseñada por Achille Castiglioni. Base en mármol de Carrara, arco en acero inoxidable. Pieza de diseño italiano.")
                    .precio(3850.00)
                    .stock(3)
                    .marca("Flos")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(maria)
                    .categorias(catHogar)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Bicicleta Pinarello Dogma F")
                    .descripcion("Bicicleta de ruta Pinarello Dogma F con cuadro de carbono T1100 1K. Grupo Shimano Dura-Ace Di2. Edición Team Sky.")
                    .precio(15500.00)
                    .stock(2)
                    .marca("Pinarello")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(carlos)
                    .categorias(catDeportes)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Set de Golf Titleist Pro V1x Edición Limitada")
                    .descripcion("Set completo de palos Titleist con bolsa de cuero. Incluye 100 pelotas Pro V1x edición limitada Argentina Open. Numerado y firmado.")
                    .precio(9200.00)
                    .stock(3)
                    .marca("Titleist")
                    .estadoProducto(EstadoProducto.NUEVO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(juan)
                    .categorias(catDeportes)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Martín Fierro - Primera Edición 1872")
                    .descripcion("Primera edición de El Gaucho Martín Fierro de José Hernández (1872). Ejemplar restaurado profesionalmente. Certificado de autenticidad.")
                    .precio(28500.00)
                    .stock(1)
                    .marca("Imprenta La Pampa")
                    .estadoProducto(EstadoProducto.USADO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(maria)
                    .categorias(catLibros)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Rayuela - Edición Firmada por Cortázar")
                    .descripcion("Primera edición de Rayuela (1963) firmada por Julio Cortázar. Estado excepcional. Incluye carta de autenticidad y estuche de conservación.")
                    .precio(35000.00)
                    .stock(1)
                    .marca("Editorial Sudamericana")
                    .estadoProducto(EstadoProducto.USADO)
                    .condicionPublicacion(CondicionPublicacion.ACTIVA)
                    .fechaPublicacion(LocalDate.now())
                    .vendedor(carlos)
                    .categorias(catLibros)
                    .build());

            System.out.println("Datos de prueba cargados exitosamente");
        };
    }
}