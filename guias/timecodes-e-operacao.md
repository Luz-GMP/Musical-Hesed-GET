# Marcadores, timecodes e operação de palco

Victor definiu em [D-60](../docs/decisoes.md) que todo vídeo do HESED deve ser editado e entregue com marcadores de operação. O padrão vale para todos os responsáveis, prévias de edição e versões finais, inclusive animações, loops e montagens por código. Consulte primeiro o [roteiro de montagem do telão](cena-a-cena/pdf/HESED-roteiro-de-montagem.pdf) e a [ficha da cena](cena-a-cena/README.md). REAPER, LumiKit SHOW e o caminho até os aparelhos DMX são uma configuração proposta para teste. A escolha do player continua em [P-12](../docs/pendencias.md).

## 1. Deixa do palco e tempo do arquivo

- **Deixa de palco** é a fala, ação ou confirmação que dá o GO. O operador prepara o arquivo antes e aperta GO quando a deixa acontece. Registre também o que fica no telão enquanto ele espera.
- **Tempo no MP4** é a posição de um evento programado dentro do vídeo. Conte desde o primeiro quadro do arquivo entregue. A entrada do arquivo é `00:00:00.000`. Use `HH:MM:SS.mmm` na ficha. Quando o editor mostrar quadros no último campo, use o FPS do projeto para converter ou confira o tempo direto no MP4.
- **Timecode da operação** é a posição recebida pelo software de luz durante o playback. Com MIDI Timecode (MTC), o REAPER informa a posição. Uma mensagem MIDI ID pode selecionar a Timeline ou Lista de cenas correspondente no LumiKit. A operação confere a correspondência entre o tempo relativo do MP4 e o relógio usado na sessão.

Se o elenco ou a música ao vivo controlar a duração, programe a mudança na deixa real. Um loop ou still sustenta a imagem durante a espera. Mudanças determinadas pelo master de playback podem seguir tempos fixos.

## 2. O que marcar na edição

1. **Antes do primeiro corte**, anote código da peça, versão de vídeo, versão do master, deixa de entrada, imagem de espera e saída prevista. Planeje as mudanças de luz e telão que a operação precisa reproduzir. Use `a definir` onde faltar material ou decisão.
2. **Na sequência ou composição final**, coloque `INÍCIO` no primeiro quadro útil do export e `SAÍDA` no quadro que sinaliza a passagem. Se a saída depende do elenco ou do fim do arquivo, registre também esse sinal na ficha. Acrescente marcadores nos eventos que pedem sincronismo, como primeira batida, virada, refrão, mudança de luz, começo de fade, corte para preto ou retomada de imagem. Descreva a ação em cada nome, por exemplo `LUZ — Acender luzes de Natal` ou `TELÃO — Entrar preto`. Um vídeo sem mudanças internas continua com início e saída.
3. **Ao renderizar**, confira a posição de cada marcador no MP4 da versão entregue. Revise o recorte de exportação, primeiro e último quadro, mudanças de áudio, fades e duração. Ao juntar blocos, converta os tempos locais para a montagem final. Se mudar corte, silêncio, áudio, FPS ou timing, atualize os marcadores e a ficha da nova versão.
4. **Ao entregar**, envie o MP4 em 1920×1080 progressivo no FPS aprovado, o editável ou configuração da montagem, e a tabela de marcadores junto ao arquivo. O responsável da cena entrega diretamente à operação. Use o [modelo de ficha](../templates/ficha-de-peca.md), inclusive quando o renderer ou o MP4 oferecer metadados. Marcadores de edição são referência para a programação da operação.

### Como inserir os marcadores

Posicione o indicador de reprodução no quadro exato antes de inserir a marca.

| Ferramenta | Procedimento |
| --- | --- |
| CapCut Desktop | Use **Adicionar marcador** na barra acima da timeline. **M** é o atalho padrão. Confirme que a marca está na régua da timeline final e anote o nome e o tempo na ficha. [Guia do CapCut](https://www.capcut.com/resource/how-to-use-capcut) |
| Premiere Pro | Desmarque os clipes na timeline e pressione **M**, ou use **Marcadores → Adicionar marcador**. Crie o marcador na régua da sequência. Dê dois cliques para editar o nome e a observação. [Documentação da Adobe](https://helpx.adobe.com/br/premiere/desktop/organize-media/apply-labeling/add-a-marker-to-a-clip.html) |
| After Effects | Desmarque as camadas e use **Camada → Adicionar marcador** ou **`*` do teclado numérico**. A marca fica na régua da composição. No Windows, **`Alt` + `*`** abre o comentário. [Documentação da Adobe](https://helpx.adobe.com/br/after-effects/desktop/work-with-layers/work-with-layer-and-composition-markers/layer-markers-composition-markers.html) |
| Remotion, HTML ou FFmpeg | Registre os marcadores no plano ou configuração editável. Gere a tabela a partir dos mesmos frames ou tempos que comandam a montagem. Quando editar direto na linha de comando, mantenha a lista de tempos e ações ao lado do MP4. Confirme os pontos no render. |

No Windows, o FFplay pode mostrar o tempo do quadro em segundos. Use **Espaço** para pausar e **S** para avançar um frame. Rode o comando em PowerShell com o caminho real do arquivo. Ele só altera a visualização. [Manual do FFplay](https://ffmpeg.org/ffplay.html) · [Filtro drawtext](https://ffmpeg.org/ffmpeg-filters.html#drawtext)

```powershell
ffplay -vf 'drawtext=fontfile=C\\:/Windows/Fonts/arial.ttf:text=%{pts}:fontsize=28:fontcolor=white:box=1:x=20:y=20' "arquivo.mp4"
```

### Tabela que acompanha a versão

Identifique no cabeçalho da ficha o arquivo, a versão, o FPS, o master de áudio ou a indicação de música ao vivo, a deixa do GO, o que fica antes e o que fica depois. Uma linha por evento. A mesma tabela pode ser entregue em Markdown ou CSV, com estas colunas.

| Marcador | Tempo no MP4 | Referência | Telão | Luz e transição | Situação |
| --- | --- | --- | --- | --- | --- |
| INÍCIO | 00:00:00.000 | Primeiro quadro do arquivo | Iniciar playback | Estado inicial conforme a ficha | Conferir em ensaio |
| LUZ — Acender luzes de Natal | A definir | Último refrão na faixa final da MM-16 | Virada visual final | Acender no ponto marcado. Transição a combinar | Pendente de master e ensaio |
| SAÍDA | A definir | Último quadro útil ou ponto de passagem | Registrar a próxima imagem ou espera | Registrar estado de saída, quando aplicável | A medir |

As linhas acima mostram o preenchimento. Registre como **proposta**, **medido no MP4** ou **ensaiado** conforme a evidência de cada evento. Para cues manuais, descreva a fala ou ação junto do marcador e deixe a hora de relógio em aberto. O editor especifica quando a mudança precisa acontecer. A operação define os aparelhos, intensidades e fades com a direção.

## 3. Sessão de playback e telão no REAPER

1. No Windows, ligue a saída de vídeo à processadora ou ao telão e use **Win + P → Estender**. No REAPER, importe o MP4, abra **View → Video Window** com **Ctrl + Shift + V** e escolha o telão em **Monitor for full screen**. Ative **Full screen**. O monitor do operador fica com a timeline e os controles. [Telas no Windows](https://support.microsoft.com/pt-br/windows/hardware/display-graphics/how-to-use-multiple-monitors-in-windows) · [Manual do REAPER, seção 20.1](https://dlz.reaper.fm/userguide/ReaperUserGuide744c.pdf#page=387)
2. Organize os blocos na ordem das cenas. No início de cada playback, use **Shift + M** e dê um nome com código e deixa, como `GO MM-02 — segundo congelamento`. Anote a imagem de espera, a fonte de áudio, o que encerra o bloco e a ação de saída na lista de operação. Durante a espera, mantenha o cursor no estado que deve ficar no telão. A seleção de outro ponto pode trocar a imagem de prévia conforme a configuração da janela de vídeo. [Manual do REAPER](https://dlz.reaper.fm/userguide/ReaperUserGuide744c.pdf)
3. Na deixa, posicione e dê **Play** no marcador correspondente. Use o mesmo transporte para áudio, vídeo e MTC do playback. Planeje os fundos que precisam sustentar diálogo como loops ou imagens mantidas até uma nova deixa. Defina a espera entre blocos para evitar avanço sem comando.

### Preto entre dois vídeos

Importe uma imagem preta de quadro inteiro e coloque-a entre os blocos pelo tempo suficiente para entrar em pausa. Quando o primeiro vídeo acabar e o preto aparecer, use **Pause** no transporte, ou **Enter** no teclado padrão. O cursor fica naquele ponto. Na próxima deixa, vá ao marcador de início e dê **Play**. Se a troca tem som vindo da mesma sessão, programe-o sobre o preto e coloque a pausa depois do som. [Manual do REAPER, transporte e pausas](https://dlz.reaper.fm/userguide/ReaperUserGuide744c.pdf)

Para automatizar a espera, a extensão **SWS** pode executar **Transport: Pause** ao cruzar um marcador. Se estiver instalada, ative **Options → Enable SWS marker actions**, confira o ID de **Transport: Pause** na lista de ações e ponha `!1008` dentro do trecho preto, com margem antes do próximo vídeo. Ensaie o retorno após pausa e a próxima entrada. Use a pausa manual se a extensão ou o comportamento ainda estiverem pendentes de teste. [Marcadores de ação do SWS](https://sws-extension.org/markeractions.php)

## 4. Configuração candidata REAPER → LumiKit SHOW → DMX

1. No REAPER, insira **SMPTE LTC/MTC Timecode Generator** numa pista dedicada. Nas propriedades da fonte, selecione o envio **MIDI (MTC)** e direcione a saída MIDI para a porta ligada ao LumiKit. Registre a origem de tempo de cada bloco. Se o sistema estiver em dois computadores, a Lumikit demonstra o uso de rtpMIDI pela rede. [Guia do gerador no REAPER](https://dl.reaper.fm/userguide/ReaperUserGuide510b.pdf) · [Tutorial Lumikit e REAPER](https://www.youtube.com/watch?v=iMmu4vqW2tw)
2. No LumiKit SHOW, abra **Action → Timecode**, selecione a entrada MIDI e habilite **Time Code** geral e na Timeline ou Lista de cenas. Programe as cenas e fades a partir das marcas do MP4. Se houver várias sequências, configure o **MIDI ID** correspondente e envie a mensagem junto ao disparo. Confira no ensaio que o ID chega antes do primeiro evento dependente dele. [Manual do LumiKit SHOW, seção 3.17](https://www.lumikit.com.br/help.br/LumikitSHOW2026%28br%29.pdf#page=114)
3. Se o relógio da sessão tiver origem diferente do MP4, confira o MTC recebido no primeiro quadro e converta a marca local para esse relógio. Exemplo ilustrativo em horas, minutos e segundos: com início no relógio em `01:12:00.000`, uma marca a `00:01:23.400` corresponde a `01:13:23.400`. Faça a conversão para o formato exibido pelo software de operação. O manual indica MTC a 25 FPS como referência de sincronização. Isso não altera o FPS aprovado para o MP4.
4. Use Art-Net cabeado para uma saída direta do LumiKit a uma interface DMX compatível. Confirme na operação quais equipamentos e universos existem. A PRO X1 GM oferece uma saída de 512 canais. A SourLight SL1000 é USB/Enttec Open DMX. Para usar esse tipo de interface com o LumiKit atual, o caminho candidato é **LumiKit Art-Net → ponte de software → SL1000 → DMX**. O QLC+ documenta o passthrough de Art-Net para USB. A SL1000 e a ponte precisam ser conferidas no computador que vai operar. [SL1000](https://www.sourlight.com.br/sl1000) · [PRO X1 GM](https://www.lumikit.com.br/interface-dmx-lumikit-pro-x1-gm) · [Passthrough no QLC+](https://docs.qlcplus.org/v4/input-output) · [USB Open DMX no QLC+](https://docs.qlcplus.org/v4/plugins/dmx-usb)

O preto do telão e o estado de luz de palco têm comandos próprios. Quando o playback pausa ou o sinal MTC se perde, o LumiKit pode manter ou trocar a cena conforme configuração. Combine com a operação o estado de espera para cada passagem e confira o comando manual de retomada. [Manual do LumiKit SHOW, seção 3.17](https://www.lumikit.com.br/help.br/LumikitSHOW2026%28br%29.pdf#page=114)

## 5. Aplicação ao roteiro do HESED

| Passagem | Comando e marcação |
| --- | --- |
| Cena 1 · MM-02 | Mantenha o exterior da cadeia até o segundo congelamento. GO da retrospectiva nessa deixa. Ao fim, voltar ao mesmo exterior para a retomada da conversa. |
| Cenas 2 → 3 · MM-03 | Sustente a cozinha V03-01 à direita e preto à esquerda durante a espera e a troca de responsável. A marcação dessa passagem deve registrar a permanência da imagem e o sinal real de saída na ficha da Cena 3. |
| Cenas 8 → 9 | Ao fim de Brilha Tua Luz, a cortina dá passagem à troca de cenário e figurino. Preto durante a troca é proposta de ensaio. Dê o GO da MM-16 depois que a troca terminar. |
| Cena 9 · MM-16 | Na versão definitiva de Maravilhosa Graça de Samuel Mizrahy, marque a parte falada e o primeiro quadro da mudança de luz no último refrão. Confirme o tempo com o master final. |

As deixas de palco vêm das fichas das cenas e do [roteiro de montagem](cena-a-cena/pdf/HESED-roteiro-de-montagem.pdf). Se a direção mudar uma deixa, atualize a ficha antes de refletir a mudança no roteiro e no mapa HTML.

## 6. Conferência para ensaio e entrega

- [ ] Conferir marcadores e estado de saída no arquivo exportado da versão entregue, inclusive se o render começou depois do início da timeline.
- [ ] No computador da operação, reproduzir dois vídeos com sequências diferentes e verificar imagem, áudio, porta MIDI, seleção do MIDI ID e posição do MTC.
- [ ] No telão, conferir primeiro e último quadros, loop ou espera, preto sustentado, próxima entrada somente na deixa e recuperação manual após pausa, salto ou perda de MTC.
- [ ] Com a luz de palco, confirmar o quadro de impacto e os fades. Se houver diferença entre telão, áudio e luz, medir o atraso no equipamento real e registrar o ajuste usado na operação.
- [ ] Registrar versão, aparelho, data, resultados e pendências no [checklist](checklist-de-aceite.md). Marcar como ensaiada apenas a combinação que foi efetivamente reproduzida.
