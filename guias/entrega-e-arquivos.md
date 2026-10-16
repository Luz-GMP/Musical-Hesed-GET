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

### Storyboards e quadros individuais — D-28

Padrão determinado pelo usuário em 16/10/2026, válido para toda a equipe e todos os assistentes:

| Conteúdo do arquivo | Nome (manter a extensão real) |
| --- | --- |
| Prancha completa de storyboard | `STB MM09.jpg` |
| Imagem individual do quadro 1 | `MM09-Q01.png` |
| Imagem individual do quadro 10 | `MM09-Q10.JPG` |
| Prancha de módulo com letra | `STB MM16D.png` |

Use dois dígitos no número da MM e do quadro. O identificador da pasta continua `MM-09`; no nome do arquivo, use `MM09`. O espaço em `STB MM09` faz parte do padrão. Preserve o formato real: renomear não converte JPG em PNG. Versão artística e situação de aprovação ficam na ficha e no histórico Git; renomear não aprova nem modifica a arte. Para guardar revisões simultâneas, use subpastas de versão, evitando sobrescrever a aprovada.

As três variações de iluminação da casa são pranchas completas: `STB MM03-01.jpg` (noite, todas as luzes acesas), `STB MM03-02.jpg` (noite, só luz central) e `STB MM03-03.jpg` (noite, só luar). A composição oficial diurna é `STB MM03.jpg`, versão artística V03. Esses sufixos identificam variações de luz, não quadros individuais.

O [inventário dos arquivos](../storyboards/inventario-de-arquivos.md) registra a conferência e os nomes anteriores. Prompts e documentos-fonte conservam seus nomes e conteúdo histórico.

### Vídeos

Mantém-se a convenção de entrega de vídeo:

```
HESED_C03_MM-06_retorno-temporal_v01.mp4
HESED_C05_MM-11_luz-do-mundo_v03.mp4
HESED_C09_MM-16C_nascimento-vida_v02.mp4
```

Para vídeos: cena com dois dígitos, descrição em minúsculas com hífen, sem acentos e sem espaços. Nunca sobrescreva uma versão aprovada; crie a próxima. Para imagens de storyboard e quadros, prevalece a regra D-28 acima sobre recomendações anteriores de nomes no briefing.

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
