# Rutas del modulo 1

## Ruta frontend actual

### `GET /crear-cv`

- Tipo: ruta SPA protegida.
- Archivo: `cvpilot-prototipo/src/pages/CrearCV.tsx`.
- Estado actual: formulario local sin integracion backend.

## Rutas backend existentes que ya sirven

### `POST /api/cvs`

Uso recomendado en la fase 1.

Responsabilidad:

- crear un CV desde el formulario,
- persistir su primera version,
- devolver `CvDetail`.

Payload base actual:

```json
{
  "title": "CV Desarrollador Frontend",
  "targetRole": "Desarrollador Frontend",
  "stylePreset": "ats",
  "personalDetails": {
    "fullName": "Nombre Apellido",
    "email": "correo@ejemplo.com",
    "phone": "+56 9 1234 5678",
    "location": "Santiago, Chile",
    "professionalSummary": "Resumen profesional"
  },
  "workExperiences": [
    {
      "companyName": "Empresa",
      "jobTitle": "Cargo",
      "periodLabel": "2022 - Presente",
      "description": "Responsabilidades principales"
    }
  ],
  "educationEntries": [
    {
      "institutionName": "Universidad",
      "degreeTitle": "Titulo",
      "periodLabel": "2018 - 2022"
    }
  ],
  "skills": ["React", "TypeScript", "Node.js"],
  "skillsText": "React, TypeScript, Node.js"
}
```

### `GET /api/cvs/:cvId`

Uso recomendado despues de crear o regenerar para refrescar el detalle.

### `GET /api/cvs/:cvId/history`

Uso recomendado para la pantalla `/historial`.

## Ruta nueva recomendada para IA

### `POST /api/cvs/generate-from-form`

Uso recomendado en la fase 2.

Responsabilidad:

- recibir el formulario del modulo 1,
- generar contenido optimizado con IA,
- persistir el CV y su version generada,
- renderizar PDF,
- devolver la vista previa y el archivo generado.

### Payload propuesto

```json
{
  "title": "CV Desarrollador Frontend",
  "targetRole": "Desarrollador Frontend",
  "stylePreset": "ats",
  "jobDescription": "Descripcion del cargo objetivo",
  "personalDetails": {
    "fullName": "Nombre Apellido",
    "email": "correo@ejemplo.com",
    "phone": "+56 9 1234 5678",
    "location": "Santiago, Chile",
    "professionalSummary": "Resumen base del usuario"
  },
  "workExperiences": [
    {
      "companyName": "Empresa",
      "jobTitle": "Cargo",
      "periodLabel": "2022 - Presente",
      "description": "Texto base del usuario"
    }
  ],
  "educationEntries": [
    {
      "institutionName": "Universidad",
      "degreeTitle": "Titulo",
      "periodLabel": "2018 - 2022"
    }
  ],
  "skills": ["React", "TypeScript"],
  "skillsText": "React, TypeScript",
  "generatePdf": true
}
```

### Respuesta propuesta

```json
{
  "cv": {
    "id": "123",
    "targetRole": "Desarrollador Frontend",
    "currentVersionId": "456",
    "currentVersion": {
      "id": "456",
      "versionType": "created",
      "createdByProcess": "ai",
      "generatedFileUrl": "uploads/generated-cvs/1/123/456.pdf",
      "generatedFileFormat": "pdf"
    }
  },
  "generationMeta": {
    "provider": "openai",
    "model": "gpt-4.1-mini",
    "generatedFileFormat": "pdf"
  }
}
```

## Decision de routing

Se recomienda mantener dos niveles:

1. `POST /api/cvs` como ruta de persistencia base y fallback sin IA.
2. `POST /api/cvs/generate-from-form` como ruta de orquestacion del modulo 1.

Esto evita acoplar toda la logica de IA a la ruta CRUD principal y facilita pruebas, reintentos y despliegue progresivo.

## Mapeo de campos frontend -> backend

| Frontend `/crear-cv` | Backend `CreateCvDto` |
| --- | --- |
| `nombre` | `personalDetails.fullName` |
| `email` | `personalDetails.email` |
| `telefono` | `personalDetails.phone` |
| `ubicacion` | `personalDetails.location` |
| `resumen` | `personalDetails.professionalSummary` |
| `cargoObjetivo` | `targetRole` |
| `experiencias[].empresa` | `workExperiences[].companyName` |
| `experiencias[].cargo` | `workExperiences[].jobTitle` |
| `experiencias[].periodo` | `workExperiences[].periodLabel` |
| `experiencias[].descripcion` | `workExperiences[].description` |
| `educacion[].institucion` | `educationEntries[].institutionName` |
| `educacion[].titulo` | `educationEntries[].degreeTitle` |
| `educacion[].periodo` | `educationEntries[].periodLabel` |
| `habilidades` | `skillsText` o `skills[]` |