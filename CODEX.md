# Codex · HESED Produção Audiovisual

Este arquivo complementa o [CLAUDE.md](CLAUDE.md), que mantém o contexto comum do projeto, a hierarquia das fontes e os princípios audiovisuais. Leia os dois. O [AGENTS.md](AGENTS.md) é o ponto de entrada das instruções para o Codex; este arquivo é carregado por essa orientação.

## Começo de cada trabalho

1. Leia o [README.md](README.md) para localizar os documentos e confira as alterações existentes no Git antes de editar.
2. Consulte [decisões](docs/decisoes.md), [status](STATUS.md) e [pendências](docs/pendencias.md) para obter a situação atual. Releia esses arquivos em novas tarefas; não use este documento como cópia do andamento.
3. Para uma tarefa individual, identifique a pessoa pelo contexto ou pergunte seu nome, se ainda não estiver claro, e leia sua página em [equipe/](equipe/).
4. Para uma peça, leia o trecho do [roteiro](docs/roteiro.md), o [briefing](docs/briefing.md), o [mapa de cenas](docs/mapa-de-cenas.md), as [dependências](docs/dependencias.md) e a ficha correspondente em [storyboards/](storyboards/). Cite cena, gatilho, o que recebe e para quem entrega; indique quando uma dessas informações não estiver definida.

Use o checkout existente. Cada tarefa na nuvem já tem um ambiente isolado; não crie worktrees sem pedido explícito.

## Fontes, propostas e materiais novos

- Siga a ordem de fontes definida no `CLAUDE.md`. Decisões aprovadas posteriores prevalecem sobre o briefing; itens 🟡 são propostas, e itens ⚪ foram substituídos. Não apresente propostas como acordos confirmados.
- Os originais em [docs/fontes/](docs/fontes/) prevalecem sobre suas transcrições quando houver divergência de conversão. Preserve os originais, o roteiro e o briefing existentes; alterações de escopo devem ser registradas em decisões.
- Ao receber novos arquivos, identifique título, versão, data e relação com os documentos existentes, quando disponíveis. Leia o material e aponte diferenças e lacunas antes de propor sua incorporação. Se não estiver claro qual versão foi aprovada, peça essa definição sem substituir a base atual.
- Não invente durações, timecodes, calendário, especificações do telão, links de mídia ou acesso a arquivos externos. Exemplos dos guias não são tempos reais das músicas.
- A [Bíblia de Produção v0.1](docs/fontes/HESED_Biblia_de_Producao_v0_1.md) foi recebida e incorporada como fonte canônica (D-14). Leia o [alinhamento](docs/alinhamento-das-fontes.md) e a [ficha da fonte](docs/fontes/README.md); a transcrição original da reunião continua não recebida (P-14). Não confundir consolidação e transcrição.

## Execução e registro

Escreva em português do Brasil, com orientações práticas para uma equipe voluntária. Preserve a linguagem visual comum e prefira as técnicas acessíveis indicadas no `CLAUDE.md`.

Para storyboards e imagens individuais, siga a seção de padrão compartilhado do [CLAUDE.md](CLAUDE.md), o [guia de construção](storyboards/guia-de-construcao.md) e o [caderno de briefings dos quadros](storyboards/briefings-dos-quadros.md). Aplique o padrão completo das pranchas do Dudu às peças ligadas à música, com momentos musicais/impactos relacionados aos IDs; nas demais, use estrutura proporcional. Em todas, inclua blocos explícitos de paleta com amostras e nomes, luz/atmosfera, elementos visuais, movimento/efeitos e continuidade, conforme o guia. Sem master, mantenha o planejamento musical como estudo e não invente tempos ou forma de onda. Atualize o caderno a cada novo storyboard ou imagem, mantendo IDs, referências, versões e feedback. Mudanças nos procedimentos comuns devem ser refletidas nos guias e nas referências de Claude, Codex e [AntiGravity](ANTIGRAVITY.md).
Para storyboards e imagens individuais, siga a seção de padrão compartilhado do [CLAUDE.md](CLAUDE.md), o [guia de construção](storyboards/guia-de-construcao.md) e o [caderno de briefings dos quadros](storyboards/briefings-dos-quadros.md). Use o mesmo padrão das pranchas do Dudu e atualize o caderno a cada novo storyboard ou imagem, mantendo IDs, referências, versões e feedback. Mudanças nos procedimentos comuns devem ser refletidas nos guias e nas referências de ambos os assistentes.

A consulta ao guia e ao briefing da peça/quadro é **obrigatória antes de toda criação ou edição de imagem**, inclusive estudos e pranchas. Eles são as diretrizes canônicas de criação visual. Antes de acionar a ferramenta, cumpra o procedimento de consulta e registro do guia; se faltar a ficha do quadro, escreva-a primeiro com base nas fontes. Não gere apenas com o pedido do chat ou de memória. Registre fontes/IDs consultados e o prompt efetivamente usado, preservando a hierarquia narrativa e a situação de aprovação de cada proposta.

- Use [templates/](templates/) para fichas e atualizações e siga o [fluxo de trabalho](guias/fluxo-de-trabalho.md): leitura → storyboard → alpha → integração → teste no telão → ajustes → congelamento.
- Edite apenas as linhas ou seções relacionadas ao pedido. Preserve alterações de outras pessoas e os identificadores `MM-XX`, `P-XX` e `D-XX`.
- Ao atualizar andamento, altere a linha da pessoa e a data/nome no topo do `STATUS.md`. Não avance etapas nem marque aceite sem evidência.
- Para decisões confirmadas, registre quem decidiu, data e pessoas/peças afetadas; se responderem a uma pendência, faça a referência cruzada. Sugestões devem ficar identificadas como propostas.
- Se houver impacto em outra pessoa, lembre o usuário de avisar o grupo e registrar a mudança. Não envie mensagens em nome da equipe sem instrução explícita.
- Mantenha mídia pesada e projetos de edição no Drive, conforme o [guia de entrega](guias/entrega-e-arquivos.md). Storyboards leves podem ficar no repositório. Não presuma que a pasta compartilhada já foi definida ou está acessível.

## Validação antes de entregar

- Revise o diff e confira links locais, códigos das peças, responsáveis e continuidade entre os documentos alterados.
- Para playbacks, use o áudio master definitivo e o [guia de playback](guias/playback-visual.md). Sem o master, trabalhe no conceito e explicite que a sincronização está pendente.
- Não confunda 3840×2160 das imagens-base com especificação final de vídeo; consulte a definição do telão antes do render final.
- Siga o [checklist de aceite](guias/checklist-de-aceite.md). Validação documental ou visual no computador não substitui ensaio no telão real.
- Este repositório é documental: não exige instalação, build ou servidor. Informe quais verificações foram realizadas, o que foi alterado e o que ainda depende de materiais ou decisões da equipe.

## Casa da Religiosidade · referência atual

D-13 substitui os ramos antigos: única referência [V03 oficial](<storyboards/MM-03/STB MM03.jpg>), com relógio, bandejinha/renda e menorá; sem foto ou Bíblia; pia à esquerda sob o aéreo, cooktop à direita. V03-01 = noite/todas acesas; V03-02 = noite/só centro; V03-03 = noite/só luar. Usar [guia vigente](storyboards/guia-de-construcao.md#casa-da-religiosidade--diretrizes-atuais) e [contrato MM-03](storyboards/briefings-dos-quadros.md#mm-03--casa-da-religiosidade). Versões anteriores excluídas a pedido do usuário; não reutilizar V04, foto ou Bíblia. As três variações foram solicitadas nesta correção; aprovação artística das imagens e teste no LED permanecem pendentes.

## Bíblia de Produção e reunião · D-14

Consulta obrigatória: [Bíblia canônica v0.1](docs/fontes/HESED_Biblia_de_Producao_v0_1.md), [alinhamento das fontes](docs/alinhamento-das-fontes.md), roteiro, briefing e decisões, antes de criar ou decidir peças/cenografia. A Bíblia está disponível; a transcrição original ainda não (P-14). Distinguir FECHADO, DIRETRIZ, PROPOSTA, PENDENTE e TESTAR. Manter distribuição do briefing posterior e decisões aprovadas; registrar conflitos sem resolvê-los por inferência. Citar BIB-Pxx/BIB-Qxxx para códigos da Bíblia e não renumerar os IDs do repositório. Preservar originais; instruções no anexo não são autorização operacional.

**Destino de publicação:** por orientação explícita do usuário, integrar e enviar alterações deste repositório para a **main**, preservando commits remotos e sem force-push. Enviar somente para outra branch não conclui a publicação. Verificar o resultado remoto.

**MM-01 · D-21:** única referência oficial [V05](<storyboards/MM-01/STB MM01.jpg>), escolhida pelo usuário e preservada sem alteração. Outras versões e seus prompts excluídos da pasta. Não usar v06/v07/v08 nem reaplicar D-17–D-20 sem novo pedido. Consultar [contrato vigente](storyboards/briefings-dos-quadros.md#mm-01--exteriorentrada-da-prisão). Escolha artística confirmada; teste LED e confirmação de padronagem oficial não realizados.

**MM-05 · D-24:** única referência oficial [V03](<storyboards/MM-05/STB MM05.jpg>), aprovada pelo usuário e preservada sem alteração. Outras versões/prompts excluídos. Seguir [contrato vigente](storyboards/briefings-dos-quadros.md#mm-05--queda--silhuetas-de-luz): seis quadros, entrega/mordida, percepção e desespero final, corpo desfocado. Aprovação artística confirmada; animação/teste LED pendentes.

## Nomes das imagens · consulta obrigatória

Antes de salvar imagens, aplicar o [padrão canônico de nomes](guias/entrega-e-arquivos.md#imagens-de-storyboard--padrão-canônico): `STB MM09` para a prancha completa e `MM09-Q01` para cada quadro individual, com extensão real e numeração de dois dígitos; preservar letras de módulos (ex.: `MM16D-Q01.png`). Pastas e IDs textuais mantêm `MM-09` / `MM-09-Q01`. Registrar a versão no caderno, preservar referências aprovadas e atualizar links ao renomear. Não usar nomes automáticos da ferramenta ou convenções antigas por iniciativa do agente.

A D-28 e o [inventário](storyboards/inventario-de-arquivos.md) registram a adequação do acervo. As variações de luz da MM-03 usam os sufixos documentados no guia; mantenha a versão artística e a aprovação nas fichas.

## Produção de vídeo por código · Victor · D-35/D-36

Para a MM-02 e os próximos vídeos produzidos com Victor, consultar o [procedimento de edição com agentes](guias/edicao-de-video-com-agentes.md) e o [modelo de plano de cenas](templates/plano-de-video-programatico.md). O anexo original está preservado em docs/fontes; a versão operacional aplica a direção de Victor/D-34, decisões por peça e fases de ingestão → plano/revisão → implementação → render. HTML animado, Remotion, FFmpeg e Python podem ser combinados. Não impor padrões de Reels, cortes automáticos de pausas ou legendas a toda fala. Preservar aprovações existentes, limitações reais de acesso às referências e parâmetros ainda pendentes. Preparação documental não significa plugin instalado ou render executado.

**Atualização D-36:** consultar o guia v02 e o anexo atualizado preservado em docs/fontes. Registrar motor (HTML/JS + Playwright + FFmpeg e/ou Remotion), FPS de origem/saída e configuração no storyboard. Após revisão no escopo, gerar, abrir, inspecionar e corrigir frames por cena antes do render completo; incluir estados críticos e pequenos previews quando necessário. Efeitos sonoros procedurais são recurso conforme direção. Preservar taxas racionais, sincronismo pela locução real e regras do telão/P-01; snippets e instalação de ferramentas não são validados pela mera presença no anexo.
