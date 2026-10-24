# Dependências entre produtores

Toda peça que encosta em outra tem uma **costura**: o último frame de uma precisa conversar com o primeiro da próxima, e as duas precisam usar paleta, escala e velocidade de movimento compatíveis. Se uma costura falha, o público vê a emenda.

Regra: **quem entrega primeiro manda o último frame (PNG em resolução final) + paleta + duração aproximada assim que tiver o alpha**, sem esperar o render final.

## Costuras

| De | Para | O que passa | Por que importa |
| --- | --- | --- | --- |
| MM-04 (Melissa) | MM-05 (Lucas) | Imagem-base e paleta da criação | A queda é a corrupção *do mesmo mundo*, não um vídeo novo |
| MM-06 (Isaac) | MM-07 (Eduardo) | Frame/loop do bebê | Nasceu em Belém começa de onde a regressão parou (ver D-01) |
| MM-09 (Melissa) | MM-10 (Eduardo) | Último estado visual dos profetas | Passagem do histórico para o cósmico |
| MM-10 (Eduardo) | MM-11 (Isaac) | Último estado do universo/luz | Luz do Mundo nasce da luz que o MM-10 deixou |
| MM-12 (Lucas) | MM-13 (Eduardo) | Paisagem noturna/estábulo à esquerda da imagem (D-45), com volume ampliado para a direita; campo à direita | O nascimento cresce no mesmo espaço até a glória; preservar casa à esquerda e caminho à direita da casa em Q03–Q05, curvando para a esquerda em profundidade |
| MM-14 (Melissa) | MM-15 (Lucas) | Ritmo de corte e tratamento de cor | Contraste deliberado: aprisionamento → restauração |
| MM-02 (Victor) | MM-08 (Isaac) | Lista de takes de Goel usados | Evitar repetir as mesmas imagens (P-04) |
| MM-16A/B/C/D | MM-16 (Lucas) | Módulos com margem nas pontas | Conform precisa de "sobra" para transicionar |

## Diagrama

```mermaid
flowchart LR
  subgraph C3[Cena 3]
    MM04[MM-04 Melissa<br/>criação] --> MM05[MM-05 Lucas<br/>queda]
    MM05 --> MM06[MM-06 Isaac<br/>regressão → bebê]
    MM06 --> MM07[MM-07 Eduardo<br/>Nasceu em Belém]
  end
  subgraph C5[Cena 5]
    MM09[MM-09 Melissa<br/>profetas] --> MM10[MM-10 Eduardo<br/>universo] --> MM11[MM-11 Isaac<br/>Luz do Mundo]
  end
  subgraph C67[Cenas 6–7]
    MM12[MM-12 Lucas<br/>viagem/estábulo] --> MM13[MM-13 Eduardo<br/>anjos]
  end
  subgraph C8[Cena 8]
    MM14[MM-14 Melissa<br/>pecados] --> MM15[MM-15 Lucas<br/>atos de Jesus]
  end
  subgraph C9[Cena 9 · filme final]
    A[16A Melissa] --> B[16B Lucas] --> C[16C Isaac] --> D[16D Eduardo]
    A & B & C & D -.-> M[MM-16 conform<br/>Lucas]
  end
  MM02[MM-02 Victor<br/>recap Goel] -. divide arquivo .- MM08[MM-08 Isaac<br/>Goel/graça]
```

## Quem depende de quem (resumo por pessoa)

- **Victor:** combina arquivo de Goel com Isaac.
- **Melissa:** entrega para Lucas (MM-04, MM-14), Eduardo (MM-09) e Lucas no conform (16A).
- **Isaac:** entrega para Eduardo (MM-06); recebe de Eduardo (MM-10); combina com Victor (Goel); entrega 16C para Lucas.
- **Eduardo:** recebe de Isaac (MM-06), Melissa (MM-09) e Lucas (MM-12); entrega para Isaac (MM-10) e 16D para Lucas.
- **Lucas:** recebe de Melissa (MM-04, MM-14) e de todos no MM-16; entrega para Eduardo (MM-12). É o gargalo do final, então os módulos do MM-16 precisam chegar cedo.
