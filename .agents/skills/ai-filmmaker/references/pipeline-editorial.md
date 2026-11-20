# Pipeline editorial: projeto, fontes e capacidades opcionais

Use esta referência ao ingerir gravações, planejar cortes, organizar mídias ou avaliar uma
integração externa. Ela descreve contratos do `ai-filmmaker`; não instala aplicativos, modelos,
plugins ou serviços.

## 1. Princípios incorporados

- Preserve cada original e trabalhe em versões derivadas. Uma revisão deve poder ser explicada,
  reproduzida e revertida sem substituir a fonte.
- Leia o estado atual antes de alterar o projeto. Registre a alteração proposta, a versão afetada,
  a evidência de QA e o resultado da revisão.
- Separe proposta de aplicação. Cortes mecânicos, buscas e classificações geram candidatos; só uma
  decisão revisada entra na montagem.
- Use uma única fonte de verdade para tempos, cenas, assets e aprovações. Código e render devem
  consumir esse mapa, sem manter cópias divergentes da timeline.
- Resultados automatizados são evidência parcial. Índice, transcrição, hash, métrica de áudio ou
  frame extraído não comprovam intenção editorial, legibilidade, sincronia percebida ou qualidade.

## 2. Transcrição, dois relógios e EDL

Quando houver cortes em material gravado, preserve dois relógios:

- `sourceStart` e `sourceEnd`: posição no arquivo original;
- `start` e `end`: posição na timeline editada.

Reutilize uma transcrição verificada quando ela corresponder exatamente ao arquivo. Se precisar
transcrever, normalize palavras com texto, início, fim, falante e confiança quando disponíveis.
Não arredonde cada palavra de forma independente; quantize somente limites de corte e de cena para
`1/fps`.

Detecção de silêncio, repetição, falsa partida e retake produz candidatos com contexto e motivo.
Não corte automaticamente por um limiar fixo: pausas respiratórias, ênfase e intenção podem ter o
mesmo formato mecânico de um erro. Uma lista de decisões de edição (EDL) deve registrar:

- intervalo removido ou mantido nos dois relógios;
- texto e contexto afetados;
- motivo da decisão;
- estado `proposto`, `aprovado`, `rejeitado` ou `aplicado`;
- versão ou aprovação que autorizou a aplicação.

Depois de aplicar cortes, derive legendas, motion e som da timeline retimada. Nunca combine tempos
do original com o vídeo limpo.

## 3. Ledger de mídias e busca

Registre cada arquivo usado com um ID estável, caminho relativo ao projeto, tipo, hash SHA-256,
origem, direitos conhecidos, estado e intervalos selecionados. Para material externo ou gerado,
registre também URL ou provedor, modelo, tarefa, custo/autorização e arquivo efetivamente escolhido.

Uma busca por texto, assunto ou cena deve devolver resultados rastreáveis: arquivo, intervalo,
texto associado, motivo da correspondência e confiança. O resultado é uma seleção candidata, não
uma autorização de uso nem uma afirmação factual. Busca lexical sobre metadados e transcrições pode
funcionar sem modelos. Embeddings e indexação semântica são uma capacidade separada e opcional.

O ID de uma cena-fonte sobrevive a recorte, cor, velocidade, reversão e transcodificação. Isso evita
reutilizar o mesmo plano sem perceber. Em cada proporção, confira começo, meio e fim do intervalo:
hash e duração não demonstram enquadramento nem ação legível.

## 4. Sessão de edição e reversibilidade

Para cada cena ou lote aprovado:

1. leia o manifesto e os arquivos atuais;
2. crie uma versão de trabalho isolada;
3. registre operações propostas e seus alvos;
4. execute QA na versão de trabalho;
5. apresente a prévia correspondente;
6. aplique a versão somente após a aprovação exigida;
7. preserve a versão anterior e atualize o estado.

Uma falha ou estado desatualizado interrompe a aplicação; releia o projeto antes de recalcular.
Operações externas irreversíveis, publicação e geração paga permanecem fora de uma sessão de
rascunho e exigem a autorização aplicável.

## 5. Capacidades avaliadas neste upgrade

| Fonte estudada | Aprendizado incorporado agora | Integração adiada |
| --- | --- | --- |
| [OpenChatCut](https://github.com/0xsline/OpenChatCut) | projeto local editável, comandos sobre rascunho, revisão antes de aplicar e uma timeline compartilhada | aplicativo, MCP e runtime próprios; nenhuma parte AGPL foi copiada |
| [Herk Edit Kit](https://github.com/nateherkai/herk-edit-kit) | transcrição normalizada, EDL revisada, ledger com hash, fixtures sintéticas e limites explícitos do QA | Cards, assets de marca e serviços opcionais. Para o motor local já integrado, consulte [HyperFrames](hyperframes.md). |
| [StoryToolkitAI](https://github.com/octimot/StoryToolkitAI) | projetos ligando arquivos, busca rastreável, metadados de timecode/FPS e exportação interoperável | aplicativo, modelos locais, embeddings e integração com DaVinci Resolve; nenhum código GPL foi copiado |
| [BackgroundRemover](https://github.com/nadermx/backgroundremover) | contrato futuro para gerar matte/alpha e conferir bordas, transparência e consistência temporal | CLI, PyTorch, modelos U2Net e download de pesos |
| [LatentSync](https://github.com/bytedance/LatentSync) | contrato futuro de lip-sync com checagem de hardware, comparação antes/depois e validação de identidade e sincronia | ambiente Python/CUDA, checkpoints e inferência |

Neste pacote, `background-removal`, `lip-sync`, editor externo e busca semântica são capacidades
opcionais. Só as declare disponíveis depois de verificar a instalação real. Não instale, baixe
modelos, use nuvem ou substitua o motor aprovado automaticamente. Ausência de uma capacidade deve
produzir um bloqueio ou alternativa explícita, nunca uma alegação de execução.

## 6. Interoperabilidade sem acoplamento

Prefira formatos simples quando o usuário já tiver outra ferramenta:

- transcrição por palavra ou segmento em JSON/SRT;
- EDL/XML/FCPXML quando o editor de destino oferecer suporte confirmado;
- PNG ou sequência com alpha, ProRes 4444 ou WebM alpha conforme o consumidor;
- WAV/PCM para intercâmbio de áudio;
- manifesto e ledger em JSON com caminhos relativos.

Confirme FPS, timecode inicial, resolução, canais de áudio, codec e suporte a alpha nos dois lados.
Exportar um arquivo não prova que o editor de destino o interpretou corretamente.
