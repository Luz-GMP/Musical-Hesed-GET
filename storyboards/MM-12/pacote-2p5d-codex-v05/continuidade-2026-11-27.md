# Retomada da Cena 6 em outro dispositivo · MM-12 v05

**27/11/2026 · Victor · Viagem a Belém e chegada ao abrigo.** O registro de execução de 26/11 documenta a aprovação do piloto Q01/Q06 e a conclusão das oito bases. A montagem de revisão está em andamento. As deixas de palco, o corte para a v09 e o teste no LED ainda dependem de ensaio.

## Etapa 2 · prévia para revisão de Victor

O commit `e585df0` publicou os 70 PNGs de retomada. A Etapa 2 acrescenta 23 planos e as provas de empilhamento ao [pacote usado pela montagem](../../../entregas/MM12/pacote-2p5d-v05/recriacao-por-camadas/). Consulte o [registro da Etapa 2](etapa-2-revisao.md) e o [manifesto de dimensões e hashes](manifesto-etapa-2.csv).

Depois de atualizar a `main`, execute `./projetos/AI-Filmmaker/mm12-cena06-v05/preparar.ps1` e abra a [prévia da montagem](../../../projetos/AI-Filmmaker/mm12-cena06-v05/cena/preview.html). O script deve indicar oito pilhas 2.5D completas. A prévia de 01:52 usa offsets de montagem e é silenciosa. O botão **Manter o abrigo vazio** simula a sustentação da Cena 7. O botão **GO em “uma multidão de anjos apareceu”** testa a imagem aprovada da D-61 fora do relógio da MM-12.

## Registro da retomada antes da Etapa 2

## O que está pronto

| Material | Estado conferido |
| --- | --- |
| Bases v05 | Oito PNGs em 1672 × 941, na ordem Q01 → Q02 → Q07 → Q03 → Q04 → Q05 → Q08 → Q06 |
| Q01 e Q06 | Piloto aprovado, com 4 e 5 planos gerados separadamente. Usar os arquivos de `recriacao-por-camadas/` |
| Q02 | Base e L01 de fundo. Faltam L02–L04 |
| Q07, Q03, Q04, Q05 e Q08 | Bases disponíveis na montagem. Faltam 4 planos por quadro, com Q03/Q04 pareados |
| Montagem | Prévia provisória de 01:52 a 30 fps, 1920 × 1080, sem áudio. Q01 e Q06 usam planos 2.5D. Os demais usam suas bases v05 enquanto a pilha está incompleta |

## Recuperar a mídia e abrir a montagem

1. Atualize a branch `main` no novo dispositivo com `git pull --ff-only origin main`. Em uma máquina sem checkout, clone a branch `main` de `https://github.com/Luz-GMP/Musical-Hesed-GET.git`.
2. Abra o [pacote de imagens no repositório](../../../entregas/MM12/pacote-2p5d-v05/). A main já inclui os PNGs na pasta que o script usa: `entregas/MM12/pacote-2p5d-v05/recriacao-por-camadas/`. Ao baixar uma pasta manualmente, preserve esse caminho dentro do checkout. Os ZIPs e exports continuam no acervo local (P-13).
3. Confira [tamanho e SHA-256 dos PNGs](manifesto-midia-v05.csv). O caminho de cada entrada é relativo à raiz do checkout. Em PowerShell, rode na raiz:

   ```powershell
   Import-Csv 'storyboards/MM-12/pacote-2p5d-codex-v05/manifesto-midia-v05.csv' | Where-Object { # Retomada da Cena 6 em outro dispositivo · MM-12 v05

**27/11/2026 · Victor · Viagem a Belém e chegada ao abrigo.** O registro de execução de 26/11 documenta a aprovação do piloto Q01/Q06 e a conclusão das oito bases. A montagem de revisão está em andamento. As deixas de palco, o corte para a v09 e o teste no LED ainda dependem de ensaio.

## O que está pronto

| Material | Estado conferido |
| --- | --- |
| Bases v05 | Oito PNGs em 1672 × 941, na ordem Q01 → Q02 → Q07 → Q03 → Q04 → Q05 → Q08 → Q06 |
| Q01 e Q06 | Piloto aprovado, com 4 e 5 planos gerados separadamente. Usar os arquivos de `recriacao-por-camadas/` |
| Q02 | Base e L01 de fundo. Faltam L02–L04 |
| Q07, Q03, Q04, Q05 e Q08 | Bases disponíveis na montagem. Faltam 4 planos por quadro, com Q03/Q04 pareados |
| Montagem | Prévia provisória de 01:52 a 30 fps, 1920 × 1080, sem áudio. Q01 e Q06 usam planos 2.5D. Os demais usam suas bases v05 enquanto a pilha está incompleta |

## Recuperar a mídia e abrir a montagem

1. Atualize a branch `main` no novo dispositivo com `git pull --ff-only origin main`. Em uma máquina sem checkout, clone a branch `main` de `https://github.com/Luz-GMP/Musical-Hesed-GET.git`.
2. Abra o [pacote de imagens no repositório](../../../entregas/MM12/pacote-2p5d-v05/). A main já inclui os PNGs na pasta que o script usa: `entregas/MM12/pacote-2p5d-v05/recriacao-por-camadas/`. Ao baixar uma pasta manualmente, preserve esse caminho dentro do checkout. Os ZIPs e exports continuam no acervo local (P-13).
3. Confira [tamanho e SHA-256 dos PNGs](manifesto-midia-v05.csv). O caminho de cada entrada é relativo à raiz do checkout. Em PowerShell, rode na raiz:

   ```powershell
   Import-Csv 'storyboards/MM-12/pacote-2p5d-codex-v05/manifesto-midia-v05.csv' | Where-Object { .path -notlike '*.zip' } | ForEach-Object {
     if (!(Test-Path -LiteralPath $_.path -PathType Leaf)) { throw "Arquivo ausente: $($_.path)" }
     if ((Get-FileHash -LiteralPath $_.path -Algorithm SHA256).Hash -ne $_.sha256) {
       throw "Hash divergente: $($_.path)"
     }
   }
   ```
4. Execute `./projetos/AI-Filmmaker/mm12-cena06-v05/preparar.ps1` no PowerShell. O script copia as bases e camadas para `cena/assets/`, gera o manifesto de camadas e atualiza `cena/index.html`. Abra [cena/preview.html](../../../projetos/AI-Filmmaker/mm12-cena06-v05/cena/preview.html). O script indica Q01 4/4 e Q06 5/5 em 2.5D, Q02 1/4 e os demais 0/4 em modo de base.
5. A pasta `interior-Q06-v06/` e seu ZIP registram o estudo de seis planos para a retomada do nascimento na **MM-06**. Considere-o junto de seu `LEIA-ME.md`. A montagem da Cena 6 aponta para a pilha Q06 de cinco planos.

## Retomar no Antigravity

> Leia AGENTS.md, CLAUDE.md, ANTIGRAVITY.md, a skill local ai-filmmaker, o guia de construção e os briefings da MM-12 incluindo Q07 e Q08. Abra a montagem v05 e preserve as oito bases. Complete Q02 L02–L04, Q07, Q03/Q04, Q05 e Q08 seguindo os nomes do pacote. Gere cada plano individualmente, com reconstrução das áreas ocultas, canvas integral 1672 × 941, L01 opaco e alpha real nas demais camadas. Preserve a mesma geometria e registro entre os planos de Q03/Q04. Produza as provas neutra e deslocada, registre hashes e rode preparar.ps1 novamente. Confira a montagem no modo 2.5D para os oito quadros antes de preparar a exportação. Preserve o plano-sequência e as deixas de palco.

Receba o céu final de Isaac (*Ó Noite Santa*, Cena 5). Segure o Q06 vazio a escala 1,00 e posição neutra na abertura da Cena 7. A operação chama MM13-Q06 v09 em “uma multidão de anjos apareceu” (D-61). Use os [marcadores da montagem](../../../projetos/AI-Filmmaker/mm12-cena06-v05/marcadores.md) como offsets de revisão. Confira no MP4 da mesma versão depois de exportar, conforme D-60. Compare telhado, mureta, luz e perfil da serra no corte com a v09.

[Prompts das bases](prompts-quadros-v05.md) · [Prompts e mapa de camadas](prompts-camadas-2p5d.md) · [Registro de produção](registro-execucao-v05.md) · [Ficha da Cena 6](../../../guias/cena-a-cena/cena-06.md)


.path -like '*.png' } | ForEach-Object {
     if (!(Test-Path -LiteralPath $_.path -PathType Leaf)) { throw "Arquivo ausente: $($_.path)" }
     if ((Get-FileHash -LiteralPath $_.path -Algorithm SHA256).Hash -ne $_.sha256) {
       throw "Hash divergente: $($_.path)"
     }
   }
   ```
4. Execute `./projetos/AI-Filmmaker/mm12-cena06-v05/preparar.ps1` no PowerShell. O script copia as bases e camadas para `cena/assets/`, gera o manifesto de camadas e atualiza `cena/index.html`. Abra [cena/preview.html](../../../projetos/AI-Filmmaker/mm12-cena06-v05/cena/preview.html). O script indica Q01 4/4 e Q06 5/5 em 2.5D, Q02 1/4 e os demais 0/4 em modo de base.
5. A pasta `interior-Q06-v06/` e seu ZIP registram o estudo de seis planos para a retomada do nascimento na **MM-06**. Considere-o junto de seu `LEIA-ME.md`. A montagem da Cena 6 aponta para a pilha Q06 de cinco planos.

## Retomar no Antigravity

> Leia AGENTS.md, CLAUDE.md, ANTIGRAVITY.md, a skill local ai-filmmaker, o guia de construção e os briefings da MM-12 incluindo Q07 e Q08. Abra a montagem v05 e preserve as oito bases. Complete Q02 L02–L04, Q07, Q03/Q04, Q05 e Q08 seguindo os nomes do pacote. Gere cada plano individualmente, com reconstrução das áreas ocultas, canvas integral 1672 × 941, L01 opaco e alpha real nas demais camadas. Preserve a mesma geometria e registro entre os planos de Q03/Q04. Produza as provas neutra e deslocada, registre hashes e rode preparar.ps1 novamente. Confira a montagem no modo 2.5D para os oito quadros antes de preparar a exportação. Preserve o plano-sequência e as deixas de palco.

Receba o céu final de Isaac (*Ó Noite Santa*, Cena 5). Segure o Q06 vazio a escala 1,00 e posição neutra na abertura da Cena 7. A operação chama MM13-Q06 v09 em “uma multidão de anjos apareceu” (D-61). Use os [marcadores da montagem](../../../projetos/AI-Filmmaker/mm12-cena06-v05/marcadores.md) como offsets de revisão. Confira no MP4 da mesma versão depois de exportar, conforme D-60. Compare telhado, mureta, luz e perfil da serra no corte com a v09.

[Prompts das bases](prompts-quadros-v05.md) · [Prompts e mapa de camadas](prompts-camadas-2p5d.md) · [Registro de produção](registro-execucao-v05.md) · [Ficha da Cena 6](../../../guias/cena-a-cena/cena-06.md)
