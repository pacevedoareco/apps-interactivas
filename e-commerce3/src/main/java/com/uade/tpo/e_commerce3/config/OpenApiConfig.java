package com.uade.tpo.e_commerce3.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

/**
 * Configuración de OpenAPI/Swagger para la API de E-Commerce.
 * 
 * Esta clase configura:
 * 1. El esquema de seguridad JWT (Bearer Token)
 * 2. La información general de la API
 * 3. El requisito de seguridad global para todos los endpoints
 * 
 * Después de esta configuración, Swagger UI mostrará:
 * - Un botón "Authorize" en la parte superior derecha
 * - Documentación clara sobre la autenticación requerida
 * - Capacidad de probar endpoints protegidos con JWT
 * 
 * Uso en Swagger UI:
 * 1. Ejecutar POST /api/auth/login con credenciales válidas
 * 2. Copiar el token JWT de la respuesta
 * 3. Click en el botón "Authorize" 
 * 4. Pegar el token en el campo "Value" (sin el prefijo "Bearer ")
 * 5. Click "Authorize" y cerrar el modal
 * 6. Ahora todas las peticiones incluirán automáticamente el header:
 *    Authorization: Bearer {tu-token}
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "E-Commerce API",
        version = "1.0",
        description = "API REST para sistema de e-commerce con autenticación JWT. " +
                      "Para usar endpoints protegidos, primero hay que autenticarse con /api/auth/login " +
                      "y luego usar el botón 'Authorize' para agregar el token JWT.",
        contact = @Contact(
            name = "Grupo 4",
            email = "grupo4@uade"
        )
    ),
    security = @SecurityRequirement(name = "Bearer Authentication")
)
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer",
    description = "Ingresá el token JWT obtenido del endpoint /api/auth/login. " +
                  "No incluyas el prefijo 'Bearer ', solo el token."
)
public class OpenApiConfig {
    // Esta clase no necesita métodos.
    // Las anotaciones @OpenAPIDefinition y @SecurityScheme
    // configuran automáticamente Swagger UI.
}
