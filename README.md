# Promo Code Engine

Un motor de validación y cálculo de descuentos para códigos promocionales desarrollado con NestJS y TypeScript, aplicando principios de arquitectura limpia (Clean Architecture), diseño guiado por el dominio (DDD) y patrones de diseño (Factory, Strategy, Decorator).

---

### Patrones de Diseño Utilizados

1. **Strategy Pattern (Patrón Estrategia)**
   - Utilizado en las estrategias de cálculo de descuentos (`DiscountStrategyInterface`):
     - `FixedDiscountStrategy`: Descuentos de monto fijo (ej. $10 USD de descuento).
     - `PercentDiscountStrategy`: Descuentos porcentuales (ej. 10% de descuento).
     - `TieredDiscountStrategy`: Descuentos escalonados basados en el historial del cliente (número de órdenes pagadas previas).
2. **Decorator Pattern (Patrón Decorador)**
   - Implementado en `MaxDiscountDecorator` para envolver cualquier estrategia de descuento y limitar dinámicamente el monto máximo descontado sin acoplar o modificar la lógica de las estrategias base.
3. **Factory Pattern (Patrón Fábrica)**
   - `ValidationRuleFactory`: Instancia reglas de validación configurables a partir de los datos almacenados en el código promocional.
   - `DiscountStrategyFactory`: Instancia la estrategia de descuento adecuada de acuerdo con el tipo de código promocional y aplica decoradores de ser necesario.
4. **Adapter Pattern (Patrón Adaptador)**
   - `OrderRequestAdapter`: Convierte las peticiones HTTP entrantes (`ValidatePromoCodeDto`) en una abstracción limpia de dominio (`OrderableInterface`), independizando el motor de las estructuras de transporte HTTP.

---

## Reglas del Motor de Validación

El proceso de validación del código se realiza en dos fases diferenciadas:

### 1. Reglas Fijas (Fase 1 - Estáticas)
Se evalúan siempre en orden prioritario. Si alguna falla, la validación se detiene inmediatamente:
- **`CodeExistsRule`**: Comprueba si el código realmente existe en el sistema.
- **`CodeActiveStatusRule`**: Comprueba que el estado del código sea `'active'`.
- **`CodeTemporalValidityRule`**: Valida que la fecha actual esté dentro de la vigencia del código (`startDate` y `endDate`).

### 2. Reglas Configurables (Fase 2 - Dinámicas)
Se configuran individualmente en cada código promocional según los requisitos del negocio:
- **`MinPurchaseRule`**: Exige un monto mínimo de compra en el subtotal.
- **`EligibleCategoriesRule`**: Valida que la categoría de la compra esté dentro de las permitidas (o sea descendiente de una categoría elegible).
- **`FirstOrderOnlyRule`**: Restringe el código únicamente para la primera compra exitosa del usuario.
- **`UserUsageLimitRule`**: Limita la cantidad de veces que un usuario específico puede aplicar el código.
- **`GlobalUsageLimitRule`**: Limita la cantidad total agregada de usos del código a nivel global en la plataforma.
- **`GlobalAmountLimitRule`**: Limita el monto acumulado total de descuento otorgado por el código globalmente.
- **`RestrictedUsageRule`**: Limita el código a un conjunto explícito de IDs de usuarios autorizados.

---

## Estructura del Directorio

```bash
src/
├── contracts/                  # Interfaces del dominio y puertos para infraestructura
├── controllers/                # Controladores HTTP y DTOs
│   └── dtos/
├── domain/                     # Entidades puras y objetos de valor del negocio
│   ├── entities/
│   └── ports/
├── engine/                     # Servicio del orquestador del motor (PromoCodeEngine)
├── infraestructure/            # Implementaciones en memoria de los repositorios y jerarquía
├── rules/                      # Reglas de validación
│   ├── configurable/           # Reglas opcionales/configurables
│   └── fixed/                  # Reglas fijas obligatorias
├── seeders/                    # Servicio para poblar datos de prueba (seeders)
└── strategies/                 # Estrategias de cálculo de descuento y decoradores
```

---

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior recomendada)
- npm o yarn

### Instalación
```bash
npm install
```

### Ejecutar Servidor en Desarrollo
```bash
npm run start:dev
```
El servidor levantará en `http://localhost:3000`.

---

## Pruebas de Software (Testing)

Se cuenta con una cobertura completa de pruebas unitarias y de integración utilizando **Jest**.

Ejecutar todas las pruebas:
```bash
npm run test
```

Ejecutar pruebas con cobertura (coverage):
```bash
npm run test:cov
```

---

## Endpoints de la API

### Validar Código Promocional
* **URL:** `/promo-codes/validate`
* **Método:** `POST`
* **Cuerpo de la Petición (`JSON`):**
```json
{
  "code": "BLACKFRIDAY10",
  "subtotal": 200,
  "userId": "user-demo",
  "categoryId": "digital-services",
  "orderHistory": [
    { "id": "order-1", "status": "paid", "categoryId": "digital-services" }
  ]
}
```

* **Respuesta Exitosa (Código Válido):**
```json
{
  "valid": true,
  "discountAmount": 20
}
```

* **Respuesta de Código Inválido/Expirado:**
```json
{
  "valid": false,
  "errorCode": "MIN_AMOUNT_REQUIRED"
}
```
