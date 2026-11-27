# Cena 6 · Viagem a Belém e chegada ao abrigo (MM-12) · Etapa 2

**27/11/2026 · Prévia 2.5D v05 em revisão de Victor.** A montagem original de 01:52 usa oito pilhas completas. Execute `./projetos/AI-Filmmaker/mm12-cena06-v05/preparar.ps1` e abra a [prévia interativa](../../../projetos/AI-Filmmaker/mm12-cena06-v05/cena/preview.html). A timeline permanece em 1920 × 1080, 30 fps e sem faixa de áudio. Os [marcadores editáveis](../../../projetos/AI-Filmmaker/mm12-cena06-v05/marcadores.md) identificam os offsets para revisão.

## Planos e inspeção

Os 23 planos foram reconstruídos em chamadas individuais do ImageGen, com as bases aprovadas como referências de câmera, luz e composição. O canvas das saídas é 1672 × 941, RGB nos fundos e RGBA com alpha real de 0 a 255 nos planos à frente. As oito bases, o piloto Q01/Q06 e L01 de Q02 foram conferidos com os hashes de origem. Consulte o [manifesto da etapa](manifesto-etapa-2.csv) para tamanhos, hashes, saídas da ferramenta e ajustes de registro, e os [prompts executados](prompts-executados-etapa-2.md).

| Quadro | Planos | Observações da inspeção |
| --- | ---: | --- |
| Q01 · O caminho | 4 | Piloto aprovado preservado. Q01 abre a viagem a partir da costura prevista com o céu de Isaac. |
| Q02 · Belém ao longe | 4 | L01 aprovado preservado. O povoado e a trilha central passam atrás das rochas da esquerda e das copas da direita. A borda das copas e o trecho mais próximo do caminho variam em relação à base. |
| Q07 · Entrada de Belém | 4 | Primeira fachada à esquerda, via curvando para dentro e oliveira à direita. Fachada e mureta tiveram o registro ajustado para recuperar a largura do caminho e a posição da porta. |
| Q03 · A chegada | 4 | O crepúsculo mantém a porta e a lamparina à esquerda e a rua entrando pela direita. A reconstrução muda detalhes de pedras, folhas e degraus. |
| Q04 · A noite | 4 | Cada plano teve tratamento noturno próprio a partir de referência gerada. O acabamento aplica a cor à geometria de Q03. As três camadas RGBA têm alpha idêntico às pares. O céu preserva a textura espacial de Q03. A dissolução atua sobre as pilhas compostas e mantém as oclusões. |
| Q05 · Sem acolhimento | 4 | O fundo recebeu o casario iluminado junto à curva. Banco e jarros foram registrados ao pé da parede sem ampliar seu peso sobre a porta. |
| Q08 · Saída para os arredores | 4 | A serra distante ficou no fundo, após revisar sua duplicação no plano dos ciprestes. A esquina à esquerda e o muro à direita conduzem ao terreno aberto. |
| Q06 · Um abrigo simples | 5 | Piloto aprovado, vazio. As cinco matrizes foram medidas no canvas em `01:44.000`: escala `1,00 × 1,00`, posição `0, 0`. |

Cada quadro tem uma prova neutra e outra deslocada no [pacote de camadas](../../../entregas/MM12/pacote-2p5d-v05/recriacao-por-camadas/layers-v05/). Para o par Q03/Q04 há provas por horário e uma prova deslocada no meio da dissolução. Foram inspecionados os planos isolados e as composições após os ajustes de registro e oclusão. As provas deslocadas têm fundo opaco em toda a extensão. As reconstruções conservam os principais pontos de composição, com variações de textura e detalhe em relação às bases. O Harness do AI Filmmaker conferiu 39 referências de mídia e a configuração da cena sem erros ou avisos. A aprovação artística cabe a Victor.

## Entrada, sustentação e saída

- **Cena 5 → Cena 6.** A entrada recebe o céu final de *Ó Noite Santa*, de Isaac. A versão final desse quadro não estava disponível para conferência e a prévia abre com o fade provisório do projeto. O GO na fala de Mari e a ligação com a saída de *Ó Noite Santa* precisam ser conferidos no ensaio.
- **Cena 6 → Cena 7.** Verificada no navegador a ordem Q01 → Q02 → Q07 → Q03 → Q04 → Q05 → Q08 → Q06. Ao fim, manter MM12-Q06 vazio na abertura da Cena 7 e durante a primeira menção a um anjo. O botão que dispara MM13-Q06 v09 foi testado separadamente e representa a fala “uma multidão de anjos apareceu” (D-61). Na imagem v09, telhado, porta, mureta e direção da luz permanecem próximos, com diferença de brilho e de perfil da serra. Conferir a leitura do corte no LED.
- **Ensaio e exportação.** Definir os tempos de sustentação e as deixas reais com elenco e operação. Na exportação, conferir os marcadores no MP4 da mesma versão e entregar a tabela junto dele (D-60). P-13 mantém ZIPs e exports no acervo local.

Fontes de trabalho: [guia de construção](../../guia-de-construcao.md), [briefings dos quadros](../../briefings-dos-quadros.md), [Q07 e Q08](prompts-quadros-v05.md), [mapa de camadas](prompts-camadas-2p5d.md), [Cena 6](../../../guias/cena-a-cena/cena-06.md), [Cena 7](../../../guias/cena-a-cena/cena-07.md), [roteiro de montagem](../../../guias/cena-a-cena/pdf/HESED-roteiro-de-montagem.pdf) e [decisões](../../../docs/decisoes.md).
