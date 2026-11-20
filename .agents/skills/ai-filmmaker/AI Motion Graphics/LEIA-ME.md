# Motion Graphics — módulo do AI Filmmaker

Este módulo é incluído no pacote único `ai-filmmaker`. Seus arquivos ficam separados para
manutenção e testes, mas não há instalação ou chamada pública independente.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `MOTION.md` | Procedimento técnico de Motion, carregado pelo Filmmaker |
| `skill/references/` | Guia visual, catálogo, tempos e contrato de integração |
| `projeto/` | Modelo Remotion, 19 cenas, 20 transições, demo e fontes locais |
| `scripts/preparar.mjs` | Prepara somente uma cópia de trabalho do projeto |
| `scripts/portabilidade.test.mjs` | Testes de preparação, tempos e referências |
| `PEDIDOS.md` | Exemplos de pedidos para o Filmmaker |

A entrada pública é o `SKILL.md` na pasta pai. A antiga entrada `AI Motion Graphics/SKILL.md`
foi renomeada para `MOTION.md` para evitar que agentes descubram duas skills. Não copie este
módulo sozinho para uma pasta de skills.

## Instalação e uso

Siga [INSTALACAO.md](../INSTALACAO.md) da raiz do Filmmaker. O instalador inclui as instruções
principais, receitas de áudio/render e este módulo no mesmo destino.

Peça ao agente:

> Use ai-filmmaker para uma vinheta de 6 segundos. Apresente o storyboard e os sons necessários,
> carregue o módulo Motion e produza uma cena por vez para minha aprovação.

O [contrato de integração](skill/references/integracao-filmmaker.md) explica como compartilhar
briefing, áudio, tempos, versões, prévias e aprovações. Não há outro modelo, API ou agente
obrigatório; use as ferramentas equivalentes disponíveis em Codex, Antigravity, Cursor ou Claude.

## Preparar um projeto de vídeo

Depois de escolher a pasta de trabalho, com Node no PATH:

```text
node "<pacote-filmmaker>/AI Motion Graphics/scripts/preparar.mjs" projeto "<pasta-do-video>"
cd "<pasta-do-video>"
npm ci
npm run diagnostico
npm run typecheck
npm run studio
```

Node 22+ recomendado; mínimo declarado no projeto: 18. No PowerShell, se npm.ps1 estiver
bloqueado, use npm.cmd sem alterar a política do sistema. O preparador não instala pacotes,
não sobrescreve pasta ocupada e exclui dependências, renders e caches da cópia.

O primeiro render pode baixar navegador headless. O diagnóstico não baixa nada e não comprova
render ou qualidade visual. Ferramentas de imagem/áudio e permissão de execução precisam estar
disponíveis no agente real. Sem essas capacidades, informe a limitação.

## Modelo e limites

O Studio lista `Demo`, `Filme-16x9`, cenas `M-01` a `M-19` e transições `T-<nome>`.
Os exemplos vêm sem narração. Claude/Opus são textos demonstrativos, não dependências de modelo.
O projeto é calibrado a 1920×1080 e 30 FPS. Vertical ou outro FPS exigem adaptar o layout,
os helpers e os tempos e verificar as cenas afetadas.

Use prévias isoladas, versionadas, para a aprovação de cada cena. Stills ajudam a inspeção,
mas não substituem a avaliação de movimento e áudio. Preserve renders aprovados com nomes novos.

Narração pronta, incluindo exportação do VoiceStudio ou ElevenLabs, entra por `public/`.
Transcrição local opcional e timestamps existentes estão em `skill/references/tempos.md`.
Não há geração de voz/SFX automática neste módulo: utilize as receitas da principal quando
aceitas pelo usuário. Informe os sons faltantes antes de substituir ou omitir um som necessário.

## Testes e licenças

Na pasta deste módulo: `node --test scripts/portabilidade.test.mjs`.
Na raiz do Filmmaker: `node --test scripts/pacote.test.mjs`.

Os testes não substituem a aprovação humana ou a execução em cada agente/SO. Preserve as licenças
das fontes locais; Remotion tem [licença própria](https://www.remotion.dev/license).
