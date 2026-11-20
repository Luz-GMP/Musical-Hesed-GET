# Catálogo do projeto modelo

O que existe em `projeto/src/` e quando usar. Abra o arquivo da peça antes de usá-la: o comentário
do topo de cada arquivo explica a API e os quadros.

No contexto Filmmaker, leia também [integracao-filmmaker.md](integracao-filmmaker.md) para a
passagem de contexto, áudio, tempos, prévias e aprovações entre a principal e esta sub-skill.

## Mapa de pastas

| Caminho | O que é |
|---|---|
| `src/tema.ts` | PALETA, tipografia (TIPOM), molas (MOLAM), curvas (CURVAM/ease), helpers (mola, janelaM, tween, lerp, clamp01) |
| `src/tempos.ts` | `criarTempos(json)` → `falaDaCena(n)`, `trecho(n, de, ate)`, `CENAS_FALA` |
| `src/Fala.tsx` | `<Fala>` e `useLayoutFala`: a palavra cinética sincronizada |
| `src/cena.ts` | `useCenaM()`: quadro local, `local(s)`, `corteLocal`, `saidaInicio`, `pSaida`... |
| `src/montagem.tsx` | `montarRoteiro`, `VideoMontado`, `CenaIsolada`, `conferirTempos` (a conta do corte preso à fala) |
| `src/blocos/index.ts` | todos os blocos num import só (lista abaixo) |
| `src/transicoes/` | as 20 transições; `catalogo.tsx` tem `entrada('nome', props)` e as composições `T-<nome>` |
| `src/cenas/` | as 19 cenas do filme (`m01` a `m19`) e peças repetidas (`pecas.tsx`, `simbolo-skill.tsx`) |
| `src/filme/` | o filme modelo: `tempos.json` (fala de exemplo), `roteiro.ts` (ordem + transições), `Filme.tsx` |
| `src/videos/demo/` | demonstração curta (3 cenas) e **modelo de vídeo novo** |
| `src/Root.tsx` | registro das composições |
| `scripts/tempos-de-texto.mjs` | texto → tempos.json (sem narração) |
| `scripts/transcrever.mjs` | áudio → tempos.json (com narração; usa whisper.cpp, instalação à parte) |
| `scripts/stills.mjs` | quadros soltos em JPG para conferir |
| `scripts/diagnostico.mjs` | verifica Node, estrutura e versões instaladas, sem downloads |
| `public/fonts/` | Inter e JetBrains Mono (OFL) |

Esses caminhos são relativos ao projeto Remotion. Na raiz do pacote, `scripts/preparar.mjs`
copia somente o projeto para um destino novo, independentemente de agente ou shell. A instalação
do pacote inteiro usa `scripts/instalar.mjs` na raiz do Filmmaker.
O diagnóstico não comprova navegador ou transcrição funcionais: execute as verificações reais
quando necessárias e registre os resultados. Os scripts também podem ser chamados por caminho
absoluto; entradas e saídas relativas continuam referidas ao diretório de onde você os chamou.

## Composições (ids)

- `Demo`: demonstração de ~9,5 s (frase com faísca → glitch → mira de laser → chicote → "código").
- `Filme-16x9`: o filme modelo inteiro (19 cenas, ~76,7 s, sem áudio).
- `M-01` a `M-19`: cada cena do filme isolada.
- `T-<nome>`: cada transição isolada, entre um cartão A e um cartão B (~2,5 s).

## Blocos (`import { ... } from '../../blocos'`)

| Bloco | Para quê |
|---|---|
| `<Fala palavras x y estilo modo destaque />` | palavra cinética sincronizada (modos `sobe`, `maquina`, `letras`, `slam`, `foco`; `sai` para saída) |
| `useLayoutFala(props)` | geometria de cada palavra e letra (x, y, w, base, q, qFim, letras) |
| `<Faisca x y forca rastro />` | faísca de luz que "escreve" |
| `<LinhaLuz x1 x2 y progresso cabeca />` | filete de luz com cabeça brilhante |
| `<Flare x y forca largura />` | ponto de luz com estrela |
| `<MiraLaser x y raio fora />` | mira de laser com régua, círculo girando e leitura X/Y |
| `<FundoM brilho grade deriva forcaGrade />` | fundo escuro com glow, grade de prancheta, vinheta e grão |
| `<GradeChao horizonte velocidade progresso />` | grade em perspectiva (chão) correndo para a câmera |
| `<Camera zoom janela origem deriva giro>` | câmera viva (push + balanço) |
| `<Poeira n semente velocidade />` | partículas em 3 planos |
| `<Fagulhas f q0 x y n raio semente />` | estouro de fagulhas |
| `<Onda f q0 x y r1 dur />` | onda de choque |
| `<Particulas fontes alvos tempo />` | texto/pontos que viram partículas e voam até alvos |
| `<HUD tl tr bl br inicio />` + `timecodeM(q)` | rótulos técnicos de canto |
| `<Feixe f q0 de para />`, `vidro(ativo)` | feixe entre dois pontos; estilo de cartão de vidro |
| `<SimboloSkill cx cy R desenho />` | o losango com M do filme |
| `<LogoApp tam sigla />` | lugar reservado para ícone de app (placeholder) |

## As 19 cenas do filme (modelos editáveis)

Cada cena é um componente (`M01` ... `M19`) que lê a fala da cena dele em `filme/tempos.json`. Para
reaproveitar uma cena num vídeo novo: copie o arquivo para `src/videos/<nome>/`, troque
`falaDaCena(n)`/`trecho(n, ...)` pela fala do seu `tempos.json` (`T.falaDaCena(...)`) e ajuste os
textos fixos. Os índices de palavra (ex.: `fala.slice(5, 10)`) dependem da frase: refaça-os.

| # | Arquivo | Na tela | Peças principais |
|---|---|---|---|
| 1 | `m01-maquina.tsx` | frase fina escrita por uma faísca; mira de laser varre a grade; MOTION gigante incandescente letra a letra | Faisca, LinhaLuz, MiraLaser, Flare, glitch em fatias |
| 2 | `m02-after-effects.tsx` | "After Effects?" gigante letra a letra; timeline de camadas em perspectiva cortada em X por laser vermelho | Laser, LogoApp, timeline 3D |
| 3 | `m03-plugin.tsx` | "plugin" cai com peso, quica e é riscado; zona tracejada de soltar arquivo | mola `quica`, risco vermelho |
| 4 | `m04-opus.tsx` | nome em duas linhas gigantes sobre a grade; câmera empurrando ancorada no "O"; rótulos técnicos | GradeChao, LinhaLuz, LogoApp |
| 5 | `m05-prompt.tsx` | barra de prompt de vidro 3D com cursor; etiquetas sugadas pelo cursor | vidro 3D, luz na borda, reflexo |
| 6 | `m06-pedido.tsx` | painel de pedido digitado com autocompletar; cartões de mini-prévia acendem por palavra | Feixe, Fagulhas, 5 mini-demos |
| 7 | `m07-detalhe.tsx` | tudo some; um ponto pulsa no centro com ondas e mira de foco | Onda, radar |
| 8 | `m08-powerpoint.tsx` | slide "brega" (WordArt, degradê, giro, carimbo "2009") | paródia de slide |
| 9 | `m09-referencias.tsx` | cinco cartões (tipografia, grade, ritmo, easing, paleta) com mini-demonstração cada | vidro, Fagulhas, demos |
| 10 | `m10-codigo.tsx` | a frase se desmancha em caracteres de código; editor de código rolando | chuva de código |
| 11 | `m11-matematica.tsx` | prancheta: MOTION, quadrado e círculo com cotas, curva de easing e partículas | alças de seleção, cotas |
| 12 | `m12-quadro.tsx` | película correndo; fotogramas viram quadros renderizados; a película gira | FitaFilme, QuadroMini |
| 13 | `m13-fluxo-velho.tsx` | cinco caixas cinza do fluxo antigo acendem por palavra e são riscadas por laser vermelho | caixas com mini-demo, laser vermelho |
| 14 | `m14-fluxo-novo.tsx` | quatro caixas de vidro caem; um pulso de luz acende cada uma | pulso com rastro, Flare |
| 15 | `m15-ajustes.tsx` | preview com quadrado em movimento; cada pedido num balão e o preview obedece | curva de easing ao vivo |
| 16 | `m16-keyframes.tsx` | centenas de keyframes enchem a timeline; contador "movidos à mão: 0" | 320 keyframes |
| 17 | `m17-skill.tsx` | o símbolo se monta como peça 3D; etiquetas em órbita | SimboloSkill, órbita 3D |
| 18 | `m18-absurdo.tsx` | arco de luz; palavra gigante incandescente letra a letra | arco, Flare, LogoApp |
| 19 | `m19-comenta.tsx` | caixa de comentários recriada; a palavra é digitada, enviada e explode em brilho; volta ao início (loop) | Faisca, SimboloSkill |

As geometrias que uma cena divide com a transição dela estão em `src/layout.ts` (cenas 1 a 5) e
`src/layoutB.ts` (6 a 12) ou no próprio arquivo da cena (`C13`, `C14`, `C15`, `C18`, `SIMBOLO17`).
A ordem e a transição de cada corte do filme estão em `src/filme/roteiro.ts`.

## As 20 transições

Ver a tabela da seção 8 do `guia-motion.md`. Para usar num roteiro: `entrada('glitchRGB')` ou
`entrada('pontoAbre', { origem: [1500, 300] })` (import de `../../transicoes/catalogo`). Para ver uma
isolada: composição `T-<nome>`. Corte seco sem efeito: `CorteSimples` em `src/base/transicao.tsx`.
