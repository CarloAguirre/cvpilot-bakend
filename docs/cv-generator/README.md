# Modulo 1: Generador de CV con IA

## Objetivo

Implementar el flujo completo para la ruta frontend `/crear-cv`, de modo que el usuario pueda completar el formulario, generar contenido con IA, obtener una vista previa consistente y descargar un PDF.

## Decisiones base

- LLM recomendado: OpenAI.
- SDK recomendado: `openai`.
- Modelo por defecto recomendado: configurable por entorno, con `gpt-4.1-mini` como punto de partida para costo y latencia.
- Generacion de documentos: HTML + CSS + `puppeteer`.
- Primer formato a soportar: PDF.
- Fuente de verdad de negocio: modulo `cvs` existente en backend.

## Estado actual

- El frontend ya tiene la ruta protegida `/crear-cv`.
- El formulario existe, pero todavia no consume backend.
- El backend ya dispone de `POST /api/cvs` para crear un CV desde cero.
- El backend todavia no tiene una capa de orquestacion IA para el modulo 1.

## Estrategia recomendada

1. Conectar primero el formulario con `POST /api/cvs` para cerrar persistencia, preview e historial.
2. Agregar despues una ruta de orquestacion dedicada para IA y PDF.
3. Reutilizar la misma infraestructura de proveedor LLM y renderizado de documentos para el modulo 2.

## Documentos de esta carpeta

- `architecture.md`
- `routes.md`
- `implementation-plan.md`