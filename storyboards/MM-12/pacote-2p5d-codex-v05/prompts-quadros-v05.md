# Prompts dos 8 quadros · MM-12 · Estilo 2.5D v05

**Uso:** rodar **um quadro por chamada** no Codex (`image_gen` com referência anexada), começando obrigatoriamente pelo piloto **`MM12-Q01` + `MM12-Q06`**.  
**Regra de preservação:** salvar as saídas em `<pasta-local-MM12-v05>/bases-v05/MM12-QNN.png`. **Nunca sobrescrever** `storyboards/MM-12/MM12-Q01.jpg`–`Q06.jpg`.

---

## Bloco de estilo compartilhado (consistência da série v05)

> Estilo cinematográfico reverente com acabamento pictórico sutil (pincelada refinada e orgânica em nuvens, pedras, vegetação e paredes) e textura muito fina de papel algodão quente integrada à luz e aos meios-tons, remetendo à sensibilidade tátil e nobre da abertura de MM-16, sem perder a credibilidade espacial. **Sem** filtro sépia pesado, **sem** aparência de gravura/xilogravura chapada, **sem** contorno de tinta grossa, **sem** vinheta escura artificial nas bordas. Sombras profundas em azul-noturno legível (para painel LED), realces contidos sem branco estourado. Horizontal 16:9, preferencialmente 1920×1080 ou superior nativo (registrar a resolução real sem rotular como 4K se for menor). Sem pessoas, animais, bebê, anjos, placas, texto, letras, números, moldura ou colagem.

---

## Parte A · Adaptação dos 6 quadros existentes (preservar composição)

### 1. `MM12-Q01` · O caminho *(PILOTO 1)*
- **Referência obrigatória anexada:** `storyboards/MM-12/MM12-Q01.jpg`
- **Prompt:**
> Adapte a imagem anexada (`MM12-Q01.jpg`) mantendo fidelidade rigorosa à composição, câmera, perspectiva, relevo e luz, aplicando um acabamento cinematográfico pictórico refinado com textura muito sutil de papel algodão fino nos meios-tons e no céu. Preserve exatamente: grande oliveira e muro rústico de pedras grandes no primeiro plano à esquerda, estrada sinuosa de terra descendo do primeiro plano esquerdo-centro para o vale central, pedras e arbustos secos à direita, colinas da Judeia em camadas e luz quente de fim de tarde vindo da direita com nuvens douradas suaves. Suavize o excesso de nitidez fotográfica crua com pincelada cinematográfica orgânica e grão tátil discreto de papel, mantendo contraste natural e legibilidade à distância para telão LED. Não espelhar, não inventar cidade ou construções, não aplicar sépia pesado nem contorno de gravura. Sem pessoas, animais, texto, moldura ou elementos modernos. Uma única paisagem ocupando todo o quadro 16:9.

### 2. `MM12-Q02` · Belém ao longe
- **Referências obrigatórias anexadas:**
  1. `storyboards/MM-12/MM12-Q02.jpg` (referência principal de composição)
  2. `bases-v05/MM12-Q01.png` *(piloto aprovado — referência exclusiva de acabamento pictórico/papel)*
- **Prompt:**
> Adapte a PRIMEIRA imagem anexada (`MM12-Q02.jpg`) aplicando exatamente o mesmo acabamento cinematográfico pictórico e textura sutil de papel da SEGUNDA imagem (`MM12-Q01` v05), preservando integralmente a composição, a câmera e os volumes de `MM12-Q02`. Manter exatamente: povoado compacto de Belém em pedra clara e reboco terroso sobre a encosta no terço superior direito com pequenas luzes âmbar, trilha sinuosa subindo do primeiro plano central até a vila, encosta rochosa no primeiro plano esquerdo, oliveiras densas no primeiro plano direito, montanhas e vale aberto à esquerda e céu de fim de tarde esfriando para o crepúsculo com nuvens azul-acinzentadas e horizonte dourado suave à direita. Não mover a cidade, não espelhar, não acrescentar torres medievais, muralhas, rios ou estrelas sobrenaturais. Sem sépia pesado, sem gravura chapada, sem pessoas, animais, texto ou moldura. Quadro único 16:9.

### 3. `MM12-Q03` · A chegada
- **Referências obrigatórias anexadas:**
  1. `storyboards/MM-12/MM12-Q03.jpg` (referência principal de composição — D-46)
  2. `bases-v05/MM12-Q01.png` *(referência de acabamento pictórico/papel)*
- **Prompt:**
> Adapte a PRIMEIRA imagem anexada (`MM12-Q03.jpg`) aplicando o mesmo acabamento cinematográfico pictórico e textura sutil de papel algodão da SEGUNDA imagem, com fidelidade rigorosa à geometria aprovada (D-46). Preservar exatamente: casa de pedra clara irregular e porta grande fechada de madeira à ESQUERDA, lamparina âmbar acesa à direita da porta, degraus de pedra, jarro grande na margem esquerda, banquinho/vaso junto à parede, vigas e ramos de oliveira no alto esquerdo; caminho de terra no lado DIREITO da casa entrando pelo primeiro plano direito e curvando para a esquerda em profundidade, mureta de pedras e oliveira à direita, casas menores com lamparinas ao fundo e céu de crepúsculo azul com nuvens alaranjadas no horizonte. Manter o calor real da lamparina sem saturar artificialmente ou aplicar sépia pesado. Não espelhar, não alterar posição de porta, pedras ou rua. Sem pessoas, animais, texto ou moldura. Quadro único 16:9.

### 4. `MM12-Q04` · A noite *(pareado pixel a pixel com `Q03`)*
- **Referências obrigatórias anexadas:**
  1. `bases-v05/MM12-Q03.png` *(referência RIGOROSA de câmera, arquitetura e textura v05)*
  2. `storyboards/MM-12/MM12-Q04.jpg` *(referência da iluminação noturna aprovada — D-46)*
- **Prompt:**
> Crie `MM12-Q04` v05 como a versão NOTURNA exata da PRIMEIRA imagem anexada (`MM12-Q03` v05), usando a SEGUNDA imagem (`MM12-Q04.jpg`) como referência da paleta e iluminação noturna aprovadas. Prioridade absoluta: preservar exatamente a mesma câmera, perspectiva, porta de madeira à esquerda, pedras da fachada, lamparina, degraus, vasos, banquinho, ramos, mureta à direita, oliveira, curva da rua e todas as casas da PRIMEIRA imagem, mantendo o mesmo acabamento pictórico com textura fina de papel. Alterar somente o céu e a iluminação: substituir o crepúsculo alaranjado por céu azul-noturno profundo (`#142B49`) com nuvens suaves, aprofundar as sombras da rua em azul noturno legível e destacar o brilho quente âmbar (`#D3A15B`) das lamparinas sobre a pedra, a madeira e o chão próximo. Não mover objetos, não redesenhar a fachada, não espelhar. Sem pessoas, animais, lua grande, estrela brilhante, texto ou moldura. Quadro único 16:9.

### 5. `MM12-Q05` · Sem acolhimento
- **Referências obrigatórias anexadas:**
  1. `storyboards/MM-12/MM12-Q05.jpg` (referência principal de enquadramento mais próximo — D-46/D-47)
  2. `bases-v05/MM12-Q04.png` *(referência de identidade arquitetônica, paleta noturna e acabamento pictórico/papel v05)*
- **Prompt:**
> Adapte a PRIMEIRA imagem anexada (`MM12-Q05.jpg`) aplicando o mesmo acabamento cinematográfico pictórico, textura suave de papel e paleta noturna da SEGUNDA imagem (`MM12-Q04` v05). Preservar exatamente o enquadramento mais próximo da PRIMEIRA imagem: casa de pedra à ESQUERDA com grande porta de madeira fechada dominando o terço esquerdo, lamparina âmbar pendurada à direita da porta, degraus de pedra, banquinho de madeira e dois jarros de barro junto à parede, ramo de arbusto ao lado; passagem de terra no lado DIREITO da casa curvando para a esquerda em profundidade, mureta de pedras à direita e casas distantes com lamparinas sob céu azul-noturno profundo. Conservar a sensação silenciosa de porta fechada sem dramatizar rejeição e sem perder textura nas sombras. Não espelhar, não mudar a porta de lado, não aplicar sépia pesado. Sem pessoas, hospedeiro, placas, animais, texto ou moldura. Quadro único 16:9.

### 6. `MM12-Q06` · Um abrigo simples *(PILOTO 2 — COMPATIBILIDADE CRÍTICA COM CENA 7)*
- **Referências obrigatórias anexadas:**
  1. `storyboards/MM-12/MM12-Q06.jpg` *(referência RIGOROSA — versão restaurada D-46)*
  2. `storyboards/MM-13/estabulo-anjos-v09/MM13-Q06.png` *(referência de alinhamento com a Cena 7 — NÃO incluir anjos!)*
  3. `bases-v05/MM12-Q01.png` *(apenas referência de sensibilidade tátil, aplicada aqui de forma MUITO SUTIL)*
- **Prompt:**
> Adapte a PRIMEIRA imagem anexada (`MM12-Q06.jpg`) com FIDELIDADE GEOMÉTRICA ABSOLUTA e acabamento pictórico/papel MUITO SUTIL (40% a 50% de intensidade), de modo que a transição futura na Cena 7 para a SEGUNDA imagem (`MM13-Q06 v09`, que contém anjos) aconteça sem nenhum salto de arquitetura, perspectiva ou cor. **NÃO incluir anjos, luz celestial ou mudanças no céu vazio.** Preservar rigorosamente na mesma posição: estábulo à ESQUERDA com telhado de madeira e palha, interior iluminado em âmbar quente com lamparina pendurada, porteira de madeira e palha no chão, parede maciça de pedra vertical e pilar de madeira à direita da abertura do estábulo, par de ânforas de barro apoiadas na base da parede; à DIREITA, mureta baixa de pedras irregulares, pequeno arbusto, vale com ciprestes escuros e pequena Belém iluminada ao fundo, montanhas noturnas e céu azul-noturno com nuvens suaves. Unificar apenas o polimento pictórico delicado e microtextura quente de papel sem alterar contornos, proporções ou equilíbrio azul/âmbar. Sem pessoas, animais, bebê, manjedoura nova, anjos, estrelas brilhantes, texto ou moldura. Quadro único 16:9.

---

## Parte B · Novos quadros ponte (fluidez narrativa · sem renumerar Q01–Q06)

### 7. `MM12-Q07` · Entrada de Belém *(ponte entre `Q02` e `Q03`)*
- **Referências obrigatórias anexadas:**
  1. `bases-v05/MM12-Q02.png` *(relevo, estrada, vegetação e casario de Belém)*
  2. `bases-v05/MM12-Q03.png` *(arquitetura de pedra/madeira, lamparinas e luz de crepúsculo)*
- **Prompt:**
> Crie uma única imagem-base limpa `MM12-Q07` (Entrada de Belém) que funcione como ponte visual perfeita entre a PRIMEIRA imagem (`MM12-Q02` v05, Belém ao longe) e a SEGUNDA imagem (`MM12-Q03` v05, rua interna ao crepúsculo), usando exatamente o mesmo estilo cinematográfico pictórico com textura fina de papel algodão. Cena: a estrada rústica de terra e pedras se estreita ao alcançar a entrada natural do povoado de Belém (sem portão monumental ou muralha medieval). No plano médio-próximo à ESQUERDA, surge a primeira casa baixa de pedra clara irregular e telhado simples com uma primeira lamparina âmbar acesa junto à parede; à DIREITA, a mureta de pedras irregulares e galhos de oliveira emolduram o caminho que entra pelo primeiro plano direito-centro e curva suavemente para a esquerda adentrando a vila, onde se veem outras casas baixas de pedra e pequenas luzes quentes em profundidade. Céu em transição do fim de tarde de Q02 para o crepúsculo de Q03: azul profundo no topo e faixa dourado-alaranjada suave no horizonte direito. Composição com planos bem separados (primeiro plano de pedras/oliveira, primeira fachada à esquerda, casario intermediário e céu distante) pronta para animação 2.5D. Sem pessoas, animais, caravanas, torres medievais, placas, texto ou moldura. Quadro único 16:9.

### 8. `MM12-Q08` · Saída para os arredores *(ponte entre `Q05` e `Q06`)*
- **Referências obrigatórias anexadas:**
  1. `bases-v05/MM12-Q05.png` *(pedra, porta/lamparina da viela noturna que fica para trás)*
  2. `bases-v05/MM12-Q06.png` *(muro baixo de pedras, ciprestes, horizonte noturno e paleta azul/âmbar dos arredores)*
- **Prompt:**
> Crie uma única imagem-base limpa `MM12-Q08` (Saída para os arredores) que funcione como ponte visual perfeita entre a PRIMEIRA imagem (`MM12-Q05` v05, porta fechada na viela noturna) e a SEGUNDA imagem (`MM12-Q06` v05, abrigo simples no campo noturno), mantendo exatamente o mesmo estilo cinematográfico pictórico com textura sutil de papel (em intensidade contida compatível com `Q06`). Cena: a extremidade periférica onde a viela de Belém termina e se abre para o campo noturno. No terço ESQUERDO em primeiro plano/plano médio, a última esquina de uma casa de pedra rústica com brilho âmbar distante ficando para trás na viela; à DIREITA, o caminho de terra e pedras acompanha um muro baixo de pedras irregulares (mesma pedra da SEGUNDA imagem) e se abre para colinas noturnas onduladas, ciprestes escuros e pequenas luzes esparsas da vila ao fundo. NÃO mostrar ainda o estábulo, a palha, o telhado do abrigo ou a manjedoura — este quadro é a passagem silenciosa saindo da cidade rumo ao campo simples. Céu azul-noturno amplo (`#142B49`) com nuvens suaves, sombras azuis legíveis, sem estrela brilhante ou lua exagerada. Composição em planos bem distintos para 2.5D (esquina esquerda, muro/vegetação à direita, colinas/ciprestes/luzes da vila e céu noturno). Sem pessoas, animais, anjos, texto ou moldura. Quadro único 16:9.
