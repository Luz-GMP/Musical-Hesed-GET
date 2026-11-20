# Direção audiovisual: decisões reutilizáveis

Use no planejamento, na construção da cena e na revisão da montagem. Estas orientações descrevem
comportamentos e critérios de qualidade; não fornecem roteiro, marca, imagens ou estética de um
projeto anterior. Valores de um template são pontos de partida, subordinados ao briefing aprovado.

## 1. Duração, intenção e revisão

- Concilie fala, leitura e ação visual antes de fechar a duração. Se a fala integral não couber com
  naturalidade, proponha ampliar o tempo ou reduzir o texto; não acelere a voz silenciosamente.
- Uma cena precisa de tempo para entrada, compreensão e saída. Uma ação de fundo relevante também
  precisa permanecer perceptível; não determine sua duração apenas pelo fim da fala.
- Traduza comentários de sensação em variáveis observáveis: fluidez envolve sobreposição temporal,
  velocidade e desaceleração; impacto envolve escala, resposta da câmera, ataque e sustentação sonora;
  legibilidade envolve hierarquia, contraste, camada e tempo de exposição.
- Em revisão localizada, preserve o que foi aprovado. Mude o alvo e seus ajustes dependentes, não
  recomponha toda a cena. Reutilize voz e alinhamento quando a alteração for apenas visual.
- Distinga aprovação da redação, aprovação da cena e aprovação da montagem. Uma mudança de texto
  confirmada não aprova antecipadamente o audiovisual. Registre a versão e o alcance da aprovação.

## 2. Camadas, contraste e identidade

- **Pense sempre em camadas, desde o storyboard.** Organize fundo, planos intermediários, conteúdo
  e primeiro plano separadamente; defina o que ambienta, o que informa e o que deve receber atenção.
  Isso é um princípio de composição, inclusive em cenas estáticas, não apenas um efeito de acabamento.
- Para cada plano relevante, decida profundidade/oclusão, posição, movimento, entrada/saída, luz e
  contraste em relação aos demais. Camadas podem ficar paradas; separação não exige animar tudo.
  Preserve essa estrutura editável em vez de achatar cedo fundo, texto, logo e ícones num único ativo.
- Quando a composição
  pedir profundidade, aplique parallax com deslocamentos relativos suaves; mover o quadro inteiro
  da mesma maneira não cria separação entre os planos.
- Logo, títulos e ícones precisam manter leitura enquanto o fundo se move. Use contraste de paleta,
  gradação do fundo, sombra difusa ou apoio localizado conforme necessário, sem esconder a ação.
- Preserve a geometria de um SVG fornecido. Para uma versão monocromática, prefira preenchimento
  ou máscara; não redesenhe a marca. Defina origem, centro e escala final antes de animar.
- Ao deslocar uma marca de um ponto da tela para outro, interpole posição e tamanho na mesma
  progressão. Ícones que crescem no lugar devem usar o centro da posição final como origem.
- Dê tempo de repouso ao conteúdo. Movimento ambiente ou pulsação não devem disputar atenção com
  leitura; se usados para ênfase, sejam discretos, sem reflow e coerentes com o andamento.

## 3. Tipografia, cards e legendas

- Faça a hierarquia por função: título, destaque, subtítulo, complemento e referência. Combine
  tamanho, peso e itálico com intenção; não transforme todo texto em negrito ou maiúsculas.
- Meça com a fonte realmente carregada. Ajuste largura, corpo, peso e quebras em conjunto. Uma frase
  curta pode pedir linha única; uma explicação longa pode pedir linhas planejadas. Não encolha um
  título até perder legibilidade apenas para manter a largura inicial de um card.
- Se o suporte visual continua representando o mesmo assunto, mantenha o card e atualize seu
  conteúdo. Separe a animação do contêiner da animação do texto; dimensione para os estados previstos.
- Ao passar de uma síntese para uma leitura mais longa, o card pode expandir enquanto o texto
  anterior sai. Preserve a referência em posição estável quando isso ajudar a orientação.
- Use legendas para a fala complementar ao texto principal. Evite duplicação visual automática
  quando o destaque já comunica a mesma mensagem. Preserve legendas integrais se o usuário pedir
  esse recurso ou houver requisito de acessibilidade; registre a decisão no plano.
- Uma citação na tela mantém aspas e atribuição quando cabíveis, mesmo que a atribuição não seja
  narrada. Complementos explicativos apenas visuais não devem entrar na voz por acidente.
- Confira o maior estado do texto, a passagem entre blocos e a versão reduzida de prévia. Sombra
  ou fundo difuso ajudam no contraste, mas não corrigem fonte pequena nem exposição curta.

## 4. Sincronização e coreografia

- Use alinhamento real da voz quando disponível; aproveite os tempos retornados pelo provedor.
  Se faltar alinhamento adequado, transcreva ou marque o áudio existente antes de ressintetizar.
- Defina eventos pelo sentido da fala: introdução do assunto, menção da referência, início da
  leitura, palavra de ênfase. Um card deve entrar quando é apresentado, não depois de a fala acabar.
- Conteúdo pode entrar após o suporte assentar, mas ações consecutivas não precisam esperar toda
  a anterior terminar. Sobreponha saídas e entradas com clareza para evitar pausas artificiais.
- Equilibre as durações relativas: uma parte pode receber mais destaque, sem que a outra passe
  rápido demais. Reserve sustentação legível depois da revelação, além do tempo de animação.
- Revelação por palavra ou letra deve respeitar grupos de sentido e leitura. Evite empilhar texto
  antigo e novo numa transição que comprometa a compreensão.
- Mantenha uma referência temporal explícita: tempos locais da cena ou globais do filme. Ao inserir
  uma pausa, desloque voz e eventos dependentes juntos, preservando o áudio original em outro arquivo.

## 5. Luz, rastros e impacto

- Luz em movimento deve surgir já percorrendo o trajeto; evite um ponto aceso imóvel seguido de
  deslocamento desconectado. O rastro se forma atrás da fonte, em vez de aparecer pronto.
- Para uma aparência orgânica, use interpolação contínua, bordas suaves e decaimento por idade
  de cada trecho. Uma máscara com limite duro ou progresso em degraus costuma parecer sintética.
- Coordene a revelação do conteúdo com a passagem da luz. Se a luz revela uma palavra, o texto
  não deve estar totalmente revelado antes de o percurso começar.
- Quando a luz se aproxima do destino, faça sua luminância decair gradualmente. O rastro anterior
  pode desaparecer enquanto ela ainda se move. Evite a sequência rígida chegar, esperar e desligar;
  um brilho residual no alvo é um estado distinto e deve ter duração deliberada.
- Sincronize impacto sonoro com resposta visual do conjunto: pequeno tranco de câmera, escala ou
  luz com recuperação amortecida. Calibre a amplitude para não prejudicar leitura nem conforto.
- Escolha o caráter sonoro conforme o gesto: brilho pode pedir transiente mais claro; impacto pode
  pedir corpo e sustentação. Ataque, sustain e reverb são decisões distintas. Repetir um whoosh a
  cada movimento não substitui desenho de som; dê função a cada efeito e espaço entre eles.

## 6. Continuidade sonora e visual do filme

- Preserve arquivos separados de fala, música, ambiência e efeitos, além das mixagens de prévia.
  Um MP4 aprovado serve de referência, mas não deve ser a única fonte disponível para a mixagem.
- Planeje música e ambiência numa timeline global. Não monte o filme simplesmente concatenando
  mixagens cujas trilhas reiniciam ataques, motivos e fades em cada cena. As prévias podem usar
  recortes da faixa global; uma nova entrada musical deve ser uma decisão narrativa deliberada.
- Sustente caudas de reverb e ambiência através dos cortes quando fizer sentido. Use redução
  gradual da música sob a voz, com recuperação suave, sem bombeamento ou sumiço a cada frase.
- Escolha corte, fusão ou transição motivada pelo ritmo e pelo assunto; não varie o efeito por
  obrigação. Numa dissolução, confira se cards e legendas sobrepostos continuam compreensíveis.
- Reserve pré-rolagem e saída ou outra estratégia explícita de transição. Não desloque a voz nem
  corte palavras para encaixar o efeito. Se houver sobreposição, recalcule o tempo global uma vez.
- Ao unir arquivos, use limites em quadros e amostras. Verifique preenchimento dos codecs e tempos
  iniciais para não acumular folgas. Meça o arquivo final, distinguindo vídeo, áudio e contêiner.
- Masterize a montagem inteira depois da mixagem; confira loudness e true peak no arquivo codificado.
  Métricas corretas não garantem continuidade perceptiva: revise cada emenda com contexto antes e
  depois e a sequência inteira nas ferramentas disponíveis. Declare limites de escuta/visualização.
- Aprovações individuais não dispensam a revisão da montagem. Se a finalização alterar cenas já
  aprovadas, apresente a revisão afetada e preserve as versões anteriores.

## 7. Alternativas de geração e loops de imagens

- Antes de consumir recursos externos, confira capacidade real, modelo, plano e custo. Uma chave,
  catálogo acessível ou estimativa de créditos não confirma que a conta pode executar a geração.
- Registre envio e resultado. Em falha com cobrança incerta, não repita automaticamente. Se o
  usuário já autorizou uma alternativa, aplique-a dentro desse escopo; não peça a mesma decisão.
  Uma alternativa não autoriza trocar de provedor pago nem assumir outro custo.
- Quando forem aceitas poses em sequência, crie um quadro mestre e derive variações coerentes.
  Preserve identidades, quantidade de personagens, figurinos, objetos, câmera, luz e enquadramento.
  Compare também o primeiro quadro com os seguintes; uma pessoa ou objeto não pode surgir só nas
  variações. Corrija o mestre e confira os arquivos efetivamente referenciados pelo render.
- Escolha ciclo fechado ou ida e volta conforme o movimento. Verifique a passagem final/início,
  poses extremas e todas as repetições previstas. Dissoluções podem criar duplicação temporária de
  rostos ou membros: reduza a diferença entre poses e ajuste a duração se esse efeito ficar aparente.
- Aplique parallax em camadas distintas quando houver conteúdo em primeiro plano. Não dependa
  apenas da troca de imagens para transmitir profundidade.
- Descreva a entrega honestamente como sequência de poses, loop ou vídeo gerado, conforme o caso.
  Não prometa animação corporal contínua a partir de poucas imagens.

## 8. Aplicação e evidências

Use a [crítica visual](critica-visual.md) para comparar a intenção do storyboard com os quadros
renderizados e separar ajustes de direção dos defeitos técnicos da cena.

No projeto, registre as decisões que importam: origem dos tempos, estados do card, função das
legendas, planos de profundidade, eventos sonoros, estrutura global de música, método de transição,
invariantes das imagens e versões aprovadas. Registre somente o que for aplicável, sem criar campos
ou etapas que não ajudam a tarefa.

Na cena, inspecione entrada, ápice, repouso e saída relevantes; em luz e loops, inclua estados de
formação, desaparecimento e retorno. Na montagem, confira emendas, duração e decodificação. Use
comparações de quadros para detectar trocas de versão ou deslocamentos, sem tratar igualdade de
pixels, ausência de clipping ou sucesso de TypeScript como prova de ritmo, emoção ou aprovação.

Estas orientações são independentes de agente, provedor e motor. Use os recursos equivalentes
disponíveis e verifique as capacidades reais do ambiente. Elas não pressupõem implementação
automática desses comportamentos nos templates ou nos scripts fornecidos.

## 9. Coreografia de motion graphics guiada pela narrativa

Fluxo adaptado do [ReelForge](https://github.com/gongnyang/reelforge/blob/main/README-en.md)
para os motores e as aprovações da AI Filmmaker. Use nas cenas em que movimento, câmera ou
transformações visuais carregam parte da narrativa.

1. **Nomeie o acontecimento visual no storyboard.** Escreva o que muda no quadro e por quê.
   Por exemplo, «a câmera atravessa o símbolo e revela o espaço que ele representa». Defina
   o elemento dominante, o gatilho e o estado em que o espectador consegue ler ou compreender
   o resultado. Encaixe a tipografia nesse gesto e mantenha o texto já aprovado.
2. **Trace a intensidade da sequência.** Marque preparação, ênfase e repouso no storyboard.
   Escolha a coreografia pela função da cena: revelar com máscara, comparar com movimento
   relativo ou conectar com um elemento compartilhado entre os cortes. Reserve os acentos mais
   fortes para momentos que sustentem a narrativa. Use marcadores de fala ou de música conforme
   o projeto e preserve o tempo natural da locução e a trilha contínua.
3. **Reaproveite padrões com evidência.** Ao adaptar uma composição já testada, indique o que
   preservar (por exemplo, ordem de revelação) e o que variar (cor, texto, escala ou duração).
   Trate padrões novos como experimentais até revisar uma prévia no formato real. Se houver
   um efeito de alto risco, faça uma prova curta dentro da cena atualmente autorizada. Adie
   a prova de uma cena posterior até a autorização correspondente.
4. **Teste os momentos que podem falhar.** Além da prévia em movimento, use uma tira de quadros
   quando ajudar a localizar trechos vazios, congelamento involuntário ou perda de contraste.
   Inclua quadros nos dois lados de cortes e nos instantes de efeitos rápidos. Em render por
   busca temporal, gere um mesmo quadro diretamente e após outro instante se houver suspeita
   de estado acumulado. Calcule movimento a partir do frame ou tempo e use semente explícita
   quando a aleatoriedade fizer parte da composição.
5. **Corrija no trecho afetado.** Use o registro da [crítica visual](critica-visual.md) para
   indicar tempo, achado e ajuste. Confira novamente o trecho e as emendas afetadas. Quando
   uma técnica for aproveitável em outro projeto, registre seu motor, condições testadas e
   evidência da prévia, sem guardar identidade visual ou conteúdo específico como regra geral.

Exemplo no storyboard: `Cena 03 · ênfase · a trajetória une dois planos · gatilho na palavra
de contraste · preservar os pontos de saída e entrada entre planos · variar a escala para o
formato vertical · conferir legibilidade no meio e no fim da passagem`.

## 10. Grafismos que acompanham a fala

Adaptação do plano de motion da [HyperFrames Motion Library](https://github.com/nutllwhy/hyperframes-motion-library).
Quando a fala pedir um grafismo, anote no storyboard o trecho ou timecode, a função do gráfico,
a informação indispensável e o que ficaria fora do escopo. Escolha a composição pela função:
grafismo em tela cheia, sobreposição sobre a fala ou composição dividida quando pessoa e gráfico
precisarem ser vistos juntos. Uma comparação pede escalas coerentes. Um percentual exige base e
denominador conhecidos. Preserve fatos, unidades e ressalvas da fonte.

Use a identidade visual do projeto como padrão dos grafismos. Se houver versões horizontal e
vertical, mantenha os mesmos dados e parâmetros de conteúdo, recomponha as posições e confira as
áreas seguras em cada formato. Na prévia, avalie a ocupação real de texto e dados por dentro da
composição. Um contêiner grande pode esconder um grafismo pequeno. Para sobreposições com alpha
solicitadas no projeto, teste a composição sobre um fundo claro e um escuro com o motor disponível.

## 11. Variedade de takes e demonstrações de produto

Adaptação da revisão criativa do [SaaS Motion Kit](https://github.com/tugrawork-creator/saas-motion-kit).
Em sequências com vários takes, registre a mensagem central e o tom. Durante a revisão do
storyboard, compare os takes adjacentes em duração, escala de enquadramento, entrada do texto,
movimento de câmera e transição. Se a repetição ajudar a reconhecer uma ideia ou sustentar o ritmo,
registre-a como motivo visual. Quando deixar a sequência previsível, varie o elemento que pode
reforçar a narrativa e mantenha a identidade e a continuidade entre os takes.

Para vídeos de software, parta de telas atuais ou de componentes verificados. Simplifique
visualmente quando a interface completa competir com a explicação. Identifique uma representação
conceitual no storyboard e deixe seu caráter ilustrativo claro no vídeo quando puder ser confundida
com o produto real. Verifique se cada interação, estado e dado mostrado corresponde ao produto
ou está apresentado como exemplo. Aplique essa revisão com o fluxo de aprovação já existente.

## 12. Escrita animada e diagramas técnicos

- **Escrita animada.** A partir do [Tegaki](https://github.com/gkurt/tegaki), planeje o gesto
  por traços quando a cena simular uma mão escrevendo. Use trajetórias centrais autorais em SVG,
  anime o comprimento visível pelo tempo da composição e ajuste duração por comprimento e ordem
  natural do gesto. Com letras largas ou irregulares, use o traço como máscara do glifo final.
  Faça um teste curto com o texto real, incluindo acentos e ligaturas, e reserve tempo para ler
  a frase completa. Uma varredura sobre texto pronto pode servir como revelação tipográfica.
- **Diagramas.** A partir do [Animated Diagrams](https://github.com/omkamal/animated-diagrams-skill),
  identifique nós, conexões e regiões com IDs estáveis no SVG ou no modelo equivalente do motor.
  Confira rótulos, relações e direção das setas com a fonte. Na timeline, vincule cada trecho da
  explicação à relação que deve aparecer ou ganhar destaque. Mantenha visível contexto suficiente
  para entender de onde o fluxo vem e para onde vai. Se houver movimento de câmera, preserve
  títulos e legendas em camada própria. Confira quadros antes, durante e depois de cada ligação
  crítica, além da leitura do diagrama em seu estado final.

## 13. Sustentação do quadro entre eventos

Da [análise de motion do Herk Edit Kit](https://github.com/nateherkai/herk-edit-kit/blob/main/MOTION_PHILOSOPHY.md),
aproveite a checagem de cobertura temporal. Marque quando termina a ação e quando realmente deve
terminar a visibilidade de cada camada importante. Se o gesto acabar antes do corte, sustente o
estado legível pelo tempo previsto. No QA, inspecione o último frame do trecho, o primeiro do
seguinte e, se houver, a sobreposição. Trate um flash vazio como falha quando o storyboard prevê
continuidade. Um corte para preto intencional deve aparecer no plano. Ajuste a duração natural do
projeto pelo briefing e pela fala, com a técnica equivalente do motor adotado.
