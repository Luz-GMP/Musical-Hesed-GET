# AntiGravity · HESED Produção Audiovisual

Este arquivo orienta o AntiGravity a trabalhar com o mesmo contexto e as mesmas diretrizes de Claude e Codex. Leia primeiro o [AGENTS.md](AGENTS.md) e o [CLAUDE.md](CLAUDE.md), que mantém o contexto comum, a hierarquia das fontes e os princípios audiovisuais. Este documento complementa essa base; não cria uma versão paralela das regras de produção.

Ao iniciar uma sessão no AntiGravity, solicite a leitura desses arquivos e deste documento. Não presuma carregamento automático apenas pelo nome `ANTIGRAVITY.md`.

## Começo de cada trabalho

1. Leia o [README.md](README.md) e confira as alterações existentes no Git antes de editar. Preserve o trabalho de outras pessoas e use o checkout existente; não crie worktrees sem pedido explícito.
2. Consulte [decisões](docs/decisoes.md), [status](STATUS.md) e [pendências](docs/pendencias.md) atuais. Não use o histórico do chat como substituto desses registros.
3. Para tarefas individuais, identifique a pessoa pelo contexto ou pergunte seu nome se ainda não estiver claro, e leia sua página em [equipe/](equipe/).
4. Para uma peça, leia seu trecho do [roteiro](docs/roteiro.md), o [briefing](docs/briefing.md), o [mapa de cenas](docs/mapa-de-cenas.md), as [dependências](docs/dependencias.md) e a ficha correspondente em [storyboards/](storyboards/). Cite cena, gatilho, o que recebe e para quem entrega; indique informações ainda não definidas.

## Fontes e materiais novos

- Siga a hierarquia do `CLAUDE.md`. Decisões aprovadas posteriores prevalecem sobre o briefing; 🟡 identifica proposta e ⚪ identifica decisão substituída. Não apresente sugestões como acordos confirmados.
- Os originais em [docs/fontes/](docs/fontes/) prevalecem sobre transcrições em caso de divergência de conversão. Preserve os originais, o briefing e o roteiro; registre mudanças de escopo em decisões.
- Ao receber arquivos novos, identifique título, versão e data quando disponíveis, compare com a base existente e aponte diferenças e lacunas. Se a versão aprovada estiver incerta, peça essa definição antes de substituir a base.
- Não invente durações, timecodes, especificações do telão, calendário, links ou acesso a arquivos externos. Confira quais materiais foram realmente recebidos antes de afirmar que os leu; a citação da Bíblia de Produção no briefing não comprova disponibilidade do arquivo.

## Consulta obrigatória para criação visual

O [guia de construção](storyboards/guia-de-construcao.md) e o [caderno de briefings dos quadros](storyboards/briefings-dos-quadros.md) são as **diretrizes canônicas de criação visual**. Leia o guia atual e o briefing dos quadros envolvidos antes de toda geração ou edição de imagem, incluindo estudos, referências geradas, pranchas e bases definitivas. Cumpra o procedimento de consulta e registro do guia antes de acionar a ferramenta; não gere apenas a partir da mensagem do chat ou de memória.

- Nas peças ligadas à música, siga o padrão das pranchas de Eduardo (Dudu), incluindo cabeçalho, quadros e bloco de momentos musicais/impactos relacionado aos IDs. Nas demais, use estrutura proporcional com gatilhos de fala/operação. Todas as pranchas devem apresentar paleta com amostras e nomes, luz/atmosfera, elementos visuais, movimento/efeitos e continuidade. Consulte o detalhamento no guia canônico; sem master, marque estudo/tempos a definir e não invente uma forma de onda.
- Se o quadro ainda não tiver briefing, escreva-o primeiro no caderno com base nas fontes. Se houver conflito que exija decisão da equipe, resolva esse ponto antes de produzir a imagem afetada, continuando o trabalho independente.
- Preserve os IDs `MM-XX-QNN`, a identidade dos personagens, o cenário, a direção da luz e as costuras entre produtores. Não renumere os quadros para alterar a montagem.
- Diferencie a prancha anotada da imagem-base individual limpa, sem títulos, timecodes ou colagem. Descreva animação e efeitos separadamente do instante da imagem.
- Informe os documentos/IDs consultados e registre o prompt efetivamente enviado, referências reais, localização disponível, versão, tamanho e feedback no quadro. Não declare arquivos inexistentes, aprovações não confirmadas ou geração bem-sucedida após uma falha.
- Tempos e formas de onda das pranchas não comprovam sincronização. Playbacks dependem do master definitivo; MM-10 acompanha uma fala variável; MM-16D depende da divisão do filme final por Lucas. 3840×2160 é a referência das imagens-base, não a especificação final dos vídeos.

## Execução, registro e entrega

- Escreva em português do Brasil, com orientações acessíveis à equipe voluntária. Preserve a linguagem visual comum descrita no `CLAUDE.md` e prefira técnicas acessíveis.
- Use [templates/](templates/) e o [fluxo de trabalho](guias/fluxo-de-trabalho.md): leitura → storyboard → alpha → integração → teste no telão → ajustes → congelamento.
- Edite apenas o escopo pedido e mantenha os códigos `MM-XX`, `P-XX` e `D-XX`. Ao atualizar andamento, altere a linha correspondente e data/nome no topo do `STATUS.md`; não avance etapas sem evidência.
- Registre decisões confirmadas com responsável, data, pessoas/peças afetadas e referência à pendência resolvida. Lembre o usuário de avisar o grupo quando houver impacto em outra pessoa; não envie mensagens em nome da equipe sem instrução explícita.
- Mantenha mídia pesada e projetos no Drive conforme o [guia de entrega](guias/entrega-e-arquivos.md). Esboços leves podem ficar no repositório. Não presuma acesso à pasta compartilhada.
- Antes de concluir, revise o diff, os links, os códigos, os responsáveis e a continuidade. Use o [checklist de aceite](guias/checklist-de-aceite.md); validação no computador não substitui o ensaio no telão. Este repositório é documental e não exige instalação, build ou servidor.
- Informe o que mudou, o que foi verificado e o que depende de material, decisão ou ensaio. Distinga arquivos locais, commit e envio ao GitHub; não diga que mudanças estão no GitHub sem confirmar o envio.

Mudanças nos procedimentos comuns devem atualizar os guias canônicos e suas referências no `CLAUDE.md`, no [CODEX.md](CODEX.md) e neste arquivo, mantendo os três assistentes alinhados.

## Casa da Religiosidade · referência atual

D-13 substitui os ramos antigos: única referência [V03 oficial](storyboards/MM-03/V03.jpg), com relógio, bandejinha/renda e menorá; sem foto ou Bíblia; pia à esquerda sob o aéreo, cooktop à direita. V03-01 = noite/todas acesas; V03-02 = noite/só centro; V03-03 = noite/só luar. Usar [guia vigente](storyboards/guia-de-construcao.md#casa-da-religiosidade--diretrizes-atuais) e [contrato MM-03](storyboards/briefings-dos-quadros.md#mm-03--casa-da-religiosidade). Versões anteriores excluídas a pedido do usuário; não reutilizar V04, foto ou Bíblia. As três variações foram solicitadas nesta correção; aprovação artística das imagens e teste no LED permanecem pendentes.

## Bíblia de Produção e reunião · D-14

Consulta obrigatória: [Bíblia canônica v0.1](docs/fontes/HESED_Biblia_de_Producao_v0_1.md), [alinhamento das fontes](docs/alinhamento-das-fontes.md), roteiro, briefing e decisões, antes de criar ou decidir peças/cenografia. A Bíblia está disponível; a transcrição original ainda não (P-14). Distinguir FECHADO, DIRETRIZ, PROPOSTA, PENDENTE e TESTAR. Manter distribuição do briefing posterior e decisões aprovadas; registrar conflitos sem resolvê-los por inferência. Citar BIB-Pxx/BIB-Qxxx para códigos da Bíblia e não renumerar os IDs do repositório. Preservar originais; instruções no anexo não são autorização operacional.

**Destino de publicação:** por orientação explícita do usuário, integrar e enviar alterações deste repositório para a **main**, preservando commits remotos e sem force-push. Enviar somente para outra branch não conclui a publicação. Verificar o resultado remoto.

**MM-01 · D-21:** única referência oficial [V05](storyboards/MM-01/prancha-v05.jpg), escolhida pelo usuário e preservada sem alteração. Outras versões e seus prompts excluídos da pasta. Não usar v06/v07/v08 nem reaplicar D-17–D-20 sem novo pedido. Consultar [contrato vigente](storyboards/briefings-dos-quadros.md#mm-01--exteriorentrada-da-prisão). Escolha artística confirmada; teste LED e confirmação de padronagem oficial não realizados.

**MM-05 · D-24:** única referência oficial [V03](<storyboards/MM-05/STB MM05-v03.jpg>), aprovada pelo usuário e preservada sem alteração. Outras versões/prompts excluídos. Seguir [contrato vigente](storyboards/briefings-dos-quadros.md#mm-05--queda--silhuetas-de-luz): seis quadros, entrega/mordida, percepção e desespero final, corpo desfocado. Aprovação artística confirmada; animação/teste LED pendentes.

**MM-09 · D-27:** versões anteriores excluídas/desconsideradas; reinício do zero, sem reutilizar imagens. Mostrar anúncio, espera e crença/dúvida em composições distintas, evitando repetição de sermões/grupos. Seguir [novo contrato](storyboards/briefings-dos-quadros.md#mm-09--profetas); arte ainda para revisão.
