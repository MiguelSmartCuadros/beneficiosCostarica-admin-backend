# Organización de Rutas en Swagger UI

Este documento explica cómo se organizan las secciones (tags) en la documentación de Swagger UI para el proyecto `beneficiosCostarica-admin-backend`.

## Archivo de Configuración

La configuración principal de Swagger se encuentra en:
`src/documentation/swagger.ts`

## Estrategia de Ordenamiento

Para mantener la documentación ordenada y fácil de navegar, seguimos la siguiente estrategia en el array `tags`:

1.  **ProjectInfo**: Se mantiene siempre como el primer elemento para mostrar la información general del proyecto al principio.
2.  **Orden Alfabético**: Todos los demás tags subsiguientes se ordenan alfabéticamente (A-Z).

## Estructura Actual

El array `tags` en `src/documentation/swagger.ts` está estructurado de la siguiente manera:

```typescript
tags: [
    // 1. ProjectInfo siempre primero
    {
      name: "ProjectInfo",
      description: "Información del proyecto"
    },
    // 2. El resto ordenado alfabéticamente
    {
      name: "AsignedCodesUser",
      description: "Gestión de códigos asignados a usuarios"
    },
    {
      name: "Authentication",
      description: "Endpoints de autenticación y gestión de usuarios"
    },
    {
      name: "Categories",
      description: "Gestión de categorías"
    },
    {
      name: "Discount Codes",
      description: "Gestión de códigos de descuento"
    },
    {
      name: "Document Type",
      description: "Gestión de tipos de documento de identidad"
    },
    // ... y así sucesivamente
]
```

## Cómo Agregar Nuevas Rutas

Si necesitas agregar una nueva sección (tag) a la documentación:

1.  Abre el archivo `src/documentation/swagger.ts`.
2.  Busca el array `tags`.
3.  Inserta el nuevo objeto de tag en la posición alfabética correcta.

**Ejemplo:**
Si agregas un tag llamado "Benefits", deberías insertarlo entre "Authentication" y "Categories".

```typescript
    {
      name: "Authentication",
      description: "..."
    },
    // Nuevo tag insertado aquí
    {
      name: "Benefits",
      description: "Gestión de beneficios"
    },
    {
      name: "Categories",
      description: "..."
    },
```

Esto asegura que la interfaz de usuario de Swagger refleje siempre un orden lógico y predecible.
