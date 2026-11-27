# Pacote de execução para o Codex · Cena 6 · MM-12 · 2.5D v05

**Projeto:** HESED 2026 · Cena 6 (Viagem a Belém e chegada ao abrigo)  
**Responsável:** Victor (continuidade das bases preparadas na fila de Eduardo)  
**Data:** 26/11/2026  
**Situação:** Especificação pronta para execução no Codex (imagens + camadas 2.5D); montagem e render final em MP4 serão feitos depois no HyperFrames. **Estado em 27/11/2026.** O piloto foi aprovado e as oito bases estão prontas. Siga o [guia de continuidade](continuidade-2026-11-27.md) para recuperar a mídia e concluir as camadas. Os passos abaixo registram a especificação original do pacote.

> **Diretrizes consultadas:** `storyboards/guia-de-construcao.md`, `storyboards/briefings-dos-quadros.md` (`MM-12-Q01` a `MM-12-Q08`), `docs/roteiro.md` (Cenas 6–7), `docs/briefing.md`, `docs/fontes/HESED_Biblia_de_Producao_v0_1.md` (§§2.1, 3/Cenas 6–7, 4.1, 5.1–5.2), `docs/alinhamento-das-fontes.md`, `docs/decisoes.md` (D-28, D-45, D-46, D-47, D-54, D-55, D-60, D-61), `storyboards/MM-13/estabulo-anjos-v09/MM13-Q06.png` e `storyboards/MM-13/estabulo-anjos-v16/layers-v01/LEIA-ME-2p5d.md`.

---

## 1. Objetivo e ordem de montagem

Adaptar visualmente as seis imagens existentes da `MM-12`, criar **dois quadros ponte novos** (`MM-12-Q07` e `MM-12-Q08`, sem renumerar `Q01`–`Q06`) e decompor toda a sequência em **camadas 2.5D reais com cleanplates** para permitir uma animação fluida no HyperFrames.

**Ordem narrativa na Cena 6 (sem renumerar IDs):**

| Ordem | ID | Título | Papel na Cena 6 | Fala / deixa aproximada |
|---:|---|---|---|---|
| 1 | `MM-12-Q01` | O caminho | Base existente adaptada + 2.5D | “Naquela época, foi decretado…” |
| 2 | `MM-12-Q02` | Belém ao longe | Base existente adaptada + 2.5D | “José, que era noivo de Maria, precisou ir até Belém…” |
| 3 | `MM-12-Q07` | **Entrada de Belém (NOVO)** | Ponte `Q02 → Q03` + 2.5D | Passagem da estrada para a entrada do povoado |
| 4 | `MM-12-Q03` | A chegada | Base existente adaptada + 2.5D | “E quando eles chegaram lá…” (crepúsculo) |
| 5 | `MM-12-Q04` | A noite | Mesma geometria de `Q03` em noite + 2.5D | Evolução contínua de luz sobre a mesma rua |
| 6 | `MM-12-Q05` | Sem acolhimento | Base existente adaptada + 2.5D | “…não tinha lugar pra ficar. Nenhuma hospedagem disponível.” |
| 7 | `MM-12-Q08` | **Saída para os arredores (NOVO)** | Ponte `Q05 → Q06` + 2.5D | Saída da viela deixando Belém atrás rumo ao campo |
| 8 | `MM-12-Q06` | Um abrigo simples | Base restaurada (D-46) adaptada + 2.5D | “…onde os animais ficavam.” / **Hold na entrada da Cena 7** |

---

## 2. Contrato de estilo visual (v05)

**Direção definida por Victor:** **cinematográfico com acabamento pictórico e textura suave de papel**, próximo da sensibilidade tátil da abertura aprovada de `MM-16`, **sem** o filtro sépia pesado, a vinheta agressiva e a estética de xilogravura/cordel chapada da `v04`.

### O que aplicar
- **Base cinematográfica preservada:** manter o realismo reverente, a luz natural/noturna crível e a profundidade atmosférica das seis bases originais (`MM12-Q01.jpg` a `MM12-Q06.jpg`).
- **Acabamento pictórico controlado:** micro-pincelada suave nas superfícies (nuvens, montanhas, pedras, reboco, folhagem), reduzindo o aspecto plástico/hiper-nítido de foto digital crua e unificando toda a sequência como uma mesma obra.
- **Textura tátil de papel:** grão orgânico bem fino e quente de papel algodão/linho perceptível nas transições de luz e nos tons médios, sem cobrir detalhes ou “sujar” as sombras profundas (importante para leitura limpa em painel de LED).
- **Paleta canônica preservada:**
  - Azul-noturno `#142B49` e sombra azul `#101B29` (preservar detalhe nas sombras, sem preto chapado estourado)
  - Pedra e terra `#A68A68`
  - Âmbar de lamparina `#D3A15B`
  - Marfim / realce suave `#E8DFCF`

### O que NÃO fazer
- **NÃO** sobrescrever `storyboards/MM-12/MM12-Q01.jpg` a `MM12-Q06.jpg` nem `STB MM12.png`. Os originais permanecem intactos.
- **NÃO** aplicar filtro sépia geral, preto-e-branco, contorno de tinta grossa, moldura de papel rasgado ou overlay de xilogravura sobre as imagens.
- **NÃO** incluir pessoas, Maria, José, hospedeiro, animais, bebê, manjedoura, anjos, estrela protagonista, placas ou texto em nenhum quadro.
- **NÃO** espelhar nenhum quadro. Em `Q03`, `Q04` e `Q05`, a casa/porta fica obrigatoriamente à **esquerda** e o caminho passa pelo lado **direito** curvando para a esquerda em profundidade (D-45/D-46). Em `Q06`, o estábulo fica obrigatoriamente à **esquerda** com sua parede de pedra maciça, poste de madeira e duas ânforas, e o campo/mureta/Belém à **direita** (D-46/D-47).

### Regra crítica de continuidade em `MM-12-Q06` (Cena 6 → Cena 7)
`MM12-Q06.jpg` e a imagem aprovada da Cena 7 (`storyboards/MM-13/estabulo-anjos-v09/MM13-Q06.png`) possuem **a mesma arquitetura e câmera exatas**. Portanto:
1. Em `MM12-Q06`, **não alterar** posição da parede de pedra, vigas, telhado, porteira, lamparina, duas ânforas, mureta, horizonte ou luzes de Belém.
2. O acabamento pictórico/papel em `Q06` deve ser **bem mais sutil** (cerca de 40%–50% da intensidade usada em `Q01`–`Q02`), garantindo que o último frame estabilizado da Cena 6 entregue para `MM13-Q06 v09` na Cena 7 sem salto tonal ou geométrico.

---

## 3. Especificação técnica das camadas 2.5D (para o HyperFrames)

Seguir o mesmo princípio validado em `storyboards/MM-13/estabulo-anjos-v16/layers-v01/LEIA-ME-2p5d.md`, com rigor adicional para composição automatizada no HyperFrames:

1. **Canvas integral e registro espacial 1:1:** todas as camadas (`L01`, `L02`, `L03`, ...) de um mesmo quadro devem ter **exatamente a mesma resolução em pixels** (`1920×1080`, 16:9; ou, se a ferramenta gerar em `1672×941`, manter todas as camadas rigorosamente em `1672×941` e registrar a dimensão real). Nunca recortar a camada no bounding box do objeto — manter o objeto na posição exata do quadro cheio sobre fundo transparente.
2. **Transparência real (PNG RGBA):**
   - `L01-BG-cleanplate.png`: **PNG RGB opaco** (sem transparência), com o fundo reconstruído (inpainting limpo) atrás de todas as áreas cobertas pelas camadas frontais.
   - Demais camadas (`L02`, `L03`, `L04`, `L05`): **PNG RGBA com canal alpha limpo**, bordas antisserrilhadas sem halo branco/cinza e **sem sombra projetada “cortada” fora do objeto** quando isso impedir o parallax.
3. **Margem de sobreposição (overpaint/bleed):** no `L01-BG-cleanplate` e nos planos intermediários que ficam parcialmente atrás de um primeiro plano, reconstruir pelo menos **6% a 10% extras** de cenário contínuo atrás da silhueta recortada, para que o movimento 2.5D no HyperFrames (parallax de 20–60 px + zoom de 1.00→1.07) não revele buracos ou duplicações (“fantasmas”).
4. **Provas de verificação obrigatórias por quadro:**
   - `preview_stack.png`: composição das camadas empilhadas em posição neutra (`tx=0, ty=0`) para conferir fidelidade visual com a base estilizada.
   - `preview_shift.png`: prova rápida com deslocamentos simulados (`L01 -10px`, `L02 +0px`, `L03 +18px`, `L04 +32px`) para provar que não há buracos no cleanplate nem halo nas bordas alpha.
5. **Política de armazenamento (P-13):** guardar os PNGs pesados em pasta local fora do Git (ex.: `entregas/MM12/pacote-2p5d-v05/` ou pasta de produção local indicada por Victor), mantendo no repositório apenas os registros, manifestos e eventuais prévias leves autorizadas.

---

## 4. Estrutura de pastas e nomes esperados na entrega do Codex

```text
<pasta-local-MM12-v05>/
├── bases-v05/                        # 8 imagens completas unificadas no estilo v05 (stills de referência / emergência)
│   ├── MM12-Q01.png
│   ├── MM12-Q02.png
│   ├── MM12-Q07.png                  # NOVO · ponte Q02 → Q03
│   ├── MM12-Q03.png
│   ├── MM12-Q04.png                  # mesma câmera de Q03 em luz noturna
│   ├── MM12-Q05.png
│   ├── MM12-Q08.png                  # NOVO · ponte Q05 → Q06
│   └── MM12-Q06.png                  # compatível com MM13-Q06 v09
├── layers-v05/
│   ├── MM12-Q01/
│   │   ├── MM12-Q01-L01-BG-cleanplate.png
│   │   ├── MM12-Q01-L02-MG-vale-trilha.png
│   │   ├── MM12-Q01-L03-FG-dir-pedras-arbustos.png
│   │   ├── MM12-Q01-L04-FG-esq-muro-oliveira.png
│   │   ├── preview_stack.png
│   │   └── preview_shift.png
│   ├── MM12-Q02/
│   │   ├── MM12-Q02-L01-BG-cleanplate.png
│   │   ├── MM12-Q02-L02-MG-belem-estrada.png
│   │   ├── MM12-Q02-L03-FG-esq-rochas.png
│   │   ├── MM12-Q02-L04-FG-dir-oliveiras.png
│   │   ├── preview_stack.png
│   │   └── preview_shift.png
│   ├── MM12-Q07/
│   │   ├── MM12-Q07-L01-BG-cleanplate.png
│   │   ├── MM12-Q07-L02-MG-casario-entrada.png
│   │   ├── MM12-Q07-L03-FG-esq-fachada-pedra.png
│   │   ├── MM12-Q07-L04-FG-dir-muro-oliveira.png
│   │   ├── preview_stack.png
│   │   └── preview_shift.png
│   ├── MM12-Q03-Q04/                 # Pilha pareada: mesma arquitetura em crepúsculo (Q03) e noite (Q04)
│   │   ├── MM12-Q03-L01-BG-ceu-crepusculo.png
│   │   ├── MM12-Q04-L01-BG-ceu-noite.png
│   │   ├── MM12-Q03-L02-MG-viela-fundo.png
│   │   ├── MM12-Q04-L02-MG-viela-fundo.png
│   │   ├── MM12-Q03-L03-FG-dir-muro-oliveira.png
│   │   ├── MM12-Q04-L03-FG-dir-muro-oliveira.png
│   │   ├── MM12-Q03-L04-FG-esq-casa-porta.png
│   │   ├── MM12-Q04-L04-FG-esq-casa-porta.png
│   │   ├── preview_stack_Q03.png
│   │   ├── preview_stack_Q04.png
│   │   └── preview_shift.png
│   ├── MM12-Q05/
│   │   ├── MM12-Q05-L01-BG-cleanplate.png
│   │   ├── MM12-Q05-L02-MG-rua-mureta.png
│   │   ├── MM12-Q05-L03-FG-esq-fachada-porta.png
│   │   ├── MM12-Q05-L04-OBJ-banco-jarros.png
│   │   ├── preview_stack.png
│   │   └── preview_shift.png
│   ├── MM12-Q08/
│   │   ├── MM12-Q08-L01-BG-cleanplate.png
│   │   ├── MM12-Q08-L02-MG-belem-ciprestes.png
│   │   ├── MM12-Q08-L03-FG-esq-esquina-viela.png
│   │   ├── MM12-Q08-L04-FG-dir-muro-vegetacao.png
│   │   ├── preview_stack.png
│   │   └── preview_shift.png
│   └── MM12-Q06/                     # Geometria travada com MM13-Q06 v09
│       ├── MM12-Q06-L01-BG-cleanplate.png
│       ├── MM12-Q06-L02-MG-belem-ciprestes.png
│       ├── MM12-Q06-L03-FG-dir-mureta-chao.png
│       ├── MM12-Q06-L04-FG-esq-estabulo.png
│       ├── MM12-Q06-L05-OBJ-anforas.png
│       ├── preview_stack.png
│       └── preview_shift.png
└── registro-execucao-v05.md          # Dimensões reais, hashes SHA-256, prompts usados e observações de QA
```

---

## 5. Fluxo em etapas (NÃO rodar tudo de uma vez)

### Etapa 0 · Piloto obrigatório (aprovação de Victor antes do lote)
Rodar primeiro apenas **2 quadros de extremos tonais**:
1. **`MM12-Q01`** (luz dourada de fim de tarde): gera `bases-v05/MM12-Q01.png` + 4 camadas 2.5D + `preview_stack.png` e `preview_shift.png`.
2. **`MM12-Q06`** (noite azul + âmbar do estábulo): gera `bases-v05/MM12-Q06.png` + 5 camadas 2.5D + `preview_stack.png` e `preview_shift.png`, **comparando lado a lado com `storyboards/MM-13/estabulo-anjos-v09/MM13-Q06.png`**.

**Parar aqui e aguardar aprovação de Victor** sobre:
- intensidade do toque pictórico e da textura de papel;
- compatibilidade visual e geométrica de `MM12-Q06` com `MM13-Q06 v09`;
- limpeza dos recortes alpha e dos cleanplates no `preview_shift.png`.

### Etapa 1 · Demais bases estilizadas + quadros ponte
Após aprovação do piloto:
1. Estilizar `Q02`, `Q03`, `Q04` (ancorado em `Q03`), `Q05` (ancorado em `Q04`).
2. Gerar os 2 quadros ponte: `Q07` (ancorado em `Q02` + `Q03`) e `Q08` (ancorado em `Q05` + `Q06`).
3. Conferir a sequência inteira (`Q01 → Q02 → Q07 → Q03 → Q04 → Q05 → Q08 → Q06`) numa prancha de revisão horizontal antes de recortar as camadas restantes.

### Etapa 2 · Decomposição 2.5D restante e entrega para o HyperFrames
1. Separar em camadas `Q02`, `Q07`, `Q03-Q04`, `Q05` e `Q08` conforme [prompts-camadas-2p5d.md](prompts-camadas-2p5d.md).
2. Preencher `registro-execucao-v05.md` com resolução real, hashes SHA-256 e qualquer limitação encontrada.
3. Voltar ao Antigravity / AI Filmmaker para montar a composição determinística `cena-06-v05` no HyperFrames (1920×1080, 30 fps ou FPS aprovado, com flicker procedural de lamparina, poeira atmosférica, transição de luz `Q03 → Q04`, transições táteis inspiradas na abertura de `MM-16`, marcadores conferidos no MP4 e hold estável no `Q06`).

---

## 6. Comando pronto para colar no Codex (Etapa 0 — Piloto)

```text
Leia AGENTS.md, CLAUDE.md, CODEX.md, storyboards/guia-de-construcao.md, storyboards/briefings-dos-quadros.md (seção MM-12, incluindo Q07 e Q08) e o pacote completo em storyboards/MM-12/pacote-2p5d-codex-v05/ (README.md, prompts-quadros-v05.md e prompts-camadas-2p5d.md).

Execute SOMENTE a Etapa 0 (Piloto) para aprovação de Victor antes de avançar para os demais quadros:
1. Adapte storyboards/MM-12/MM12-Q01.jpg e storyboards/MM-12/MM12-Q06.jpg para o estilo v05 (cinematográfico com acabamento pictórico controlado e textura suave de papel, sem filtro sépia pesado ou gravura da v04), preservando os originais intactos e respeitando a compatibilidade geométrica/tonal de MM12-Q06 com storyboards/MM-13/estabulo-anjos-v09/MM13-Q06.png.
2. Separe MM12-Q01 (4 camadas) e MM12-Q06 (5 camadas) em PNGs 2.5D com canvas integral 1:1 (L01-BG-cleanplate opaco com fundo reconstruído + demais camadas RGBA com alpha limpo), conforme prompts-camadas-2p5d.md.
3. Gere preview_stack.png e preview_shift.png para Q01 e Q06, e uma comparação lado a lado de Q06 v05 com MM13-Q06 v09.
4. Salve tudo na pasta local de produção fora do Git (respeitando P-13), registre resolução real, hashes e observações em registro-execucao-v05.md e pare para aprovação visual de Victor.
```

---

## Arquivos deste pacote

- [prompts-quadros-v05.md](prompts-quadros-v05.md) — Prompts completos para adaptação estilística (`Q01`–`Q06`) e criação dos quadros ponte (`Q07`, `Q08`).
- [prompts-camadas-2p5d.md](prompts-camadas-2p5d.md) — Mapa exato de camadas, prompts de cleanplate e recortes RGBA, e plano de animação 2.5D no HyperFrames.

