# Cena 6 · Viagem a Belém e chegada ao abrigo (MM-12) · Piloto v05

**26/11/2026 · Etapa 0 aprovada por Victor · Etapa 1 (8 bases unificadas v05) concluída · Etapa 2 (camadas RGBA restantes) pronta para Codex.**

### Atualização Etapa 1 · 26/11/2026 (Antigravity, após aprovação do piloto)
- **Diretriz adicional confirmada por Victor:** a Cena 6 deve ser construída como **plano-sequência contínuo** (`Q01 → Q02 → Q07 → Q03 → Q04 → Q05 → Q08 → Q06`).
- **Bases unificadas geradas e normalizadas em `1672 × 941` (RGB):**
  - `bases-v05/MM12-Q02.png` · 3.968.381 bytes · SHA-256 `ca2b602b5fc7f09750e7b513a1cce3017fe0bc6612341d568a01b23ee4f66b70`
  - `bases-v05/MM12-Q07.png` *(NOVO · ponte `Q02 → Q03`)* · 4.123.414 bytes · SHA-256 `daaa5549d8b48662a4ec5ab9caf52426116f47c61fd10c05a2472cc8e1c2d16f`
  - `bases-v05/MM12-Q03.png` · 4.130.220 bytes · SHA-256 `2e2770fa6666f2120b7e0085eadc7904971e378e0aa3f1f1e715bc7c9bc24465`
  - `bases-v05/MM12-Q04.png` *(relighting noturno 1:1 de `Q03`)* · 3.642.222 bytes · SHA-256 `3199bce04bcee1aaf61a9731fea2003ddcc86f9fb603be732ada066b0ff1e462`
  - `bases-v05/MM12-Q05.png` · 3.947.511 bytes · SHA-256 `72ce0c596c8aa211cb7d3fc750095bd7f42ea74a8e200a29877911596dd400e7`
  - `bases-v05/MM12-Q08.png` *(NOVO · ponte `Q05 → Q06`)* · 3.452.493 bytes · SHA-256 `8a36b8a915018bc2eb9bca5182c2200bf762667fdc3895d4960be9116ed0b5a1`
- **Camada já adiantada da Etapa 2:**
  - `layers-v05/MM12-Q02/MM12-Q02-L01-BG-cleanplate.png` · `1672 × 941` RGB · 3.623.574 bytes · SHA-256 `b72701f4135f9d27110b28c82fdd1cd91e84cbbfd46ab0ed957ede33257070b7`
- **Prancha de conferência dos 8 quadros:** `prova-sequencia-8-quadros-v05.png` · 4.938.110 bytes · SHA-256 `109cb1826b1781a34222b0095bd83501cf0cdc6a6cfb1c37c5f29e91716f1c9a`.
- **Limite encontrado nesta sessão:** o gerador de imagens do Antigravity atingiu cota (`RESOURCE_EXHAUSTED`, HTTP 429) logo após concluir as 8 bases + `MM12-Q02-L01-BG-cleanplate.png`. A recriação das camadas RGBA restantes (`Q02` L02–L04, `Q07`, `Q03/Q04`, `Q05` e `Q08`) fica pronta para rodar no Codex (que exporta PNG RGBA nativo com alpha real 0–255).

---

**26/11/2026 · Etapa 0 · Q01 e Q06 · Recriação por planos · Aprovado por Victor.**

Foram gerados nove planos independentes no ImageGen, um por chamada, com as bases estilizadas Q01 e Q06 como referências de câmera e luz. As bases desta revisão são as composições neutras das novas camadas. Os JPGs de origem, a v09 da MM-13 e os arquivos do ensaio anterior ficam preservados. Este pacote local segue P-13.

Os dois fundos estão em RGB. Os sete planos à frente têm alpha real, com faixa verificada de 0–255 na saída do ImageGen. Camadas e prévias têm canvas integral de 1672 × 941. As imagens de origem de cada camada e ajustes de registro são documentados abaixo.

A prova de deslocamento usa L01 −10, L02 0, L03 +18, L04 +32 e L05 +38 px, com reenquadramento central de cerca de 1,05×. O Q06 vazio permanece durante a abertura da Cena 7, com saída para a v09 na fala “uma multidão de anjos apareceu”. Ver [registro anterior](../registro-execucao-v05.md) para as fontes e deixas consultadas.

Na prova deslocada, o fundo permanece preenchido e a vila do Q06 conserva o céu transparente, sem a silhueta do telhado. Na comparação com a v09, os principais volumes do abrigo, das ânforas e da mureta continuam próximos de suas posições de referência. A geração independente recriou detalhes das pedras, do telhado e da vegetação. O céu e o perfil da serra também variam entre as versões. Avaliar o corte na fala da multidão em ensaio. As áreas ocultas foram reconstruídas nas próprias gerações e verificadas nos deslocamentos de prova. A margem de 6–10% ao longo de todo contorno segue sem medição. Teste de LED e aprovação artística pendentes.

## Arquivos

| Caminho | Dimensões | Modo | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| `bases-v05/MM12-Q01.png` | 1672 × 941 | RGB | 2940179 | `fcb3160c012483e0c1dc6ea72fc45d63115c6b73db7f8aedf5297e0fe603f721` |
| `bases-v05/MM12-Q06.png` | 1672 × 941 | RGB | 2580270 | `a4b5dbbcee3b9da44c97639646948f6a347fb35bf6982ceca58d2b0c5165d28c` |
| `comparacao-MM12-Q06-v05_MM13-Q06-v09.png` | 3356 × 989 | RGB | 5123865 | `d1e7500db511bd94082b365ea6ffa54f1e5b617bb2e65e73720edc52b118fd71` |
| `layers-v05/MM12-Q01/MM12-Q01-L01-BG-cleanplate.png` | 1672 × 941 | RGB | 2112801 | `cb690543b3b086aa04720f2f5fecb2c3f81b32b3e735ce29bc1b18e1923bc177` |
| `layers-v05/MM12-Q01/MM12-Q01-L02-MG-vale-trilha.png` | 1672 × 941 | RGBA | 2307802 | `fe23009d4daedafbd04fdf3587bd03fb2ea6d2a7a33e1e0598100e09c35c3eb9` |
| `layers-v05/MM12-Q01/MM12-Q01-L03-FG-dir-pedras-arbustos.png` | 1672 × 941 | RGBA | 783294 | `4ed72cc76e6cc09515769d4ffedc907dcc55ed96b2eab858da55e4c568859c1b` |
| `layers-v05/MM12-Q01/MM12-Q01-L04-FG-esq-muro-oliveira.png` | 1672 × 941 | RGBA | 899673 | `23dd6d5569cdeacb1bf78b5c97cd8857182c3a436101bbd2559df0933ca413bc` |
| `layers-v05/MM12-Q01/preview_shift.png` | 1672 × 941 | RGB | 2886392 | `254873ab883205ce2efd06db862c523020d003326ec3afc062bcc748a4cca921` |
| `layers-v05/MM12-Q01/preview_stack.png` | 1672 × 941 | RGB | 2940179 | `fcb3160c012483e0c1dc6ea72fc45d63115c6b73db7f8aedf5297e0fe603f721` |
| `layers-v05/MM12-Q06/MM12-Q06-L01-BG-cleanplate.png` | 1672 × 941 | RGB | 1852688 | `e86b6bfede17acce2c07b63c2ba7efd7f0d557b1862f5ba63a9edf993e1b1949` |
| `layers-v05/MM12-Q06/MM12-Q06-L02-MG-belem-ciprestes.png` | 1672 × 941 | RGBA | 1490813 | `474c97bfa7bd5837332dcf0d6d37d19d39e3f0f55ce68667abc2f1f9dc2d3f48` |
| `layers-v05/MM12-Q06/MM12-Q06-L03-FG-dir-mureta-chao.png` | 1672 × 941 | RGBA | 1155087 | `47fdf614ed99c95c7e6e89a4c1fec10469f87a1cec97592112f08c2c1afc104a` |
| `layers-v05/MM12-Q06/MM12-Q06-L04-FG-esq-estabulo.png` | 1672 × 941 | RGBA | 1272633 | `94cef966c6bbfcd3ee5958d75dc4ddc996c942646ae43d9d7607f3f3372b61ff` |
| `layers-v05/MM12-Q06/MM12-Q06-L05-OBJ-anforas.png` | 1672 × 941 | RGBA | 74625 | `c934109eae61784ff2cc02010d1360412a55f55ef1a9ed975ba70746c29153d1` |
| `layers-v05/MM12-Q06/preview_shift.png` | 1672 × 941 | RGB | 2571432 | `9b2d8bfe5ceefd9132de176df70f982734b09ca3af286584b0d4316b3b023c81` |
| `layers-v05/MM12-Q06/preview_stack.png` | 1672 × 941 | RGB | 2580270 | `a4b5dbbcee3b9da44c97639646948f6a347fb35bf6982ceca58d2b0c5165d28c` |
| `prova-camadas-2p5d.png` | 2085 × 570 | RGB | 787821 | `514430724980a422e1b604281e94a1311de1b9bc2d54065bd74c9fc29c6e4cb2` |

## Gerações e ajustes

- MM12-Q01 / L01-BG-cleanplate · 1671 × 941, RGB · arquivo de origem do ImageGen: `exec-6ab116f8-5f3e-4209-bf5e-cb38136e61f2.png`.
- MM12-Q01 / L02-MG-vale-trilha · 1671 × 941, RGBA · arquivo de origem do ImageGen: `exec-f1f4db4c-894b-4829-9d77-9cb8a6f36c1e.png`.
- MM12-Q01 / L03-FG-dir-pedras-arbustos · 1671 × 941, RGBA · arquivo de origem do ImageGen: `exec-0d6675dc-6972-406b-9e0d-c0ab40e19510.png`.
- MM12-Q01 / L04-FG-esq-muro-oliveira · 1672 × 941, RGBA · arquivo de origem do ImageGen: `exec-740b177a-4013-4331-9b57-78e988564282.png`.
- MM12-Q06 / L01-BG-cleanplate · 1672 × 941, RGB · arquivo de origem do ImageGen: `exec-035f90aa-1ab4-4861-a9ac-d57a07f58bba.png`.
- MM12-Q06 / L02-MG-belem-ciprestes · 1672 × 941, RGBA · arquivo de origem do ImageGen: `exec-189eacf9-df18-4ae4-ac1a-dd6993ce0c45.png`.
- MM12-Q06 / L03-FG-dir-mureta-chao · 1672 × 941, RGBA · arquivo de origem do ImageGen: `exec-8095ef78-4857-4644-bb81-fd00e65075ec.png`.
- MM12-Q06 / L04-FG-esq-estabulo · 1672 × 941, RGBA · arquivo de origem do ImageGen: `exec-bca71e1d-cb4f-4561-a865-8cec0d9d39cf.png`.
- MM12-Q06 / L05-OBJ-anforas · 1672 × 941, RGBA · arquivo de origem do ImageGen: `exec-e4e42b67-8133-4c3b-8780-457c65554836.png`.

## Prompts efetivos

### MM12-Q01 / L01-BG-cleanplate

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q01 L01-BG-cleanplate, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Placa limpa opaca: somente céu dourado, nuvens e cordilheiras distantes. Recrie colinas distantes contínuas sob todo o quadro, sem oliveira próxima, muro, trilha ou arbustos de primeiro plano. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Imagem plenamente opaca.

### MM12-Q01 / L02-MG-vale-trilha

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q01 L02-MG-vale-trilha, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Somente vale rural intermediário com oliveiras médias e trilha sinuosa, mantendo a trilha na posição original, em todo o plano até o pé do canvas. Reconstrua terra e trilha ocultas pelos dois primeiros planos. Todo céu e cordilheiras distantes 100% transparentes. Sem oliveira grande, muro nem pedras ou arbustos próximos. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Transparência real RGBA no resto do canvas, bordas limpas naturais.

### MM12-Q01 / L03-FG-dir-pedras-arbustos

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q01 L03-FG-dir-pedras-arbustos, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Somente pedras e arbustos secos do primeiro plano no canto inferior direito, mesma posição e escala. Reconstrua seu volume completo até a borda direita e inferior. Todo restante do canvas transparente, sem céu, encosta, trilha ou elementos do lado esquerdo. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Transparência real RGBA no resto do canvas, bordas limpas naturais.

### MM12-Q01 / L04-FG-esq-muro-oliveira

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q01 L04-FG-esq-muro-oliveira, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Somente a grande oliveira superior esquerda com seus galhos e folhas e o muro rústico de pedras no primeiro plano esquerdo, mesmas posições e escala em relação à imagem completa. Preserve transparência real entre as folhas e entre os dois elementos. Sem céu, trilha, colinas distantes ou sombra de fundo. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Transparência real RGBA no resto do canvas, bordas limpas naturais.

### MM12-Q06 / L01-BG-cleanplate

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q06 L01-BG-cleanplate, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Placa limpa opaca: somente céu azul noturno com nuvens, cordilheira e vale azul distantes contínuos. Reconstrua cenário atrás do abrigo, vila, ciprestes, mureta e chão imediato. Preserve contorno da crista original visível e posição das nuvens. Sem objetos, casas, árvores próximas ou anjos. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Imagem plenamente opaca.

### MM12-Q06 / L02-MG-belem-ciprestes

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q06 L02-MG-belem-ciprestes, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Somente a encosta média com o povoado de Belém e seus pequenos pontos âmbar e ciprestes. Recrie terreno atrás do abrigo e da mureta, mantendo casas e ciprestes exatamente na metade direita como na referência. Área de céu e montanha distante completamente transparente, inclusive atrás do antigo telhado. Não desenhe nem deixe resíduo da silhueta do estábulo, telhado ou mureta. Plano contínuo de encosta, recortado por sua própria crista. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Transparência real RGBA no resto do canvas, bordas limpas naturais.

### MM12-Q06 / L03-FG-dir-mureta-chao

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q06 L03-FG-dir-mureta-chao, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Somente a mureta de pedras à direita, arbusto pequeno junto a ela e o chão rústico imediato que ocupa a parte de baixo do quadro. Reconstrua o chão e a continuação oculta da mureta por trás do abrigo e das ânforas. Áreas acima da mureta transparentes. Sem estábulo, franja do telhado, vila, ciprestes ou ânforas. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Transparência real RGBA no resto do canvas, bordas limpas naturais.

### MM12-Q06 / L04-FG-esq-estabulo

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q06 L04-FG-esq-estabulo, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Somente o abrigo no canto esquerdo com paredes, pilar, vigas, telhado de palha, porteira, palha e lamparina. Preserve posição 1:1 de todos esses elementos. Recrie parede e base da coluna onde as ânforas estavam. O vão entre os postes acima da palha é transparente assim como todo fundo fora do abrigo. Sem céu, mureta, ânforas, sombras pintadas no cenário ou chão externo. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Transparência real RGBA no resto do canvas, bordas limpas naturais.

### MM12-Q06 / L05-OBJ-anforas

> Gere de novo do zero uma única camada de cenário 2.5D da Cena 6 HESED MM12-Q06 L05-OBJ-anforas, usando a imagem inteira como referência de câmera, coordenadas, escala, paleta e luz. Somente as duas ânforas de barro lado a lado no terço inferior, exatamente na posição, dimensões relativas, escala e luz da referência. Reconstrua as silhuetas completas. Todo restante do canvas transparente, sem piso, pilar, parede, brilho externo ou sombras cortadas. A camada deve coincidir em tamanho e registro com as coordenadas do canvas original completo 1672x941, sem recentralizar nem aproximar os objetos e sem padding artificial. Use acabamento cinematográfico reverente, pictórico contido com papel muito suave, sem sépia. Personagens, animais, texto, marca, moldura ou xadrez desenhado proibidos. Transparência real RGBA no resto do canvas, bordas limpas naturais.

