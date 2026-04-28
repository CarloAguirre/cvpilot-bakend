# Arquitectura del modulo 2

## Objetivo

Transformar un CV subido por el usuario en una nueva version optimizada, reutilizando la misma fuente de verdad del dominio `cvs` y devolviendo una vista previa descargable.

## Capas involucradas

### Frontend

- `src/pages/MejorarCV.tsx`
  Orquesta upload, creacion de request, procesamiento y vista previa final.
- `src/pages/SolicitudesMejora.tsx`
  Da trazabilidad a solicitudes previas, filtros por estado y reproceso controlado.

### Backend HTTP

- `src/files/files.controller.ts`
  Acepta archivos `.pdf` y `.docx` via multipart.
- `src/improvements/improvements.controller.ts`
  Expone CRUD basico y el endpoint `POST :requestId/process`.

### Backend de aplicacion

- `src/improvements/improvements.service.ts`
  Valida propiedad del request, bloquea reprocesamientos invalidos y delega el flujo.
- `src/cvs/generation/cv-generation-workflow.service.ts`
  Orquesta extraccion, OpenAI, PDF y versionado.
- `src/cvs/generation/cv-document-text-extractor.service.ts`
  Convierte PDF o DOCX en texto normalizado.
- `src/cvs/generation/openai-cv-generator.service.ts`
  Produce la estructura extraida y la version mejorada.

### Dominio persistente

- `Cv`
  Agregado raiz del resultado final.
- `CvVersion`
  Version mejorada generada por IA.
- `CvImprovementRequest`
  Registro operativo del proceso, estado y enlace al resultado.

## Flujo de datos

1. El archivo se guarda fisicamente y se registra en `uploaded_files`.
2. La solicitud se guarda en `cv_improvement_requests` con estado `pending`.
3. El procesamiento cambia a `processing`.
4. Se extrae texto desde disco y se llama a OpenAI.
5. Se genera el PDF final.
6. Se crea o mejora un CV en el agregado `cvs`.
7. El request pasa a `completed` y conserva referencia al `cvId` y `resultCvVersionId`.

## Criterios de consistencia ya cubiertos

- Un request `processing` o `completed` no puede reprocesarse.
- Un request completado queda enlazado al CV y a la version resultante.
- Un fallo de IA o extraccion marca el request como `failed` con `errorMessage`.