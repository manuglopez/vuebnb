# Vuebnb

Clon sencillo de Airbnb: una portada con alojamientos agrupados por ciudad, la ficha de cada alojamiento con galería, servicios y precios, y una lista de guardados.

Nació en 2018 como el proyecto del libro *Full-Stack Vue.js 2 and Laravel 5* de Anthony Gore, sobre Laravel 5.5 y Vue 2. En 2026 se ha migrado entero a **Laravel 13 + Vue 3.5**, con dependencias actuales y sin vulnerabilidades conocidas.

## Stack

| Capa | Antes (2018) | Ahora |
|---|---|---|
| Backend | Laravel 5.5 | Laravel 13 (PHP ≥ 8.3) |
| Frontend | Vue 2 + Vuex | Vue 3.5 + Pinia + Vue Router 4 |
| Build | Laravel Mix (webpack) | Vite 8 + `laravel-vite-plugin` |
| Estilos | SCSS | CSS propio por capas (`original.css` + `design.css` con tokens) |
| Base de datos | MySQL | SQLite por defecto (cualquier driver de Laravel sirve) |
| Tests | PHPUnit | Pest/PHPUnit, cobertura con pcov y mutation testing con Infection |

### Seguridad

La versión de 2018 acumulaba casi 500 alertas de Dependabot (61 críticas y 210 altas) por dependencias antiguas de npm y Composer. Tras la migración, las tres auditorías salen limpias:

```bash
composer audit                  # No security vulnerability advisories found
npm audit --package-lock-only   # found 0 vulnerabilities
yarn audit                      # 0 vulnerabilities found
```

`.npmrc` lleva `ignore-scripts=true`, así que los paquetes de npm no ejecutan scripts al instalarse.

## Requisitos

- PHP 8.3 o superior con las extensiones `pdo_sqlite`, `mbstring` y `openssl`
- Composer 2
- Node.js `^20.19` o `>=22.12` (lo exige Vite 8) y npm

## Puesta en marcha

```bash
git clone https://github.com/manuglopez/vuebnb.git
cd vuebnb

composer install
cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate --seed      # crea las tablas y carga los 30 alojamientos de database/data.json

npm install
npm run build

php artisan serve               # http://127.0.0.1:8000
```

Para desarrollar con recarga en caliente, usa `composer dev`, que lanza a la vez el servidor de Laravel, la cola, los logs y Vite (este último con `yarn run dev`). Si no tienes yarn, arranca por separado `php artisan serve` y `npm run dev`.

## Rutas

| Ruta web | Ruta API | Qué devuelve |
|---|---|---|
| `/` | `/api/` | Portada: alojamientos agrupados por ciudad |
| `/saved` | `/api/saved` | Lista de guardados (se filtran en el cliente; viven en memoria, en el store de Pinia) |
| `/listing/{id}` | `/api/listing/{id}` | Ficha del alojamiento; 404 si no existe |

Las rutas web sirven la SPA con los datos iniciales incrustados en la página. Las rutas API devuelven JSON, y la SPA las usa al navegar sin recargar.

## Estructura

```
app/Http/Controllers/ListingController.php   controlador de las rutas web y API
app/Listing.php                              modelo (casts de servicios y precios)
database/data.json                           datos de ejemplo
public/images/{id}/                          fotos de cada alojamiento
resources/assets/js/                         SPA: main.js, router.js, store.js, components/
resources/assets/css/                        original.css + design.css (tokens en :root)
resources/views/app.blade.php                plantilla única de la SPA
```

Para retocar el diseño, cambia los tokens en `:root` de `design.css` en vez de tocar los componentes.

## Tests

Los tests usan SQLite en memoria; no hace falta ninguna base de datos externa.

```bash
php artisan test                                  # toda la suite
php artisan test --order-by=random                # en orden aleatorio
php artisan test --coverage --min=97              # cobertura (requiere pcov o Xdebug)
vendor/bin/infection --threads=4 --show-mutations # mutation testing (umbrales en infection.json5)
vendor/bin/pint --test                            # estilo
```

## Créditos y licencia

El proyecto original es de Anthony Gore ([fsvwd/vuebnb](https://github.com/fsvwd/vuebnb)), del libro *Full-Stack Vue.js 2 and Laravel 5* (Packt, 2017). Se distribuye con la misma licencia que el original, Creative Commons **BY-NC-ND 4.0** (ver [LICENSE](LICENSE)).
