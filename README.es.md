<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gabrielSantosLima/harness/main/web/assets/logo-dark.svg">
  <img src="https://raw.githubusercontent.com/gabrielSantosLima/harness/main/web/assets/logo.svg" alt="harness" width="112" />
</picture>

# harness

Un harness universal y agnóstico de stack para configurar proyectos, con una biblioteca reutilizable de skills.

[![CI](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml/badge.svg)](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://gabrielSantosLima.github.io/harness/)
[![Release](https://img.shields.io/github/v/release/gabrielSantosLima/harness?label=release)](https://github.com/gabrielSantosLima/harness/releases)
[![Licencia: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md)

</div>

Configura cualquier repositorio con la misma base:

- un único `AGENTS.md` con los comandos del proyecto, reglas de idioma, política
  de commits, política de releases, contrato de CI/build, acceso a las skills y
  reglas de seguridad;
- Conventional Commits y una política segura de staging;
- Semantic Versioning, una GitHub Action `Release` manual y release notes
  generadas;
- workflows de CI, build y deploy elegidos por proyecto;
- `.agents/`, la biblioteca de skills como submodule fijado o copia;
- `.harness.json`, el estado de setup versionado usado para actualizaciones y
  auditoría de drift.

Deliberadamente no cubre stacks, frameworks, dependencias ni arquitectura. Eso
pertenece a los proyectos o a skills opcionales futuras.

## Usarlo en un proyecto

En el repositorio de destino, pega esto en el agente:

```text
Usa el harness en https://github.com/gabrielSantosLima/harness para configurar
este repositorio. Lee setup/PROMPT.md en ese repositorio y sigue las
instrucciones exactamente.
```

El agente descarga el harness público en un directorio temporal, realiza la
entrevista, renderiza los archivos, verifica el resultado y elimina el clone.
Nada se commitea, se sube ni se etiqueta.

Si prefieres trabajar con un clone local:

```bash
git clone https://github.com/gabrielSantosLima/harness.git
cd harness
node scripts/render.mjs \
  --answers <answers.json> \
  --target <ruta-del-proyecto> \
  --merge \
  --skills-mode submodule \
  --submodule https://github.com/gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"
node scripts/verify-setup.mjs <ruta-del-proyecto>
```

Usa `--skills-mode copy` en lugar de `--submodule` cuando el destino no pueda usar
un submodule. La entrevista pregunta qué modo usar.

Consulta [`setup/PROMPT.md`](setup/PROMPT.md) para el bootstrap remoto y
[`setup/SETUP.md`](setup/SETUP.md) para el flujo completo.

## Ejecutar una skill aislada

Para usar una skill sin configurar el repositorio, lee
[`skills/PROMPT.md`](skills/PROMPT.md) y pega el prompt con el ID de la skill. El
agente descarga el harness en un directorio temporal, ejecuta la skill y elimina
el clone. Nada queda instalado permanentemente.

## Estructura del repositorio

```text
setup/
  PROMPT.md              Prompt de bootstrap remoto
  SETUP.md               El flujo interactivo
  decisions.md           Decisiones fijadas y reglas de la casa
  questions.md           Banco de preguntas
  verify.md              Definición de terminado
  harness.schema.json    Formato de .harness.json
  answers.example.json   Ejemplo completo de respuestas
guidelines/              Secciones componibles del AGENTS.md
templates/               Archivos determinísticos copiados a los proyectos
  AGENTS.md
  docs/RELEASE_TEMPLATE.*.md
  scripts/               release-notes, next-version, bump-version
  .github/               CI, build, release, deploy, plantilla de PR
skills/                  Biblioteca universal de skills, agnóstica de agente
  project-setup/         Solo en el harness
  commit-and-push/
  release-summary/
  release-cut/
  add-skill/
scripts/
  render.mjs             Renderiza los templates en un destino
  verify-setup.mjs       Verifica un repositorio generado
tests/
  run.mjs                Pruebas end-to-end
  pilot.mjs              Pilotos de creación, adopción y actualización
  fixtures/              Respuestas para los cinco tipos de proyecto
```

## Tipos de proyecto

| Tipo | Artefacto de build | Pregunta de deploy |
| --- | --- | --- |
| `web` | bundle estático | sí |
| `mobile` | paquete de la plataforma | no |
| `desktop` | instalador o archivo | no |
| `library` | paquete o archivo | no |
| `data` | ninguno | sí |

El tipo solo selecciona qué preguntas se hacen y qué jobs genéricos se generan.
No se infiere ninguna stack.

## Instrucciones para agentes y skills

`AGENTS.md` es el único archivo de instrucciones. Lo leen de forma nativa Codex,
Cline, OpenCode, Cursor y GitHub Copilot. El renderizador también crea dos puentes
finos para las herramientas con nombre de archivo propio:

- `CLAUDE.md` importa `AGENTS.md` y es el archivo que lee Claude Code;
- `GEMINI.md` importa `AGENTS.md` y es el archivo que lee Gemini CLI por defecto.

Las skills viven en `.agents/skills/<id>/SKILL.md`, la ruta interoperable del
estándar Agent Skills. Codex, Cline, Gemini CLI, OpenCode, Cursor y Copilot la
descubren de forma nativa. Claude Code no la escanea, así que `AGENTS.md` sigue
indicando al agente que lea el `SKILL.md` correspondiente bajo demanda; eso
funciona para cualquier agente que pueda leer archivos.

Los proyectos generados referencian la biblioteca mediante el submodule `.agents/`
con sparse checkout limitado a `skills/`, o reciben una copia cuando no se quiere
el submodule. En este repositorio, usa OpenCode con el `.opencode/opencode.json`
incluido, o lee los archivos de skill directamente. Añade una skill con
[`skills/add-skill/SKILL.md`](skills/add-skill/SKILL.md).

## Requisitos

- Node.js 20 o superior (renderizador, verificador y scripts de release).
- Git y el GitHub CLI (`gh`) para releases.
- Soporte de submodules en el repositorio de destino al usar el modo submodule.

## Desarrollo

```bash
node tests/run.mjs        # ejecuta la suite end-to-end
node tests/pilot.mjs      # ejecuta los pilotos de creación, adopción y actualización
node web/build.mjs --check # genera la documentación y verifica los enlaces
```

Cualquier cambio en `templates/`, `guidelines/` o `scripts/` debe mantener la
suite verde para los cinco tipos de proyecto.

La documentación se publica en <https://gabrielSantosLima.github.io/harness/>.
Consulta [`docs/pilots.md`](docs/pilots.md) para los pilotos registrados,
incluyendo la adopción de un repositorio público real.

## Publicar el harness

El harness sigue su propio contrato:

```bash
gh workflow run release.yml -f bump=minor -f summary="..."
```

El workflow ejecuta las pruebas, resuelve la próxima versión desde la última
etiqueta `vX.Y.Z`, genera las notas a partir de los Conventional Commits y crea
la release en GitHub. La primera release es `v0.1.0`.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
