# Modulo 2: mejora de CV desde archivo

Este modulo toma un CV existente en PDF o DOCX, extrae su contenido, lo normaliza con OpenAI y genera una version optimizada persistida dentro del dominio `cvs`.

## Estado actual

- Flujo backend implementado de punta a punta.
- Flujo frontend implementado en `/mejorar-cv` con vista previa real.
- Historial operativo implementado en `/solicitudes-mejora`.
- PDF final generado con Puppeteer y servido desde `/uploads/...`.

## Decisiones tecnicas vigentes

- LLM: OpenAI via SDK oficial `openai`.
- Extraccion de texto: `pdf-parse` para PDF y `mammoth` para DOCX.
- Persistencia de resultado: se reutiliza el agregado `Cv` y sus `CvVersion`.
- Almacenamiento de salida: PDF generado en `GENERATED_CV_DIR`.
- Modelo operativo: procesamiento sincronico por request HTTP.

## Flujo resumido

1. El frontend sube el archivo a `POST /api/files/upload`.
2. El frontend crea la solicitud en `POST /api/improvement-requests`.
3. El frontend dispara el procesamiento en `POST /api/improvement-requests/:requestId/process`.
4. El backend extrae texto del archivo.
5. OpenAI devuelve estructura extraida + contenido mejorado.
6. El backend crea o reutiliza un `Cv`, genera una nueva `CvVersion` mejorada y persiste el PDF.
7. La solicitud queda en estado `completed` con `cvId` y `resultCvVersionId` enlazados.

## Limitaciones actuales

- El procesamiento todavia no usa colas ni jobs asincronos.
- `.doc` no esta soportado en el flujo de mejora.
- La calidad del resultado depende de la calidad del texto extraido del archivo fuente.

## Enlaces

- `architecture.md`: arquitectura y responsabilidades por capa.
- `routes.md`: rutas backend/frontend del modulo.