# Storyboards

Uma pasta por peça. Cada pasta já tem um `README.md` com a ficha do storyboard: é ele que aparece quando você abre a pasta no site.

Storyboard é a etapa 🎨 do [fluxo de trabalho](../guias/fluxo-de-trabalho.md). Não precisa ser bonito: foto de desenho no papel, print do Canva ou frame tirado de uma referência servem. O objetivo é a equipe (e o vizinho de costura) entender a sequência antes do alpha.

## Construção e briefing de cada quadro

**Storyboards ligados à música** seguem o padrão das pranchas do Eduardo (Dudu): cabeçalho com objetivo/estilo, quadros descritos e bloco de momentos musicais/impactos ligado aos quadros. **Os demais** podem usar uma estrutura mais simples com gatilhos de fala/operação. **Todos** devem apresentar paleta com amostras e nomes, luz/atmosfera, elementos visuais, movimento/efeitos e continuidade. O [guia canônico](guia-de-construcao.md) detalha os blocos e exemplos. Sem master, o mapa musical fica como estudo com tempos a definir; não usar forma de onda inventada.

- [Guia de construção](guia-de-construcao.md): como planejar as composições, manter continuidade e passar da prancha para imagens individuais.
- [Briefings dos quadros](briefings-dos-quadros.md): caderno vivo com o detalhamento e o prompt de cada imagem. A versão inicial cobre os 46 quadros das referências de MM-07, MM-10, MM-13 e MM-16D; novas peças e revisões devem ser registradas nele.

As referências visuais orientam a construção. Tempos, sincronização e pontos de continuidade dependem das fontes e confirmações indicadas nos documentos.

## Nomes dos arquivos

Prancha completa: **`STB MM09.jpg`**. Quadro individual: **`MM09-Q01.png`**, com dois dígitos e a extensão real. Para módulos, mantenha a letra: `STB MM16D.png`. O prefixo `STB` identifica o arquivo que reúne os quadros; não nomeie uma prancha como um quadro individual. Veja as [regras e variações de luz](../guias/entrega-e-arquivos.md#padrão-de-nomes) e o [inventário completo](inventario-de-arquivos.md). A versão artística e a aprovação continuam na ficha.

## Como preencher pelo site

1. Abra a pasta da sua peça (ex.: `storyboards/MM-06`).
2. **Subir os esboços:** clique em **Add file → Upload files**, arraste as imagens e clique em **Commit changes**. Na MM-06, use `MM06-Q01.jpg`, `MM06-Q02.jpg` etc. para quadros individuais; a prancha completa usa `STB MM06.jpg`. Preserve a extensão real. Consulte o [padrão canônico de nomes](../guias/entrega-e-arquivos.md#imagens-de-storyboard--padrão-canônico).
3. **Preencher a ficha:** clique no `README.md` da pasta, depois no lápis (✏️). Na coluna "Esboço", escreva `![](MM06-Q01.jpg)` para mostrar o quadro 1, se esse arquivo existir. Para a prancha, use `![](<STB MM06.jpg>)`. Precisa de mais quadros? Copie uma linha da tabela.
4. Clique em **Commit changes** e mude sua etapa no [STATUS.md](../STATUS.md) para 🎨.

Mudou um quadro em revisão? O histórico Git guarda a anterior. Preserve a imagem aprovada; se precisar manter revisões simultâneas, use subpastas de versão com os mesmos nomes padronizados.

## O que pode subir aqui

- ✅ Esboços leves em **JPG ou PNG** (até ~2 MB cada) ou um **PDF** curto exportado do Canva.
- ❌ Vídeo, animatic, projeto de edição, imagens-base em 4K: isso vai para o Drive (ver [entrega e arquivos](../guias/entrega-e-arquivos.md)). Se tiver um animatic, cole o link do Drive em "Notas e feedback".

## Peças

| Peça | Responsável |
| --- | --- |
| [MM-01](MM-01/) · [MM-02](MM-02/) · [MM-03](MM-03/) | Victor |
| [MM-04](MM-04/) · [MM-09](MM-09/) · [MM-14](MM-14/) · [MM-16A](MM-16A/) | Melissa |
| [MM-06](MM-06/) · [MM-08](MM-08/) · [MM-11](MM-11/) · [MM-16C](MM-16C/) | Isaac |
| [MM-07](MM-07/) · [MM-10](MM-10/) · [MM-13](MM-13/) · [MM-16D](MM-16D/) | Eduardo |
| [MM-05](MM-05/) · [MM-12](MM-12/) · [MM-15](MM-15/) · [MM-16B](MM-16B/) | Lucas |

O MM-16 (conform do Lucas) não tem pasta própria: ele é montado a partir dos storyboards dos módulos 16A a 16D.
