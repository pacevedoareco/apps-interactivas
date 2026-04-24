package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.CategoriaRequestDTO;
import com.uade.tpo.e_commerce3.dto.CategoriaResponseDTO;
import com.uade.tpo.e_commerce3.exception.ResourceNotFoundException;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    /*
     * Lógica para: GET /api/categorias
     * Devuelve el listado completo de categorías.
     * Se utiliza DTO para no exponer directamente la entidad.
     */
    public List<CategoriaResponseDTO> getAllCategorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::mapToCategoriaResponseDTO)
                .collect(Collectors.toList());
    }

    /*
     * Lógica para: GET /api/categorias/{id}
     * Devuelve una categoría específica por su ID.
     * Si no existe, lanza ResourceNotFoundException.
     */
    public CategoriaResponseDTO getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));

        return mapToCategoriaResponseDTO(categoria);
    }

    /*
     * Lógica para: POST /api/categorias
     * Crea una nueva categoría en el sistema.
     * Valida que tenga nombre antes de persistir.
     */
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO request) {
        validarCategoria(request);

        Categoria categoria = Categoria.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .build();

        Categoria guardada = categoriaRepository.save(categoria);

        return mapToCategoriaResponseDTO(guardada);
    }

    /*
     * Lógica para: PUT /api/categorias/{id}
     * Actualiza los datos de una categoría existente.
     * Permite modificar nombre y descripción.
     */
    public CategoriaResponseDTO updateCategoria(Long id, CategoriaRequestDTO request) {
        validarCategoria(request);

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));

        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());

        Categoria actualizada = categoriaRepository.save(categoria);

        return mapToCategoriaResponseDTO(actualizada);
    }

    /*
     * Lógica para: GET /api/categorias/{id}/productos
     * Devuelve los nombres de los productos asociados a una categoría.
     * Se usa para navegación o filtrado por categoría.
     */
    public List<String> getProductosByCategoriaId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));

        return categoria.getProductos()
                .stream()
                .map(Producto::getNombre)
                .collect(Collectors.toList());
    }

    /*
     * Valida que la categoría tenga nombre.
     */
    private void validarCategoria(CategoriaRequestDTO request) {
        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
        }
    }

    /*
     * Convierte la entidad Categoria en CategoriaResponseDTO.
     * Evita exponer la entidad directamente en la API.
     */
    private CategoriaResponseDTO mapToCategoriaResponseDTO(Categoria categoria) {
        return CategoriaResponseDTO.builder()
                .idCategoria(categoria.getIdCategoria())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .build();
    }
}