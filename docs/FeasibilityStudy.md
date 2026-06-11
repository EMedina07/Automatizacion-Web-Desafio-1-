# Estudio de Factibilidad: Automatización de "Nuevo Usuario"

**Aplicación:** https://demoqa.com/books  
**Funcionalidad evaluada:** Registro de Nuevo Usuario (`/register`)  
**Fecha:** 2026-06-10  
**Autor:** QA Automation Engineer

---

## 1. Descripción de la Funcionalidad

La página de registro (`https://demoqa.com/register`) permite crear una cuenta nueva en el Book Store Application. El formulario incluye los siguientes campos:

| Campo         | Tipo     | Validaciones                          |
|---------------|----------|---------------------------------------|
| First Name    | Texto    | Requerido                             |
| Last Name     | Texto    | Requerido                             |
| User Name     | Texto    | Requerido, único                      |
| Password      | Password | Requerido, mínimo 8 chars, mayúscula, número, símbolo |
| CAPTCHA       | reCAPTCHA v2 | Verificación humana — **bloqueante** |

---

## 2. Análisis de Factibilidad

### 2.1 Elementos Automatizables

Los campos del formulario (`#firstname`, `#lastname`, `#userName`, `#password`) son perfectamente automatizables con Playwright:

```typescript
await page.locator('#firstname').fill('Test');
await page.locator('#lastname').fill('User');
await page.locator('#userName').fill('testUser1');
await page.locator('#password').fill('Test@1234!');
```

Los campos no presentan mecanismos que impidan la automatización por sí solos.

### 2.2 Elemento Bloqueante: Google reCAPTCHA v2

El formulario de registro incluye un **Google reCAPTCHA v2** (`I'm not human` checkbox) que impide la automatización directa:

- El CAPTCHA requiere interacción humana real para ser resuelto.
- Playwright no puede interactuar con iframes de reCAPTCHA de forma confiable.
- Los servicios de resolución de CAPTCHA (2captcha, Anti-Captcha) violan los Términos de Servicio del sitio.
- No existe API pública documentada para crear usuarios en demoqa.com.

---

## 3. Veredicto

| Criterio                             | Resultado     |
|--------------------------------------|---------------|
| Campos del formulario automatizables | ✅ Sí          |
| Validaciones de formulario           | ✅ Sí          |
| CAPTCHA automatizable                | ❌ No          |
| API de creación de usuarios          | ❌ No disponible |
| **Factibilidad general**             | **⚠️ No recomendado** |

> **Conclusión:** La funcionalidad de "Nuevo Usuario" **NO es recomendable para automatización E2E** en su estado actual debido a la presencia de Google reCAPTCHA v2. Automatizar el CAPTCHA viola los Términos de Servicio de Google y no es mantenible a largo plazo.

---

## 4. Alternativas Recomendadas

### Opción A — Pre-creación manual de usuarios de prueba (recomendada)
Crear las cuentas necesarias para pruebas una sola vez manualmente, almacenar las credenciales en los archivos `jsonData/{env}/users.json` y usar esas cuentas en todos los tests de Login y funcionalidades protegidas. Esta es la estrategia adoptada en este framework.

### Opción B — API directa (si el entorno lo permite)
Si la aplicación estuviera en un entorno propio (staging/cert), se podría:
1. Deshabilitar el CAPTCHA en el entorno de pruebas.
2. Crear usuarios vía API REST directamente (sin pasar por el UI).

### Opción C — Test de contrato de la API de registro
Validar que el endpoint `/Account/v1/User` acepta el payload correcto y retorna `HTTP 201` con el `userId` generado, sin pasar por el UI.

---

## 5. Cobertura de Prueba Sugerida (si se elimina el CAPTCHA)

Si el CAPTCHA fuera removido del entorno de pruebas, los siguientes casos de prueba serían automatizables:

| # | Caso de Prueba                                          | Tipo     |
|---|---------------------------------------------------------|----------|
| 1 | Registro exitoso con todos los campos válidos           | Positivo |
| 2 | Registro fallido — username ya existe                   | Negativo |
| 3 | Registro fallido — password no cumple requisitos        | Negativo |
| 4 | Registro fallido — campos obligatorios vacíos           | Negativo |
| 5 | Login exitoso con la cuenta recién creada               | E2E      |
