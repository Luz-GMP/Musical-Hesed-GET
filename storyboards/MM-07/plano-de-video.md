# Plano de produção por código · MM-07 · Nasceu em Belém

**Responsável/direção:** Isaac · **Versão/data:** v02 · 20/11/2026
**Situação:** em preparação; piloto Q03 aguardando conexão autorizada e revisão
**Procedimento:** [edição com agentes](../../guias/edicao-de-video-com-agentes.md), D-37.

## Contexto e fontes

- **Peça, cena, função, gatilho:** MM-07, Cena 3, playback visual de *Nasceu em Belém* (Marcus Salles). Entra depois da conversa sobre Belém da Judeia; a deixa exata deve ser ensaiada.
- **Recebe de / entrega para:** recebe a última imagem do bebê do MM-06 e compara com o primeiro céu; D-01 continua aberta. Entrega a passagem para a operação e depois retorna à casa conforme o guia da Cena 3.
- **Fontes consultadas:** [CLAUDE.md](../../CLAUDE.md), [CODEX.md](../../CODEX.md), [guia de construção](../guia-de-construcao.md), [caderno de quadros](../briefings-dos-quadros.md#mm-07--nasceu-em-belém), [Bíblia v0.1](../../docs/fontes/HESED_Biblia_de_Producao_v0_1.md), [alinhamento](../../docs/alinhamento-das-fontes.md), [briefing](../../docs/briefing.md), [roteiro](../../docs/roteiro.md), [guia vigente da Cena 3](../../guias/cena-a-cena/cena-03.md), [mapa](../../docs/mapa-de-cenas.md), [Isaac](../../equipe/isaac.md), [decisões](../../docs/decisoes.md), [pendências](../../docs/pendencias.md), [dependências](../../docs/dependencias.md), [MM-12](../MM-12/README.md), [instrução do piloto](instrucao-antigravity.md), [guia operacional](../../guias/edicao-de-video-com-agentes.md) e [revisão da skill](../../guias/revisao-ai-filmmaker-2026-10-20.md).
- **Escopo autorizado agora:** preparar um único take piloto da viagem MM07-Q03, revisar o movimento inteiro e aguardar aceite explícito antes de outros takes. Não declarar sincronização, aprovação ou render final sem motor autorizado, master/configuração e QA.
- **Unidade atual:** piloto MM07-Q03. O céu estrelado e os demais quadros ficam como seleção posterior; não antecipar montagem integral.
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
| A07 | [preview-mm07-q01-parallax-v02.html](preview-mm07-q01-parallax-v02.html) | Estudo interativo, 15 s, sem áudio; JS determinístico com `renderAtTime(t)` | Histórico Q01: base preservada com três máscaras de profundidade | V01/V02 rejeitadas; não usar como take atual |
| A08 | [instrucao-antigravity.md](instrucao-antigravity.md) | Instrução vigente do piloto Q03 | Q03 como primeiro quadro; avanço da comitiva, câmera quase fixa, take curto 16:9 | Plano/prompt preparados; gerador autorizado ausente |

O repositório não contém áudio, vídeo, projeto de edição, FFmpeg, Playwright ou plugin de composição instalado nesta sessão. As referências `PhotoCraft`, `VectorCraft`, `FilmCraft` e `EffectCraft` foram verificadas como não instaladas; não foram chamadas nem substituídas silenciosamente. A prévia HTML usa apenas a base local e não constitui render final.

## Plano de cenas

| Bloco / quadro | Tempo e fonte | Visual / movimento | Transição | Situação |
| --- | --- | --- | --- | --- |
| **Piloto · MM07-Q03** | Take curto; duração, resolução e cadência a registrar no arquivo real | Maria sobre o jumento e José avançam alguns passos rumo a Belém, mantendo identidade, proporções, figurino, montaria, horizonte, arquitetura, luz e paleta | Câmera quase fixa; sem zoom, ondulação, esticamento, cintilação ou transformação entre artes | Plano pronto; gerador autorizado ausente |
| **Seleção posterior · céu estrelado** (Q01–Q02) | A definir após comparação com o último frame do MM-06 e escolha da produção | Céu com duas intensidades de estrela; pode sustentar o recorte de 30–45 s conforme o guia da Cena 3 | Dissolução/variação de brilho somente após teste e aprovação | Acervo para revisão; não produzir agora |
| **Acervo posterior · Q04–Q10** | A definir com direção e faixa | Cidade, abrigo, nascimento, pastores e encerramento permanecem estudos do storyboard | Não antecipar nem duplicar MM-12/MM-13 | Não iniciar antes do aceite do piloto |

## Direção e implementação

- **Paleta/luz:** azul-noturno, azul profundo, sombra azul e terra/pedra nos exteriores; âmbar de lamparina nos pontos quentes; dourado e branco suave no nascimento. Início frio/quieto, calor humano gradual, clímax íntimo e recuperação esperançosa.
- **Elementos e continuidade:** para o piloto, preservar Q03 integralmente e comparar início/centro/fim com a arte-fonte. O céu do MM-07 deve ser comparado com o último bebê do MM-06; Q04–Q10 também mostram variações de geografia e não estão aprovados para montagem.
- **Motor candidato:** gerador de vídeo autorizado (Veo ou outro indicado por Victor), usando Q03 como primeiro quadro; se a conexão/autorização não existir, manter apenas plano e prompt. A faixa musical fica na montagem local.
- **FPS e relógio:** fonte e saída a definir com P-01; usar `t = frame / fps`, preservar taxa racional e registrar arredondamento. Não usar os rótulos de tempo da prancha como FPS/medição.
- **Música:** nenhum MP3/master está no repo. Após o aceite do piloto, receber a faixa de Victor e planejar os takes do ponto 00:36 até o fim; manter relógio da música separado do relógio da edição e não inventar onsets.
- **Áudio/SFX:** nenhum previsto até a direção ouvir o master. Qualquer efeito procedural será camada separada, versionada e revisada com a prévia.
- **Texto:** não previsto como lyric video; eventuais frases serão pontos específicos autorizados pela direção.
- **Prévia isolada:** não há prévia atual do piloto Q03. [preview-mm07-q01-parallax-v02.html](preview-mm07-q01-parallax-v02.html) é apenas histórico rejeitado, silencioso e sem sincronização.

## Inspeção visual antes do render completo

| Unidade | Entrada/repouso | QA DOM + visual | Correção | Resultado |
| --- | --- | --- | --- | --- |
| MM07-Q03 | Imagem-fonte 1376×768 disponível; take ainda não produzido | Inspeção de movimento, deformações, identidade, mãos, anatomia, roupa, montaria, cenário e comparação início/centro/fim ainda pendentes | Produzir somente após conexão/autorização do gerador; corrigir uma variável por tentativa | Não produzido |
| C02–C05 | A definir com master | Não executado | A definir | Não iniciar antes da aprovação progressiva |

O QA deverá cobrir pelo menos entrada e repouso de cada unidade, continuidade de cidade/estrela/bebê/manjedoura, contraste, clipping, legibilidade a distância, movimento real e reprodução com áudio. Dois frames não substituem assistir à prévia em movimento.

## Aprovação progressiva

| Unidade | Versão apresentada | Estado | Pendências | Aprovação de Victor |
| --- | --- | --- | --- | --- |
| MM07-Q03 | Take piloto ainda não produzido | Em preparação | Gerador autorizado, revisão de movimento e aceite explícito; depois faixa de Victor a partir de 00:36 | Não recebida |

A aprovação do storyboard e desta ficha não equivale à aprovação do vídeo. Render integral somente após todas as unidades aprovadas, QA concluído e especificação do telão fechada.

## Verificação e entrega

- **Preview revisado:** não há take atual. O HTML Q01 V02 foi preservado como histórico rejeitado; sua auditoria estrutural não substitui revisão em movimento.
- **Render final/metadados:** não executado; falta motor, master e especificação.
- **Costuras:** roteiro e documentos consultados; continuidade visual com MM-06/MM-12 ainda precisa de material e decisão.
- **Projeto/assets/backups:** manter vídeo, áudio, projeto e renders fora do Git, na pasta de mídia definida (P-13); cópias leves atuais ficam no repositório.
- **Próximos passos:** conectar/confirmação de uso do Veo ou gerador indicado por Victor; produzir somente o take Q03 com a imagem-fonte; revisar o take inteiro em movimento; apresentar o piloto identificado para aceite explícito; só então planejar os demais takes com a faixa de 00:36 ao fim. Não renderizar a montagem integral antes das aprovações.
