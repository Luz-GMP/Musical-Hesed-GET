# Cena 1 · Quebrando as Correntes · Take 02 (1º Refrão Void 2.5D + Tipografia Cinética) — v03

23/11/2026 · Cena 1 (*Da prisão à liberdade*) · Responsável: **Victor** · **Prévia v03 em revisão artística** (renderizada via plugin MCP `ai-filmmaker` · motor **HyperFrames 0.9.72**). Versões `v01` e `v02` preservadas intactas.

## Identificação da versão e operação

| Campo | Registro |
| --- | --- |
| **MP4 da prévia v03** | [Cena01-Quebrando-as-Correntes-Take02-v03-1080p24.mp4](Cena01-Quebrando-as-Correntes-Take02-v03-1080p24.mp4) · `1920 × 1080` progressivo, `24 fps`, `22,000 s` (`528` quadros), H.264 BT.709 `yuv420p` / AAC `48.000 Hz` estéreo · `9.380.909` bytes · SHA-256 `7389f9004cffd4f69349dbf6484308753c44ec63e11b35e94b374046625ea23b` |
| **Motor e validação** | Plugin MCP `ai-filmmaker` (`validate_project`: `pass`, `12 assets e 1 cenas`, `0` erros, `0` avisos; `render_preview`: `engine: "hyperframes"`, versão `0.9.72`). |
| **Master de áudio de referência** | `Quebrando-as-Correntes.mp3` (Wagner Oliveira, recorte `00:47.000`–`01:09.000` em `cena/musica.wav`). |
| **O que mudou na v03** | Preservados todos os refinamentos da `v02` (aterramento real, sombras macias, respiração em malha sem bounce e estilhaçamento 3D vindo contra a câmera) e acrescentados os **8 blocos completos da letra do 1º Refrão em tipografia cinética** no mesmo estilo do Take 01, alternando esquerda/direita fora do corpo da Ladra, com os estilhaços 3D passando à frente do texto. |
| **Emenda anterior / Quadro final** | Parte do quadro final do Take 01 v01 (`00:00:00.000`) e encerra limpo no [Quadro-Final-v03.png](Cena01-Quebrando-as-Correntes-Take02-Quadro-Final-v03.png) (`00:21.958`, quadro `527`). |

## Tabela de marcadores (conferidos no MP4 v03 · 24 fps)

| Marcador | Tempo no MP4 (Take 02) | Tempo no MP3 | Quadro (0-index) | Telão / Letra cinética e ação 2.5D | Situação |
| --- | --- | --- | --- | --- | --- |
| **INÍCIO + B1** | `00:00:00.000` *(B1 `00:00:00.320`)* | `00:47.000` | `0` | Emenda Take 01 → Void com diagonais intactas. **B1 (esq.):** *“SE O FILHO ME LIBERTAR”*. | Medido no MP4 |
| **RUPTURA 3D + B2** | `00:00:02.800` | `00:49.800` | `67` | Estilhaçamento 3D das diagonais vindo contra a lente (sem fogo/faíscas) + chicote das metades. **B2 (dir.):** *“VERDADEIRAMENTE EU SOU LIVRE”*. | Medido no MP4 |
| **AVANÇO 2.5D + B3** | `00:00:05.600` | `00:52.600` | `134` | Câmera atravessa as correntes penduradas até a Ladra acorrentada. **B3 (esq.):** *“SE O FILHO ME LIBERTAR”*. | Medido no MP4 |
| **LIBERTAÇÃO 3D + B4** | `00:00:08.400` | `00:55.400` | `201` | Estilhaços 3D dos tornozelos/pulsos na lente + algema aberta cai no piso + troca `02 → 03` alinhada. **B4 (dir.):** *“A CORRENTE CAI AOS MEUS PÉS, EU VIVO!”*. | Medido no MP4 |
| **RECUO LIVRE + B5** | `00:00:11.200` | `00:58.200` | `268` | Ladra livre firme (respiração em malha, sem bounce) + recuo cinematográfico de câmera. **B5 (esq.):** *“EU ERA ESCRAVO, MAS CRISTO ME COMPROU”*. | Medido no MP4 |
| **B6** | `00:00:13.950` | `01:00.950` | `335` | Continuidade do recuo revelando a algema no chão. **B6 (dir.):** *“ME CHAMOU PELO NOME, ME CARREGOU”*. | Medido no MP4 |
| **B7** | `00:00:16.750` | `01:03.750` | `402` | Contraluz quente expandindo suavemente. **B7 (esq.):** *“SE O FILHO ME LIBERTAR”*. | Medido no MP4 |
| **B8** | `00:00:19.020` | `01:06.020` | `456` | **B8 (dir.):** *“VERDADEIRAMENTE, VERDADEIRAMENTE SOU!”* (sai limpo até `00:21.850`). | Medido no MP4 |
| **SAÍDA (2º VERSO)** | `00:00:21.958` *(fim `00:00:22.000`)* | `01:09.000` | `527` *(total `528`)* | Quadro-âncora limpo pronto para o Take 03 (`Quadro-Final-v03.png`). | Medido no MP4 |
| **DEIXA SEPARADA — Cortina fechada** | Deixa manual *(fora deste take)* | Pós `03:44` | — | Saída das atrizes ao vivo concluída → cortina fechada dispara **som de elevador/telemarketing** (Cena 2). | Deixa separada · a ensaiar |

## Editável e conferência

- **Projeto editável v03:** [filmmaker.project.json](../../../projetos/AI-Filmmaker/cena01-correntes-take02-v03/filmmaker.project.json) · [cena.js](../../../projetos/AI-Filmmaker/cena01-correntes-take02-v03/cena/cena.js) · [marcadores.js](../../../projetos/AI-Filmmaker/cena01-correntes-take02-v03/cena/marcadores.js)
- **Prancha QA v03:** [Cena01-Quebrando-as-Correntes-Take02-Prancha-v03.jpg](Cena01-Quebrando-as-Correntes-Take02-Prancha-v03.jpg) (`DECODE_OK=0`, zero sobreposição sobre a Ladra e zero corte de borda nos 8 blocos).
- **Pendências:** revisão artística de Victor sobre a sincronia vocal dos 8 blocos cinéticos e aprovação do Take 02 antes de planejar o Take 03 (`01:09` em diante).
