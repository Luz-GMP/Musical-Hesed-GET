# Aprendizados de produção · vinheta Cia LUZ B01B

**Registro:** 21/10/2026 · **Direção e aprovação:** Victor · **Resultado observado:** V06 visual aprovada.<br>
**Aplicação:** vinhetas, logos animadas, composições em profundidade, neblina procedural e travellings produzidos por código.

Este registro transforma em procedimento reutilizável o que foi validado durante a produção da vinheta Cia LUZ. A aprovação se refere ao visual silencioso da B01B; não transforma duração, paleta, cenário ou movimento desta peça em padrão obrigatório para outros vídeos.

## 1. Identidade visual é um asset, não um texto

- Quando a direção fornece uma logo canônica, usar o próprio arquivo raster ou vetorial como camada. Não redigitar a marca, procurar uma fonte parecida nem reconstruir letras por conveniência de animação.
- Conferir transparência, dimensões, recorte e hash do arquivo antes de animar. Derivações de trabalho devem manter os pixels e a proporção do original.
- Referência de linguagem não autoriza reutilizar propostas antigas ou copiar a marca da referência. Na B01B, o acabamento foi inspirado por uma abertura cinematográfica, mas a identidade permaneceu a arte canônica Cia LUZ.

## 2. Uma entrada contínua precisa de uma única curva

- Se a direção pede redução fluida entre uma escala inicial e uma final, calcular todo o percurso com uma única curva monotônica. Não costurar uma pré-entrada a uma segunda animação no meio do trajeto.
- Não usar `spring` quando não houver intenção de rebote. Overshoot, troca de easing ou waypoint intermediário podem parecer trava, quicada ou dois movimentos consecutivos.
- O fade e a animação podem se sobrepor: a logo pode começar em escala extrema enquanto o quadro ainda emerge do preto. A escala inicial deve impedir a leitura imediata da marca sem exigir um corte de visibilidade.
- Validar a trajetória em movimento e, quando possível, verificar que os valores de escala são monotônicos. Quadros isolados não revelam uma queda de velocidade, pausa curta ou retomada.

## 3. Chegada, impacto e reação formam uma cadeia causal

- Primeiro a logo alcança exatamente sua escala final. Nesse mesmo evento começa o impacto visual; o impacto dispara a primeira reação do ambiente.
- Não redimensionar novamente a logo para simular o impacto quando a direção não pede rebote. Preferir pulso de luz, deslocamento curto da atmosfera, vibração controlada ou resposta de elementos do cenário.
- Luzes acionadas pelo impacto devem iniciar no mesmo frame ou em atraso deliberado registrado. Os grupos seguintes podem alternar, mas precisam parecer consequências do evento inicial.
- Conferir separadamente: último frame da entrada, primeiro frame do impacto, pico, retorno e primeiro acendimento. Uma defasagem curta pode destruir a relação de causa e efeito.

## 4. Movimento de câmera precisa afetar o espaço inteiro

- Aumentar apenas a logo faz parecer que ela avança contra a câmera. Para atravessar a logo, usar um parâmetro comum de câmera que também aproxime o cenário, altere a perspectiva do primeiro plano e conduza a passagem para o plano seguinte.
- Tratar a logo como um plano estacionário no espaço. Seu aumento durante a aproximação deve resultar da perspectiva da câmera; depois que a câmera cruza esse plano, a logo sai do quadro e o travelling continua em direção ao fundo.
- Em composição 2D/2.5D, vincular `cameraProgress` ao crop/zoom dos panoramas, à escala em perspectiva do plano frontal e, quando necessário, à velocidade aparente da atmosfera. Evitar curvas independentes sem relação física.
- Usar pontos de vista canônicos do mesmo cenário. Transições entre panoramas devem preservar eixo, horizonte, ponto de fuga, escala e direção do movimento.

## 5. Atmosfera orgânica exige profundidade

- Uma textura única deslocada sobre a tela produz aparência chapada. Separar a neblina em planos com densidade, velocidade, direção, altura e respiração distintas.
- A configuração validada usou atmosfera alta atrás/acima da penitenciária, camada suave na fachada, camada de pátio/guarita, camada mais densa no plano da logo, véu diante da logo e banco de primeiro plano.
- Fazer as camadas reagirem de maneira diferente ao impacto. A resposta não deve mover toda a neblina como uma placa única.
- Manter o cenário legível. Densidade e contraste devem apoiar profundidade e clima sem apagar a logo, a guarita, os acessos e a penitenciária.

## 6. QA de movimento é diferente de QA de composição

- Prancha de quadros confirma composição, continuidade, texto e estados críticos; não comprova fluidez, velocidade, impacto ou travelling.
- Assistir à prévia codificada completa. Revisar em especial intervalos curtos ao redor de mudanças de curva, chegada, impacto, acendimento e travessia de planos.
- Conferir metadados do MP4 real, quantidade de frames, duração, resolução, fps, codec e pixel format. Ferramentas como `blackdetect` e `freezedetect` auxiliam, mas não substituem a inspeção: fade preto e repousos intencionais podem gerar alertas legítimos.
- Preservar versões aprovadas em novos nomes. Uma correção perceptível gera nova versão e nova conferência; não sobrescrever a evidência aprovada.

## 7. Desempenho sem alterar o desenho

- Escalas iniciais muito grandes não devem criar bitmaps intermediários gigantes. Projetar apenas o viewport visível por transformação inversa/afim reduz memória e tempo sem modificar o asset canônico.
- Calcular campos procedurais de neblina em resolução menor e ampliar somente a máscara suavizada pode preservar a aparência e reduzir custo.
- Em máquinas com poucos núcleos, renderizar intervalos contíguos em paralelo e concatenar somente arquivos com parâmetros idênticos. Verificar duração, total de frames e costuras depois da concatenação.
- Instalar uma biblioteca npm não conecta automaticamente um plugin ou navegador do aplicativo. Registrar separadamente ferramenta conectada, biblioteca local e motor efetivamente usado. Na V06, Remotion 4.0.537 gerou as curvas; Pillow compôs os planos e FFmpeg codificou o MP4.

## 8. Estado aprovado e responsabilidade do áudio

- A V06 visual silenciosa da B01B foi aprovada por Victor em 21/10/2026: 15 s, 1920 × 1080, 30 fps e 450 quadros.
- Por direção explícita, o MP4 não deve ser incluído no repositório nesta etapa. Victor fará pessoalmente a inserção da trilha e dos efeitos e depois colocará o vídeo final no repositório.
- Não adicionar, mixar, substituir ou publicar áudio por iniciativa do agente. Quando o arquivo final chegar, medir e registrar a nova versão; mudanças de duração ou sincronismo exigem QA dos pontos afetados.

## Checklist reutilizável

- [ ] Asset canônico usado diretamente, sem recriação tipográfica.
- [ ] Curva de entrada única e monotônica quando não houver rebote dirigido.
- [ ] Chegada, impacto e primeiro evento ambiental conferidos no frame correto.
- [ ] Travelling vincula primeiro plano, cenário e perspectiva à mesma câmera.
- [ ] Atmosfera dividida em planos independentes.
- [ ] Prancha estática e prévia em movimento inspecionadas.
- [ ] MP4 real validado por metadados, duração e total de frames.
- [ ] Versão anterior preservada.
- [ ] Responsabilidade por trilha, SFX, mixagem e publicação registrada.

