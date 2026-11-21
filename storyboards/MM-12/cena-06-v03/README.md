# Cena 6 · MM-12 · parallax v03

Proposta de reconstrução para revisão. A referência do vídeo de [Cordel Encantado](https://www.youtube.com/watch?v=9IMiOxcIZT4) foi usada somente como linguagem de edição: tableaux ilustrados, revelação por planos, deriva de câmera, recortes diagonais e dissoluções motivadas. Nenhum conteúdo do vídeo foi importado.

## Decisão visual

Os seis JPGs originais do repositório foram preservados e duplicados apenas para o pacote autossuficiente de render em `assets/`. Cada quadro é composto em três planos espaciais derivados do mesmo still:

- fundo: céu/horizonte, mais distante, com deslocamento relativo mínimo e entrada primeiro;
- intermediário: arquitetura/paisagem, com o movimento principal de câmera;
- primeiro plano: caminho, muro, porta ou chão, com deslocamento relativo maior e entrada por último.

Essa é uma separação espacial de uma imagem achatada, feita por máscaras de recorte e tratamentos de profundidade. Não inventa geometria, pessoas, anjos, bebê ou uma nova versão do estábulo. O Q06 permanece literalmente o quadro de abrigo vazio e sustenta a passagem para a Cena 7.

## Coreografia

| Quadro | Entrada | Gesto dominante | Repouso/saída |
|---|---:|---|---|
| Q01 | page-reveal | o caminho se monta do distante ao próximo | deriva lateral suave |
| Q02 | diagonal-wipe | a cidade aparece como página recortada | pan invertido |
| Q03 | ink-dissolve | chegada se revela por contraste de tinta | sustentação curta |
| Q04 | pan-crossfade | a noite atravessa o mesmo espaço | dissolução contínua |
| Q05 | shadow-fold | o fechamento da porta cria o acento | sombra repousa antes da troca |
| Q06 | quiet-hold | abrigo vazio estabiliza o quadro | hold para a Cena 7 |

O overlay `assets/mm12-cordel-overlay.svg` foi desenhado no VectorCraft como grafismo abstrato discreto de moldura/folhagem; ele não altera os quadros e não substitui os elementos cenográficos originais.

## Ferramentas e evidências

- PhotoCraft: prova nativa de organização em camadas/máscaras com o Q01, sem sobrescrever o JPG original.
- VectorCraft: overlay vetorial local usado nesta versão.
- EffectCraft: prova curta com opacidade, deslocamento relativo, blur e easy-ease; o projeto-demo foi limpo depois do teste.
- FilmCraft: transições disponíveis conferidas no motor; o projeto-demo não foi alterado.
- AI Filmmaker/HyperFrames: `index.html` é a raiz de composição, com timeline determinística de 106 s a 30 fps.

Sem áudio nesta proposta. A duração e os marcadores são pontos de ensaio; as deixas reais de palco e a fala devem prevalecer quando forem alinhadas.
