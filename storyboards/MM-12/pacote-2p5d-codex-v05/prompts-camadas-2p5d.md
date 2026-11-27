# Decomposição 2.5D e plano de animação · MM-12 · v05

Este documento define **exatamente quais camadas PNG** o Codex deve extrair/reconstruir a partir de cada quadro em `bases-v05/MM12-QNN.png`, e como essas camadas serão animadas depois no **HyperFrames**.

---

## Regras comuns de decomposição (aplicar em TODOS os 8 quadros)

1. **Mesmo tamanho de canvas em 100% das camadas de um quadro** (preferencialmente `1920×1080`, ou a resolução nativa exata da base `MM12-QNN.png`, mantendo registro 1:1).
2. **`L01-BG-cleanplate.png` sempre opaco (RGB):** remover completamente os elementos que estão em `L02`–`L05` e reconstruir o cenário contínuo atrás deles (céu, colinas, chão, parede contínua) com margem limpa para parallax.
3. **Camadas `L02` em diante sempre PNG RGBA com fundo 100% transparente:** preservar os pixels, texturas e luz da imagem `bases-v05/MM12-QNN.png` correspondente, sem alterar cor, sem halo branco nas bordas e sem recriar a cena com outro desenho.
4. **Provas obrigatórias em cada pasta:**
   - `preview_stack.png`: empilhamento das camadas em `tx=0, ty=0` (deve reproduzir fielmente `bases-v05/MM12-QNN.png`).
   - `preview_shift.png`: empilhamento com deslocamento de teste (`L01 -10px`, `L02 0px`, `L03 +18px`, `L04 +32px`) para confirmar ausência de buracos ou duplicações (“fantasmas”).

---

## 1. `MM12-Q01` · O caminho *(PILOTO 1 — 4 camadas)*

| Z | Arquivo | Conteúdo exato | Tipo | Parallax previsto no HyperFrames |
|---:|---|---|---|---|
| 1 | `MM12-Q01-L01-BG-cleanplate.png` | Céu dourado, nuvens suaves e cordilheira distante ao fundo (sem a oliveira esquerda e sem as pedras de primeiro plano). | RGB opaco | `scale 1.04→1.06`, `tx 0→-12px` |
| 2 | `MM12-Q01-L02-MG-vale-trilha.png` | Vale intermediário, colinas com oliveiras médias e estrada sinuosa de terra no centro (reconstruída atrás das pedras de primeiro plano). | PNG RGBA | `scale 1.03→1.07`, `tx 0→-24px` |
| 3 | `MM12-Q01-L03-FG-dir-pedras-arbustos.png` | Pedras e arbustos secos do canto inferior direito. | PNG RGBA | `scale 1.04→1.10`, `tx 0→-42px`, `ty 0→+8px` |
| 4 | `MM12-Q01-L04-FG-esq-muro-oliveira.png` | Muro rústico de pedras grandes à esquerda + tronco e copa da oliveira no canto superior esquerdo. | PNG RGBA | `scale 1.05→1.12`, `tx 0→-56px`, leve oscilação orgânica (`±0.25°`) |

**Prompt-base para extrair `L01` (cleanplate) de `MM12-Q01`:**
> A partir de `bases-v05/MM12-Q01.png`, gere a placa limpa de fundo `MM12-Q01-L01-BG-cleanplate.png` nas mesmas dimensões exatas: mantenha apenas o céu dourado, nuvens suaves e montanhas distantes no horizonte, removendo a grande oliveira esquerda, o muro de pedras e a vegetação de primeiro plano, preenchendo naturalmente o céu e as encostas distantes onde havia sobreposição, com o mesmo estilo pictórico/papel e iluminação.

**Prompt-base para camadas RGBA (`L02`–`L04`):**
> A partir de `bases-v05/MM12-Q01.png`, isole em PNG RGBA com fundo 100% transparente apenas `[DESCRIÇÃO EXATA DA CAMADA]`, mantendo exatamente a posição, escala, cor, iluminação e acabamento pictórico da referência no canvas completo 1:1. Bordas limpas e naturais (especialmente nos galhos/folhas da oliveira), sem halo e sem alterar o desenho original.

---

## 2. `MM12-Q02` · Belém ao longe *(4 camadas)*

| Z | Arquivo | Conteúdo exato | Tipo | Parallax previsto no HyperFrames |
|---:|---|---|---|---|
| 1 | `MM12-Q02-L01-BG-cleanplate.png` | Céu de fim de tarde/crepúsculo + montanhas e vale distante à esquerda (reconstruído atrás das oliveiras direitas e da encosta esquerda). | RGB opaco | `scale 1.03→1.05`, `tx 0→+10px` |
| 2 | `MM12-Q02-L02-MG-belem-estrada.png` | Povoado de Belém na encosta direita com pontos de luz âmbar + trilha central subindo até a vila. | PNG RGBA | `scale 1.03→1.08`, `tx 0→+22px` |
| 3 | `MM12-Q02-L03-FG-esq-rochas.png` | Encosta de pedras grandes e arbustos secos no primeiro plano esquerdo. | PNG RGBA | `scale 1.05→1.12`, `tx 0→+40px`, `ty 0→+8px` |
| 4 | `MM12-Q02-L04-FG-dir-oliveiras.png` | Copa densa das oliveiras em primeiro plano à direita (funciona como moldura de aproximação rumo à cidade). | PNG RGBA | `scale 1.06→1.15`, `tx 0→+58px`, leve respiro de vento |

---

## 3. `MM12-Q07` · Entrada de Belém *(NOVO — 4 camadas)*

| Z | Arquivo | Conteúdo exato | Tipo | Parallax previsto no HyperFrames |
|---:|---|---|---|---|
| 1 | `MM12-Q07-L01-BG-cleanplate.png` | Céu em transição fim de tarde → crepúsculo + horizonte distante limpo. | RGB opaco | `scale 1.02→1.05`, `tx 0→-10px` |
| 2 | `MM12-Q07-L02-MG-casario-entrada.png` | Casario interno da entrada de Belém ao fundo, caminho curvando para dentro e pequenas luzes âmbar. | PNG RGBA | `scale 1.03→1.08`, `tx 0→-20px` |
| 3 | `MM12-Q07-L03-FG-esq-fachada-pedra.png` | Primeira fachada de pedra à esquerda com a primeira lamparina âmbar e degraus. | PNG RGBA | `scale 1.05→1.12`, `tx 0→-38px` |
| 4 | `MM12-Q07-L04-FG-dir-muro-oliveira.png` | Mureta de pedra e galhos de oliveira em primeiro plano à direita. | PNG RGBA | `scale 1.06→1.14`, `tx 0→-52px` |

---

## 4. `MM12-Q03` + `MM12-Q04` · A chegada → A noite *(Pilha pareada: 4 camadas × 2 estados de luz)*

> **Estratégia chave:** como `Q03` e `Q04` possuem **a mesma câmera e arquitetura exatas**, gerar as mesmas 4 máscaras/recortes para os dois estados de luz permite que o HyperFrames faça um **anoitecer contínuo e orgânico (crepúsculo → noite)** sem corte seco e com parallax ininterrupto!

| Z | Arquivo (`Q03` crepúsculo / `Q04` noite) | Conteúdo exato | Tipo | Parallax + transição no HyperFrames |
|---:|---|---|---|---|
| 1 | `MM12-Q03-L01-BG-ceu-crepusculo.png` + `MM12-Q04-L01-BG-ceu-noite.png` | Céu limpo com nuvens (alaranjado/azul em `Q03` → azul-noturno profundo em `Q04`). | RGB opaco | Deriva lenta de nuvens + crossfade suave de crepúsculo para noite |
| 2 | `MM12-Q03-L02-MG-viela-fundo.png` + `MM12-Q04-L02-MG-viela-fundo.png` | Rua de terra curvando à esquerda, casas distantes com lamparinas, ciprestes e casario ao fundo. | PNG RGBA | `scale 1.02→1.07`, `tx 0→-18px` + crossfade tonal |
| 3 | `MM12-Q03-L03-FG-dir-muro-oliveira.png` + `MM12-Q04-L03-FG-dir-muro-oliveira.png` | Mureta baixa de pedras à direita + oliveira da margem direita. | PNG RGBA | `scale 1.04→1.10`, `tx 0→-34px` + crossfade tonal |
| 4 | `MM12-Q03-L04-FG-esq-casa-porta.png` + `MM12-Q04-L04-FG-esq-casa-porta.png` | Fachada esquerda de pedra, porta de madeira fechada, lamparina, degraus, jarro esquerdo, banquinho/vaso e galhos de oliveira no topo esquerdo. | PNG RGBA | `scale 1.05→1.12`, `tx 0→-48px` + brilho procedural (flicker âmbar) na lamparina no HyperFrames |

---

## 5. `MM12-Q05` · Sem acolhimento *(4 camadas)*

| Z | Arquivo | Conteúdo exato | Tipo | Parallax previsto no HyperFrames |
|---:|---|---|---|---|
| 1 | `MM12-Q05-L01-BG-cleanplate.png` | Céu azul-noturno + casas distantes desfocadas com pontos âmbar. | RGB opaco | `scale 1.02→1.04`, `tx 0→+8px` |
| 2 | `MM12-Q05-L02-MG-rua-mureta.png` | Rua de pedras e terra curvando ao fundo + mureta de pedra e arbustos à direita. | PNG RGBA | `scale 1.03→1.07`, `tx 0→+18px` |
| 3 | `MM12-Q05-L03-FG-esq-fachada-porta.png` | Fachada próxima de pedra à esquerda, porta de madeira fechada, lamparina suspensa e pedras do canto inferior esquerdo. | PNG RGBA | `scale 1.04→1.09`, `tx 0→+30px` + flicker sutil da lamparina |
| 4 | `MM12-Q05-L04-OBJ-banco-jarros.png` | Banquinho de madeira + par de jarros de barro + folhagem junto à parede (reforça o relevo próximo sem mexer na porta). | PNG RGBA | `scale 1.05→1.11`, `tx 0→+40px` |

---

## 6. `MM12-Q08` · Saída para os arredores *(NOVO — 4 camadas)*

| Z | Arquivo | Conteúdo exato | Tipo | Parallax previsto no HyperFrames |
|---:|---|---|---|---|
| 1 | `MM12-Q08-L01-BG-cleanplate.png` | Céu azul-noturno amplo + montanhas distantes (mesma atmosfera de `Q06`). | RGB opaco | `scale 1.02→1.04`, `tx 0→-10px` |
| 2 | `MM12-Q08-L02-MG-belem-ciprestes.png` | Colinas intermediárias, ciprestes escuros e pequenas luzes de Belém ficando ao fundo. | PNG RGBA | `scale 1.03→1.06`, `tx 0→-20px` |
| 3 | `MM12-Q08-L03-FG-esq-esquina-viela.png` | Última esquina de pedra da viela saindo pelo lado esquerdo com calor âmbar residual. | PNG RGBA | `scale 1.05→1.12`, `tx 0→-42px` (abre o espaço para a direita) |
| 4 | `MM12-Q08-L04-FG-dir-muro-vegetacao.png` | Muro baixo de pedras irregulares, trilha e vegetação baixa em primeiro plano à direita. | PNG RGBA | `scale 1.05→1.11`, `tx 0→-48px` |

---

## 7. `MM12-Q06` · Um abrigo simples *(PILOTO 2 — 5 camadas · padrão `MM13-Q06 v16`)*

> **Regra de fechamento (Cena 6 → Cena 7):** o movimento 2.5D de entrada em `Q06` acontece apenas nos primeiros segundos e **desacelera até estabilizar exatamente em `scale=1.00, tx=0, ty=0`** (posição neutra idêntica à `MM13-Q06 v09`), mantendo apenas respiração atmosférica mínima (flicker muito sutil da lamparina e deriva quase imperceptível de nuvens) durante o hold até a fala da multidão na Cena 7.

| Z | Arquivo | Conteúdo exato | Tipo | Parallax previsto no HyperFrames |
|---:|---|---|---|---|
| 1 | `MM12-Q06-L01-BG-cleanplate.png` | Céu azul-noturno com nuvens suaves + montanhas e vale distantes (sem Belém, sem mureta e sem estábulo). | RGB opaco | Entrada suave `tx +8px→0px`, depois deriva mínima de nuvens |
| 2 | `MM12-Q06-L02-MG-belem-ciprestes.png` | Povoado distante de Belém com pequenas luzes âmbar + ciprestes e encosta média. | PNG RGBA | Entrada `tx +14px→0px`, estabiliza em `0` |
| 3 | `MM12-Q06-L03-FG-dir-mureta-chao.png` | Mureta baixa de pedras irregulares à direita, pequeno arbusto e chão de terra/pedras. | PNG RGBA | Entrada `tx +22px→0px`, estabiliza em `0` |
| 4 | `MM12-Q06-L04-FG-esq-estabulo.png` | Estábulo à esquerda (paredes de pedra, pilar/vigas, telhado de palha, porteira, palha interna e lamparina). | PNG RGBA | Entrada `tx +30px→0px`, estabiliza em `0` + flicker âmbar sutil |
| 5 | `MM12-Q06-L05-OBJ-anforas.png` | Par de ânforas de barro apoiadas junto à quina da parede de pedra (mesmo critério de `MM13-Q06 v16`). | PNG RGBA | Entrada `tx +36px→0px`, estabiliza em `0` |

**Nota especial para `MM12-Q06`:** preservar exatamente a geometria de `MM12-Q06.jpg` (D-46) e testar `preview_stack.png` em diferença visual contra `storyboards/MM-13/estabulo-anjos-v09/MM13-Q06.png` para garantir alinhamento do telhado, parede de pedra, ânforas e mureta.

---

## 8. Plano de montagem no HyperFrames (após entrega das camadas)

Assim que as camadas forem aprovadas e entregues:
1. Criaremos o projeto `storyboards/MM-12/cena-06-v05/` com `filmmaker.project.json` validado via `validate_project`.
2. **Transições inspiradas na abertura de `MM-16`:** em vez de cortes secos ou máscaras geométricas de polígonos da `v04`, usaremos transições suaves por profundidade/luz (dobra orgânica de luz/papel suave, dissolução atmosférica direcional e evolução contínua de iluminação em `Q03 → Q04`).
3. **Efeitos procedurais no HyperFrames (sem alterar os PNGs):**
   - oscilação quente (flicker orgânico) nos focos de lamparina (`Q07`, `Q03/Q04`, `Q05`, `Q06`);
   - poeira dourada muito discreta no feixe de fim de tarde (`Q01`, `Q02`, `Q07`) e no calor do abrigo (`Q06`);
   - entrega em **dois formatos operacionais** conforme `cena-06.md` e D-60:
     - **Prévia sequencial completa (`v05`)** com marcadores conferidos no MP4; e
     - **Clipes/loops operacionais individuais por deixa** (ou pontos de pausa/loop definidos com a operação em P-12), garantindo que o operador avance exatamente no ritmo da fala ao vivo e sustente `Q06` na entrada da Cena 7.
