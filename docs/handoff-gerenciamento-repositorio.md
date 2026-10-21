# Handoff para gerenciamento do repositório

**Atualizado em:** 21/10/2026
**Escopo:** publicação da referência canônica MM-01 V06

## Estado já publicado

A atualização visual foi publicada com sucesso na branch principal do GitHub:

- repositório: `https://github.com/Luz-GMP/Musical-Hesed-GET.git`;
- branch canônica: `main`;
- avanço confirmado: `7677f37` → `e2fcaa8`;
- commit publicado: `e2fcaa814a1cfa495e6e1f3637c3be3b91071ff0` — `Canoniza storyboard noturno MM-01 V06`;
- decisões documentais: D-40 para a V06 e D-41 para o estado inicial apagado, pois D-29 a D-39 já pertenciam ao histórico da MM-02;
- SHA-256 da prancha `storyboards/MM-01/STB MM01.jpg`: `e6e9f09d6f29c00cf8a8a6276c13455f047b4122c46ca112718c7fef017f263a`;
- resolução da prancha: 3840×2160, AR 16:9.

O push foi confirmado por `git ls-remote`: `refs/heads/main` apontava para `e2fcaa814a1cfa495e6e1f3637c3be3b91071ff0` após o envio.

## Conteúdo canônico da MM-01

A pasta `storyboards/MM-01/` deve conter como imagens somente:

- `STB MM01.jpg`;
- `MM01-Q01-ATMOSFERA-APAGADA.png`;
- `MM01-Q01-ATMOSFERA-MESTRE.png`;
- `MM01-Q02-ATMOSFERA-NOTURNA.png`;
- `MM01-Q03-ATMOSFERA-NOTURNA.png`;
- `MM01-Q04-ATMOSFERA-NOTURNA.png`;
- `MM01-ATMOSFERA-NOTURNA-CONTATO.png`.

`prompt-prancha-v05.txt` permanece apenas como registro textual histórico. Imagens antigas e estudos descartados não devem ser restaurados.

## Situação das branches

- `main`: fonte de verdade e destino de publicação; contém a V06 no commit `e2fcaa8`.
- `work`: branch secundária com histórico divergente; o remoto está em `b0d3f91` e o ponteiro local em `6417b3c`.
- `publish-mm01-v06`: branch local auxiliar que aponta para o mesmo commit `e2fcaa8` da `main` publicada.

Não mesclar `work` na `main` para publicar a V06: a mudança necessária já foi aplicada diretamente sobre a `main`. Não usar force-push. A remoção ou atualização das branches auxiliares deve ser tratada separadamente, após revisão explícita.

## Procedimento para a tarefa de gerenciamento

Executar em sequência:

```bash
git fetch origin --prune
git switch main
git status --short
git log --oneline --decorate -5
git diff --check
git push origin main
git ls-remote origin refs/heads/main
```

Depois do push, comparar `git rev-parse HEAD` com o hash retornado por `git ls-remote`. Os dois devem ser iguais. Também conferir no GitHub, na branch `main`, se `storyboards/MM-01/STB MM01.jpg` mostra a prancha V06 e se os seis PNGs canônicos aparecem na mesma pasta, incluindo o Q01-A apagado.

## Resultado esperado

A tarefa de gerenciamento deve publicar apenas commits que estejam à frente de `origin/main`, verificar o hash remoto e relatar separadamente qualquer ação proposta para `work`. O conteúdo visual aprovado da MM-01 não deve ser regenerado, renomeado nem substituído durante essa conciliação.
