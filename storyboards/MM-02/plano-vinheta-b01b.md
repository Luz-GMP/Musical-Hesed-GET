# MM-02 · Plano de preparação — B01B, vinheta Cia Luz

**Data:** 21/10/2026 · **Direção:** Victor · **Base:** D-38 e [briefing v10, §4.1](briefing-recap.md).<br>
**Estado:** preparação para revisão; sem imagem recebida, storyboard visual, código ou render.

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
| Imagem gerada da logo | Victor informou que enviará; arquivo ausente | Conferir identidade, dimensões, fundo e separação possível em camadas. |
| Capturas Goel | A enviar/selecionar | Catalogar candidatos e escolha de Victor, sem quantidade arbitrária. |
| Som da vinheta | Não escolhido | Direção de trilha/SFX; não presumir música da Marvel. |

## Configuração para o storyboard

| Item | Estado |
| --- | --- |
| Duração | Própria da vinheta, a definir; não é a duração da primeira locução. |
| Proporção / resolução / FPS / codec | A definir com direção/operação; P-01 continua aberta. |
| Motor | HTML/JS/GSAP + Playwright/FFmpeg ou Remotion; propor depois de inspecionar imagem/referência. |
| Movimento | Estudo: passar pelo acervo → revelar logo → assentar assinatura → sair para B02; confirmar após análise. |
| Paleta / luz / elementos | A descrever com base na imagem recebida e quadros reais; sem HEX ou acabamento inventados. |
| IDs de quadros | A registrar no caderno ao definir o storyboard; B01B não é ID de imagem. |

## Revisão e execução seguinte

Aplicar o [guia de produção por código](../../guias/edicao-de-video-com-agentes.md) e o [acompanhamento por cena](producao-por-cena.md). Apresentar plano/configuração para revisão no escopo; implementar a unidade atual; realizar auditor DOM e inspeção dos frames de entrada/repouso e momentos críticos; apresentar prévia reproduzível, versionada e com áudio/pendências explícitos. A aprovação da direção deste documento não representa aprovação de uma prévia inexistente.

A skill local [ai-filmmaker](../../.agents/skills/ai-filmmaker/SKILL.md) está instalada neste projeto (D-39); usar `$ai-filmmaker` ou a entrada direta em AGENTS.md. Fontes/auxiliares continuam no repositório. O catálogo da sessão pode precisar de atualização; instalação da skill não inicia a produção nem instala ferramentas de render.
