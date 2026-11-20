# Tempos da fala (tempos.json)

Toda cena põe a fala na tela a partir de um `tempos.json`: cada palavra com início e fim em segundos,
e onde cada cena começa. É isso que faz a palavra aparecer quando é dita.

Os comandos são executados na pasta de trabalho do projeto Remotion, não na raiz da skill.
O contrato é independente do agente e do provedor de voz. Este modelo está calibrado a 30 FPS;
gerar JSON com outro FPS não adapta automaticamente os helpers e movimentos do código.

## Formato

```json
{
  "fps": 30,
  "fim_fala_s": 8.7,
  "cenas": [
    { "cena": 1, "inicio_s": 0, "fim_s": 3.45, "inicio_f": 0, "dur_f": 104 },
    { "cena": 2, "inicio_s": 3.45, "fim_s": 7.12, "inicio_f": 104, "dur_f": 110 }
  ],
  "palavras": [
    { "t": "Cada", "s": 0.4, "e": 0.72 },
    { "t": "palavra", "s": 0.78, "e": 1.22 }
  ]
}
```

- `t`: a palavra como aparece na tela (o `<Fala>` limpa aspas e `. , : ;` do fim; `?` fica).
- `s`, `e`: início e fim em segundos.
- `cenas[i].inicio_s`: o início da **primeira palavra** da cena (a cena 1 começa em 0).
  `inicio_f = round(inicio_s × fps)`. `fim_s` = início da próxima cena (a última: fim da fala).
- Duração do vídeo = `fim_fala_s + 0,8 s` de respiro (é o que a demo usa).

## Sem narração (texto na tela, ritmo de fala)

```bash
node scripts/tempos-de-texto.mjs "Primeira frase. | Segunda frase, com vírgula. | Terceira." --saida=src/videos/meu/tempos.json
```

- `|` separa as cenas (uma frase por cena).
- `--saida` cria a pasta e grava UTF-8 diretamente, evitando o UTF-16/BOM de redirecionamentos em
  versões antigas do PowerShell. Sem essa opção, stdout continua disponível. O arquivo representa
  ritmo estimado; não é evidência de palavras efetivamente pronunciadas.
- Ritmo padrão ~3 palavras por segundo (o do filme). `--ritmo=1.3` deixa mais lento; `--ritmo=0.85`, mais rápido.
- Para um vídeo de duração exata (ex.: "8 segundos"), gere, veja `fim_fala_s` e ajuste `--ritmo`
  até `fim_fala_s + 0,8` dar a duração pedida (ou ajuste o respiro no fim).
- Pode editar o JSON à mão: segurar uma palavra-chave mais tempo, abrir uma pausa antes do impacto.
- Texto curto num vídeo mais longo (ex.: 2 palavras em 8 s): não estique o ritmo até a fala ficar
  arrastada; mantenha o ritmo natural e aumente a duração da composição (a última cena segura a
  palavra com movimento até o fim).

## Com narração (áudio pronto)

1. Ponha o áudio em `public/` (ex.: `public/narracao.mp3`).
2. Transcreva com tempo por palavra:
   ```bash
   npm i -D @remotion/install-whisper-cpp@4.0.409
   node scripts/transcrever.mjs public/narracao.mp3 src/videos/meu/tempos.json --modelo=small --idioma=pt --fps=30
   ```
   Roda local (whisper.cpp), sem enviar áudio para uma API. A instalação/download usa rede;
   verifique a permissão do ambiente antes de executar. Na primeira vez baixa o programa e o
   modelo (centenas de MB). O pacote opcional não está incluído no `npm ci` principal. Em macOS/Linux,
   confira git, make e compilador C; no Windows confira a disponibilidade do binário compatível.
   O script executa a CLI Remotion instalada usando Node, sem depender de Bash, `npx.cmd` ou shell
   intermediário. Evite executar duas transcrições simultâneas na mesma pasta `.whisper/`.
   Cada
   frase vira uma cena; junte ou separe cenas editando `cenas`.
   Se o usuário já tem a transcrição com tempo por palavra de outra ferramenta (ElevenLabs, Whisper,
   AssemblyAI, legendas palavra a palavra), converta para o formato acima em vez de transcrever.
3. Corrija a grafia das palavras no JSON (o reconhecimento erra nome próprio); não mexa nos tempos.
4. No vídeo, passe o áudio: `<VideoMontado ... audio="narracao.mp3" />`.
5. Confira palavras no início, meio e fim contra o áudio real: quadro = round(s × fps), usando
   o FPS da composição. O modelo antecipa a animação em 2 quadros; isso é um ajuste inicial,
   não uma correção universal de transcrição. Confira também a prévia em movimento e ajuste o
   alinhamento quando necessário. Corrigir tempos exige verificar novamente as cenas afetadas.

Áudio pode vir de gravação, VoiceStudio, ElevenLabs ou outra fonte escolhida. Reutilize timestamps
existentes quando adequados. Para converter um `timestamps.json` da skill principal, mapeie
`word → t`, `start → s`, `end → e` e crie os intervalos de `cenas` conforme o storyboard aprovado.
Preserve os segundos originais e calcule `inicio_f` e `dur_f` por diferença de limites arredondados.
Essa conversão não é executada automaticamente por este pacote. Verifique que toda palavra
pertence ao intervalo de uma cena e que o áudio final não foi cortado ou alterado depois dos tempos.

## No código

```tsx
import TEMPOS from './tempos.json';
import { criarTempos, type TemposJson } from '../../tempos';
const T = criarTempos(TEMPOS as TemposJson);

T.falaDaCena(2)          // as palavras da cena 2
T.trecho(2, 0, 3)        // palavras 0 a 3 da cena 2
T.CENAS_FALA             // para montarRoteiro
T.fimFala                // segundos
```
