# Marcadores · Cena 6 · MM-12 · Plano-sequência 2.5D v05

**Conforme D-60 e `guias/timecodes-e-operacao.md`.**  
Configuração de montagem da composição `hesed-mm12-cena06-v05` (1920 × 1080 progressivo, 30 fps, **01:52.000 / 3.360 quadros**, sem faixa de áudio).  
**Atenção operacional:** os tempos abaixo são offsets de revisão em plano-sequência contínuo; não substituem a deixa real das falas ao vivo em ensaio. Após a exportação do MP4 final, conferir os tempos quadro a quadro via `ffprobe`.

| Tipo | Timecode | Quadro (30 fps) | Evento / Quadro | Modo visual atual | Deixa real de palco / observação |
| --- | ---: | ---: | --- | --- | --- |
| INÍCIO | `00:00:00.000` | 0 | `MM12-Q01` · O caminho | **2.5D real (4 camadas)** | Recebe último céu de Isaac (Cena 5 · *Ó Noite Santa*); entra em “Naquela época, foi decretado…”. |
| SINCRONISMO 01 | `00:00:15.000` | 450 | `MM12-Q02` · Belém ao longe | Base v05 *(auto-upgrade p/ 4 camadas RGBA)* | “José, que era noivo de Maria, precisou ir até Belém…”. Transição por passagem de primeiro plano a partir de `00:00:13.100`. |
| SINCRONISMO 02 | `00:00:29.000` | 870 | `MM12-Q07` · Entrada de Belém *(ponte)* | Base v05 *(auto-upgrade p/ 4 camadas RGBA)* | Ponte de aproximação da estrada até as primeiras casas de pedra ao fim de tarde. |
| SINCRONISMO 03 | `00:00:41.000` | 1230 | `MM12-Q03` · A chegada (crepúsculo) | Base v05 *(auto-upgrade p/ 4 camadas pareadas)* | “E quando eles chegaram lá…”. |
| SINCRONISMO 04 | `00:00:51.000` | 1530 | Início do anoitecer contínuo `Q03 → Q04` | Relighting 1:1 contínuo (sem corte) | Transição de luz do crepúsculo para azul-noturno sobre a mesma arquitetura até `00:00:58.000`. |
| SINCRONISMO 05 | `00:00:58.000` | 1740 | `MM12-Q04` · A noite plena | Base v05 *(auto-upgrade p/ 4 camadas pareadas)* | Mesma rua sob noite plena e lamparinas âmbar. |
| SINCRONISMO 06 | `00:01:07.000` | 2010 | `MM12-Q05` · Sem acolhimento | Base v05 *(auto-upgrade p/ 4 camadas RGBA)* | “…não tinha lugar pra ficar. Nenhuma hospedagem disponível.” |
| SINCRONISMO 07 | `00:01:21.000` | 2430 | `MM12-Q08` · Saída para os arredores *(ponte)* | Base v05 *(auto-upgrade p/ 4 camadas RGBA)* | Saída da viela deixando Belém ao fundo rumo ao campo noturno. |
| SINCRONISMO 08 | `00:01:34.000` | 2820 | `MM12-Q06` · Um abrigo simples | **2.5D real (5 camadas)** | “…onde os animais ficavam.” / “Sim. E foi ali que Jesus nasceu.” Chegada em desaceleração 2.5D. |
| SINCRONISMO 09 | `00:01:44.000` | 3120 | `MM12-Q06` · **Repouso neutro 1,00** | **2.5D real travado (`1,00 / 0,0`)** | Todas as 5 camadas estabilizam em escala `1,00` e posição neutra para abrir a Cena 7 sem salto. |
| SAÍDA | `00:01:52.000` | 3360 | Entrega para Cena 7 (hold contínuo) | Hold estável `MM12-Q06` | Manter `MM12-Q06` vazio na abertura da Cena 7 e na primeira menção a um anjo; chamar `MM13-Q06 v09` somente em “uma multidão de anjos apareceu” (D-61). |

## Pendências registradas
- Camadas RGBA 2.5D de `Q02` (L02–L04), `Q07`, `Q03/Q04`, `Q05` e `Q08`: prontas para recriação no Codex; ao salvar em `entregas/MM12/pacote-2p5d-v05/recriacao-por-camadas/layers-v05/` e rodar `preparar.ps1`, a composição ativa automaticamente o modo 2.5D real em todos os quadros.
- Conferência de entrada com o último céu de Isaac (Cena 5 · `MM-13`).
- Ajuste final de tempos/pausas operacionais em ensaio de palco (P-12) e homologação técnica no painel LED (P-01).
