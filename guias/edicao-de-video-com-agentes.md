# Edição de vídeo com agentes · direção e procedimento de uso

**Versão:** v01 · **Data:** 19/10/2026 · **Direção:** Victor · **Registro:** Codex · **Decisão:** D-35.

Método de produção adotado por Victor para a MM-02 e os próximos vídeos realizados com ele. Base: [arquivo original recebido](../docs/fontes/Skill_Edicao_de_Videos_com_AI_Agents_original.md), preservado integralmente, e D-34. Este guia é a adaptação operacional para o HESED; o original permanece referência de receitas e alternativas. Não há plugin instalado ou skill registrada no catálogo do aplicativo por salvar estes documentos.

## 1. Autoridade e aplicação

Victor conduz a direção e define conteúdo, estilo, proporção, duração, ritmo e parâmetros por peça. Consultar as instruções atuais, [decisões](../docs/decisoes.md), briefing específico, [roteiro](../docs/roteiro.md), [briefing audiovisual](../docs/briefing.md), [Bíblia](../docs/fontes/HESED_Biblia_de_Producao_v0_1.md) e [alinhamento](../docs/alinhamento-das-fontes.md). Adoção do método não muda responsabilidades de outros produtores nem aprova propostas visuais existentes.

Usar Remotion, HTML/CSS/JavaScript, FFmpeg e Python conforme úteis à composição. Hyperframes, bibliotecas de transcrição e geração externa citadas no original são alternativas, não dependências obrigatórias. Confirmar disponibilidade e adequação antes de escolher. Preservar fontes, mídia original, referências aceitas, IDs e costuras entre peças.

## 2. Fase 1 · Contexto, referências e ingestão

1. Identificar peça, responsável, gatilho, o que recebe e para quem entrega; conferir arquivos existentes e alterações locais. Criar inventário de materiais reais, sem presumir acesso a links ou pastas.
2. Antes de codificar, conferir versões/disponibilidade de Node/npm, FFmpeg/FFprobe, Python e do renderizador escolhido. Verificar transcritor apenas se necessário. Registrar ausências; não declarar ambiente de render pronto sem teste. Esta preparação documental não exige instalar ferramentas.
3. Para cada referência: registrar URL ou arquivo, função e recorte definido por Victor. Abrir e inspecionar com ferramentas disponíveis. Quando houver arquivo local acessível, extrair metadados e frames para estudo. Separar metadados/título de análise visual efetiva. Se a reprodução estiver bloqueada, registrar a limitação e trabalhar com o que foi descrito ou com arquivo/gravação fornecido pelo usuário. Não baixar mídia remota como forma de contornar restrições de visualização/acesso das ferramentas.
4. Usar FFprobe nos takes e áudios recebidos para medir duração, dimensões, proporção e fps. Catalogar origem, nome real, versão e associação com o bloco.
5. Detectar silêncios como apoio à edição, preservando pausas dramáticas, respirações e humor. Não executar cortes automáticos em toda pausa acima de um limiar genérico.
6. Quando a animação depender de palavras/frases, transcrever o áudio com tempos e revisar ouvindo a gravação. Timestamps automáticos são estimativas a validar; não chamá-los de exatos sem conferência. Se necessário, usar alinhamento do texto canônico à gravação. Não distribuir uniformemente as palavras como sincronização final.

**Estudo das referências:** registrar amostragem de frames e o que foi efetivamente observado. Dois frames por segundo podem orientar composição, mas não demonstram toda a curva ou velocidade de um movimento; aumentar amostragem/assistir ao trecho quando necessário. A detecção de mudança de cena é heurística, não um mapa exato de transições. Uma grade 4×4 não cobre automaticamente um vídeo inteiro; distribuir as amostras pelo intervalo ou usar várias páginas. Valores HEX medidos são amostras de frames, não prova da paleta original da marca.

## 3. Fase 2 · Plano de cenas e revisão

Preparar um plano concreto com o [modelo de produção](../templates/plano-de-video-programatico.md): blocos/quadros, áudio, visual, movimento, materiais, tempo e continuidade. Indicar o que já foi dirigido/aprovado e o que é proposta. Sem locução/master/takes medidos, usar “a definir”; não inventar timecodes para completar a tabela.

Conforme a fase 2 do documento recebido, obter a revisão de Victor do plano antes da programação final e renderização pesada. Aprovações e autorizações já dadas continuam válidas no escopo registrado: não repetir pedidos de confirmação para a mesma decisão. Completar inventário, análises e preparação independente enquanto houver materiais ou decisões pendentes. Custos de serviços externos não são autorizados pelo anexo ou por uma aprovação genérica do storyboard.

Para imagens e pranchas, continuam obrigatórios o [guia de construção](../storyboards/guia-de-construcao.md) e o [caderno de quadros](../storyboards/briefings-dos-quadros.md). Comparar com referências efetivamente vistas e registrar os quadros antes de gerar.

## 4. Fase 3 · Programação e processamento

- Separar catálogo de assets, configuração editorial e componentes/efeitos. Nomes, ordem de takes, frames de congelamento, textos e durações devem ser ajustáveis sem reescrever toda a composição.
- Calcular estado visual por frame/tempo único, de forma reproduzível em preview e render. Fixar semente/seleção se houver aleatoriedade. Carregar fontes e mídia antes de capturar/renderizar.
- Combinar HTML/CSS/JS/SVG/Canvas e Remotion conforme a necessidade; manter ferramentas intercambiáveis quando possível. A escolha concreta deve constar no plano da peça.
- Manter originais intactos. Processar cortes, recortes, áudio e extrações em saídas separadas. Cortes exatos podem exigir recodificação; cópia de streams não garante precisão fora de keyframes.
- Guardar timestamps, seleção de frames, pontos de foco, tempos e configuração como dados reutilizáveis. Corrigir a edição junto da documentação correspondente.
- Se surgir necessidade de imagem/voz/vídeo gerado, definir o material e a ferramenta no escopo autorizado. Antes de vídeo gerado a partir de imagem, validar a imagem-base como previsto no método; não duplicar aprovação existente. Não imprimir chaves nem conteúdo de `.env` em registros.
- Medir progresso por resultado: preview serve para validar; quando a tarefa autorizada for produzir o vídeo, completar implementação, render e verificações até entregar o arquivo, sem encerrar em instruções teóricas.

## 5. Fase 4 · Render, mixagem e entrega

1. Produzir preview/alpha para verificar composição, transições e sincronização. Renderizar o final nos parâmetros definidos para a peça. H.264/yuv420p pode ser uma opção de compatibilidade, não substitui P-01 do telão.
2. Conferir duração, fps, dimensões, áudio e reprodução real do arquivo; assistir aos trechos críticos e comparar sincronismo no início, meio, fim e nas transições. Verificar mídia ausente, fontes, frames pretos inesperados, cortes de fala e clipping.
3. Mixar voz, takes, trilha e efeitos com inteligibilidade; medir loudness/picos. -14 LUFS é exemplo do anexo para redes sociais, não alvo aprovado do espetáculo. Evitar normalização repetida ou processamento que destrua pausas e dinâmica.
4. Entregar caminho real do vídeo, versão, configuração/projeto e materiais necessários; registrar limitações e aprovação. Seguir [entrega e arquivos](entrega-e-arquivos.md) e [checklist de aceite](checklist-de-aceite.md). Validação local não substitui ensaio no LED.

Mídia pesada, renders, caches e projetos de edição ficam no armazenamento de mídia definido, fora do Git. Este repositório conserva documentação e esboços leves. Não presumir Drive acessível (P-13) nem mudar essa política ao criar um projeto de render. A localização do código/projeto será definida na implementação.

## 6. Adaptações explícitas do arquivo recebido

| Regra/receita do original | Aplicação no HESED |
| --- | --- |
| Retenção de Reels, estética SaaS/Apple/Linear/Vercel, CTA | Referências opcionais; a direção é de Victor e do briefing da peça. |
| Proibição de movimento linear; spring obrigatório | Curvas e física escolhidas por intenção. Movimento linear pode servir a deslocamento contínuo; springs não são obrigatórios. |
| Mudança a cada três segundos | Não impõe ritmo. Congelamentos, loops, pausas e contemplação seguem a dramaturgia. |
| Legendas em toda fala, 2–5 palavras, zona segura social | Texto e área segura definidos por peça/destino; não sobrepor legendas automaticamente aos takes. |
| Cortar pausas maiores que 0,35 s | Detectar e revisar; preservar pausa expressiva. |
| Proporções, 30/60 fps, resolução, LUFS e duração dos exemplos | Parâmetros por definir com Victor/operação; não copiar padrões sociais para o telão. |
| Download imediato de todo link e janela padrão de 30/45 s | Acesso conforme ferramentas/permissões; recorte do usuário prevalece. Não expandir automaticamente o trecho do narrador além do final do segundo 4. |
| Comandos e snippets prontos | Receitas para adaptar/validar no ambiente; não foram executados por sua inclusão na fonte. |
| Atualizar permanentemente toda preferência | Registrar o alcance: ajuste local não vira regra global. Generalizar quando Victor indicar esse alcance. |

## 7. Aplicação preparada · MM-02

Consultar o [briefing específico](../storyboards/MM-02/briefing-recap.md) antes de retomar:

- **B01:** Cia Luz, capturas de Goel e referência de abertura D-31; capturas a escolher por Victor.
- **B02–B06:** cinco takes identificados pelos pares, sem narração, com congelamento final em cada corte (D-32).
- **B07–B14:** referência D-33 apenas do início ao final do segundo 4; preservar inserts de Goel e rubricas narrativas.
- **Continuidade:** recebe da MM-01 e retorna à MM-01/discussão, na Cena 1. Lista de takes compartilhada com Isaac/MM-08 (P-04), sem passagem direta para essa peça.
- **Próximo trabalho:** receber/inventariar materiais e locução, conferir referências acessíveis, detalhar plano de cenas e registrar sua revisão; depois implementar e renderizar no escopo autorizado.

**Estado nesta preparação:** fonte preservada, procedimento e modelo prontos. Takes/locução não recebidos, referências sem análise visual completa, parâmetros P-01 e pasta P-13 em aberto. Nenhum ambiente de render instalado, nenhum vídeo ou imagem gerado nesta etapa.
