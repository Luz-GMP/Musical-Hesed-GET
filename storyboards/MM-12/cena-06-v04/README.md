# Cena 6 · MM-12 · recortes em papel v04

Proposta de reconstrução para revisão. A referência do vídeo de [Cordel Encantado](https://www.youtube.com/watch?v=9IMiOxcIZT4) foi usada somente como linguagem de edição: gravura chapada em papel, contorno de tinta, folhas/paisagem atravessando o quadro, panorâmica com rastro e recortes que entram como páginas. Nenhum conteúdo do vídeo foi importado.

## Decisão visual

Os seis JPGs originais do repositório foram preservados e duplicados apenas para o pacote autossuficiente de render em `assets/`. A imagem continua sendo a fonte da cena; a diferença desta versão é o tratamento editorial e a forma de entrada. Cada quadro é composto em três recortes espaciais derivados do mesmo still:

- fundo: céu/horizonte, convertido em papel/tinta e entrando como a primeira folha;
- intermediário: arquitetura/paisagem, com recorte irregular, sombra de papel e o movimento principal de câmera;
- primeiro plano: caminho, muro, porta ou chão, com deslocamento maior, rastro e entrada por último.

Essa é uma separação espacial de uma imagem achatada, feita por máscaras de recorte, contraste de gravura, sombras duras e tratamentos de profundidade. Não inventa geometria, pessoas, anjos, bebê ou uma nova versão do estábulo. O Q06 permanece literalmente o quadro de abrigo vazio e sustenta a passagem para a Cena 7.

## Coreografia

| Quadro | Entrada | Gesto dominante | Repouso/saída |
|---|---:|---|---|
| Q01 | paper-sweep | o caminho se monta como folha ilustrada | deriva lateral com rastro |
| Q02 | cutout-wipe | a cidade entra por uma diagonal recortada | pan invertido |
| Q03 | ink-reveal | chegada se revela por tinta e oclusão | sustentação curta |
| Q04 | camera-pan | a noite atravessa o mesmo espaço | panorâmica contínua |
| Q05 | fold-shadow | o fechamento da porta cria o acento | sombra repousa antes da troca |
| Q06 | quiet-hold | abrigo vazio estabiliza o quadro | hold para a Cena 7 |

O overlay `assets/mm12-cordel-overlay.svg` foi desenhado no VectorCraft como grafismo de tinta. Nesta versão ele recebe tratamento monocromático e acompanha os recortes; não altera os quadros e não substitui os elementos cenográficos originais.

## Ferramentas e evidências

- PhotoCraft: prova nativa de organização em camadas/máscaras com o Q01, sem sobrescrever o JPG original.
- VectorCraft: overlay vetorial local usado nesta versão.
- EffectCraft: prova curta com opacidade, deslocamento relativo, blur e easy-ease; o projeto-demo foi limpo depois do teste.
- FilmCraft: transições disponíveis conferidas no motor; o projeto-demo não foi alterado.
- AI Filmmaker/HyperFrames: `index.html` é a raiz de composição, com timeline determinística de 106 s a 30 fps.

## Ajuste desta revisão

A v03 estava com aparência cinematográfica (vinheta azul, blur e camadas horizontais). A v04 troca esses sinais por fundo de papel, filtros de gravura/sepia, sombras de recorte, máscaras irregulares e entradas mais rápidas em página. O Q06 mantém a paleta azul noturna/âmbar prevista no briefing, para não perder a continuidade da Cena 7.

Sem áudio nesta proposta. A duração e os marcadores são pontos de ensaio; as deixas reais de palco e a fala devem prevalecer quando forem alinhadas.
