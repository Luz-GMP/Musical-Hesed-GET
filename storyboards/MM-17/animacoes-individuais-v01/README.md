# Cena 7 · animações 2.5D individuais · v01

**Responsável:** Eduardo (Dudu) · **Origem:** proposta MM-17, Cena 7 · **Estado:** estudos independentes para revisão visual. Não foi criada uma montagem completa da Cena 7 nesta entrega.

Cada MP4 tem 6 s, 1920 × 1080, 24 fps e 144 quadros, sem áudio. Os seis segundos servem apenas para revisar a animação e não definem o tempo musical. O master P-02 ainda deve determinar os pontos reais de entrada, retomada e saída. Cada projeto EffectCraft contém os mesmos marcadores que acompanham seu MP4 em tabela Markdown e CSV.

| Imagem | Estrutura separada | Movimento | Entrega |
|---|---|---|---|
| MM-17-Q01 · Os que esperaram · [base](../alpha-v02/assets/MM17-Q01.png) | Fundo limpo reconstruído; árvore; grupo de pessoas ao fundo; grupo de primeiro plano. | Parallax curto em quatro planos, deriva suave em direção à luz no horizonte. | MP4 local: `MM17-Q01/HESED_C07_MM17-Q01_2p5D_v01.mp4` · projeto: `HESED_C07_MM17-Q01_2p5D_v01.ecproj` · prévia: `MM17-Q01_2p5D_preview_v01.png` · [marcadores](MM17-Q01/HESED_C07_MM17-Q01_2p5D_v01_marcadores.md) · [CSV](MM17-Q01/HESED_C07_MM17-Q01_2p5D_v01_markers.csv). |
| MM-17-Q02 · Os que louvam hoje · [base](../alpha-v02/assets/MM17-Q02.png) | Fundo limpo; árvore; grupo de adoradores ao fundo; grupo próximo à esquerda. | Parallax curto e deriva em direção à luz; sem duplicar o grupo do suéter vermelho. | MP4 local: `MM17-Q02/HESED_C07_MM17-Q02_2p5D_v01.mp4` · projeto: `HESED_C07_MM17-Q02_2p5D_v01.ecproj` · prévia: `MM17-Q02_2p5D_preview_v01.png` · [marcadores](MM17-Q02/HESED_C07_MM17-Q02_2p5D_v01_marcadores.md) · [CSV](MM17-Q02/HESED_C07_MM17-Q02_2p5D_v01_markers.csv). |
| MM-17-Q03 · Os que virão · [base](../alpha-v02/assets/MM17-Q03.png) | Fundo limpo; árvore; caminhantes ao fundo; famílias em primeiro plano; feixe vetorial suave de luz. | Parallax curto e expansão vertical contida da luz no horizonte. | MP4 local: `MM17-Q03/HESED_C07_MM17-Q03_2p5D_v01.mp4` · projeto: `HESED_C07_MM17-Q03_2p5D_v01.ecproj` · prévia: `MM17-Q03_2p5D_preview_v01.png` · [marcadores](MM17-Q03/HESED_C07_MM17-Q03_2p5D_v01_marcadores.md) · [CSV](MM17-Q03/HESED_C07_MM17-Q03_2p5D_v01_markers.csv). |
| MM13-Q06 v16 · anjos em adoração · [estrutura das camadas](../../MM-13/estabulo-anjos-v16/layers-v01/LEIA-ME-2p5d.md) | Placa limpa; vila e árvores; estábulo e lanterna; muro e terreno; ânforas; anjos; feixes vetoriais. | Parallax curto e entrada gradual dos anjos/feixes, conforme o estudo v01 aprovado para renderização. | MP4 local v02: `HESED_MM13_Q06_v16_2p5D_v02.mp4` · projeto: `HESED_MM13_Q06_2p5d_study_v01.ecproj` · prévia: `MM13-Q06_2p5d_preview_v01.png` · [marcadores](../../MM-13/estabulo-anjos-v16/layers-v01/HESED_MM13_Q06_v16_2p5D_v02_marcadores.md) · [CSV](../../MM-13/estabulo-anjos-v16/layers-v01/HESED_MM13_Q06_v16_2p5D_v02_markers.csv). |

## O que foi separado

Q01, Q02 e Q03 têm um fundo sem pessoas/árvore, uma camada de árvore, um grupo de figuras mais distantes e um grupo de primeiro plano. Q03 também tem o feixe vetorial do horizonte. Em Q02 o primeiro plano foi refinado como `foreground-v02` para manter o grupo vermelho apenas no plano intermediário.

Os recortes e placas limpas foram reconstruídos por geração de imagem com os quadros originais como referência; não são máscaras pixel a pixel. Os quadros originais continuam intactos. A prévia foi conferida no início, no movimento e no último quadro útil. Os deslocamentos são curtos para reduzir bordas, diferenças de reconstrução e revelação de áreas ocultas.

## Operação e continuidade

- **Q01:** recebe a fala sobre as gerações e abre quando começa *Santo pra Sempre*; GO real a confirmar na operação.
- **v16:** entra somente na adoração dos anjos, conforme D-61; retorna às gerações depois, com o ponto exato a alinhar a P-02.
- **Q02:** retoma as pessoas que louvam hoje.
- **Q03:** conclui as gerações; a saída para a cozinha deve acompanhar a deixa real de fim da música.

As transições de recorte/papel/tinta ficam para o encaixe entre arquivos individuais, conforme o storyboard. Os MP4s e imagens de camada são arquivos locais de produção/revisão, fora do Git conforme P-13. `MM-17` continua identificador proposto; a seleção artística dos grupos ainda precisa ser registrada pela direção.
