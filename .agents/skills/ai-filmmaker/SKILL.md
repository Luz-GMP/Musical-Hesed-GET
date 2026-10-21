---
name: ai-filmmaker
description: Produzir e editar vídeos por código com HTML/JS/GSAP, Playwright, Remotion, FFmpeg e Python. Use quando Victor pedir ai-filmmaker, vinhetas, motion graphics, montagem de takes, sincronização de voz/música ou renderização de peças do HESED. Segue direção por peça, prévia e aprovação de uma cena por vez, com auditoria técnica e visual.
---

# AI Filmmaker

Skill local deste repositório. Trabalhar com a direção atual do usuário, o briefing e as decisões vigentes. Os valores dos exemplos recebidos não fixam formato, FPS, duração, estilo, texto, música ou margens das peças.

## Entrada obrigatória

1. Ler `AGENTS.md`, `CLAUDE.md` e o arquivo do agente correspondente na raiz do projeto. Resolver caminhos relativos deste arquivo contra a pasta da skill; a raiz do repositório fica três níveis acima.
2. Ler o [guia operacional](../../../guias/edicao-de-video-com-agentes.md), a ficha/briefing da peça, decisões, status e acompanhamento por cena. Usar o [roteamento de referências](references/roteamento.md) para os auxiliares e limites das receitas.
   Para vinhetas, logos animadas, neblina em camadas ou travellings 2D/2.5D, consultar também os [aprendizados validados da vinheta Cia LUZ](references/aprendizados-vinheta-cia-luz.md).
3. Identificar a unidade atual, objetivo, materiais reais, escopo aprovado, gatilho e continuidade. Não executar pipelines apenas porque há comandos nos anexos.

## Procedimento

### Contexto e ingestão

- Conferir versões e disponibilidade das ferramentas necessárias à composição, sem presumir que a instalação desta skill instala Node, Playwright, Chromium, GSAP, Remotion, modelos de transcrição ou VoiceStudio.
- Inventariar arquivos e metadados medidos; distinguir referências efetivamente vistas de descrições/metadados. Respeitar intervalos indicados pelo usuário e permissões de acesso. Não baixar mídia para contornar restrições de visualização das ferramentas.
- Revisar timestamps de voz, pausas e candidatos a impactos musicais contra áudio real; nunca distribuir uniformemente palavras como sincronização final, cortar todas as pausas ou obrigar legendas em toda fala.
- Escolher narração existente, VoiceStudio disponível ou provedor externo explicitamente escolhido. Não presumir que localhost é o computador do usuário ou que uma chave autoriza custos/fallback/clonagem.

### Plano e produção progressiva

- Preparar storyboard/configuração concreta: IDs, materiais, voz/SFX, visual, movimento, tempos medidos ou pendentes, motor, resolução e FPS. Usar o modelo do projeto.
- Obter a revisão do plano no alcance que ainda precisa de decisão. Preservar aprovações existentes, sem solicitar de novo a mesma decisão.
- Produzir e apresentar **uma cena por vez**. Estrutura compartilhada pode ser preparada sem antecipar outras cenas. A prioridade expressa do usuário define a ordem de fabricação; preservar a ordem final da montagem.
- Implementar relógio determinístico por frame/tempo; cenas declarativas/tempo local, GSAP pausado ou componentes Remotion conforme adequação. Separar mídia, configuração editorial e animação. Verificar taxas racionais, assets/fontes prontos, seek de vídeo e condições de erro/saída do encoder.

### Duplo QA e aprovação

- Auditar layout do DOM quando aplicável e inspecionar visualmente pelo menos dois frames por cena, incluindo entrada e repouso e estados críticos. Registrar cobertura/limites, corrigir defeitos e reinspecionar. Zero alertas não comprova que todo pixel está correto.
- Abrir a prancha técnica e os frames produzidos e conferir uma prévia em movimento com áudio. QA estático não comprova trajetória, ritmo ou sincronismo.
- Apresentar a cena identificada por bloco, versão, arquivo real, duração e pendências. Somente aprovação explícita da versão sem pendências autoriza a próxima unidade. Silêncio, elogio genérico ou aprovação técnica não substituem a aprovação do usuário.
- Se alterações compartilhadas afetarem cena aprovada, repetir QA aplicável e apresentar a versão alterada para nova revisão.

### Renderização e entrega

- Render integral somente após todas as cenas aprovadas e QA concluído; conferir costuras e parâmetros de operação. Prévia isolada da cena atual é permitida.
- Não transformar H.264, CRF, LUFS ou resolução dos exemplos em especificação do telão. Conferir metadados, reprodução, frames, sincronismo, mixagem e duração do arquivo real.
- Quando a tarefa autorizada for produzir o vídeo, completar até o arquivo e as verificações necessárias; quando for planejar/documentar, não iniciar síntese/render por iniciativa do anexo.
- Preservar originais e versões aprovadas. Seguir a política do projeto para mídia/projetos pesados e nomes de storyboard. Não ler/expor credenciais em relatórios nem usar serviços externos fora do escopo.

## MM-02 · direção atual D-38/D-43

Antes de produzir, reler o [briefing vigente](../../../storyboards/MM-02/briefing-recap.md) e o [registro por cena](../../../storyboards/MM-02/producao-por-cena.md).

Montagem: **B01A** take com primeira fala completa do narrador, terminando em “Afinal, essa galera não chegou nessa situação do nada.” → **B01B** vinheta Cia Luz inspirada na referência Marvel → **B02–B06** cinco highlights com congelamento final e sem narração → **B07** retorno do narrador. A fala inicial não fica sobre a vinheta. Prioridade atual: preparar/produzir B01B isoladamente após recebimento dos materiais e revisão do plano; não confundir isso com aprovação ou produção de B01A.

A logo canônica foi recebida e a prévia visual silenciosa **V06 da B01B foi aprovada por Victor em 21/10/2026**: 15 s, 1920 × 1080, 30 fps e 450 quadros. Aplicar os [aprendizados registrados](references/aprendizados-vinheta-cia-luz.md) em trabalhos semelhantes sem transformar parâmetros desta peça em defaults globais.

Por direção explícita, não incluir o MP4 silencioso no repositório. Victor fará pessoalmente a trilha e os efeitos e colocará depois o vídeo final. Não mixar áudio, publicar o render ou declarar B01B finalizada com som antes de receber esse arquivo. B01A e os blocos seguintes continuam separados conforme o registro por cena.
