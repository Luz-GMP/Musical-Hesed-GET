# Contrato de conexão — Filmmaker e Motion

Motion é uma especialidade carregada pela skill principal de edição de vídeos. O código e as
referências ficam neste pacote; a principal aponta para eles quando precisa da capacidade.
Não há chamada a outro modelo, agente ou API só por carregar esta sub-skill.

## Localização e responsabilidade

No pacote integrado, a estrutura é:

```text
AI Filmmaker Agent/
  SKILL.md
  Skill Edição de Videos com AI Agents.md
  AI Motion Graphics/
    MOTION.md
    skill/references/integracao-filmmaker.md
    projeto/
    scripts/
```

Resolva a principal pelo diretório pai da raiz de Motion; este arquivo de referência está dois
níveis abaixo dessa raiz. Não calcule o caminho a partir do cwd do terminal. O pacote é instalado
inteiro como `ai-filmmaker`, com uma única entrada `SKILL.md`; Motion usa `MOTION.md` para não
ser descoberto como outra skill. Transportar a pasta Filmmaker inteira preserva a conexão relativa
e a manutenção independente dos módulos. Não altere diretórios globais sem pedido de instalação.

A principal responde pelo briefing, storyboard, motores/FPS, inventário de sons, aprovações e
edição/mixagem final. Motion responde pela implementação Remotion e suas evidências técnicas.
As regras de aprovação e de sons da principal continuam obrigatórias na execução especializada.
Se um requisito aprovado não for atendido pelo modelo, informe a limitação antes de substituir
o requisito. Por exemplo: não mude 60 FPS aprovado para 30 FPS apenas para reutilizar o template.

## Entrada da principal

Antes de implementar, identifique no contexto existente:

| Dado | Contrato |
|---|---|
| Projeto e pasta de trabalho | Caminho real da cópia Remotion; preserve o modelo |
| Cena e versão | Qual cena está autorizada; não produza as próximas antecipadamente |
| Briefing e storyboard | Texto, público, objetivo, estilo e transição aprovados |
| Configuração | Resolução, proporção, FPS, duração e áreas seguras |
| Tempos | Origem e unidade; instante global de início da cena e duração |
| Áudio | Caminho real dos arquivos, origem escolhida, estado e pendências |
| Aprovações | Versões já aprovadas e alterações que invalidam essas aprovações |

Quando pertinentes, inclua função dos textos/legendas, estados e dimensões do card, planos de
parallax, evento que guia a revelação, tempo de leitura, caudas sonoras e invariantes de loops.
Não crie um segundo esquema: use o `filmmaker.project.json` mantido pela principal, conforme o
[Harness](../../../references/harness.md). Aplique também a referência compartilhada de
[direção audiovisual](../../../references/direcao-audiovisual.md), sem copiar exemplos de projetos.

Reaproveite as informações da conversa e do projeto. Solicite apenas o que faltar e não puder
ser determinado pelos arquivos. Carregar Motion não cria uma segunda rodada de aprovação de
storyboard. A prévia da cena continua aguardando a aprovação explícita prevista pela principal.

## Passagem de arquivos e tempos

1. Prepare a cópia Remotion na pasta de trabalho escolhida, com `scripts/preparar.mjs projeto`.
   Não copie o modelo novamente se já estiver configurado.
2. Coloque os áudios escolhidos em `public/` da cópia. Um caminho fora de `public/` não pode ser
   passado diretamente a `staticFile`. Preserve os originais e registre o nome relativo usado.
3. Use o áudio final da principal, inclusive `narracao.mp3` de VoiceStudio, ElevenLabs ou importação.
   A sub-skill não gera outra voz nem retranscreve se os tempos existentes forem adequados.
4. O extrator da principal grava uma lista `{word, start, end}` em segundos. Para Remotion,
   converta para `{t, s, e}` e acrescente `fps`, `fim_fala_s` e `cenas` conforme `tempos.md`.
   `inicio_f = round(inicio_s * fps)`; `dur_f` é a diferença entre os limites arredondados.
   A separação em cenas vem do storyboard aprovado, não obrigatoriamente da pontuação do áudio.
   O agente faz essa conversão; o pacote não oferece conversor automático desse formato.
5. Preserve a referência temporal: em uma narração integral use segundos globais; em um arquivo
   de áudio recortado por cena use tempos locais recalculados para esse recorte. Não subtraia o
   início da cena duas vezes: `useCenaM().local(s)` já converte o tempo global em quadro local.
6. Para a prévia, registre `CenaIsolada` com `cena.seqDuracao` e o áudio correspondente. Para
   uma narração integral, ela usa `trimBefore={cena.seqInicio}`. Confira também as sobreposições
   de transição; a duração da Sequence pode incluir pré-rolagem e saída, além da fala.

## Retorno e montagem final

Devolva à principal: pasta do projeto, fontes alteradas, ID da composição e da cena isolada,
versão, caminho da prévia, resolução/FPS/duração, QA executado, áudio incluído e pendências.
Uma prévia com som ausente continua provisória. A principal apresenta o resultado e registra
a aprovação do usuário; a sub-skill não pode aprovar o próprio trabalho.

Quando todo o vídeo usa Remotion, mantenha as cenas na mesma montagem e use o render Remotion.
Quando Motion é apenas um trecho de uma edição maior, exporte esse trecho com as configurações
aprovadas para inserção na timeline da principal. Não trate MP4 opaco como overlay transparente;
se transparência for necessária, escolha e teste formato/canal alpha apropriados antes da entrega.

Defina uma única montagem final do áudio. A receita FFmpeg da principal recebe `video_visual.mp4`,
`narracao.mp3` e `sfx_track.wav`; se usada, exporte o visual Remotion sem áudio (`audio={null}`)
e entregue-o com o nome/caminho esperado. Na prévia, o áudio pode estar incluído para avaliação.
Se a montagem final de áudio acontecer em Remotion, não duplique a voz ou os efeitos em outra
mixagem. Música/ambiência exigem camadas explícitas; a receita original não as inclui sozinha.

Entregue também os arquivos separados de voz, música, efeitos e seus tempos. Na montagem,
música/ambiência seguem o tempo global: as entradas e saídas usadas para avaliar uma cena
isolada não devem se tornar reinícios involuntários no filme. Planeje caudas e transições sem
deslocar fala ou acumular preenchimento de codecs. Reutilize os áudios aprovados ao revisar
somente layout ou transições; não consuma créditos para repetir a mesma narração.

## QA e limites

Use TypeScript, `conferirTempos`, stills e prévia audiovisual para Remotion. O comando
`node render.mjs --qa` e o auditor DOM da principal são do motor HTML/Playwright e não estão
implementados nesta sub-skill. Não declare esses checks como executados no Remotion.

Atualize o manifesto com a versão, o plano de camadas, os stems, a prévia e a aprovação recebida.
Antes da entrega integral, execute o Harness da raiz da skill; ele confere o contrato compartilhado,
mas não substitui os checks específicos do Remotion nem a revisão audiovisual.

O modelo fornecido está calibrado a 30 FPS e 1920×1080. Outro FPS/resolução exige adaptação dos
helpers, tempos e geometrias e revisão das cenas afetadas. Não há adaptação automática universal.
Uma falha técnica não autoriza avançar de cena, ignorar som faltante ou consumir APIs externas.
