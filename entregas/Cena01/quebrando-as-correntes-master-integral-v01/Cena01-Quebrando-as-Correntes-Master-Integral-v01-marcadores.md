# Cena 1 · Quebrando as Correntes — Master Integral v01 (`1080p24`) · Tabela Unificada de Marcadores

27/11/2026 · **Cena 1 (*Da prisão à liberdade*)** · Responsável: **Victor** · **Master Integral compilado em `1920 × 1080` progressivo a `24 fps`** a partir dos **6 takes aprovados por Victor** (`Take 01 v01`, `Take 02 v03`, `Take 03 v03`, `Take 04 v03`, `Take 05 v01`, `Take 06 v01`), unidos **sem perda geracional no vídeo (`-c:v copy`)** e muxados com o **áudio original contínuo sem cortes** de `Quebrando-as-Correntes.mp3`.

---

## 1. Identificação do Master e Verificação Técnica

| Campo | Registro verificado |
| --- | --- |
| **Arquivo Master MP4** | [Cena01-Quebrando-as-Correntes-Master-Integral-v01-1080p24.mp4](Cena01-Quebrando-as-Correntes-Master-Integral-v01-1080p24.mp4) |
| **Tamanho / SHA-256** | `117.722.585 bytes` (`112,27 MB`) · `ccc540440dc311489531a21e411987e3b15a2dbf65f9859134ff74fbbf14bc54` |
| **Vídeo (`ffprobe`)** | `H.264` (`Constrained Baseline`, Level `4.0`), `1920 × 1080` progressivo, `yuv420p`, `BT.709` (space/transfer/primaries), `24/1 fps` exatos, `time_base = 1/12288`, **`5.376` quadros exatos**, **`224,000000 s` (`03:44.000`)**, `~3.941 kbps`, `-movflags +faststart` |
| **Áudio (`ffprobe` + `ebur128`)** | `AAC LC` `48.000 Hz`, `2` canais (estéreo), `~259 kbps`, **`224,000000 s`** contínuos (sem emendas) · **Integrated loudness `-14,0 LUFS`**, **LRA `5,5 LU`**, **True peak `-3,7 dBFS`** (zero clipping) · `mean_volume -16,2 dB`, `max_volume -3,8 dB` |
| **Fonte de áudio master** | `Quebrando-as-Correntes.mp3` (Wagner Oliveira, `223,967 s`, preenchido com `0,033 s` de silêncio final para fechar exatos `224,000 s`) · SHA-256 `36e8ab2dafd0a47086e8794125c52deb6305b31b16465416e4ca86004906205c` |
| **Decodificação integral** | `ffmpeg -v error -i ... -f null -` → **exit `0`**, `0` erros |
| **Conferência visual das 5 emendas** | [Cena01-Quebrando-as-Correntes-Master-Integral-v01-qa-emendas.jpg](Cena01-Quebrando-as-Correntes-Master-Integral-v01-qa-emendas.jpg) — abertura, antes/depois das 5 emendas (`00:47`, `01:09`, `01:42`, `02:25.5`, `02:47`) e quadro final `q5375` (`03:43.958`) em preto absoluto (`YMIN=16`, `YAVG=16`, `YMAX=16`) |
| **Status de aprovação e pendências** | Todos os 6 takes individuais foram **aprovados artisticamente por Victor**; Master Integral v01 compilado e validado tecnicamente. **Pendentes:** conferência final do arquivo integral no telão/LED e validação das deixas ao vivo em ensaio de palco (nunca declaradas como executadas sem ensaio real). |

---

## 2. Composição dos 6 Takes Aprovados (Intactos no Acervo)

| Take | Seção musical | Intervalo no Master | Duração | Quadros (`24 fps`) | Arquivo de origem aprovado | SHA-256 |
| --- | --- | --- | --- | --- | --- | --- |
| **Take 01 v01** | Intro + 1º Verso | `00:00.000`–`00:47.000` | `47,000 s` | `0`–`1127` (`1.128`) | [Take01-v01](../quebrando-as-correntes-take01-v01/Cena01-Quebrando-as-Correntes-Take01-v01-1080p24.mp4) | `bdf3ea95d62d772680d3525fafd1ca7e9d8303ee9f388ccc727bf1c003b4b068` |
| **Take 02 v03** | 1º Refrão Void 2.5D + Tipografia | `00:47.000`–`01:09.000` | `22,000 s` | `1128`–`1655` (`528`) | [Take02-v03](../quebrando-as-correntes-take02-v03/Cena01-Quebrando-as-Correntes-Take02-v03-1080p24.mp4) | `7389f9004cffd4f69349dbf6484308753c44ec63e11b35e94b374046625ea23b` |
| **Take 03 v03** | 2º Verso (Arco + Portas + Esteira + Clímax) | `01:09.000`–`01:42.000` | `33,000 s` | `1656`–`2447` (`792`) | [Take03-v03](../quebrando-as-correntes-take03-v03/Cena01-Quebrando-as-Correntes-Take03-v03-1080p24.mp4) | `b2def26eedb0cc81a7bec1f3af3d257158f1c043a5ce44b730bab9acb6c4ef43` |
| **Take 04 v03** | 2º Refrão + Ponte (Pulsos + Coturnos + X + Jesus) | `01:42.000`–`02:25.500` | `43,500 s` | `2448`–`3491` (`1.044`) | [Take04-v03](../quebrando-as-correntes-take04-v03/Cena01-Quebrando-as-Correntes-Take04-v03-1080p24.mp4) | `163275dd6e21f3f985d2fd85e5b6442298913f788939f1ae387ca5cdfe6ea385` |
| **Take 05 v01** | 3º Verso (Filipenses 2:7 + Romanos 6:6) | `02:25.500`–`02:47.000` | `21,500 s` | `3492`–`4007` (`516`) | [Take05-v01](../quebrando-as-correntes-take05-v01/Cena01-Quebrando-as-Correntes-Take05-v01-1080p24.mp4) | `4619d72fdc8b7141234c4d1eba8df8033f60bd1ff48353af701d9e2c29fc55f0` |
| **Take 06 v01** | Refrão Final + Encerramento + Preto | `02:47.000`–`03:44.000` | `57,000 s` | `4008`–`5375` (`1.368`) | [Take06-v01](../quebrando-as-correntes-take06-v01/Cena01-Quebrando-as-Correntes-Take06-v01-1080p24.mp4) | `4e6c94193d37cae4af2625509d9fb21c7664cb1c973b9eb5a990d145f2fd6e7d` |
| **TOTAL** | **Faixa integral sem cortes** | **`00:00.000`–`03:44.000`** | **`224,000 s`** | **`0`–`5375` (`5.376`)** | **Master Integral v01** | **`ccc540440dc311489531a21e411987e3b15a2dbf65f9859134ff74fbbf14bc54`** |

---

## 3. Operação de Palco (Ficha da Cena 1)

- **Imagem de espera (antes do GO):** exterior da cadeia V06 (`MM01-Q01-ATMOSFERA-MESTRE.png`), que retorna logo após a retrospectiva MM-02.
- **Deixa de palco para o GO (`00:00:00.000`):** fala da **Ladra**: *“Rapaziada, seguinte, lili cantou e nós tá aqui até agora porque? Bora trocar ideia em outro lugar, eu que não vou ficar pagando de doida na porta da cadeia dando bobeira.”* As atrizes se levantam e saem ao vivo durante o número.
- **Saída do MP4 (`03:41.400`–`03:43.750`):** fade limpo para preto absoluto (`#000000`) sustentado até `03:44.000` (`q5375`).
- **DEIXA MANUAL SEPARADA (NÃO embutida no MP4):** após o encerramento em preto (`03:44.000`) e a saída das atrizes ao vivo, com a **cortina fechada**, o operador de som aciona o **cue separado de som de elevador / telemarketing** durante a troca de cenário para a **Cena 2** (casa da Mari à noite).

---

## 4. Tabela Unificada de Marcadores (`D-60` · Conferidos no MP4 Master Integral · `24 fps`)

| # | Tempo no MP4 | Quadro (0-index) | Take | Evento / Ação no Telão / Tipografia Cinética | Situação |
| --- | --- | --- | --- | --- | --- |
| 1 | `00:00:00.000` | `0` | T01 | **INÍCIO / GO:** exterior V06 (`Q01`) idêntico ao retorno pós-MM-02; neblina e câmera iniciam movimento suave. | Medido no MP4 · deixa a ensaiar |
| 2 | `00:00:13.000` | `312` | T01 | **1º Verso:** avanço contínuo sobre `Q01` com peso azul-noturno (*“Diziam que eu era livre...”*). | Medido no MP4 |
| 3 | `00:00:17.850` | `428` | T01 | **Texto 1:** `A CORRENTE / ERA INVISÍVEL` (terço superior, sai até `00:21.450`). | Medido no MP4 |
| 4 | `00:00:22.350` | `536` | T01 | **Texto 2:** `EU ERA / ESCRAVO` (sai no beat drop `00:25.000`). | Medido no MP4 |
| 5 | `00:00:25.000` | `600` | T01 | **BEAT DROP → Pátio (`Q03`):** transição contínua para pátio/cancela com pulso âmbar na batida. | Medido no MP4 |
| 6 | `00:00:30.450` | `731` | T01 | **Texto 3:** `O QUE CHAMEI DE LIBERDADE / ERA PRISÃO` (sai até `00:35.750`). | Medido no MP4 |
| 7 | `00:00:36.000` | `864` | T01 | **Aproximação `Q02` + Texto 4:** guarita/cancela fechada + `PENSEI QUE MANDAVA / MAS EU OBEDECIA` (sai até `00:41.250`); tensão cresce limpa até `00:46.958`. | Medido no MP4 |
| 8 | `00:00:47.000` | `1128` | T01→T02 | **EMENDA 1 → 1º REFRÃO (Void 2.5D):** corte invisível da cancela para o Void com diagonais; **B1 (Esq., `00:47.320`):** `SE O FILHO ME LIBERTAR`. | Emenda verificada no QA |
| 9 | `00:00:49.800` | `1195` | T02 | **Ruptura 3D das diagonais + B2 (Dir.):** estilhaços 3D à lente (sem fogo/faíscas) + `VERDADEIRAMENTE EU SOU LIVRE`. | Medido no MP4 |
| 10 | `00:00:52.600` | `1262` | T02 | **Avanço 2.5D + B3 (Esq.):** câmera atravessa correntes até a Ladra acorrentada + `SE O FILHO ME LIBERTAR`. | Medido no MP4 |
| 11 | `00:00:55.400` | `1330` | T02 | **Libertação 3D + B4 (Dir.):** estilhaços 3D, algema cai no piso, troca para Ladra livre + `A CORRENTE CAI AOS MEUS PÉS, EU VIVO!`. | Medido no MP4 |
| 12 | `00:00:58.200` | `1397` | T02 | **Recuo livre + B5 (Esq.):** `EU ERA ESCRAVO, MAS CRISTO ME COMPROU`. | Medido no MP4 |
| 13 | `00:01:00.950` | `1463` | T02 | **B6 (Dir.):** `ME CHAMOU PELO NOME, ME CARREGOU`. | Medido no MP4 |
| 14 | `00:01:03.750` | `1530` | T02 | **B7 (Esq.):** `SE O FILHO ME LIBERTAR`. | Medido no MP4 |
| 15 | `00:01:06.020` | `1584` | T02 | **B8 (Dir.):** `VERDADEIRAMENTE, VERDADEIRAMENTE SOU!` (sai limpo em `01:08.850`). | Medido no MP4 |
| 16 | `00:01:09.000` | `1656` | T02→T03 | **EMENDA 2 → 2º VERSO (Arco limpo):** Ladra livre contínua; **Bloco A (Esq., `01:09.350`):** `JOÃO 8:34 / QUEM COMETE O PECADO / É ESCRAVO, É FATO`; arco entra de fora da lente. | Emenda verificada no QA |
| 17 | `00:01:13.780` | `1771` | T03 | **Bloco A (Dir.):** `1ª VEZ É ESCOLHA / 10ª É HÁBITO`. | Medido no MP4 |
| 18 | `00:01:16.800` | `1843` | T03 | **Abertura do arco para a Porta #1:** arco sai pelas bordas revelando a porta fechada; **Esq. (`01:16.980`):** `A MILÉSIMA É / IDENTIDADE / É DOENTE, É MALDITO`. | Medido no MP4 |
| 19 | `00:01:20.120` | `1923` | T03 | **Bloco B (Dir.):** Porta #1 solitária + `EU QUERIA PARAR / MAS NÃO CONSEGUIA`. | Medido no MP4 |
| 20 | `00:01:22.800` | `1987` | T03 | **Abertura e travessia da Porta #1 (`01:23.450`–`01:25.250`):** folha gira e câmera atravessa a porta revelando **Porta #2 idêntica fechada**; **Esq.:** `A PORTA ERA A / MESMA / TODO DIA`. | Medido no MP4 |
| 21 | `00:01:25.600` | `2054` | T03 | **Agostinho (Dir.):** `AGOSTINHO / “MEU PESO É O MEU AMOR”`. | Medido no MP4 |
| 22 | `00:01:28.420` | `2122` | T03 | **Bloco B (Esq.):** `EU AMAVA / O QUE MATAVA`. | Medido no MP4 |
| 23 | `00:01:30.800` | `2179` | T03 | **Esteira lateral B → C + Lutero (Dir., `01:31.250`):** caminho em perspectiva + rédeas + `LUTERO / “A VONTADE É UM CAVALO”`. | Medido no MP4 |
| 24 | `00:01:34.000` | `2256` | T03 | **Bloco C (Sup. Esq.):** `OU DEUS TÁ NA SELA / OU O DIABO NO SALTO`. | Medido no MP4 |
| 25 | `00:01:36.520` | `2316` | T03 | **Bloco C (Dir.):** `NÃO EXISTE HOMEM LIVRE / ANDANDO SOLTO / NA RUA`. | Medido no MP4 |
| 26 | `00:01:38.850` | `2372` | T03 | **Clímax do 2º Verso (`01:39.100`):** rédeas saem à esquerda, Ladra dissolve, texto monumental centralizado `A PERGUNTA É SÓ UMA: / DE QUEM É A ALMA SUA?` (limpa em `01:41.820`). | Medido no MP4 |
| 27 | `00:01:42.000` | `2448` | T03→T04 | **EMENDA 3 → 2º REFRÃO (Pulsos macro):** caminho vazio dissolve nos pulsos presos; **Sup. central (`01:42.200`):** `SE O FILHO / ME LIBERTAR`. | Emenda verificada no QA |
| 28 | `00:01:43.900` | `2494` | T04 | **Ruptura macro dos pulsos:** elo rompe em `[960, 621]`, pulsos se separam + estilhaços 3D; **`01:44.700`:** `VERDADEIRAMENTE / EU SOU LIVRE!`. | Medido no MP4 |
| 29 | `00:01:47.300` | `2575` | T04 | **Corte plano baixo coturnos:** **Esq. (`01:47.480`):** `SE O FILHO / ME LIBERTAR`. | Medido no MP4 |
| 30 | `00:01:50.100` | `2642` | T04 | **Queda das 4 correntes + 12 elos:** 2 atrás/laterais + 2 pela frente das pernas/coturnos; **Dir.:** `A CORRENTE CAI / AOS MEUS PÉS / EU VIVO!`. | Medido no MP4 |
| 31 | `00:01:53.000` | `2712` | T04 | **X de 4 correntes cruzadas:** **Esq. (`01:53.100`):** `EU ERA ESCRAVO / MAS CRISTO / ME COMPROU`; **Dir. (`01:55.800`):** `ME CHAMOU / PELO NOME / ME CARREGOU`. | Medido no MP4 |
| 32 | `00:01:58.400` | `2842` | T04 | **Ruptura simultânea das 4 correntes em X:** chuva dupla de estilhaços 3D; **Esq.:** `SE O FILHO / ME LIBERTAR`; **Dir. (`02:00.900`):** `VERDADEIRAMENTE / VERDADEIRAMENTE / SOU!`. | Medido no MP4 |
| 33 | `00:02:03.800` | `2971` | T04 | **PONTE · X íntegro travando a fenda:** 2 correntes íntegras em X travam os véus em vai-e-vem tenso; **`02:04.000`:** `NÃO FOI FORÇA DE VONTADE / QUE QUEBROU MINHA CORRENTE`. | Medido no MP4 |
| 34 | `00:02:07.100` | `3050` | T04 | **Explosão do X na Ponte + abertura pelo Amor Maior (`02:07.700`):** estilhaços 3D à lente, fenda abre suave em `FOI UM AMOR MAIOR QUE ENTROU / E MUDOU O QUE EU SENTIA`. | Medido no MP4 |
| 35 | `00:02:14.000` | `3216` | T04 | **Abertura total dos véus → Jesus de costas (MM-16):** revela horizonte luminoso com Jesus apoiado no piso; **`02:14.100`:** `QUANDO CRISTO VIROU / O MEU MAIOR TESOURO`; **`02:19.550`:** `O PRAZER BARATO / PERDEU O SEU VALOR AGORA!` (limpa em `02:25.300`). | Medido no MP4 |
| 36 | `00:02:25.500` | `3492` | T04→T05 | **EMENDA 4 → 3º VERSO (Filipenses 2:7):** Jesus de costas contínuo; **Esq. (`02:25.620`):** `FILIPENSES 2:7 / ESCUTA O QUE / ELE FEZ`; **Dir. (`02:28.250`):** `CRISTO SE FEZ / SERVO / PRA EU SER LIVRE`. | Emenda verificada no QA |
| 37 | `00:02:30.700` | `3617` | T05 | **Cruz em papel rasgado + corrente íntegra:** silhueta rasgada da cruz atrás de Jesus; **Esq. (`02:30.820`):** `TOMOU MINHA / CORRENTE / LEVOU PRA CRUZ / COM ELE`; **Dir. (`02:33.480`):** `MORREU COMO ESCRAVO / PRA ME CHAMAR DE / IRMÃO FIEL!`. | Medido no MP4 |
| 38 | `00:02:35.350` | `3728` | T05 | **Ruptura em “IRMÃO FIEL!” + Wipe de véus (`02:35.850`–`02:36.650`):** corrente explode e véus rasgados viram para Romanos 6:6. | Medido no MP4 |
| 39 | `00:02:36.280` | `3751` | T05 | **Romanos 6:6 · O velho enterrado:** Void com cruz na névoa + algemas; **Esq.:** `ROMANOS 6:6 / O VELHO FOI / CRUCIFICADO`; **`02:38.700`:** papel escuro sobe enterrando algemas + **Dir. (`02:38.820`):** `O HOMEM QUE EU ERA / HOJE TÁ / ENTERRADO`. | Medido no MP4 |
| 40 | `00:02:41.350` | `3872` | T05 | **Criatura Nova:** horizonte reabre pleno com a Ladra livre em `y=842`; **Esq. (`02:41.500`):** `NÃO SOU MAIS O MESMO / SOU CRIATURA / NOVA!`; **Sup. central (`02:44.080`):** `A LIBERDADE QUE EU TENHO / É A ÚNICA QUE PROVA!` (limpa em `02:46.820`). | Medido no MP4 |
| 41 | `00:02:47.000` | `4008` | T05→T06 | **EMENDA 5 → REFRÃO FINAL:** Ladra livre contínua no horizonte + X íntegro sob tensão; **Esq. (`02:47.150`):** `SE O FILHO / ME LIBERTAR`; **ruptura em `02:49.650`** + **Dir.:** `VERDADEIRAMENTE / EU SOU LIVRE!`. | Emenda verificada no QA |
| 42 | `00:02:52.300` | `4135` | T06 | **Refrão Final · Corte coturnos + queda das 4 correntes (`02:55.050`):** **Esq.:** `SE O FILHO / ME LIBERTAR` → **Dir.:** `A CORRENTE CAI / AOS MEUS PÉS / EU VIVO!`. | Medido no MP4 |
| 43 | `00:02:57.800` | `4267` | T06 | **X de 4 correntes no horizonte:** **Esq. (`02:57.900`):** `EU ERA ESCRAVO / MAS CRISTO / ME COMPROU`; **Dir. (`03:00.600`):** `ME CHAMOU / PELO NOME / ME CARREGOU`. | Medido no MP4 |
| 44 | `00:03:03.200` | `4397` | T06 | **Ruptura final das 4 correntes:** maior chuva de estilhaços 3D; **Esq.:** `SE O FILHO / ME LIBERTAR`; **Dir. (`03:05.700`):** `VERDADEIRAMENTE / VERDADEIRAMENTE / SOU!`. | Medido no MP4 |
| 45 | `00:03:08.500` | `4524` | T06 | **Encerramento épico:** recuo no horizonte luminoso com elos caindo em câmera lenta; **`03:09.800`:** `A CORRENTE / CAIU`; **`03:14.800`:** `A CORRENTE / CAIU!`. | Medido no MP4 |
| 46 | `00:03:19.000` | `4776` | T06 | **Ladra + Jesus lado a lado no horizonte:** Ladra desliza suave à esquerda e Jesus entra ao lado diante da luz plena; **`03:20.400`:** `EU SOU LIVRE / EM CRISTO`; **`03:25.300`:** `EU SOU LIVRE / EM CRISTO!`. | Medido no MP4 |
| 47 | `00:03:30.200` | `5045` | T06 | **Silêncio íntimo:** queda da bateria; Ladra e Jesus dissolvem em fade; **`03:30.800`–`03:35.450`:** `VERDADEIRAMENTE / LIVRE.` monumental centralizado. | Medido no MP4 |
| 48 | `00:03:35.500` | `5172` | T06 | **Batida final (“Hey!”):** 5 pulsos secos sincronizados (`03:35.5`, `03:37.0`, `03:38.5`, `03:39.8`, `03:40.95`) no horizonte limpo. | Medido no MP4 |
| 49 | `00:03:41.400` | `5314` | T06 | **Fade final para preto absoluto (`#000000`):** conclui em `03:43.750` (`q5370`); preto absoluto sustentado até `03:43.958` (`q5375`). | Medido no MP4 |
| 50 | `00:03:44.000` | `5376` *(fim)* | — | **SAÍDA DO MP4.** | Medido no MP4 |
| 51 | **Deixa manual** | — | Palco | **DEIXA SEPARADA · Cortina fechada:** após saída das atrizes ao vivo, acionar em **cue separado** o **som de elevador / telemarketing** na troca para a Cena 2 (casa da Mari). | Deixa separada · a ensaiar |
