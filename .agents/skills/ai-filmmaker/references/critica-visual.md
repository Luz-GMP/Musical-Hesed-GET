# Direção de arte e crítica de quadros

Adaptação para vídeo das práticas de planejamento, crítica, auditoria e acabamento do
[Impeccable, de Paul Bakaus](https://github.com/pbakaus/impeccable). A revisão usa o storyboard e
as prévias da AI Filmmaker. Funciona com qualquer motor capaz de gerar quadros e prévias.

## Antes de compor

No storyboard, registre público e formato de exibição, mensagem central, elemento que deve
receber atenção primeiro e como a atenção passa ao próximo. Reaproveite as decisões de marca e
briefing. Defina tipografia, cor, contraste, profundidade e ritmo pelas funções das camadas.

## Exploração da direção de arte

Adaptação do método de [direções visuais do Huashu Design](https://github.com/alchaincyf/huashu-design/blob/master/references/directions.md).
Quando houver uma decisão de arte em aberto que mude o resultado, compare duas ou três miniaturas
do mesmo momento no formato final. Mantenha mensagem, ativos de marca e demais restrições iguais.
Varie a estrutura do quadro, como o peso da imagem em relação ao texto, a posição do foco ou a
profundidade das camadas. Se a decisão depender de movimento, anote o gesto e seu gatilho na
miniatura. Se a direção já estiver definida, faça um quadro de estilo diretamente.

Quando usar referências, monte uma prancha curta com quadros que realmente inspecionou. Ao lado
de cada quadro, registre a fonte, o instante quando conhecido e a regra que pretende adaptar.
Exemplo: «o título ocupa a faixa de menor movimento e a imagem revela o assunto em profundidade».
Apresente cada proposta com seu efeito esperado e seu principal trade-off. Registre a escolhida no
storyboard e use a aprovação já prevista. As miniaturas são estudos visuais para essa decisão.

## Crítica visual e auditoria técnica

Examine a prévia em movimento e selecione quadros de entrada, leitura, saída e sobreposição
relevantes. Compare o resultado no formato de entrega e em tamanho representativo da exibição.

- **Crítica (`critique`).** Verifique o que o olhar encontra primeiro, se a mensagem é
  compreensível durante a exposição e se a cena tem identidade. Se vários elementos competem em
  peso, cor ou movimento, encontre o foco e reduza a concorrência. Questione cartões, gradientes,
  brilhos ou ícones repetidos quando não servirem à narrativa ou à marca.
- **Auditoria (`audit` e `harden`).** Confira contraste sobre os momentos claros e escuros do
  fundo, quebras e recortes nas legendas mais longas, margens seguras para o formato, colisões
  durante transições, frames faltantes e artefatos de composição. Se houver mais de um formato
  solicitado, revise cada enquadramento. Use as verificações do motor para fatos mensuráveis e
  registre os pontos que dependem de inspeção visual.
- **Refinamento (`distill`, `typeset`, `bolder`/`quieter`, `polish`).** Remova redundâncias,
  ajuste peso, tamanho e exposição da tipografia, concentre a ênfase no momento principal e
  alinhe espaçamentos, movimentos e pontos de corte. Ajuste o elemento e o intervalo apontados
  na crítica. Confira novamente aqueles quadros e a transição ao redor.

Registre, quando houver achado, **cena e versão · tempo ou quadro · observação · efeito para quem
assiste · ajuste proposto**. Priorize primeiro o que impede leitura, corta informação ou quebra
a continuidade. Depois trate problemas de hierarquia e acabamento. Exemplo: `Cena 02 v1 ·
00:04.2–00:05.0 · legenda perde contraste sobre a janela durante o pan · leitura interrompida ·
aplicar gradação localizada no fundo e conferir a passagem na prévia`.

No [ciclo de acabamento inspirado no Huashu Design](https://github.com/alchaincyf/huashu-design/blob/master/references/polish-loop.md),
use a miniatura para comparar hierarquia e abra o quadro original para avaliar detalhes. Compare
com o quadro de estilo escolhido, corrija os achados de maior impacto e gere novamente os mesmos
quadros. Revise em movimento quando o ajuste afetar ritmo ou transição. Registre separadamente o
que foi observado (por exemplo, texto recortado) e a interpretação de arte (por exemplo, título
dominante demais). Se não conseguir inspecionar os quadros, informe isso junto das checagens feitas.

Em revisões de motion, adapte o ciclo de verificação do
[Design Engineering](https://github.com/agentsorg/design-engineering) a uma comparação controlada.
Declare a intenção aprovada, compare o mesmo quadro ou intervalo antes e depois e registre o que
melhorou e qual critério continua pendente. Dê preferência a mudanças que possam ser verificadas
isoladamente, como reduzir a amplitude de uma transição sem alterar a tipografia. Quando duas
opções tecnicamente válidas entregarem efeitos diferentes, descreva o efeito em cada uma com base
nas prévias e na direção de arte. Use o fluxo já previsto para obter a decisão do usuário quando
ela afetar o que foi aprovado.

Na montagem, reveja também as emendas com contexto dos dois lados. Se o ajuste alterar de forma
perceptível uma cena aprovada, apresente uma nova versão pelo fluxo existente. O Harness continua
validando o contrato do projeto. A crítica registra evidência visual e o Self-QA reúne as checagens
técnicas e perceptivas. O detector web, o modo ao vivo e os hooks do Impeccable ficam fora deste
fluxo. Nenhuma instalação adicional é exigida.
