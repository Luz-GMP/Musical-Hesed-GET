# AI Filmmaker Agent · pacote recebido em 20/10/2026

Sete anexos fornecidos por Victor para atualizar o fluxo e publicar a documentação na main (D-37). Arquivos originais preservados sem alterar nomes, bytes ou links relativos. Não se presume acesso à pasta Windows nem conteúdo além destes anexos. Autoria, versão interna e data de criação não declaradas; a data da pasta identifica o recebimento.

**Uso:** consultar o [guia operacional v03](../../../guias/edicao-de-video-com-agentes.md) e a [revisão dos arquivos](../../../guias/revisao-ai-filmmaker-2026-10-20.md). A fonte orienta o método junto da direção de Victor/D-34; exemplos técnicos/estéticos não substituem parâmetros aprovados por peça. Salvar o pacote não instala plugin, dependência ou skill no aplicativo.

| Anexo | Conteúdo | Verificação sem execução |
| --- | --- | --- |
| [mkdir -p .ref'frames.sh](<mkdir -p .ref'frames.sh>) | Receitas de análise de referência | Sintaxe Bash validada com bash -n; comandos não executados. |
| [Gerador de Efeitos Sonoros Procedurais + Detector de Batidas Musicais (Beat Tracking) em Python.py](<Gerador de Efeitos Sonoros Procedurais + Detector de Batidas Musicais (Beat Tracking) em Python.py>) | SFX procedurais e candidatos a onsets musicais | Sintaxe Python validada via AST, sem importar/executar. |
| [Narração com Voz Clonada (ElevenLabs API) + Sincronização Automática.sh](<Narração com Voz Clonada (ElevenLabs API) + Sincronização Automática.sh>) | Narração por VoiceStudio/ElevenLabs/arquivo | Sintaxe Bash validada com bash -n; comandos não executados. |
| [Skill Edição de Videos com AI Agents.md](<Skill Edição de Videos com AI Agents.md>) | Direção principal e template HTML/GSAP | Inspeção textual; não executado. |
| [Suporte a Qualquer FPS + Auditor Matemático de DOM + Prancha de Storyboard.js](<Suporte a Qualquer FPS + Auditor Matemático de DOM + Prancha de Storyboard.js>) | Renderizador JS, auditor DOM e prancha de QA | Sintaxe ESM validada com node --check em cópia .mjs; código não executado. |
| [Extração de Timestamps Palavra por Palavra (Python + Faster-Whisper).py](<Extração de Timestamps Palavra por Palavra (Python + Faster-Whisper).py>) | Transcrição com timestamps | Sintaxe Python validada via AST, sem importar/executar. |
| [ffmpeg -y -i video_visual.mp4 -i narracao.mp3 -i sfx_track.wav](<ffmpeg -y -i video_visual.mp4 -i narracao.mp3 -i sfx_track.wav>) | Receita de mixagem | Sintaxe Bash validada com bash -n; comandos não executados. |

O [manifesto de integridade](manifesto.json) registra SHA-256 e tamanho de cada fonte. A revisão cobre limitações e adaptações; validação sintática não comprova execução correta. Nenhum script foi executado como pipeline, nenhuma API acionada e nenhum render produzido na incorporação. Versões anteriores continuam em docs/fontes.
