# Bloque de imágenes — especificación de implementación

**Contexto:** la ronda anterior cerró los tres bloqueantes (metadatos duplicados, dominio canónico y keywords). Verificado en producción el 2026-08-06. Queda el bloque de mayor impacto en rendimiento, que es el único de la Fase 2 que sigue sin ejecutar.

**Situación medida hoy, sobre el HTML servido:**

- 15 imágenes en la home. **14 con `width`/`height`** (bien), **0 con `srcset`**.
- Todas las fotos siguen en **PNG**. La home sigue en **≈26,5 MB**.
- Se sirven desde `pub-0dbc19d1502d4a47a1f049597dce1ed6.r2.dev`, el dominio público de desarrollo de Cloudflare R2.

---

## 0. Dos correcciones puntuales antes de empezar

### 0.1 `Carpinchos.png` tiene el `width`/`height` mal

Se declaró `800×600` (relación 4:3) a todas las portadas. Leyendo la cabecera de cada archivo en el origen:

| Archivo | Dimensiones reales | Relación real | Declarado | ¿Correcto? |
|---|---|---|---|---|
| `Azurra.png` | 1448×1086 | 1,33 | 800×600 | ✅ |
| `Marinas.png` | 1448×1086 | 1,33 | 800×600 | ✅ |
| `jardin-botanico.png` | 1433×1098 | 1,31 | 800×600 | ✅ (desvío 2 %) |
| **`Carpinchos.png`** | **1347×1167** | **1,15** | 800×600 | ❌ **desvío 15 %** |

El navegador reserva una caja 15 % más baja de lo que la imagen necesita, así que **en esa tarjeta el CLS no se corrigió**; y si el contenedor no fuerza `object-fit`, la foto sale deformada.

**Corrección:** las dimensiones se leen del archivo, no se asumen. Con la conversión del punto 2 salen del pipeline automáticamente.

### 0.2 Falta una imagen sin dimensiones

El primer `<img>` del navbar (`logo-estudio-levinton.png`) quedó sin `width`/`height`. Son 14 de 15.

---

## 1. Objetivo y criterio de éxito

| Métrica | Hoy | Objetivo |
|---|---|---|
| Peso total de la home | ≈26,5 MB | **< 1,5 MB** |
| Imágenes con `srcset` | 0/15 | 15/15 |
| Imágenes con `width`/`height` correctos | 14/15 (1 mal) | 15/15 |
| LCP en móvil (4G) | — | < 2,5 s |
| CLS | — | < 0,1 |

---

## 2. Camino recomendado: dominio propio sobre R2 + transformaciones en el borde

**Hacer esto primero. Resuelve la conversión y las variantes responsivas sin reprocesar un solo archivo a mano, y elimina el trabajo de los puntos 3 y 4.**

### 2.1 Mapear un dominio propio

1. En el panel de Cloudflare R2 → el bucket → **Settings → Custom Domains → Connect Domain**.
2. Usar `img.estudiolevinton.com`.
3. Cloudflare crea el registro DNS solo si el dominio está en su zona. Si el DNS está en otro proveedor, agregar el `CNAME` que indique el panel.

Además de habilitar las transformaciones, esto saca al sitio del dominio `*.r2.dev`, que **Cloudflare desaconseja explícitamente en producción**: está limitado por tasa y no pasa por las optimizaciones de su CDN.

### 2.2 Activar transformaciones de imagen

En el dashboard de Cloudflare → **Images → Transformations** → habilitar para la zona `estudiolevinton.com`.

A partir de ahí cualquier imagen se pide así:

```
https://img.estudiolevinton.com/cdn-cgi/image/width=800,format=auto,quality=80/img/portadas/Azurra.png
```

`format=auto` entrega **AVIF o WebP según lo que acepte el navegador**, con respaldo automático al original. No hay que convertir nada ni mantener copias.

### 2.3 Componente único de imagen

Centralizar en un solo componente para no repetir la lógica en ocho archivos:

```jsx
// src/components/Img/Img.jsx
const CDN = 'https://img.estudiolevinton.com/cdn-cgi/image';
const ANCHOS = [400, 800, 1200, 1920];

/**
 * @param {string} src   ruta dentro del bucket, ej. "/img/portadas/Azurra.png"
 * @param {number} width  ancho intrínseco real del archivo original
 * @param {number} height alto intrínseco real del archivo original
 * @param {string} sizes  ancho de presentación por breakpoint
 * @param {boolean} priority  true SOLO para el hero
 */
export function Img({ src, width, height, alt, sizes, priority = false, ...rest }) {
  const url = (w) => `${CDN}/width=${w},format=auto,quality=80/${src.replace(/^\//, '')}`;
  return (
    <img
      src={url(1200)}
      srcSet={ANCHOS.map((w) => `${url(w)} ${w}w`).join(', ')}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      {...rest}
    />
  );
}
```

**`width` y `height` tienen que ser los del archivo original**, no los de presentación. Es lo que fija la relación de aspecto; el CSS se encarga del tamaño en pantalla.

### 2.4 CSS obligatorio

Sin esto, declarar `width`/`height` **rompe el layout responsivo** — el navegador honra el alto literal:

```css
img {
  max-width: 100%;
  height: auto;   /* imprescindible: deja que el alto siga al ancho */
}
```

Donde la imagen se recorta en un contenedor de relación fija (las portadas, las fotos de Sergio y Adriana), además:

```css
.contenedor-foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 2.5 Valores de `sizes`

`sizes` le dice al navegador **cuánto espacio ocupa la imagen**, no cuánto mide el archivo. Si se omite, asume `100vw` y baja la variante más grande siempre — anulando el beneficio.

| Uso | `sizes` |
|---|---|
| Hero a ancho completo | `100vw` |
| Portadas en grilla de 3 columnas | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| Retratos de Sergio y Adriana | `(max-width: 640px) 50vw, 300px` |
| Logo del navbar | no lleva `srcset`: ver punto 5 |

### 2.6 Preload del hero

En el `<head>` de la home, únicamente para la imagen del hero:

```html
<link rel="preload" as="image"
      href="https://img.estudiolevinton.com/cdn-cgi/image/width=1920,format=auto,quality=80/img/hero.jpeg"
      imagesrcset="…mismo srcset que el <img>…"
      imagesizes="100vw" />
```

Sólo el hero. Precargar más imágenes compite por ancho de banda y **empeora** el LCP.

---

## 3. Camino alternativo, si el punto 2 no se puede

Si no hay acceso al panel de Cloudflare, conversión en build con `sharp`:

```bash
npm i -D sharp
```

```js
// scripts/optimize-images.js — corre antes del build
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ANCHOS = [400, 800, 1200, 1920];
const ENTRADA = 'assets-originales';
const SALIDA = 'public/img';

for (const archivo of await readdir(ENTRADA, { recursive: true })) {
  if (!/\.(png|jpe?g)$/i.test(archivo)) continue;
  const origen = path.join(ENTRADA, archivo);
  const base = archivo.replace(/\.[^.]+$/, '');
  const meta = await sharp(origen).metadata();   // ← de acá salen width/height reales
  await mkdir(path.dirname(path.join(SALIDA, base)), { recursive: true });
  for (const w of ANCHOS) {
    if (w > meta.width) continue;                // nunca agrandar
    await sharp(origen).resize(w)
      .webp({ quality: 80 })
      .toFile(path.join(SALIDA, `${base}-${w}.webp`));
    await sharp(origen).resize(w)
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(SALIDA, `${base}-${w}.jpg`));
  }
}
```

Y emitir `<picture>` con `<source type="image/webp">` más el `<img>` JPG de respaldo.

**Emitir además un `image-manifest.json` con las dimensiones reales de cada archivo**, y que el componente lea de ahí. Es lo que evita que se repita el error de `Carpinchos.png`: ningún número escrito a mano.

---

## 4. Referencia: qué pesa cada archivo hoy

| Archivo | Peso actual | Dimensiones reales | Esperado en WebP |
|---|---|---|---|
| `SIL 645.png` | 3,68 MB | — | ~150 KB |
| `Azurra.png` | 2,91 MB | 1448×1086 | ~120 KB |
| `Carpinchos.png` | 2,37 MB | 1347×1167 | ~110 KB |
| `Marinas.png` | — | 1448×1086 | ~120 KB |
| `jardin-botanico.png` | — | 1433×1098 | ~120 KB |
| `sergio.JPG` | 2,29 MB | 3872×2592 | ~60 KB a 800 px |

`Azurra.png` son 1448×1086 px pesando 2,91 MB: **1,85 bytes por píxel**. Un WebP de calidad visual equivalente ronda 0,08. Ese factor es de dónde sale el 95 %.

---

## 5. Puntos sueltos del mismo bloque

| # | Acción | Detalle |
|---|---|---|
| 5.1 | **Logo a SVG** | Hoy es PNG de 720×720 y 115 KB, mostrado a 36×36, y se descarga 3 veces por página. En SVG son ~4 KB. Si no hay vector, exportar PNG de 96×96. **No lleva `srcset`.** |
| 5.2 | **Dimensiones al logo del navbar** | Es la única de las 15 que quedó sin `width`/`height`. |
| 5.3 | **`Talar de Pacheco.png`** | Se muestra ampliada: el origen tiene 1184 px de ancho en un contenedor de 1792 px. Se ve borrosa. Hace falta el original en alta o reducir el contenedor. |
| 5.4 | **Renombrar sin espacios** | `SIL 645.png` → `casa-san-isidro-labrador-laguna.webp`. Los espacios en URL se codifican como `%20` y complican el cacheado. Dejar redirecciones 301 de las viejas. |
| 5.5 | **`og:image` a 1200×630** | Hoy la home usa el logo cuadrado y las fichas usan la portada de 1448×1086 (4:3). Las dos se recortan mal al compartir. Generar la variante con `width=1200,height=630,fit=cover` del mismo CDN. |
| 5.6 | **Purgar caché de Vercel al desplegar** | Se observó una cabecera `Age` de ~25 días. Sin purgar, los cambios tardan en verse. |

---

## 6. Orden de ejecución

1. **§2.1 y §2.2** — dominio propio + transformaciones. *Desbloquea todo lo demás, ~30 min.*
2. **§2.4** — el CSS de `height: auto`. **Antes de tocar ningún `<img>`**, o el layout se rompe.
3. **§2.3 y §2.5** — componente `Img` y los `sizes`, reemplazando las 15 etiquetas.
4. **§0.1, §0.2 y §5.2** — las dimensiones reales, que ahora salen del componente.
5. **§2.6** — preload del hero.
6. **§5.1, §5.3, §5.4, §5.5** — logo, imagen borrosa, nombres, `og:image`.

---

## 7. Verificación de cierre

```bash
BASE=https://www.estudiolevinton.com

# 1. Todas las imágenes con srcset y con dimensiones
curl -sL $BASE/ | grep -o '<img[^>]*>' > /tmp/imgs.txt
echo "total:   $(wc -l < /tmp/imgs.txt)"
echo "srcset:  $(grep -c 'srcset' /tmp/imgs.txt)"
echo "width:   $(grep -c 'width=' /tmp/imgs.txt)"
# esperado: los tres números iguales, salvo el logo (sin srcset)

# 2. Peso real de la home: sumar el Content-Length de cada recurso
#    Objetivo: < 1,5 MB. Medir con DevTools → Network → Disable cache → Fast 4G.

# 3. Formato entregado (debe decir image/webp o image/avif)
curl -sI -H "Accept: image/avif,image/webp,*/*" \
  "https://img.estudiolevinton.com/cdn-cgi/image/width=800,format=auto/img/portadas/Azurra.png" \
  | grep -i content-type

# 4. Relación de aspecto declarada == real, imagen por imagen
#    Sobre todo Carpinchos.png (1347×1167, NO es 4:3)
```

Y una corrida de PageSpeed Insights **en móvil** sobre `https://www.estudiolevinton.com/`, guardando el resultado antes y después para tener la comparación.

---

*Medidas tomadas sobre producción el 2026-08-06. Referencia: auditoría SEO del 2026-07-28, sección 9.*
