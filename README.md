# Mercado Exclusivo
## Marketplace de Compra y Venta
Trabajo Práctico Obligatorio

## Aplicaciones Interactivas | UADE | 1er Cuatrimestre 2026
 
*Grupo 4 - Alumnos*

●	ACEVEDO ARECO, PABLO 
●	ANDREUS, ANDREA 
●	CAPONE, FABRICIO 
●	MORELLO FLORES, MARIA LAURA 
●	SALVATIERRA, MARTINA 

## Descripción

Mercado Exclusivo es un marketplace de compra y venta de productos de alta gama, desarrollado en Java con Spring y MYSQL, similar en concepto a sistemas como MercadoLibre. La plataforma está orientada a un segmento exclusivo, ofreciendo artículos de lujo, edición limitada y colección, para una audiencia selecta. Permite a los usuarios registrarse, publicar productos para vender y realizar compras, todo dentro de un mismo sistema con autenticación segura, mediante JWT y control de acceso por roles.

## Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas, separando claramente las responsabilidades:
●	Presentación (Controllers): Recibe los requests HTTP y devuelve las respuestas.
●	 Lógica de Negocio (Services): Contiene la lógica del negocio, validaciones y conversiones entre entidades y DTOs.
●	Acceso a Datos (Repositories): Extiende JpaRepository para operaciones CRUD sobre la base de datos.
●	Dominio (Models + DTOs): Entidades JPA mapeadas a tablas y DTOs para transferir datos sin exponer la entidad.
●	Seguridad (Security): Spring Security con JWT para autenticación y autorización basada en roles.
●	Manejo de Excepciones: @ControllerAdvice con excepciones personalizadas para respuestas HTTP consistentes.
