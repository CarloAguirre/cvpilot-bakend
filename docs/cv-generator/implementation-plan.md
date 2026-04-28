# Plan de implementacion por etapas

## Fase 0: Baseline actual

Estado:

- El frontend tiene la ruta `/crear-cv`.
- El backend ya expone `POST /api/cvs`.
- El historial y el dashboard todavia usan datos mock.
- No existe todavia orquestacion IA para el modulo 1.

## Fase 1: Cerrar flujo base sin IA

Objetivo:

Cerrar el flujo formulario -> persistencia -> vista previa -> historial usando solo el backend ya existente.

Archivos a tocar:

- `cvpilot-prototipo/src/pages/CrearCV.tsx`
- `cvpilot-prototipo/src/lib/api/index.ts`
- `cvpilot-prototipo/src/lib/api/types.ts`
- `cvpilot-prototipo/src/pages/Historial.tsx`

Cambios:

1. mapear el formulario al payload `CreateCvPayload`,
2. llamar `cvsApi.create`,
3. reemplazar el placeholder de la vista previa por datos reales,
4. redirigir o refrescar historial con informacion persistida.

Criterio de cierre:

- el usuario puede crear un CV real desde `/crear-cv`,
- el backend guarda datos en `cvs`, `cv_versions` y tablas relacionadas,
- la respuesta backend se ve en pantalla,
- historial deja de depender de mocks para este flujo.

## Fase 2: Agregar capa IA de generacion

Objetivo:

Introducir una ruta de orquestacion para generar contenido mejorado desde el formulario.

Archivos a tocar:

- `cvpilot-bakend/src/cvs/cvs.controller.ts`
- `cvpilot-bakend/src/cvs/cvs.module.ts`
- `cvpilot-bakend/src/cvs/dto/generate-cv-from-form.dto.ts`
- `cvpilot-bakend/src/cvs/generation/cv-generation-workflow.service.ts`
- `cvpilot-bakend/src/cvs/generation/openai-cv-generator.service.ts`
- `cvpilot-bakend/src/cvs/generation/cv-prompt-builder.service.ts`

Cambios:

1. crear DTO dedicado para el flujo IA,
2. agregar `POST /api/cvs/generate-from-form`,
3. construir prompt estructurado,
4. pedir salida JSON al LLM,
5. validar la salida,
6. persistir version generada con `createdByProcess = ai`.

Criterio de cierre:

- el backend genera una version redactada por IA,
- el usuario recibe contenido estructurado consistente,
- el flujo falla de forma controlada cuando el proveedor LLM no responde o responde invalido.

## Fase 3: Render de PDF

Objetivo:

Producir un archivo PDF descargable desde la version generada.

Archivos a tocar:

- `cvpilot-bakend/package.json`
- `cvpilot-bakend/src/cvs/generation/cv-pdf-render.service.ts`
- `cvpilot-bakend/src/cvs/generation/generated-documents-storage.service.ts`
- `cvpilot-bakend/src/cvs/generation/templates/cv-template.html.ts`

Cambios:

1. instalar `puppeteer`,
2. crear plantilla HTML para estilo ATS,
3. renderizar el PDF,
4. guardar el archivo en `GENERATED_CV_DIR`,
5. actualizar `generatedFileUrl` y `generatedFileFormat` en `CvVersion`.

Criterio de cierre:

- el backend entrega un PDF valido,
- el frontend puede descargarlo,
- la ruta del archivo queda asociada a la version actual del CV.

## Fase 4: Consumir datos reales en historial y dashboard

Objetivo:

Eliminar mocks de las pantallas de seguimiento.

Archivos a tocar:

- `cvpilot-prototipo/src/pages/Historial.tsx`
- `cvpilot-prototipo/src/pages/Dashboard.tsx`
- `cvpilot-prototipo/src/lib/api/index.ts`

Cambios:

1. consumir `cvsApi.list`,
2. mostrar tipo, fecha y conteo de versiones reales,
3. mostrar actividad reciente con datos del backend.

Criterio de cierre:

- historial y dashboard reflejan CVs creados y versiones reales,
- desaparecen los arreglos mock para este modulo.

## Fase 5: Reuso para modulo 2

Objetivo:

Compartir proveedor LLM y renderizado con el flujo de mejora de CV.

Archivos a tocar:

- `cvpilot-bakend/src/improvements/*`
- `cvpilot-bakend/src/files/*`
- servicios compartidos de generacion ya creados en `cvs/generation`

Cambios:

1. extraer texto del PDF o DOCX cargado,
2. transformar el resultado a estructura equivalente al modulo 1,
3. reutilizar la misma capa IA y de PDF.

Criterio de cierre:

- ambos modulos usan la misma infraestructura de generacion,
- la diferencia entre modulos queda solo en el origen de datos.

## Orden recomendado de implementacion real

1. Fase 1.
2. Fase 2.
3. Fase 3.
4. Fase 4.
5. Fase 5.

## Riesgos y controles

### Salida inconsistente del LLM

Control:

- pedir JSON estricto,
- validar antes de persistir,
- registrar errores del proveedor.

### Complejidad prematura del formato DOCX

Control:

- dejar DOCX fuera del MVP,
- priorizar PDF.

### Mezclar CRUD con IA en la misma ruta

Control:

- dejar `POST /api/cvs` como fallback simple,
- usar `POST /api/cvs/generate-from-form` para orquestacion.