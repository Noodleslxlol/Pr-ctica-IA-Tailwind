# DevSpace Portfolio

Portafolio académico de un estudiante de Ingeniería de Software, construido con **HTML5, Tailwind CSS 4 y JavaScript puro**, con apoyo de inteligencia artificial.

- **Sitio publicado:** https://noodleslxlol.github.io/devspace-portfolio/
- **Autor:** Dilant Steven Almanza Figueroa


## Características

- Diseño mobile-first y responsive (prefijos `sm`, `md` y `lg`).
- Navbar fija con menú hamburguesa en celular.
- Modo oscuro con botón; recuerda la elección del usuario.
- Tema propio con `@theme` y regla 60-30-10: #0B1220 (60 %), #1E293B (30 %), #22D3EE (10 %); éxito #22C55E, error #EF4444, advertencia #F59E0B.
- Dos fuentes de Google Fonts: Inter (texto) y Space Grotesk (títulos).
- Formulario validado con JavaScript (campos obligatorios y correo válido), errores junto a cada campo y toast de confirmación. Es una demostración: no envía correos.
- Componentes extra: acordeón de preguntas frecuentes y filtro de proyectos.
- Accesibilidad: contraste ≥ 4.5:1, textos alternativos, etiquetas en los campos y foco visible.

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica |
| Tailwind CSS 4 (CLI) | Estilos; el tema está en `src/input.css` |
| JavaScript sin librerías | Menú, modo oscuro, acordeón, filtro, validación y toast |

## Estructura

```
├── index.html          Página principal
├── src/input.css       Entrada de Tailwind (@import, modo oscuro y @theme)
├── dist/output.css     CSS compilado que usa la página
├── js/script.js        Interacción
└── assets/images/      Ilustraciones SVG
```

## Cómo ejecutarlo

```bash
npm install
npm run build    # genera dist/output.css
npm run dev      # recompila mientras editas
```

Luego abre `index.html` en el navegador.

## Bitácora de prompts

Herramienta de IA usada: Claude (Anthropic). Cada iteración registra el problema detectado, el cambio y la prueba que lo comprobó.

### Prompt maestro (5 partes)

**Rol.** Actúa como desarrollador frontend senior especializado en HTML5 semántico, Tailwind CSS 4, JavaScript puro, diseño responsive y accesibilidad web (WCAG 2.2 AA).

**Contexto.** Voy a crear "DevSpace Portfolio", el portafolio personal de un estudiante de Ingeniería de Software. Está dirigido a reclutadores tecnológicos, desarrolladores, estudiantes de programación y personas interesadas en tecnología. Debe presentar perfil académico, habilidades, proyectos académicos, intereses (incluido el desarrollo de videojuegos) y contacto. El estilo es moderno, tecnológico, minimalista y profesional, sin abusar de sombras, degradados ni animaciones. No inventes experiencia laboral, certificaciones ni proyectos reales: usa contenido demostrativo claramente marcado como editable.

**Tareas.** Construye una página única con, en este orden:
1. Navbar fija con logotipo, enlaces a cada sección, botón de modo oscuro y menú hamburguesa en celular que se abra y se cierre con JavaScript (también con Escape y al elegir un enlace).
2. Hero con H1, subtítulo, descripción y dos botones ("Ver proyectos" y "Contactar").
3. Sección "Sobre mí".
4. Habilidades tecnológicas agrupadas en tarjetas.
5. Proyectos en tarjetas (1 columna en celular, 2 en tablet, 3 en computador) con imagen, título, descripción, etiquetas y enlace, más un filtro por categoría.
6. Preguntas frecuentes en acordeón accesible (aria-expanded / aria-controls).
7. Formulario de contacto (nombre, correo, asunto, mensaje) validado con JavaScript: campos obligatorios, correo válido, error debajo de cada campo y toast verde de confirmación que desaparece a los 4 segundos. No simules el envío de correos.
8. Footer con derechos y enlaces.

**Restricciones.** Solo HTML, Tailwind CSS 4 compilado con Tailwind CLI y JavaScript puro (sin Bootstrap, React, Vue ni librerías). Define el tema con `@theme`: 60 % #0B1220, 30 % #1E293B, 10 % #22D3EE; éxito #22C55E, error #EF4444, advertencia #F59E0B. Máximo dos fuentes de Google Fonts: Inter y Space Grotesk. Mobile-first con al menos los prefijos sm, md y lg. Contraste mínimo 4.5:1 en texto normal, `alt` en todas las imágenes, `label` en todos los campos, foco visible, navegación por teclado, desplazamiento suave y respeto de `prefers-reduced-motion`. No construyas nombres de clase dinámicamente.

**Formato de salida.** Archivos separados: `index.html`, `src/input.css`, `js/script.js` y `package.json` con los scripts de compilación. Comentarios en español que separen cada sección. Imágenes propias en `assets/images/`. Al final, explica cómo compilar y abrir el sitio y qué partes se deben personalizar.

### Iteraciones

| # | Prompt de ajuste enviado | Problema que buscaba resolver | Modificación efectuada | Archivo(s) | Resultado obtenido | Prueba utilizada | ¿Funcionó? |
|---|---|---|---|---|---|---|---|
| 1 | (Prompt maestro completo) | Generar la versión 1 | Se crearon todos los archivos del sitio y se compiló el CSS | index.html, src/input.css, js/script.js, package.json | Primera ejecución de pruebas: 36 de 38 pasan. Fallan contraste en modo claro (botones de filtro "Web", "Videojuegos", "Datos" con 4.35:1) y en modo oscuro (varias lecturas) | Pruebas automáticas (Playwright) | Parcial |
| 2 | "La prueba de contraste en modo oscuro da valores imposibles (1.00:1 en un título blanco). Revisa si la medición ocurre durante las transiciones de color y corrígela." | Falsos positivos de la herramienta de prueba | El script espera 600 ms tras cambiar de tema antes de medir | Script de pruebas | El modo oscuro pasa sin fallos; se confirma que solo el modo claro tenía un error real | Pruebas automáticas (Playwright) | Sí |
| 3 | "Los botones de filtro inactivos tienen contraste 4.35:1 (#0E7490 sobre #E2E8F0). Corrígelo sin cambiar la paleta y actualiza también las clases que alterna el JavaScript." | Contraste insuficiente (WCAG 1.4.3) | Fondo blanco en los botones inactivos (`bg-white`, `hover:bg-cyan-50`, `dark:bg-ink`) y nuevas listas de clases en el filtro | index.html, js/script.js | Contraste 5.36:1; 38 de 38 pruebas pasan | Pruebas automáticas (Playwright) | Sí |
| 4 | "La auditoría de contraste solo revisa el estado inicial. Agrega una segunda pasada con el acordeón abierto, los errores del formulario visibles y otro filtro activo." | Cobertura incompleta de las pruebas | Nueva prueba "Contraste con estados interactivos" en ambos temas | Script de pruebas | 86 textos adicionales revisados en cada tema, sin fallos; 40 de 40 | Pruebas automáticas (Playwright) | Sí |
| 5 | "En celular, el menú desplegable es translúcido y deja ver las tarjetas detrás del texto. Hazlo opaco y que respete el modo oscuro." | Legibilidad del menú móvil | `bg-paper shadow-lg dark:bg-ink` en `#mobile-menu` | index.html | El menú se ve opaco en la captura `celular-menu-abierto.png` | Revisión visual de capturas a 375 px | Sí |
| 6 | "Los enlaces 'Ver repositorio' apuntan a '#', así que al hacer clic la página salta al inicio. Corrígelos y agrega una prueba que detecte enlaces vacíos." | Enlaces que no llevan a ningún sitio (heurística de Nielsen: control y libertad del usuario) | Enlaces a GitHub marcados como EDITABLE, texto "Ver en GitHub" y prueba nueva | index.html | 0 enlaces vacíos; 41 de 41 pruebas pasan | Pruebas automáticas (Playwright) | Sí |

## Cambios manuales (sin IA)

| # | Archivo | Qué cambié | Por qué | Cómo lo comprobé |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Licencia

Código bajo licencia MIT. Ilustraciones creadas para este proyecto.
