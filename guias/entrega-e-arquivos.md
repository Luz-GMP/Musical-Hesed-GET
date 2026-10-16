# Entrega e organização de arquivos

## Onde fica o quê

| Tipo | Onde | Por quê |
| --- | --- | --- |
| Texto, status, decisões, guias | **Este repositório** | Histórico, todo mundo vê a mesma versão |
| Esboços de storyboard (JPG/PNG leves) | **Este repositório**, em [storyboards/](../storyboards/) | Ficam ao lado da ficha da peça e todo mundo vê sem abrir o Drive |
| Vídeos, imagens, projetos, áudios | **Drive compartilhado** (link: _a definir, P-13_) | Arquivos grandes; Git não foi feito para isso |

**Não suba vídeo, projeto de edição ou áudio no repositório.** O `.gitignore` já bloqueia os formatos comuns.

## Estrutura sugerida no Drive

```
HESED_Telão/
├── 00_Fontes/            roteiro, briefing, audio masters (P-02), arquivo de Goel (P-03)
├── 01_Referências/       uma subpasta por MM
├── MM-01_Victor/
│   ├── alpha/
│   ├── final/
│   ├── projeto/          arquivo editável + assets
│   └── emergencia/       still de emergência
├── MM-02_Victor/
├── ...
├── MM-16_Conform_Lucas/
└── 99_Operação/          pasta final que vai para o computador do telão
```

## O que entregar em cada peça

- [ ] Arquivo final renderizado para o telão
- [ ] Arquivo editável / projeto
- [ ] Assets necessários para alterações posteriores
- [ ] Still de emergência (imagem que substitui o vídeo se ele falhar)
- [ ] Versão claramente identificada (v01, v02...)
- [ ] Backup do aprovado em um segundo lugar

## Padrão de nomes

### Imagens de storyboard · padrão canônico

Por orientação do usuário na tarefa **Storyboards Hesed-GET**, usar os nomes abaixo para salvar pranchas e imagens individuais. Esta regra substitui as sugestões anteriores de `prancha-vNN`, `q01` ou prefixos longos `HESED_C...` para essas imagens.

| Tipo | Nome sem extensão | Exemplo de arquivo |
| --- | --- | --- |
| Prancha completa do storyboard | `STB MMNN` | `STB MM09.jpg` |
| Imagem individual do quadro | `MMNN-QNN` | `MM09-Q01.png` |
| Prancha de módulo do filme final | Preservar a letra do MM | `STB MM16D.jpg` |
| Quadro de módulo do filme final | Preservar a letra e numerar o quadro | `MM16D-Q01.png` |

- Usar `STB` e `MM` em maiúsculas. Na prancha, há **um espaço** entre `STB` e `MM09`; no nome do arquivo, não há hífen entre `MM` e `09`.
- Usar dois dígitos para o MM e para o quadro: `Q01`, `Q02` … `Q10`. Evitar `Q1`, `quadro-1`, nomes automáticos da ferramenta e descrições acrescentadas ao nome canônico.
- Preservar a extensão correspondente ao formato real (`.jpg`, `.png` etc.). Trocar a extensão não converte uma imagem; não fazer conversões apenas para padronizar nomes.
- Salvar na pasta da peça: `storyboards/MM-09/STB MM09.jpg` e `storyboards/MM-09/MM09-Q01.png`. A pasta e os IDs textuais continuam com hífen: `MM-09` e `MM-09-Q01`. A diferença entre ID e nome de arquivo é intencional.
- A regra vale para arquivos de imagem de prancha e quadros, inclusive bases individuais e suas cópias leves quando existirem. Miniatura e original de um mesmo quadro ficam em locais distintos, identificados no registro; não criar dois arquivos concorrentes como oficiais.
- Versão, aprovação, dimensões e feedback ficam na ficha da peça e no caderno. O nome canônico sozinho não indica versão nem aprovação. Não adicionar `-v03` ou outro sufixo por iniciativa do agente; usar nome diferente apenas quando solicitado explicitamente.
- Renomear não autoriza regenerar, alterar conteúdo, excluir uma referência ou sobrescrever uma imagem aprovada. Preservar o histórico no Git e registrar a correspondência entre nome antigo, novo e versão artística. Para substituição de conteúdo, seguir a autorização e as decisões da peça; se for necessário guardar variantes simultâneas, registrar destinos separados sem disputar o mesmo caminho canônico.
- Ao salvar ou renomear, atualizar os links em Markdown, fichas, registros e instruções dos agentes. Manter a identidade/versão artística: por exemplo, uma referência V03 continua sendo V03 após receber o nome canônico da peça.
- Antes de publicar, conferir nomes, extensão real, links e ausência de colisões. O padrão organiza os arquivos; não altera a política de mídia pesada no Drive.

As três variações de iluminação da casa são pranchas completas: `STB MM03-01.jpg` (noite, todas as luzes acesas), `STB MM03-02.jpg` (noite, só luz central) e `STB MM03-03.jpg` (noite, só luar). A composição oficial diurna é `STB MM03.jpg`, versão artística V03. Esses sufixos identificam variações de luz, não quadros individuais.

O [inventário dos arquivos](../storyboards/inventario-de-arquivos.md) registra a conferência e os nomes anteriores. Prompts e documentos-fonte conservam seus nomes e conteúdo histórico.

### Vídeos e demais entregas

Os formatos abaixo continuam como referência para vídeos e imagens de outras entregas que não sejam pranchas ou quadros de storyboard:

```
Vídeo:       HESED_C[NN]_MM-[NN]_[descricao]_v[NN].mp4
Imagem-base: HESED_C[NN]_[descricao]_3840x2160_v[NN].png
```

Exemplos:

```
HESED_C03_MM-06_retorno-temporal_v01.mp4
HESED_C03_MM-06_loop-bebe_v01.mp4
HESED_C05_MM-11_luz-do-mundo_v03.mp4
HESED_C09_MM-16C_nascimento-vida_v02.mp4
HESED_C03_criacao-base_3840x2160_v01.png
```

Para esses formatos de entrega: cena sempre com dois dígitos, descrição em minúsculas com hífen, sem acentos e sem espaços. Nunca sobrescreva uma versão aprovada; registre a próxima. A regra sem espaços não se aplica ao nome canônico das pranchas `STB MMNN`.

## Especificação técnica

| Item | Valor |
| --- | --- |
| Imagens-base | 3840×2160 (definido na Bíblia de Produção) |
| Resolução de vídeo | **a definir (P-01)** |
| Frame rate | **a definir (P-01)** |
| Codec / container | **a definir (P-01)** |
| Áudio embutido? | **a definir** (depende de como a operação roda as músicas) |
| Loops em arquivo separado? | **a definir (P-12)** |

Quando a P-01 for respondida, atualize esta tabela e registre em [decisoes.md](../docs/decisoes.md).
