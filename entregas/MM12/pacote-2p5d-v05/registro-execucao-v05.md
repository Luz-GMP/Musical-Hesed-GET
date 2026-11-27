# Cena 6 · Viagem a Belém e chegada ao abrigo (MM-12) · Piloto v05

**26/11/2026 · Q01 O caminho e Q06 Um abrigo simples · Etapa 0 · Aguardando aprovação visual de Victor.**

## Direção e operação

- Fontes consultadas — AGENTS.md, CLAUDE.md, CODEX.md, guia de construção, caderno MM-12 incluindo Q07/Q08, os três arquivos do pacote v05, ficha MM-12, inventário, fichas Cenas 6–7, roteiro Cenas 6–7, briefing, Bíblia v0.1 §§2.1, 3, 4.1, 5.1–5.2, alinhamento das fontes e decisões D-46, D-47, D-55, D-60 e D-61. O PDF de montagem referenciado nas fichas está ausente nesta cópia local. Foram usadas a ficha de cada cena e as falas do roteiro para identificar as deixas.
- Q01 recebe o céu final de *Ó Noite Santa* (Cena 5, Isaac). A ficha operacional chama a viagem quando Mari fala de José indo a Belém. O caderno propõe entrar no começo do recenseamento, “Naquela época, foi decretado…”. Fechar o ponto exato no ensaio com Victor e a operação.
- Q06 recebe a sequência de busca de hospedagem. A ficha usa “Sim. E foi ali que Jesus nasceu”; o caderno indica “…onde os animais ficavam”. Escolha de ensaio a confirmar com Victor. Maria, José e o presépio ficam no palco, com o abrigo vazio em posição neutra no telão durante a entrada da Cena 7. A operação chama MM13-Q06 v09 em “uma multidão de anjos apareceu” (D-61). *Santo pra Sempre* entra depois, na fala das gerações, sob responsabilidade de Victor nesta cena. A peça MM-12 acompanha diálogo ao vivo e os pontos exatos serão aferidos em ensaio.

## Execução e conferência

- ImageGen integrado para as duas adaptações e cinco reconstruções auxiliares. Q01 usa a adaptação nativa. Para Q06, os pixels da edição estilizada foram misturados a 45% sobre os pixels do JPG original, no mesmo canvas, para reduzir textura e variação tonal. As três entradas foram preservadas. Canvas de cada base, camada e prévia 1672 × 941 px em RGB/RGBA de 8 bits, sem ampliação. A comparação usa os dois quadros inteiros à escala nativa e faixa de identificação.
- Recortes registrados por máscaras de geometria e cor, antisserrilhadas, seguidos de recomposição com alpha reto. As áreas ocultas usam as reconstruções de céu, vale, chão e parede, com extensão atrás das silhuetas. O fundo tem preenchimento opaco integral. Os recortes trazem alguma sobreposição de ambiente nos limites suavizados, especialmente perto das folhas, palha e transições da encosta. Avaliar amplitudes maiores no HyperFrames. A extensão em porcentagem ao longo de todo contorno não foi medida.
- Teste neutro independente dos PNGs salvos: diferença RGB máxima 0/255 entre a base e a pilha em ambos os quadros. As sete camadas RGBA contêm pixels alpha 0, 255 e intermediários. As duas placas L01 são RGB opacas. Prova deslocada com L01 −10, L02 0, L03 +18, L04 +32 e, no Q06, L05 +38 px, com reenquadramento central de aproximadamente 1,05× para manter a margem do deslocamento fora de quadro. Sem buracos de transparência visíveis na prova.
- Q06 → MM13-Q06 v09: correlação local de intensidade em busca de ±4 px encontrou melhor alinhamento em (0, −1) na lamparina e no pilar, e em (0, 0) nas ânforas e na mureta. Os marcos frontais correspondem visualmente. A v09 tem céu e crista diferentes e é ligeiramente mais fria e clara na mureta. Essas diferenças estão expostas na comparação e serão avaliadas no corte de palco.
- P-13 — pacote na pasta local de produção `entregas/MM12/pacote-2p5d-v05/`, protegida por exclusão local de Git. O destino compartilhado e backup seguem pendentes. Aprovação artística, ensaio da transição e teste no LED estão pendentes. Somente o piloto está em revisão.

## Arquivos e integridade

| Caminho | Dimensões (px) | Modo | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| `bases-v05/MM12-Q01.png` | 1672 × 941 | RGB | 3057528 | `c39dcfddfd1de7900c8e4afbf2ad8b08398fa92a54201126e773959ad5e7f3ef` |
| `bases-v05/MM12-Q06.png` | 1672 × 941 | RGB | 2424614 | `fd71624e9e8a70eb34b7537734a02c6a5347ab4f6838fba25dd51fb8840a7b7c` |
| `comparacao-MM12-Q06-v05_MM13-Q06-v09.png` | 3356 × 989 | RGB | 4964397 | `a9894dd2d753cd2db147e7d33e8dcc0d9821577b5ca206163cabaf9db22e11a9` |
| `layers-v05/MM12-Q01/MM12-Q01-L01-BG-cleanplate.png` | 1672 × 941 | RGB | 2131442 | `7a82af877099989ab2a576788b794de58d675017a58e55f3c9f50cabd78e9393` |
| `layers-v05/MM12-Q01/MM12-Q01-L02-MG-vale-trilha.png` | 1672 × 941 | RGBA | 2816073 | `4ce9488c6cd362b0e60a220afac3bf8e747d7e4f333da51b9717d7a16875a799` |
| `layers-v05/MM12-Q01/MM12-Q01-L03-FG-dir-pedras-arbustos.png` | 1672 × 941 | RGBA | 798200 | `355bc7170918334d6437493720f8feb035c23e70ae635f865f783458e2b93313` |
| `layers-v05/MM12-Q01/MM12-Q01-L04-FG-esq-muro-oliveira.png` | 1672 × 941 | RGBA | 1005672 | `c075554a562537c562933d87fa5f81aa37a79bf9642da9adfc39407509fdd8fc` |
| `layers-v05/MM12-Q01/preview_shift.png` | 1672 × 941 | RGB | 3001140 | `0fef5c7e44ae537aab0b0d2949257baec711ac76204e009fbf157df808a0f58b` |
| `layers-v05/MM12-Q01/preview_stack.png` | 1672 × 941 | RGB | 3057528 | `c39dcfddfd1de7900c8e4afbf2ad8b08398fa92a54201126e773959ad5e7f3ef` |
| `layers-v05/MM12-Q06/MM12-Q06-L01-BG-cleanplate.png` | 1672 × 941 | RGB | 1745683 | `29e051f052711a734f60117daee84e71b9513d036c287dbbe3654b02714c86a6` |
| `layers-v05/MM12-Q06/MM12-Q06-L02-MG-belem-ciprestes.png` | 1672 × 941 | RGBA | 1996464 | `92b0046decd18f0b3b02e3de1841c689b10de443ac10fe4351278d8e4135770c` |
| `layers-v05/MM12-Q06/MM12-Q06-L03-FG-dir-mureta-chao.png` | 1672 × 941 | RGBA | 1045813 | `0531953b7ca2dbfc68550fac41e94739ffb1f253bd790f8901b03c4f26b3e4f0` |
| `layers-v05/MM12-Q06/MM12-Q06-L04-FG-esq-estabulo.png` | 1672 × 941 | RGBA | 1241972 | `b70b1c302b4b15f426d7246381b83ee83018cde60b9dfa4ae24b61194ca8c3c7` |
| `layers-v05/MM12-Q06/MM12-Q06-L05-OBJ-anforas.png` | 1672 × 941 | RGBA | 75020 | `7db020064dfcca5959411247116262532dcc61bb0f9bf5aad16afd3241b16a8f` |
| `layers-v05/MM12-Q06/preview_shift.png` | 1672 × 941 | RGB | 2438016 | `a17d66fbc203320a0ddda7c43a44389aba1ab39a7b1c2835f675950cbf748221` |
| `layers-v05/MM12-Q06/preview_stack.png` | 1672 × 941 | RGB | 2424614 | `fd71624e9e8a70eb34b7537734a02c6a5347ab4f6838fba25dd51fb8840a7b7c` |

## Referências originais

| Caminho na raiz do acervo | Dimensões (px) | Modo | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| `storyboards/MM-12/MM12-Q01.jpg` | 1672 × 941 | RGB | 788559 | `5a2fa7e28a08bdb690e8c0e201a1596155600e6a2abc61ca52f641c318979638` |
| `storyboards/MM-12/MM12-Q06.jpg` | 1672 × 941 | RGB | 560115 | `105d9ee6b9de7104efb6ea4e8e13eb39bdf8e86b949a882433883d2007c44058` |
| `storyboards/MM-13/estabulo-anjos-v09/MM13-Q06.png` | 1672 × 941 | RGB | 2486192 | `6e7d846fb4e647cf00a09aed3437dee29595278a1d2d99dd53ecaae014f6d92a` |

## Prompts efetivamente enviados ao ImageGen

### Q01 · base

> Adapte a imagem anexada (`MM12-Q01.jpg`) mantendo fidelidade rigorosa à composição, câmera, perspectiva, relevo e luz, aplicando um acabamento cinematográfico pictórico refinado com textura muito sutil de papel algodão fino nos meios-tons e no céu. Preserve exatamente: grande oliveira e muro rústico de pedras grandes no primeiro plano à esquerda, estrada sinuosa de terra descendo do primeiro plano esquerdo-centro para o vale central, pedras e arbustos secos à direita, colinas da Judeia em camadas e luz quente de fim de tarde vindo da direita com nuvens douradas suaves. Suavize o excesso de nitidez fotográfica crua com pincelada cinematográfica orgânica e grão tátil discreto de papel, mantendo contraste natural e legibilidade à distância para telão LED. Não espelhar, não inventar cidade ou construções, não aplicar sépia pesado nem contorno de gravura. Sem pessoas, animais, texto, moldura ou elementos modernos. Uma única paisagem ocupando todo o quadro 16:9.

### Q06 · base

> Adapte a PRIMEIRA imagem anexada (`MM12-Q06.jpg`) com FIDELIDADE GEOMÉTRICA ABSOLUTA e acabamento pictórico/papel MUITO SUTIL (40% a 50% de intensidade), de modo que a transição futura na Cena 7 para a SEGUNDA imagem (`MM13-Q06 v09`, que contém anjos) aconteça sem nenhum salto de arquitetura, perspectiva ou cor. **NÃO incluir anjos, luz celestial ou mudanças no céu vazio.** Preservar rigorosamente na mesma posição: estábulo à ESQUERDA com telhado de madeira e palha, interior iluminado em âmbar quente com lamparina pendurada, porteira de madeira e palha no chão, parede maciça de pedra vertical e pilar de madeira à direita da abertura do estábulo, par de ânforas de barro apoiadas na base da parede; à DIREITA, mureta baixa de pedras irregulares, pequeno arbusto, vale com ciprestes escuros e pequena Belém iluminada ao fundo, montanhas noturnas e céu azul-noturno com nuvens suaves. Unificar apenas o polimento pictórico delicado e microtextura quente de papel sem alterar contornos, proporções ou equilíbrio azul/âmbar. Sem pessoas, animais, bebê, manjedoura nova, anjos, estrelas brilhantes, texto ou moldura. Quadro único 16:9. A primeira referência é o alvo com geometria fixa. Use a segunda apenas para conferir arquitetura e balanço azul/âmbar, sem copiar anjos, nuvens ou relevo. Alteração apenas superficial, com 45% da intensidade de textura de Q01.

### Q01 · fundo

> Edite a imagem MM12-Q01 para reconstruir a placa opaca de fundo 2.5D. Preserve no centro e à direita o céu dourado, nuvens e cordilheiras longínquas no mesmo registro e canvas. Remova totalmente a grande oliveira e o muro à esquerda, as pedras e arbustos de primeiro plano e o vale intermediário com a trilha, preenchendo com continuidade realista do céu, serras distantes e encostas longínquas discretas na metade inferior. Sem árvores próximas, caminho ou construções. Estética pictórica fina da referência. Canvas integral.

### Q01 · reconstrução intermediária

> Inpainting para sobreposições ocultas 2.5D de MM12-Q01. Mantenha câmera, trilha central e todo o vale intermediário com suas oliveiras no mesmo lugar. Remova a grande oliveira e o muro à esquerda, e as pedras e arbustos grandes à direita no primeiro plano. Preencha as áreas liberadas com continuação do vale, terra, trilha e vegetação de escala intermediária consistentes com as bordas. Preserve a trilha e as cores da imagem. Sem pessoas, texto ou colagem. Canvas integral.

### Q06 · fundo

> Reconstrua a placa limpa 2.5D de MM12-Q06 mantendo céu azul noite e montanhas distantes rigorosamente alinhados à referência nos lugares visíveis. Remova todo o estábulo, lamparina, ânforas, muro baixo, chão imediato com luz laranja, Belém e ciprestes. Continue céu e montanhas naturalmente à esquerda e vale vazio azul escuro na metade inferior. Não mova a crista visível, não adicione cidade, objetos, personagens ou texto. Quadro horizontal integral.

### Q06 · reconstrução intermediária

> Faça inpainting de MM12-Q06: remova todo o estábulo à esquerda, ânforas e mureta/terra imediata e reconstrua a encosta rural e vale noturno atrás. Preserve com rigor a mesma câmera, a crista da montanha, o céu, todas as casas e ciprestes existentes à direita com a mesma posição e dimensão. Não acrescente construções à esquerda, deixe terreno e colinas rural azul-noturno. Sem anjos ou texto. Canvas integral.

### Q06 · parede atrás das ânforas

> Inpainting restrito em MM12-Q06: apague SOMENTE o par de ânforas na frente do pilar esquerdo, preenchendo sua silhueta com a continuidade da parede de pedra, base da coluna e chão. Preserve rigorosamente a câmera, a mureta, a parede, o entorno e a luz. Quadro integral.

## Prova de visualização dos recortes

[Prancha das nove camadas](prova-camadas-2p5d.png), com fundo xadrez para revelar o alpha. Os PNGs de animação são os arquivos individuais L01–L04 e L01–L05 listados acima.

PNG RGB 1320 × 1128 px, 733052 bytes. SHA-256 `98e4025b548d563ff71ecc82ba0c365190f80457ffae7738e0d041edb2638e5f`.
