# MM-02 · Plano de preparação — B01B, vinheta Cia Luz

**Data:** 21/10/2026 · **Direção:** Victor · **Base:** D-38 e [briefing v10, §4.1](briefing-recap.md).<br>
**Estado:** prévia visual silenciosa V06 aprovada por Victor em 21/10/2026 (D-43); trilha e SFX serão inseridos pessoalmente por Victor.

## Entrada e saída definidas

- **Recebe de B01A:** primeira fala completa do narrador já encerrada em “Afinal, essa galera não chegou nessa situação do nada.”
- **Conteúdo:** vinheta inspirada na abertura Marvel com logo Cia Luz e capturas de Goel.
- **Entrega para B02:** highlight Mentira e roubo, seguido pelos outros quatro cortes e, em B07, retorno do narrador.
- **Primeira locução:** pertence a B01A; não acompanha esta vinheta.
- **Produção atual:** B01B isolado, sem exigir a conclusão de B01A para começar seu planejamento. Integração final dependerá da conferência das duas passagens.

## Referência e materiais

| Material | Evidência atual | Próxima ação |
| --- | --- | --- |
| [Referência Marvel no YouTube](https://www.youtube.com/watch?v=4Xr7PkHjD8A&list=PLr_UAhQSlwSXsb4bqnttfjZoVQxxGI8Li&index=115) | Link já recebido; sem análise visual completa | Inspecionar por meio acessível, registrar os efeitos observados; não presumir movimentos pelo título. |
| [Logo canônica Cia LUZ](../../assets/identidade/CIA-LUZ-LOGO-CANONICA.png) | Recebida de Victor; PNG RGBA transparente, 2048 × 768 px, metal escuro com contornos vermelho/laranja | Usar a própria imagem como camada raster. Não recriar a grafia com fonte nem reutilizar propostas visuais anteriores. |
| Capturas Goel | A enviar/selecionar | Catalogar candidatos e escolha de Victor, sem quantidade arbitrária. |
| Som da vinheta | Sob controle de Victor | Victor fará pessoalmente a inserção da trilha e dos efeitos; não mixar ou publicar por iniciativa do agente. |

## Configuração para o storyboard

| Item | Estado |
| --- | --- |
| Duração | 15 s na V06 visual aprovada; não é a duração da primeira locução. |
| Proporção / resolução / FPS / codec | 1920 × 1080, 16:9, 30 fps, H.264/yuv420p na prévia; P-01 continua aberta para o master do telão. |
| Motor | Curvas com Remotion 4.0.537; composição Pillow e codificação FFmpeg. |
| Movimento | Fade-in; logo canônica reduz continuamente até o repouso; impacto dispara luzes alternadas; travelling atravessa o plano da logo e aproxima a penitenciária. |
| Paleta / luz / elementos | Madrugada azul, luzes quentes vermelho/laranja e neblina em seis planos independentes sobre panoramas canônicos da prisão. |
| IDs de quadros | A registrar no caderno ao definir o storyboard; B01B não é ID de imagem. |

## Revisão e execução seguinte

A composição visual V06 passou por inspeção de quadros, reprodução codificada e validação de metadados. A aprovação de Victor cobre o visual silencioso; áudio, costuras com B01A/B02 e teste no telão continuam pendentes. O MP4 não deve ser adicionado ao repositório nesta etapa. Consultar o [acompanhamento por cena](producao-por-cena.md) e os [aprendizados registrados na skill](../../.agents/skills/ai-filmmaker/references/aprendizados-vinheta-cia-luz.md).

A skill local [ai-filmmaker](../../.agents/skills/ai-filmmaker/SKILL.md) está instalada neste projeto (D-39); usar `$ai-filmmaker` ou a entrada direta em AGENTS.md. Fontes/auxiliares continuam no repositório. O catálogo da sessão pode precisar de atualização; instalação da skill não inicia a produção nem instala ferramentas de render.
