# Rutas del modulo 2

## Backend

- `POST /api/files/upload`
  Sube el archivo fuente y crea el registro de metadata.
- `GET /api/improvement-requests`
  Lista solicitudes del usuario autenticado.
- `POST /api/improvement-requests`
  Crea una solicitud de mejora asociada a un archivo subido y opcionalmente a un CV existente.
- `POST /api/improvement-requests/:requestId/process`
  Ejecuta el flujo sincronico de extraccion + IA + PDF y devuelve `CvDetail`.
- `PATCH /api/improvement-requests/:requestId`
  Mantiene el endpoint de actualizacion manual de estado/resultado.

## Frontend

- `/mejorar-cv`
  Flujo principal de subida, definicion de cargo objetivo y vista previa.
- `/solicitudes-mejora`
  Historial operativo del modulo 2 con filtros y reprocesamiento.
- `/historial/:cvId`
  Detalle final del CV generado o mejorado.

## Respuesta principal del procesamiento

`POST /api/improvement-requests/:requestId/process` responde con `CvDetail` para que el frontend pueda:

- mostrar la vista previa inmediatamente,
- descargar el PDF generado,
- invalidar historial y dashboard,
- navegar al detalle persistido del CV resultante.