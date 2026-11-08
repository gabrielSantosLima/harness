<div align="center">

# harness

Um harness universal e agnóstico de stack para configurar projetos, com uma biblioteca reutilizável de skills.

[![CI](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml/badge.svg)](https://github.com/gabrielSantosLima/harness/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://gabrielSantosLima.github.io/harness/)
[![Release](https://img.shields.io/github/v/release/gabrielSantosLima/harness?label=release)](https://github.com/gabrielSantosLima/harness/releases)
[![Licença: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md)

</div>

Ele configura qualquer repositório com a mesma base:

- um único `AGENTS.md` com os comandos do projeto, regras de idioma, política de
  commits, política de releases, contrato de CI/build, acesso às skills e regras
  de segurança;
- Conventional Commits e uma política segura de staging;
- Semantic Versioning, uma GitHub Action `Release` manual e release notes
  geradas;
- workflows de CI, build e deploy escolhidos por projeto;
- `.agent/`, um submodule fixado que expõe a biblioteca de skills para qualquer
  agente;
- `.harness.json`, o estado de setup versionado usado para atualizações e
  auditoria de drift.

Ele deliberadamente não cobre stacks, frameworks, dependências ou arquitetura.
Isso pertence aos projetos ou a skills opcionais futuras.

## Usar em um projeto

No repositório de destino, cole isto no agente:

```text
Use o harness em https://github.com/gabrielSantosLima/harness para configurar
este repositório. Leia setup/PROMPT.md nesse repositório e siga as instruções
exatamente.
```

O agente baixa o harness público em um diretório temporário, conduz a entrevista,
renderiza os arquivos, verifica o resultado e remove o clone. Nada é commitado,
enviado ou tagueado.

Se preferir trabalhar com um clone local:

```bash
git clone https://github.com/gabrielSantosLima/harness.git
cd harness
node scripts/render.mjs \
  --answers <answers.json> \
  --target <caminho-do-projeto> \
  --merge \
  --submodule https://github.com/gabrielSantosLima/harness.git \
  --commit "$(git rev-parse HEAD)"
node scripts/verify-setup.mjs <caminho-do-projeto>
```

Veja [`setup/PROMPT.md`](setup/PROMPT.md) para o bootstrap remoto e
[`setup/SETUP.md`](setup/SETUP.md) para o fluxo completo.

## Estrutura do repositório

```text
setup/
  PROMPT.md              Prompt de bootstrap remoto
  SETUP.md               O fluxo interativo
  decisions.md           Decisões travadas e regras da casa
  questions.md           Banco de perguntas
  verify.md              Definição de pronto
  harness.schema.json    Formato do .harness.json
  answers.example.json   Exemplo completo de respostas
guidelines/              Seções componíveis do AGENTS.md
templates/               Arquivos determinísticos copiados para os projetos
  AGENTS.md
  docs/RELEASE_TEMPLATE.*.md
  scripts/               release-notes, next-version, bump-version
  .github/               CI, build, release, deploy, template de PR
skills/                  Biblioteca universal de skills, agnóstica de agente
  project-setup/         Somente no harness
  commit-and-push/
  release-summary/
  release-cut/
  add-skill/
scripts/
  render.mjs             Renderiza os templates em um destino
  verify-setup.mjs       Verifica um repositório gerado
tests/
  run.mjs                Testes end-to-end
  pilot.mjs              Pilotos de criação, adoção e atualização
  fixtures/              Respostas para os cinco tipos de projeto
```

## Tipos de projeto

| Tipo | Artefato de build | Pergunta de deploy |
| --- | --- | --- |
| `web` | bundle estático | sim |
| `mobile` | pacote da plataforma | não |
| `desktop` | instalador ou arquivo | não |
| `library` | pacote ou arquivo | não |
| `data` | nenhum | sim |

O tipo apenas seleciona quais perguntas são feitas e quais jobs genéricos são
gerados. Nenhuma stack é inferida.

## Skills

A biblioteca fica em `skills/`. Os projetos gerados a referenciam pelo submodule
`.agent/` com sparse checkout limitado a `skills/`, e o `AGENTS.md` instrui o
agente a ler `.agent/skills/<id>/SKILL.md` sob demanda. Isso funciona para
qualquer agente que consiga ler arquivos.

Neste repositório, use o OpenCode com o `.opencode/opencode.json` incluído, ou
leia os arquivos de skill diretamente. Adicione uma skill com
[`skills/add-skill/SKILL.md`](skills/add-skill/SKILL.md).

### Claude Code

O Claude Code não lê `AGENTS.md` nativamente. Aponte-o para as regras do projeto
uma única vez, de forma global, em `~/.claude/CLAUDE.md`:

```markdown
Quando o repositório atual tiver um AGENTS.md, leia-o antes de iniciar qualquer
tarefa e siga as instruções. As skills ficam em .agent/skills/<id>/SKILL.md;
leia a correspondente sob demanda.
```

Nenhum arquivo adaptador por projeto é gerado.

## Requisitos

- Node.js 20 ou mais recente (renderizador, verificador e scripts de release).
- Git e o GitHub CLI (`gh`) para releases.
- Suporte a submodules no repositório de destino.

## Desenvolvimento

```bash
node tests/run.mjs        # executa a suíte end-to-end
node tests/pilot.mjs      # executa os pilotos de criação, adoção e atualização
node web/build.mjs --check # gera a documentação e verifica os links
```

Toda mudança em `templates/`, `guidelines/` ou `scripts/` deve manter a suíte
verde para os cinco tipos de projeto.

A documentação é publicada em <https://gabrielSantosLima.github.io/harness/>.
Veja [`docs/pilots.md`](docs/pilots.md) para os pilotos registrados, incluindo a
adoção de um repositório público real.

## Lançar o harness

O harness segue o próprio contrato:

```bash
gh workflow run release.yml -f bump=minor -f summary="..."
```

O workflow executa os testes, resolve a próxima versão a partir da última tag
`vX.Y.Z`, gera as notas a partir dos Conventional Commits e cria a release no
GitHub. A primeira release é `v0.1.0`.

## Licença

MIT. Veja [LICENSE](LICENSE).
