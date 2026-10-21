# Construção de storyboards e imagens · HESED

**Padrão de trabalho:** storyboards ligados à música devem seguir a estrutura de comunicação das pranchas de Eduardo (Dudu), incluindo progressão musical e impactos visuais. Os demais podem usar uma estrutura mais simples, mantendo os blocos comuns de direção: objetivo, paleta, luz, elementos visuais, movimento, efeitos e continuidade. O formato de apresentação não amplia o conteúdo exigido pelo briefing de cada MM. Tempos e sincronização precisam de fonte verificada.

Este guia orienta a criação. O [caderno de briefings por quadro](briefings-dos-quadros.md) registra o que construir em cada imagem. As fichas em `storyboards/MM-XX/README.md` continuam sendo o resumo de cada peça. Consulte também o [briefing oficial](../docs/briefing.md), o [roteiro](../docs/roteiro.md), as [decisões](../docs/decisoes.md) e as [dependências](../docs/dependencias.md).

## Diretrizes canônicas · consulta obrigatória antes de gerar

Este guia é a referência canônica do **processo de criação visual**; o caderno é a referência canônica do **detalhamento de cada quadro**. A consulta aos dois é obrigatória para toda criação ou edição de imagem do HESED por Claude, Codex ou outra ferramenta, incluindo estudos, referências geradas, pranchas e bases definitivas. O briefing, o roteiro e as decisões aprovadas continuam regendo o conteúdo narrativo; propostas no caderno continuam propostas.

Antes de cada chamada de geração ou edição:

1. Identifique a peça, os IDs dos quadros envolvidos e a entrega: estudo, prancha ou base individual. Em pranchas, consulte todos os quadros incluídos.
2. Leia a versão atual deste guia e os briefings correspondentes no caderno, incluindo o contrato visual da peça, os pontos de conferência e os quadros vizinhos necessários à continuidade. Confira também a [Bíblia de Produção canônica](../docs/fontes/HESED_Biblia_de_Producao_v0_1.md), o [alinhamento das fontes](../docs/alinhamento-das-fontes.md), os selos de maturidade, as fontes narrativas e as referências reais pertinentes; não substitua essa leitura por lembrança de outra conversa.
3. Se não houver briefing, registre-o primeiro no caderno com base nos documentos do projeto. Material ausente deve ser identificado como ausente. Se um conflito exigir decisão da equipe, resolva esse ponto antes da imagem afetada; o trabalho independente pode continuar.
4. Monte o prompt a partir dessas diretrizes, do briefing do quadro e das referências disponíveis. Para edição, confira também a imagem atual e o feedback que motivou a mudança. Uma referência artística não autoriza alterar silenciosamente a cena.
5. Antes de gerar, informe de forma breve: **“Diretrizes consultadas: guia de construção + caderno, [MM/IDs]; entrega: [tipo]”**, acrescentando outras fontes relevantes. Essa indicação acompanha a conversa/registro, sem virar texto embutido na imagem.
6. Após a chamada, registre na ficha do quadro as fontes consultadas, as referências realmente usadas, o prompt efetivamente enviado, a versão/localização disponível e o feedback. Identifique falhas de geração e não registre aprovação ou arquivo inexistente. Para pranchas, associe o registro aos IDs incluídos.

Se um pedido mudar uma diretriz, atualize o documento canônico correspondente e as referências dos assistentes antes da próxima geração afetada, preservando a distinção entre proposta e aprovação. Este procedimento mantém uma base compartilhada em vez de regras existentes somente no chat.

## 1. O que produzir em cada etapa

| Entrega | Finalidade | Conteúdo |
| --- | --- | --- |
| Storyboard em prancha | Avaliar o conjunto antes de produzir imagens finais | Miniaturas numeradas, descrição, movimento, transição e gatilho; tempos apenas quando medidos |
| Briefing de cada quadro | Tornar cada imagem reproduzível e coerente com as vizinhas | Intenção, composição, personagens, cenário, luz, continuidade, restrições e prompt |
| Imagem-base individual | Servir de fonte para animação e edição | Uma composição limpa, sem grade, legendas, títulos, números ou timecodes |
| Clipe / alpha | Validar movimento, duração e passagem entre imagens | Animação das bases e efeitos em camadas, sincronização verificada quando aplicável |

Um quadro representa um estado visual relevante. Não é necessariamente um corte, um arquivo de vídeo ou um intervalo fixo de tempo. Uma mesma base pode produzir mais de um estado por reenquadramento e luz. Evite gerar imagens novas para movimentos que a edição resolve.

### Padrão das pranchas · música e direção visual comum

**Referências examinadas:** [MM-07](<MM-07/STB MM07.png>), [MM-10](<MM-10/STB MM10.png>), [MM-13](<MM-13/STB MM13.png>) e [MM-16D](<MM-16D/STB MM16D.png>). A análise considera a forma de comunicar o planejamento, sem aprovar automaticamente o conteúdo ou os tempos desenhados nessas imagens.

As pranchas apresentam cabeçalho, grade de imagens e blocos de direção. O MM-07 usa 10 quadros e um resumo textual de sincronização; MM-10, MM-13 e MM-16D usam 12 quadros, faixa de momentos/impactos e amostras de cor. Portanto, o padrão é a organização das informações, não um número fixo de quadros ou a obrigação de reproduzir uma forma de onda.

| Bloco | Obrigatório em todos os storyboards | Complemento obrigatório quando ligado à música |
| --- | --- | --- |
| **Cabeçalho** | HESED, MM, título, cena, responsável, versão/situação, objetivo e estilo | Música, intérprete/versão do master quando conhecidos; duração verificada ou “a definir com o master”; no MM-16, identificar o módulo e seu intervalo no filme |
| **Quadros** | IDs legíveis, título curto, imagem, descrição do que se vê, movimento/efeito/transição e gatilho pertinente | Relação entre estado visual e trecho/momento da música; entrada/saída e intervalo medido quando disponível |
| **Paleta de cores** | Bloco visível com amostras e nomes das cores, seus papéis na imagem e evolução entre estados, quando houver | Relação entre mudança de cor/luminosidade e crescimento, impacto ou repouso musical |
| **Luz e atmosfera** | Fontes, direção, temperatura, contraste e intensidade relativa | Progressão luminosa em relação à música; ponto de maior intensidade e recuperação visual |
| **Elementos visuais** | Lista dos cenários, objetos, personagens permitidos, texturas e motivos recorrentes; restrições importantes | Elementos que se transformam ou entram em resposta aos momentos musicais |
| **Movimento e efeitos** | Câmera, parallax, movimento ambiental, velocidade, partículas ou efeitos pertinentes; escrever “não previsto” quando não houver | Resposta planejada aos crescimentos, pausas, impactos, clímax e encerramento realmente presentes na faixa |
| **Continuidade / operação** | O que recebe, estado final, para quem entrega, repetição/espera quando necessária; marcar itens não definidos | Costura com a música e a peça seguinte, relação com dança/elenco e, no MM-16, integração dos quatro módulos |
| **Faixa de sincronização** | Dispensável nas peças sem música; usar gatilhos de fala, estados de luz e operação | Bloco próprio de momentos musicais e impactos visuais, em tabela ou linha de progressão legível, ligado aos IDs dos quadros |

**Apresentação visual comum:** usar a linguagem editorial das referências: cabeçalho claro, miniaturas alinhadas, títulos destacados e descrições curtas abaixo das imagens; blocos técnicos separados no rodapé ou em página complementar. Fundo escuro, divisórias discretas e textos claros com detalhes dourados são a referência de apresentação. A cor da prancha não obriga a imagem-base a ser escura. Preservar legibilidade; se faltar espaço, dividir a prancha em páginas, sem comprimir instruções até ficarem ilegíveis. Os títulos e blocos técnicos pertencem ao planejamento, não à imagem-base limpa.

**Paleta explícita em todas as peças:** incluir amostras visuais identificadas por nome e função (base, sombra, luz, acento). Códigos de cor podem complementar quando definidos; não atribuir HEX exatos às referências sem medição. Usar a linguagem comum do HESED com adaptação à cena e às referências oficiais aprovadas, sem recolorir automaticamente a casa V03, a prisão V06 ou a queda V03. Uma ambientação sem pessoas também precisa desse bloco e dos demais campos comuns.

**Quais peças seguem o padrão musical:** MM-07, MM-08, MM-11, MM-13 na posição musical confirmada e MM-16 com seus módulos. MM-04 também está ligada à música/dança e deve apresentar sua relação com a faixa, preservando a solução de loop/ambientação: o padrão musical não obriga a criar narrativa nova ou cortes extras. Qualquer outra peça efetivamente vinculada a uma canção usa o mesmo padrão. MM-10 acompanha uma fala, apesar da faixa musical ilustrada na referência; não presumir trilha autônoma. MM-01, MM-03, MM-05, MM-09, MM-12, MM-14 e MM-15 usam apresentação proporcional à função documentada, salvo vínculo musical definido posteriormente.

**Sem master, manter o bloco e explicitar a pendência:** registrar fonte de áudio “não recebida”, tempo “a definir” e resposta visual como proposta. Não inventar batidas, refrões ou segundos. Não usar uma forma de onda decorativa como se fosse análise do áudio; se a onda real for incluída, identificar o arquivo/versão de origem. Um mapa textual de intenção musical, marcado como estudo, permite planejar sem alegar sincronização validada.

Modelo do bloco musical:

| Quadro(s) | Trecho/momento da faixa | Tempo e fonte | Resposta visual / luz / movimento | Transição e relação com palco |
| --- | --- | --- | --- | --- |
| MM-XX-QNN | A identificar na faixa; intenção de introdução/crescimento/clímax somente como proposta | A definir com master não recebido, ou intervalo medido e identificação do master | Descrever a resposta correspondente | Descrever a costura e o cuidado com elenco/dança |

Para peças sem música, substituir esse bloco por **“Gatilhos e sustentação”**: fala/ação que inicia, estado visual a sustentar, loop/variação e condição de saída. MM-03 pode apresentar uma composição e suas variações de luz; MM-14 permanece montagem curta simbólica. Não impor timeline musical, 10/12 quadros ou encenação completa a essas peças.

**Conferência antes de entregar a prancha:** verificar todos os blocos comuns e, quando musical, a faixa de sincronização e a ligação quadro ↔ momento ↔ resposta. A qualidade pictórica não substitui informações de produção. Preservar referências já aprovadas; esta atualização orienta próximas criações/revisões e não autoriza refazer imagens existentes sem pedido.

## 2. Preparar a peça antes de desenhar

1. Identifique código, cena, responsável, função narrativa, fala-gatilho e condição de saída. Leia a página do responsável em [equipe/](../equipe/).
   Classifique também a função visual conforme a seção abaixo: ambientação, loop atmosférico, transformação simbólica ou sequência/montagem narrativa. Separe o que acontece no palco do que precisa aparecer no telão antes de incluir personagens no prompt.
2. Registre o que recebe e para quem entrega: frame, paleta, direção de luz, escala, movimento e materiais de referência. Quando não houver destinatário definido, escreva isso.
3. Classifique o controle: **fala com duração variável**, **música com master definitivo** ou **módulo de um filme maior**. Não aplique uma timeline musical a todas as peças.
4. Escreva o arco em uma frase e separe os estados necessários. Aplique o padrão musical das pranchas do Dudu quando houver vínculo com música; nas demais peças, mantenha os blocos comuns com estrutura proporcional. Nas referências existentes, preserve os IDs; a quantidade de quadros vem da função da peça, sem obrigação de usar 10 ou 12.
5. Registre conflitos e dependências antes de gerar bases definitivas. Ideias podem ser exploradas enquanto o áudio ou o frame vizinho não chegam, mantendo o caráter de estudo.

### Ambientação, personagens e alcance da criação

**Diretriz de escopo:** seguir o padrão de apresentação das pranchas do Dudu não exige transformar todo MM em um filme completo. O roteiro e o briefing definem a função de cada peça. Num fundo de cena, as pessoas que atuam no palco não devem ser acrescentadas automaticamente à imagem projetada. Uma composição-base com movimento sutil e loop pode ser toda a entrega visual necessária; não imponha quantidade mínima de quadros.

Antes de desenhar, registre no briefing do quadro: **função visual**, **ação no palco**, **conteúdo necessário no telão** e **personagens no telão: necessários, opcionais ou não previstos**, com a fonte da classificação. Quando a documentação permitir alternativas, diferencie requisito de escolha artística. Não aplique uma proibição geral de figuras humanas.

| Peça | Leitura dos documentos e orientação de escopo |
| --- | --- |
| **MM-03 · sala · Victor** | **Ambientação sem pessoas.** O [roteiro da Cena 2](../docs/roteiro.md) pede o fundo da sala no telão e as atrizes numa mesa no palco. Reutilizar o ambiente no começo da Cena 3 até “Não tinha dor” e no retorno da Cena 4. Criar o espaço da casa, sem morador, Religiosidade, detentas, figura humana ou silhueta. Movimento ambiental discreto, sem encenar a conversa. Ver [ficha MM-03](MM-03/README.md). |
| **MM-01 · prisão · Victor** | O roteiro coloca detentas e Jesus no palco; o MM é exterior/entrada da prisão. Não duplicar automaticamente essas atuações na projeção. É uma leitura de ambientação; o detalhamento permanece reservado ao Victor, conforme briefing. |
| **MM-04 · criação · Melissa** | O [briefing](../docs/briefing.md) permite uma única paisagem forte animada em loop. Não exige personagens nem representação completa dos dias da criação. Entregar imagem-base/paleta para Lucas no MM-05. |
| **MM-09 · profetas · Melissa** | **D-27: refazer do zero.** V01/v02 excluídas e desconsideradas; não usar suas imagens como referência. Roteiro pede profetas pregando/anunciando, espera por gerações e crença/dúvida. Poucas composições contemplativas com funções e enquadramentos realmente distintos, sem repetir o mesmo sermão/grupo nos quadros. Nova proposta: [contrato v03](briefings-dos-quadros.md#mm-09--profetas), ainda para revisão. Entrega ao MM-10. |
| **MM-14 · pecados · Melissa** | Montagem curta de ações simbólicas e diretas, com stills animados ou pequenos vídeos. O briefing pede comunicar aprisionamento sem ilustrar cada pecado de modo literal ou prolongado. Figuras humanas podem ser usadas conforme a ação, sem obrigar uma encenação completa por pecado. Alinhar ritmo e cor com Lucas no MM-15. Ver [ficha MM-14](MM-14/README.md). |
| **MM-10 · Cristo eterno · Dudu** | O briefing pede cosmos/criação/luz sob a fala de João 1. Figuras de Cristo e seres humanos em Q03/Q09/Q10 do caderno vêm da referência artística, não de obrigação do briefing. Conferir a necessidade dessas figuras antes de gerar; não tratar os 12 quadros como metragem obrigatória. |
| **MM-11 · Luz do Mundo · Isaac** | O briefing pede composição predominantemente abstrata. O roteiro coloca o elenco compondo o presépio no palco e também diz que o telão acompanha a narração. Não duplicar automaticamente o elenco no vídeo nem declarar a divergência resolvida: consultar P-10 e, para o diálogo seguinte, P-09. |
| **MM-12 · viagem/cidade/estábulo · Lucas** | A progressão dos ambientes é necessária; encenar cada ação com personagens não é. O briefing dispensa atores filmados e permite paisagens, silhuetas e movimento lento. Apoiar a montagem física do presépio e entregar o espaço ao MM-13. |
| **MM-16A / MM-16B / MM-16D** | Transformações simbólicas são permitidas pelo briefing. Não exigir atuação literal de todo o arco. Conferir P-05 sobre as atrizes no filme final e P-06 sobre a divisão do tempo, sem eliminar personagens por conta própria. |

**Casos que exigem outro tratamento:** MM-06 pede a regressão cruz → ministério → infância → bebê; MM-13 prevê pastores e anjos; MM-02/MM-08 usam arquivo de Goel; MM-14/MM-15 são montagens de ações humanas. Simplificar a execução não significa retirar sujeitos necessários à função narrativa.

**Época e ambiente:** a sala da Religiosidade pertence ao mundo presente, descrito no briefing como urbano/doméstico. Não impor à casa arquitetura bíblica ou proibir objetos contemporâneos só porque outras peças são bíblicas. As restrições de época dos prompts devem acompanhar a cena específica.

**Referências e revisões:** os quadros detalhados a partir das pranchas são estudos, não exigências adicionais ao briefing. Se uma referência ampliar o escopo, registrar o ponto de revisão e propor a solução proporcional, preservando IDs e histórico. A transcrição da reunião não foi localizada no repositório nesta conferência; não atribuir decisões a ela sem receber e ler o arquivo.

## 3. Construir a imagem para o telão

**Direção comum:** realista e cinematográfica, reverente nos trechos bíblicos; branco, dourado, azul-noturno e luz quente. Essa linguagem admite símbolos e atmosfera, sem obrigar toda peça a repetir estrelas, explosões e feixes. O telão apoia atores e dança.

- **Intenção:** escolha um foco principal e descreva o que o público deve sentir ou entender. Evite acumular vários acontecimentos numa única imagem.
- **Composição:** defina plano aberto, médio ou detalhe; altura e posição da câmera; ponto focal; primeiro plano, plano médio e fundo. Use poucos elementos legíveis à distância.
- **Espaço de movimento:** preveja margem para zoom e deslocamento sem cortar rostos, mãos ou objetos essenciais. A margem é uma necessidade de composição, sem percentual técnico definido até o enquadramento ser testado.
- **Personagens:** crie referências de rosto, faixa etária aparente, cabelo, barba, figurino e proporção antes das séries com pessoas recorrentes. Registre essas escolhas como propostas até serem aceitas. Use a mesma referência nas peças conectadas, inclusive entre produtores.
- **Cenário:** estabeleça geografia, arquitetura, materiais, horizonte e direção da entrada de luz. Reutilize o mesmo ambiente entre planos; uma nova imagem não deve inventar outra Belém ou outro estábulo.
- **Iluminação:** descreva fonte, direção, temperatura, intensidade relativa e áreas de sombra. Reserve o maior brilho para o momento narrativo correto, preservando textura nos claros e leitura nos escuros.
- **Época:** proponha arquitetura, objetos e roupas coerentes com o contexto bíblico, sem elementos modernos ou fantasia medieval. Realismo visual não é comprovação de precisão histórica.
- **Representação:** detalhes de aparência, figuração de Cristo, anjos e recursos sobrenaturais são escolhas artísticas a alinhar com a direção. Não transforme detalhes da imagem gerada em afirmações do roteiro.
- **Texto:** títulos, descrições e timecodes pertencem à prancha. As bases finais saem sem texto; frases eventualmente aprovadas entram depois na edição.

Para imagens-base, a referência documental é **3840×2160**. Isso não define resolução, proporção de exibição, fps ou codec finais dos vídeos (P-01). Se a ferramenta não entregar esse tamanho nativamente, registre o tamanho real e valide a ampliação; não rotule um arquivo menor como 4K.

### Queda · MM-05 · diretrizes atuais

**D-24:** [V03](<MM-05/STB MM05.jpg>) é a única versão oficial, aprovada pelo usuário e preservada sem alteração. Outras versões e seus prompts excluídos da pasta. Aplicar [contrato vigente](briefings-dos-quadros.md#mm-05--queda--silhuetas-de-luz) e a imagem aceita: seis estados, luz emanante → forma física, Q02 entrega do fruto, Q03 mordida do homem, Q05 percepção por olhar mútuo e Q06 desespero/olhares/mãos na cabeça no mundo mais sombrio. Corpo oculto por desfoque, sem exposição de nudez. Não usar a versão vestida ou o final apenas em silhuetas. Mesma paisagem MM-04; MM-06 entra em “Enviando alguém pra nos salvar”. Aprovação artística não é aceite técnico ou loop validado.

### Prisão · MM-01 · diretrizes atuais

**D-40 prevalece:** [V06](<MM-01/STB MM01.jpg>) é a única versão oficial. Seus quatro [quadros individuais](MM-01/) e a prancha de conferência formam o conjunto canônico aprovado pelo usuário. Preservar perspectiva central, grades contínuas, cancela junto à guarita com dois guardas, quatro SUVs em escala coerente, pátio e segundo perímetro em muro alto com concertina e portão duplo alinhado à penitenciária. Usar somente esse conjunto para novos enquadramentos e para retomar a animação; imagens anteriores foram excluídas. Consultar o [contrato vigente](briefings-dos-quadros.md#mm-01--exteriorentrada-da-prisão). Jesus e detentas permanecem no palco. Aprovação artística não é aceite técnico do LED nem confirmação de padronagem oficial da frota.

### Casa da Religiosidade · diretrizes atuais

**D-13 prevalece sobre referências anteriores:** usar somente a [V03 oficial](<MM-03/STB MM03.jpg>), imagem reenviada pelo usuário com bandejinha sobre renda delicada, relógio à esquerda e menorá à direita. Sem foto ou Bíblia. Cimento queimado na sala, tijolinho na copa, pia à esquerda sob o armário aéreo e cooktop à direita. Mesma casa de classe média brasileira, arco panorâmico suave e desfoque discreto nas extremidades; não recriar cenário ou objetos. Mesa e sofá fora do painel; aparador projetado conforme referência.

V03-01 = noite/todas as luzes internas acesas; V03-02 = noite/somente luz central; V03-03 = noite/todas as luzes internas apagadas, apenas luar. As três foram solicitadas para refazer a série correta. Manter panorama e três detalhes, AR próximo de 16:9, mesmos IDs Q01–Q04 (Q05 não utilizado). Ver [contrato vigente](briefings-dos-quadros.md#mm-03--casa-da-religiosidade). Antigas versões da pasta foram excluídas a pedido do usuário. Não usar V04 ou imagens com porta-retrato. Painel físico ≈6×3 m não define a matriz de saída; validar no LED antes do aceite técnico.

## 4. Separar imagem de movimento e efeitos

O prompt da base descreve um instante. Travelling, aproximação, abertura de nuvens e expansão luminosa ficam no campo de animação. Não peça à imagem estática que execute uma sequência inteira.

Prefira zoom lento, parallax com poucos planos, máscaras, dissoluções e partículas discretas. Parallax exige separação de camadas ou reconstrução de áreas ocultas; uma imagem achatada não entrega isso automaticamente. Movimentar mãos, rostos, animais ou câmera com grande mudança de perspectiva exige validação específica e pode precisar de outra base.

Para loops, evite movimento irreversível no centro da ação e faça início/fim compatíveis. Uma dissolução não garante um loop sem emenda: teste repetido na duração necessária. Não congele o público em imagens paradas por falta de planejamento.

## 5. Continuidade antes da geração em série

Escolha uma imagem de referência por personagem/ambiente e registre a versão aceita no caderno. Gere uma base piloto, confira sua leitura e só então avance pelas vizinhas. Compartilhe os frames de ligação com o outro responsável.

Confira entre imagens: identidade, roupas, posição e quantidade de pessoas, escala do bebê, lado da manjedoura, desenho da cidade, direção do olhar, fonte de luz e sentido do movimento. Reutilize referências aprovadas na ferramenta quando disponíveis. Seed e prompt sozinhos não garantem consistência.

## 6. Tempos e conflitos nas pranchas do Dudu

| Peça | O que aproveitar | O que precisa ser resolvido |
| --- | --- | --- |
| MM-07 · Cena 3 | Belém noturna, calor humano, nascimento e progressão de luz | A prancha abre na cidade; o roteiro manda continuar com o bebê, e D-01 propõe o mesmo frame do MM-06. Validar com Isaac/Dudu a abertura e o uso de viagem/sem hospedagem, também tratados no MM-12 |
| MM-10 · Cena 5 | Escala crescente, criação e luz preparando MM-11 | Acompanha a fala de João 1, não uma música de 4 minutos. Ajustar ao ensaio; reduzir explosões e estética de ficção científica; alinhar figuração de Cristo |
| MM-13 · Cena 7 | Paisagem noturna contínua e crescimento até a glória | P-07/P-02 em aberto. A prancha põe a multidão celestial antes do anúncio; o roteiro traz anúncio antes da multidão. Reordenar na montagem sem perder os IDs |
| MM-16D · Cena 9 | Sombra → morte → silêncio → ressurreição → luz | É o quarto módulo do MM-16, não um filme autônomo de 4 minutos. Lucas define a divisão (P-06); reduzir a longa introdução da Paixão se não couber e considerar P-05 |

As durações e formas de onda desenhadas nas pranchas não comprovam medição de áudio. Use **“tempo a definir com o master”**, **“gatilho de fala”** ou **“duração a combinar no conform”**. Não associe refrão, virada ou clímax a segundos inventados.

## 7. Comando-base melhorado para criar um storyboard

```text
Planeje a peça [MM-XX / nome], da Cena [N] do HESED 2026, sob responsabilidade
de [pessoa], usando o briefing, o trecho do roteiro, as decisões aprovadas e
as referências fornecidas. Identifique propostas e conflitos sem tratá-los
como decisões. Não invente acesso a arquivos que não foram fornecidos.

Função narrativa: [...]. Gatilho: [...]. Saída: [...].
Recebe de: [...]. Entrega para: [...].
Controle: [fala variável / música com master / módulo do filme final].
Formato: [padrão musical Dudu / estrutura simples com direção visual comum].
Áudio e frames de ligação disponíveis: [... ou não fornecidos].

Proponha os estados visuais necessários, com IDs estáveis MM-XX-QNN.
Para cada um, descreva intenção, imagem de um único instante, composição,
personagens, cenário, luz, continuidade e elementos a evitar. Em campo
separado, descreva movimento, efeitos e transição para o próximo estado.
Siga o estilo realista e cinematográfico e a linguagem visual do HESED.
Não fixe tempos sem fonte medida. Planeje espera/loop onde houver fala.
Inclua blocos visíveis de paleta com amostras e nomes, luz/atmosfera,
elementos visuais, movimento/efeitos e continuidade em toda prancha.
Se a peça estiver ligada à música, use o padrão Dudu com cabeçalho,
quadros e faixa de momentos musicais/impactos ligada aos IDs. Sem master,
mantenha o bloco como estudo, com tempos a definir; não invente uma onda.
Se não houver música, use gatilhos de fala/operação e sustentação do estado.

Entregue primeiro o plano textual para revisão. Para a prancha visual,
use miniaturas com IDs e anotações fora da área de cada imagem. Para as
bases definitivas, gere uma imagem limpa por vez, nunca uma colagem.
Atualize o caderno de briefings por quadro com as escolhas e versões.
```

## 8. Registro e revisão de cada quadro

Use este modelo ao acrescentar peças ao [caderno](briefings-dos-quadros.md):

```markdown
### MM-XX-QNN · Título
- Situação e origem: proposta / referência / aprovado por quem e quando.
- Função narrativa e gatilho: ...
- Imagem-base: sujeito, ação congelada, ambiente e objetos.
- Composição: plano, câmera, foco, camadas e margem de movimento.
- Luz e cor: fonte, direção, contraste e relação com o quadro vizinho.
- Continuidade: referência de personagem/cenário, entrada e saída.
- Animação e transição: movimento, efeitos, espera/loop e ligação seguinte.
- Evitar: desvios específicos deste quadro.
- Prompt da imagem: descrição autossuficiente do instante a gerar.
- Referências usadas: arquivos/versões reais; ausentes quando não recebidas.
- Tempo: fonte medida ou a definir; nunca estimativa apresentada como real.
- Arquivo/versão/feedback: localização real, revisão e correção necessária.
```

Não renumere IDs após revisão: mude a ordem de montagem numa lista separada. Marque quadros retirados como não utilizados e dê novo ID a adições. Ao gerar uma imagem, registre a versão e o feedback no quadro correspondente; não sobrescreva versões aprovadas. **Ao salvar, aplicar obrigatoriamente o [padrão canônico de nomes](../guias/entrega-e-arquivos.md#imagens-de-storyboard--padrão-canônico): `STB MM07.jpg` para a prancha e `MM07-Q01.png` para o quadro individual**, preservando a extensão real e a letra nos módulos (`MM16D-Q01.png`). Os IDs textuais mantêm o hífen (`MM-07-Q01`). Não usar as antigas sugestões `q01.jpg`, `prancha-vNN.jpg` ou `HESED_C...` para novas imagens de storyboard. Registrar a versão artística no caderno e atualizar os links ao renomear; o nome novo não altera o conteúdo ou sua aprovação.

Antes de aprovar: conferir fidelidade à função da cena, anatomia, identidade, continuidade, leitura de longe, possibilidade de animação e relação com palco/música. Uma imagem bonita ainda pode falhar como peça do espetáculo. Use o [checklist de aceite](../guias/checklist-de-aceite.md) na validação do vídeo.
