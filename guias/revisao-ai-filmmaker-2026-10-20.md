# AI Filmmaker Agent · revisão dos sete arquivos recebidos

**Recebimento e revisão:** 20/10/2026 · Codex, a pedido de Victor · **Decisão:** D-37.

## Origem e incorporação

Victor solicitou comparar a versão atualizada, implementar as orientações no fluxo documental, fazer commit e push na main. Os sete anexos foram lidos integralmente e preservados byte a byte em [fontes](../docs/fontes/AI_Filmmaker_Agent_2026-10-20/README.md); [manifesto](../docs/fontes/AI_Filmmaker_Agent_2026-10-20/manifesto.json) registra tamanho, hash e verificação de cada arquivo. A pasta Windows citada não foi acessada: este registro refere-se aos anexos recebidos, sem presumir que representam todos os arquivos existentes nela.

A fonte vigente é o novo MD e seus seis auxiliares. As duas versões anteriores continuam preservadas. Comandos de exemplo são conteúdo do anexo, não autorização para executar redes, instalações, síntese ou render nesta tarefa.

## Mudanças em relação à atualização D-36

| Novidade | Aplicação preparada no fluxo |
| --- | --- |
| Aprovação progressiva | Storyboard/configuração autorizam a primeira cena; produzir e apresentar uma cena por vez, com versão, áudio e movimento. Só avançar após aprovação explícita sem pendências. |
| GSAP e cenas declarativas | Motor HTML pode usar GSAP pausado e adaptador `renderAtTime(t)`; intervalos e tempo local declarados, cenas inativas isoladas. Remotion continua alternativa complementar. |
| Auditor DOM + inspeção visual | Conferir bounds, overflow e colisões como apoio; capturar dois estados por cena e montar prancha técnica; abrir as imagens e assistir à prévia. |
| Anti-bugs de composição | Evitar disputa de `transform`, esperar fontes/decodificação, desativar filtros de cenas inativas e conferir movimento real. |
| Picos musicais | Gerar candidatos a impactos em JSON, conferir ouvindo o master e registrar quais eventos dirigirão a animação. Não impor música à MM-02. |
| VoiceStudio / ElevenLabs / arquivo | Selecionar provedor e perfil explicitamente; preferir avaliar a instalação VoiceStudio existente, sem presumir acesso local ou API compatível. Sem fallback externo silencioso. |
| Preservação de aprovação | Mudanças em componentes compartilhados exigem QA das cenas afetadas e nova aprovação das versões perceptivelmente alteradas. Render integral só com todas aprovadas. |

## Inspeção dos arquivos e limites das receitas

### 1. MD principal e template HTML/GSAP

O MD recebido termina no template HTML da seção 6.1. Partes de render, áudio, transcrição, referência e mixagem foram recebidas como arquivos separados; não presumir seções adicionais ausentes. O link relativo para a receita de narração foi preservado junto do arquivo real.

O template contém URLs no formato Markdown dentro dos atributos HTML `href` e `src`; esses atributos devem receber URLs reais ao implementar, ou referências locais versionadas. Caso contrário, fontes/GSAP podem não carregar. A detecção de vídeos ativos por substring `style*="flex"` é frágil: preferir o estado declarativo explícito. Configurar intervalos, gaps e transições deliberadamente; `display:none` é útil para isolar cenas, mas transições que sobrepõem cenas precisam de janela própria. Preservar tempo local, trim e velocidade dos vídeos. Esperar metadados, seek e frame decodificado com tratamento de timeout/erro; não depender apenas de `seeked` nem de uma tolerância fixa de 10 ms para todo FPS.

Separar um wrapper de layout do elemento animado evita disputa de `transform`. A receita de movimento contínuo não deve animar automaticamente os congelamentos da MM-02. Dois frames diferentes ajudam a detectar animação travada, mas não comprovam trajetória, easing ou sincronização; conferir uma prévia reproduzível.

### 2. Renderizador JS e auditor de DOM

A sintaxe foi validada como módulo ESM, sem executar o renderizador ou carregar Playwright. Para uso, definir `.mjs` ou configuração ESM apropriada; o nome recebido `.js` não instala um projeto.

- O arquivo acrescenta espera de fontes, `await renderAtTime`, leitura de `data-start`/`data-duration`, dois checkpoints por cena, relatório DOM e grade de QA. São recursos incorporados ao procedimento.
- O seletor cobre alguns elementos HTML/textuais; não audita todos os pixels de Canvas/SVG, máscaras, filtros, pseudo-elementos, ancestral com opacity/clipping, overflow vertical ou toda sobreposição relevante. Bounds de caixas não provam bounds dos glifos. “Zero alertas” significa apenas ausência de alertas nas verificações e instantes cobertos, nunca layout perfeito.
- Margens verticais/horizontais fixas e tolerância de overlap são exemplos; parametrizar pelo destino/resolução, tratar colisão intencional e registrar exclusões justificadas. Não silenciar um alerta só para obter relatório limpo.
- Validar checkpoints/intervalos, cobertura e lista não vazia. Usar saídas de QA por versão; o `rmSync` do exemplo apaga o diretório existente, o que não deve destruir evidência anterior.
- A montagem da grade silencia erros; uma implementação precisa reportar falha e verificar arquivo gerado. Verificar compatibilidade de glob no FFmpeg/Windows e usar lista explícita quando necessário. Uma prancha de QA não substitui a prancha canônica de storyboard.
- Permanecem as ressalvas D-36: validar argumentos/racionais sem aliases `29.9`/`59`, prontidão de assets/vídeo, backpressure, erros/exit code de FFmpeg, limpeza em falha e metadados reais. As opções de viewport/escala devem ser conferidas com a versão de Playwright escolhida.

### 3. Python · SFX e detector musical

Sintaxe validada por AST, sem importar NumPy ou processar áudio. O arquivo define funções; executá-lo sem chamá-las não gera automaticamente `beats.json` ou áudio.

`extract_music_beats` calcula variações positivas de energia em janelas de 20 ms, com limiar e intervalo mínimo. Detecta candidatos a onsets; não estima sozinho tempo/BPM, compasso, downbeat ou todos os beats. Sustentação, voz e instrumentos podem produzir falsos positivos/negativos. Registrar origem/versão do master, parâmetros, timestamps e seleção revisada pelo ouvido.

A receita usa WAV temporário de nome fixo e não faz limpeza; criar temporários exclusivos e verificar o formato PCM de entrada. Validar áudio vazio/curto, limites de eventos e durations; manter RNG com semente nos sons, headroom e ganho sem depender de hard clipping. Chirps com frequência variável precisam de fase integrada se esse for o som desejado. A taxa de 44100 Hz é exemplo, não especificação de áudio do telão.

### 4. Bash · narração multprovedor

Sintaxe Bash validada com `bash -n`, sem chamar APIs. O script aceita `voicestudio`, `elevenlabs` ou `arquivo`, exige escolha explícita, preserva saída existente, usa temporário/limpeza, não carrega `.env` e não faz fallback automático. Converte a saída para MP3 e informa duração; não cria clones, não transcreve nem ajusta a timeline sozinho.

VoiceStudio: o MD descreve descoberta em `/.well-known/voicestudio-speech`, modelos/vozes e síntese em `/v1/audio/speech`, com raiz exemplificada `http://localhost:3900`. Esses são dados do anexo, **não contrato validado na instalação de Victor**. No ambiente remoto do Codex, `localhost` é o ambiente de execução, não o computador Windows do usuário. Verificar versão, alcance, modelo e perfil antes da integração; se a API não estiver acessível, receber WAV/MP3 exportado pelo aplicativo. Não reinstalar aplicativo ou baixar modelos automaticamente.

ElevenLabs continua opção externa escolhida, com escopo/custo autorizado; chave existente não seleciona provedor. O script pode aguardar até 600 s em chamada externa: na integração, usar execução assíncrona e comunicação de progresso. A validação numérica da duração e pré-checagem do JSON/contrato devem ser reforçadas antes de uso. Não anunciar sincronia palavra a palavra ou labial pela duração total. Avaliar se a conversão MP3 é necessária; preservar WAV de origem para mix de melhor fidelidade.

### 5. Python · transcrição

Sintaxe validada por AST, sem importar o modelo. O snippet usa Faster-Whisper `small`/CPU e arredonda tempos a duas casas. Isso não dá precisão de milissegundo nem alinhamento perfeito: revisar áudio/texto, tratar falta de palavras, timestamps, argumentos e saída existente. Carregar modelo pode baixar arquivos; verificar recursos antes de executar.

### 6. Bash · análise de referência

Sintaxe validada com `bash -n`. Contém placeholders e duas opções alternativas de download, seguidas de FFprobe/extrações. Não executar em sequência sem escolher a operação, arquivo e intervalo reais. Não sobrescrever referências anteriores. Valem os limites de acesso das ferramentas e o recorte de Victor; amostragem 2 fps e grade 4×4 não comprovam toda a animação nem cobertura total.

### 7. Comando de mixagem FFmpeg

Sintaxe de shell validada sem executar. A receita usa `-y`, caminhos fixos, voz e SFX, normalização de -14 LUFS e duração do áudio mais longo. Adaptar saídas versionadas, formato, ganhos, loudness e duração ao projeto. Não descartar o áudio importante do take ao mapear só voz/SFX; evitar cauda de áudio excedendo o vídeo ou final cortado. `-14 LUFS` não é decisão de mixagem do HESED.

## Resultado da preparação

Atualizados o guia operacional v03, modelo de plano, registro progressivo da MM-02, briefing, orientações dos agentes e fontes. Sete anexos conferidos byte a byte; sintaxe dos seis auxiliares validada sem execução. Isso não comprova funcionamento de render/API, qualidade visual ou aprovação artística. Sem instalações, downloads de referência, síntese, leitura de credenciais ou geração de vídeo nesta tarefa.
