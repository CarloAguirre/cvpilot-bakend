<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
# CVPilot Backend

Backend base en NestJS + TypeORM para el esquema definido en `schema.sql`.

## Documentacion adicional

- `docs/cv-generator/README.md`: resumen del modulo 1.
- `docs/cv-generator/architecture.md`: arquitectura objetivo del generador de CV.
- `docs/cv-generator/routes.md`: rutas actuales y rutas propuestas.
- `docs/cv-generator/implementation-plan.md`: roadmap de implementacion por fases.
- `docs/cv-improvement/README.md`: resumen del modulo 2.
- `docs/cv-improvement/architecture.md`: arquitectura implementada del flujo de mejora.
- `docs/cv-improvement/routes.md`: rutas actuales del modulo 2.

## Módulos incluidos

- `users`: usuarios y preferencias.
- `cvs`: CVs, versiones, detalle personal, experiencia, educación y habilidades.
- `files`: archivos subidos para procesos de mejora.
- `improvements`: solicitudes de mejora de CV.
- `reports`: snapshots de reportes.
- `audit`: auditoría de cambios.
- `events`: eventos del sistema.

Cada módulo registra sus entidades con `TypeOrmModule.forFeature(...)` y deja listas las inyecciones de repositorio en su servicio correspondiente.

## Variables de entorno

Usa `.env.example` como base para crear `.env` o `.env.local`.

## Scripts

```bash
npm install
npm run start:dev
npm run build
```

## Rutas base

Prefijo global: `/api`

- `GET /api`: health check.
- `POST /api/auth/register`: registro básico con JWT.
- `POST /api/auth/login`: login básico con JWT.
- `GET /api/auth/me`: usuario autenticado actual.
- `GET /api/users/me/profile`: perfil del usuario autenticado.
- `PATCH /api/users/me/profile`: actualización de nombre y correo.
- `GET /api/users/me/settings`: preferencias del usuario autenticado.
- `PATCH /api/users/me/settings`: actualización de preferencias.
- `GET /api/cvs`: listado de CVs con conteo de versiones.
- `POST /api/cvs`: creación de CV desde cero.
- `GET /api/cvs/:cvId`: detalle completo del CV con versiones.
- `GET /api/cvs/:cvId/history`: historial resumido de versiones.
- `PATCH /api/cvs/:cvId/archive`: archivar o desarchivar CV.
- `POST /api/cvs/:cvId/versions/improved`: crear nueva versión mejorada.
- `GET /api/files`: listar archivos cargados.
- `POST /api/files`: registrar metadata de archivo subido.
- `POST /api/files/upload`: subir archivo real por multipart y registrar metadata.
- `GET /api/improvement-requests`: listar solicitudes de mejora.
- `POST /api/improvement-requests`: crear solicitud de mejora.
- `POST /api/improvement-requests/:requestId/process`: ejecutar mejora sincronica y devolver `CvDetail`.
- `PATCH /api/improvement-requests/:requestId`: actualizar estado o resultado.
- `GET /api/reports/dashboard-summary`: resumen para dashboard.
- `GET /api/reports/by-role`: agregación por cargo.
- `GET /api/reports/by-version-type`: agregación por tipo de versión.
- `GET /api/reports/monthly`: serie mensual.
- `GET /api/reports/snapshots`: snapshots guardados.
- `POST /api/reports/snapshots`: generar snapshot de reporte.

## Notas

- Base de datos esperada: PostgreSQL / Supabase.
- `DB_SYNCHRONIZE` queda en `false` por defecto para no pisar el esquema existente.
- Las subidas multipart se almacenan localmente en `UPLOAD_DIR` y luego se registran en `uploaded_files`.
- El siguiente paso natural es agregar DTOs, casos de uso y controladores por módulo.
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
