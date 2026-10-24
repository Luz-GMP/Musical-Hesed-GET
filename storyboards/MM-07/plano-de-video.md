# Plano de produção por código · MM-07 · Nasceu em Belém

**Responsável/direção:** Eduardo · **Versão/data:** v01 · 24/10/2026
**Situação:** em preparação; revisão de plano e configuração pendentes
**Procedimento:** [edição com agentes](../../guias/edicao-de-video-com-agentes.md), D-37.

## Contexto e fontes

- **Peça, cena, função, gatilho:** MM-07, Cena 3/Bloco II, playback visual de *Nasceu em Belém* (Marcus Salles). Entra após a fala da Ladra: “...desse jeito aí faz bem mais sentido mesmo”.
- **Recebe de / entrega para:** recebe o frame/loop final do bebê do MM-06; D-01 é proposta ainda aberta. A saída retorna à sala MM-03 na Cena 4, com cue de operação ainda não fechado.
- **Fontes consultadas:** [CLAUDE.md](../../CLAUDE.md), [CODEX.md](../../CODEX.md), [guia de construção](../guia-de-construcao.md), [caderno de quadros](../briefings-dos-quadros.md#mm-07--nasceu-em-belém), [Bíblia v0.1](../../docs/fontes/HESED_Biblia_de_Producao_v0_1.md), [alinhamento](../../docs/alinhamento-das-fontes.md), [briefing](../../docs/briefing.md), [roteiro](../../docs/roteiro.md), [mapa](../../docs/mapa-de-cenas.md), [Eduardo](../../equipe/eduardo.md), [decisões](../../docs/decisoes.md), [pendências](../../docs/pendencias.md), [dependências](../../docs/dependencias.md), [MM-12](../MM-12/README.md), [guia operacional](../../guias/edicao-de-video-com-agentes.md) e [revisão da skill](../../guias/revisao-ai-filmmaker-2026-10-20.md).
- **Escopo autorizado agora:** consolidar o plano, auditar os assets existentes e preparar a primeira unidade de prévia. Não declarar sincronização, aprovação ou render final sem master, configuração e QA.
- **Unidade atual:** C01 — abertura/costura MM-06 → MM-07. Produzir uma unidade por vez; os demais quadros ficam como estrutura de montagem, sem antecipar aprovação.
- **Destino/especificação:** telão do HESED; resolução, proporção operacional, FPS, codec, áudio embutido e tratamento de loops pendentes em P-01/P-12. A referência 3840×2160 é das imagens-base, não do vídeo final.

## Materiais e referências

| ID | Arquivo real | Metadados medidos | Conteúdo/uso | Estado |
| --- | --- | --- | --- | --- |
| A01 | [STB MM07.png](STB%20MM07.png) | 1672×941 px · 3.077.855 bytes | Prancha de estudo com 10 estados, ordem proposta e tempos impressos | Inspecionada; tempos não verificados |
| A02 | [MM07-Q01.JPG](MM07-Q01.JPG) a [MM07-Q10.JPG](MM07-Q10.JPG) | 1376×768 px cada | Bases individuais limpas para movimento/edição | Inspecionadas; não aprovadas; Q01–Q09 atualizadas em 24/10, Q10 de 16/10 |
| A03 | [MM-12/README.md](../MM-12/README.md) e seis JPGs | 1672×941 px cada | Referência de cidade, caminho, porta e abrigo; evitar duplicar a atuação física | Inspecionados; bases do MM-12 ainda em revisão |
| A04 | [MM-06/README.md](../MM-06/README.md) | Sem frame, loop ou vídeo anexado | Costura de entrada e identidade do bebê | Ausente; solicitar a Isaac |
| A05 | Arquivo master de *Nasceu em Belém* | Nenhum áudio encontrado no repo | Medir duração, forma, onsets e frases | Ausente · P-02 |
| A06 | Resolução/FPS/codec do telão | Nenhum parâmetro confirmado | Configuração de saída e QA | Ausente · P-01 |
| A07 | [preview-c01-q01-v01.html](preview-c01-q01-v01.html) | Estudo interativo, 15 s, sem áudio; JS determinístico com `renderAtTime(t)` | Piloto C01/Q01: base preservada com três máscaras de profundidade | Produzido para revisão; não aprovado |

O repositório não contém áudio, vídeo, projeto de edição, FFmpeg, Playwright ou plugin de composição instalado nesta sessão. As referências `PhotoCraft`, `VectorCraft`, `FilmCraft` e `EffectCraft` foram verificadas como não instaladas; não foram chamadas nem substituídas silenciosamente. A prévia HTML usa apenas a base local e não constitui render final.

## Plano de cenas

| Bloco / quadro | Tempo e fonte | Visual / movimento | Transição | Situação |
| --- | --- | --- | --- | --- |
| **C01 · costura de entrada** | Estudo visual de 15 s conforme rótulo da prancha; master e frame MM-06 pendentes | Piloto Q01: céu/fundo, montanhas intermediárias e terreno em parallax independente; câmera com push-in/deriva diagonal sutil. | Costura sem apagar o bebê de forma brusca; Q01 ou Q07/Q08 são alternativas de abertura, não decisão | Prévia v01 produzida; revisão pendente |
| **C02 · expectativa / estrela** (Q01–Q02) | A definir com master | Belém distante, céu e estrela; zoom/parallax/halo discretos | Dissolução e elevação de câmera | Estrutura de montagem |
| **C03 · aproximação humana** (Q03–Q05) | A definir com master; não usar os tempos impressos como medição | Viagem, rua e busca por acolhimento; pessoas projetadas apenas onde o quadro exigir e sem competir com o palco | Avanços lentos/dissoluções; sem animar marcha ou porta sem validação | Estrutura de montagem; conferir com MM-12 |
| **C04 · abrigo / nascimento** (Q06–Q08) | A definir com master | Espaço humilde → família/bebê → expansão de luz; reservar o maior brilho para Q08 sem estourar textura | Parallax curto, aproximação e partículas em camadas | Estrutura de montagem; conferir com MM-06/MM-12 |
| **C05 · impacto / saída** (Q09–Q10) | A definir com master | Pastores como breve retorno exterior; Belém/estrela sustentam esperança | Recuperação visual e saída para MM-03 a combinar | Estrutura de montagem; não confundir com MM-13 |

## Direção e implementação

- **Paleta/luz:** azul-noturno, azul profundo, sombra azul e terra/pedra nos exteriores; âmbar de lamparina nos pontos quentes; dourado e branco suave no nascimento. Início frio/quieto, calor humano gradual, clímax íntimo e recuperação esperançosa.
- **Elementos e continuidade:** cidade/horizonte/estrela coerentes entre Q01/Q02/Q09/Q10; Maria, José, jumento, bebê, manjedoura e figurinos coerentes entre as bases. Os arquivos atuais ainda mostram variações de geografia, escala e continuidade que precisam de decisão/ajuste antes do alpha.
- **Motor candidato:** HTML/JS com relógio determinístico, Playwright e FFmpeg, por permitir movimento sutil, cenas declarativas, captura por frame e QA; não executar até confirmar disponibilidade e configuração. Remotion é alternativa se a operação real exigir.
- **FPS e relógio:** fonte e saída a definir com P-01; usar `t = frame / fps`, preservar taxa racional e registrar arredondamento. Não usar os rótulos de tempo da prancha como FPS/medição.
- **Música:** master não recebido; não gerar `beats.json`, forma de onda ou sincronização inventada. Depois do recebimento: medir master, gerar candidatos, revisar por escuta e ligar apenas os eventos selecionados a Q01–Q10.
- **Áudio/SFX:** nenhum previsto até a direção ouvir o master. Qualquer efeito procedural será camada separada, versionada e revisada com a prévia.
- **Texto:** não previsto como lyric video; eventuais frases serão pontos específicos autorizados pela direção.
- **Prévia isolada:** C01/Q01 v01 está em [preview-c01-q01-v01.html](preview-c01-q01-v01.html), 15 s de estudo, silenciosa e sem sincronização. A duração final depende do master.

## Inspeção visual antes do render completo

| Unidade | Entrada/repouso | QA DOM + visual | Correção | Resultado |
| --- | --- | --- | --- | --- |
| C01 | v01 HTML, t=0 e t=15 s declarados; arquivo real disponível | Sintaxe JS verificada; inspeção visual/movimento no navegador e auditoria DOM ainda não executadas nesta sessão | A definir após revisão do usuário e disponibilidade do navegador/motor | Prévia para revisão |
| C02–C05 | A definir com master | Não executado | A definir | Não iniciar antes da aprovação progressiva |

O QA deverá cobrir pelo menos entrada e repouso de cada unidade, continuidade de cidade/estrela/bebê/manjedoura, contraste, clipping, legibilidade a distância, movimento real e reprodução com áudio. Dois frames não substituem assistir à prévia em movimento.

## Aprovação progressiva

| Unidade | Versão apresentada | Estado | Pendências | Aprovação de Victor |
| --- | --- | --- | --- | --- |
| C01 | `preview-c01-q01-v01.html` · 15 s · sem áudio | Em revisão | D-01, frame MM-06, master P-02, P-01/P-12; QA visual/movimento e aprovação pendentes | Não recebida |

A aprovação do storyboard e desta ficha não equivale à aprovação do vídeo. Render integral somente após todas as unidades aprovadas, QA concluído e especificação do telão fechada.

## Verificação e entrega

- **Preview revisado:** não há arquivo nesta etapa.
- **Render final/metadados:** não executado; falta motor, master e especificação.
- **Costuras:** roteiro e documentos consultados; continuidade visual com MM-06/MM-12 ainda precisa de material e decisão.
- **Projeto/assets/backups:** manter vídeo, áudio, projeto e renders fora do Git, na pasta de mídia definida (P-13); cópias leves atuais ficam no repositório.
- **Próximos passos:** receber master e loop do MM-06; confirmar a abertura e saída; confirmar P-01/P-12; conectar/instalar os plugins solicitados ou indicar o motor disponível; então produzir C01, fazer duplo QA e apresentar a prévia com áudio para aprovação.
