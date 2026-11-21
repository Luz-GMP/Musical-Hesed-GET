# MM13-Q06 v16 · decomposição 2.5D · estudo v01

**Estado:** insert 2.5D renderizado e integrado à sequência visual alpha v03 para revisão. Esta exportação é silenciosa e ainda não está sincronizada ao master da música.

**Fonte:** `../MM13-Q06.png` (1672 × 941), quadro MM-13-Q06 v16. A imagem aprovada permanece intacta.

**Projeto animável:** `HESED_MM13_Q06_2p5d_study_v01.ecproj`
**Insert:** `HESED_MM13_Q06_v16_2p5D_v01.mp4` (6 s, 144 quadros).
**Prova estática:** `MM13-Q06_2p5d_preview_v01.png`, quadro em 00:00:03:00.
**Sequência de revisão:** `../../../MM-17/alpha-v03/HESED_C07_MM-17_santo-pra-sempre_alpha-v03.mp4` (24 s, 576 quadros; 1920 × 1080, 24 fps). A v16 ocupa 00:00:06–00:00:12, conforme a sequência visual anterior; esses tempos não são sincronismo musical aprovado.

## Pilha atual · topo para base

| Ordem | Camada | Arquivo/estrutura | Separação confirmada |
|---:|---|---|---|
| 1 | `MM13-Q06-L06-CHAR-anjos-grupo` | PNG com alpha | Grupo de anjos isolado do céu. Os anjos permanecem agrupados; não foram separados um a um. |
| 2 | `GFX-01 — Feixes de luz` | Caminhos vetoriais no `.ecproj` | Quatro feixes suaves, editáveis e independentes. São uma reconstrução gráfica do efeito de luz, não uma máscara extraída pixel a pixel. |
| 3 | `MM13-Q06-L05-OBJ-anforas` | PNG com alpha | As duas ânforas foram separadas juntas, como um par. |
| 4 | `MM13-Q06-L04-FG-muro-terreno` | PNG com alpha | Mureta, terreno nevado e vegetação de primeiro plano em um grupo. |
| 5 | `MM13-Q06-L03-FG-estabulo-lanterna` | PNG com alpha | Estábulo e lanterna permanecem juntos; a lanterna não está isolada do edifício. |
| 6 | `MM13-Q06-L02-MG-vila-arvores` | PNG com alpha | Vila, pontos de luz e árvores em um plano intermediário. Casas, janelas e árvores não foram recortadas individualmente. |
| 7 | `MM13-Q06-L01-BG-cleanplate` | PNG opaco | Placa limpa com céu, montanhas e vale; áreas atrás dos recortes foram reconstruídas para permitir deslocamentos curtos sem buracos visíveis na prova. |

## Animação montada para a revisão

- Parallax por profundidade com movimento eased de posição e escala ao longo de 6 s; deslocamentos de poucos pixels, do fundo para o primeiro plano.
- A vila entra primeiro; as ânforas aparecem em seguida; o grupo de anjos e os feixes de luz entram por fade. O estábulo preserva sua presença desde o início.
- Linguagem editorial contida: caminhos vetoriais de luz e entradas limpas, sem logotipo, título ou texto acrescentado ao quadro.
- O movimento é pensado para a passagem v16 existente (6–12 s da sequência visual), sem afirmar sincronismo musical; o alpha atual não tem áudio/master.

## Limites e revisão necessária

Os PNGs foram reconstruídos a partir da referência com geração de imagem, não obtidos por máscaras pixel a pixel. A placa de fundo reinterpreta alguns contornos de montanha e neve; a silhueta do grupo de anjos e o detalhamento das bordas também têm variações. Na prévia de 3 s não há buracos conspícuos, mas a separação permite apenas parallax curto e deve ser aprovada antes do render final. O original continua sendo a referência visual de autoridade.

Confirmação do que está separado: placa de fundo, plano da vila/árvores, estábulo/lanterna, primeiro plano muro/terreno, par de ânforas e grupo de anjos. Confirmação do que ainda está agrupado: anjos entre si, lanterna com estábulo, ânforas entre si e elementos menores da vila/vegetação.

## Próxima etapa

Revisar as separações e o alpha v03 com a direção, escolher os quadros geracionais e, quando o master chegar, alinhar a deixa real e a saída. O material continua como alpha silencioso de revisão; não define a operação do telão.
