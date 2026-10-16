# HESED · Produção Audiovisual

Repositório de coordenação da equipe de telão do **HESED, Musical de Natal 2026** (GET Planalto e GET Santa Amélia).

Aqui fica tudo que a equipe precisa para trabalhar alinhada: o contexto do espetáculo, o que cada pessoa entrega, em que pé está cada peça, as decisões que já foram tomadas e as perguntas que ainda estão abertas. **Os vídeos e projetos pesados não ficam aqui**, ficam no Drive (ver [guias/entrega-e-arquivos.md](guias/entrega-e-arquivos.md)). O repositório é o mapa; o Drive é o depósito.

> **Princípio central:** cinco pessoas produzem o conteúdo, mas o público deve perceber uma única linguagem audiovisual.

## Por onde começar

| Se você quer... | Abra |
| --- | --- |
| Ver o storyboard oficial da queda | [MM-05 · V03 oficial](storyboards/MM-05/README.md) |
| Ver a versão oficial da prisão | [MM-01 · V05 oficial](storyboards/MM-01/README.md) |
| Ver as imagens oficiais da sala e variações noturnas | [MM-03 · V03 oficial e V03-01/02/03](storyboards/MM-03/README.md) |
| Saber como está o projeto agora | [STATUS.md](STATUS.md) |
| Ver só as suas tarefas | [equipe/](equipe/) → seu nome |
| Entender o que acontece em cada cena e quando cada vídeo entra | [docs/mapa-de-cenas.md](docs/mapa-de-cenas.md) |
| Saber com quem você precisa combinar primeiro/último frame | [docs/dependencias.md](docs/dependencias.md) |
| Ver o que ainda não foi decidido | [docs/pendencias.md](docs/pendencias.md) |
| Ver o que já foi decidido (e por quem) | [docs/decisoes.md](docs/decisoes.md) |
| Entender a linguagem visual e o vocabulário (loop, still, conform...) | [docs/visao-geral.md](docs/visao-geral.md) |
| Consultar direção/cenografia e cruzamento da reunião | [Bíblia de Produção canônica](docs/fontes/HESED_Biblia_de_Producao_v0_1.md) · [alinhamento das fontes](docs/alinhamento-das-fontes.md) · [origem dos documentos](docs/fontes/README.md); transcrição original ainda não recebida |
| Ler o roteiro ou o briefing completos | [docs/roteiro.md](docs/roteiro.md) · [docs/briefing.md](docs/briefing.md) · originais em [docs/fontes/](docs/fontes/) |
| Montar ou ver o storyboard de uma peça | [storyboards/](storyboards/) → código da peça |
| Criar ou editar imagens do HESED | Consulta obrigatória ao [guia canônico](storyboards/guia-de-construcao.md) e ao [briefing do quadro](storyboards/briefings-dos-quadros.md) antes da geração |
| Saber como fazer um playback que "dance" com a música | [guias/playback-visual.md](guias/playback-visual.md) |
| Saber como nomear, exportar e entregar arquivos | [guias/entrega-e-arquivos.md](guias/entrega-e-arquivos.md) |
| Nomear imagens de storyboard | [Padrão canônico](guias/entrega-e-arquivos.md#imagens-de-storyboard--padrão-canônico): `STB MM09` para prancha; `MM09-Q01` para quadro, com extensão real |
| Conferir se uma peça está pronta | [guias/checklist-de-aceite.md](guias/checklist-de-aceite.md) |
| Nunca usou GitHub | [guias/como-usar-este-repo.md](guias/como-usar-este-repo.md) |
| Usar IA (Claude, Codex, AntiGravity, ChatGPT etc.) para ajudar no seu trabalho | [AGENTS.md](AGENTS.md) · [CLAUDE.md](CLAUDE.md) · [CODEX.md](CODEX.md) · [ANTIGRAVITY.md](ANTIGRAVITY.md) |

Para começar no AntiGravity, peça: **“Leia AGENTS.md, CLAUDE.md e ANTIGRAVITY.md antes de executar a tarefa e siga as diretrizes canônicas indicadas nesses arquivos.”** Não presuma que o nome do arquivo, sozinho, garante sua leitura automática.
| Usar IA (Claude, Codex, ChatGPT etc.) para ajudar no seu trabalho | [AGENTS.md](AGENTS.md) · [CLAUDE.md](CLAUDE.md) · [CODEX.md](CODEX.md) |

## Equipe

| Pessoa | Entregas | Arquivo |
| --- | --- | --- |
| Victor | MM-01, MM-02, MM-03 | [equipe/victor.md](equipe/victor.md) |
| Melissa | MM-04, MM-09, MM-14, MM-16A | [equipe/melissa.md](equipe/melissa.md) |
| Isaac | MM-06, MM-08, MM-11, MM-16C | [equipe/isaac.md](equipe/isaac.md) |
| Eduardo | MM-07, MM-10, MM-13, MM-16D | [equipe/eduardo.md](equipe/eduardo.md) |
| Lucas | MM-05, MM-12, MM-15, MM-16B + conform do MM-16 | [equipe/lucas.md](equipe/lucas.md) |

## Regras de convivência do repo

1. **O STATUS.md é a fonte da verdade sobre andamento.** Avançou uma etapa, atualiza a sua linha. Leva 30 segundos e poupa dez mensagens no grupo.
2. **Decisão tomada no grupo do WhatsApp só existe depois de entrar em [docs/decisoes.md](docs/decisoes.md).** Conversa some; arquivo fica.
3. **Pergunta que trava alguém vira item em [docs/pendencias.md](docs/pendencias.md)** com dono e prazo.
4. **Ninguém edita o briefing nem o roteiro convertidos.** Se o escopo mudar, registra em decisoes.md e, se for o caso, a coordenação gera uma nova versão do briefing.
5. **Mexeu em algo que afeta outra pessoa** (paleta, último frame, duração), avisa no grupo *e* registra.

## Estrutura

```
hesed-producao/
├── README.md              ← você está aqui
├── STATUS.md              ← painel de andamento de todas as peças
├── CLAUDE.md              ← harness: contexto para assistentes de IA
├── CODEX.md               ← orientações complementares para o Codex
├── ANTIGRAVITY.md         ← orientações complementares para o AntiGravity
├── AGENTS.md              ← aponta para o CLAUDE.md (outras ferramentas de IA)
├── docs/
│   ├── visao-geral.md     ← linguagem visual, progressão, glossário
│   ├── mapa-de-cenas.md   ← cena a cena: gatilho, mídia, música, responsável
│   ├── dependencias.md    ← quem entrega o quê a quem
│   ├── pendencias.md      ← perguntas abertas
│   ├── decisoes.md        ← log de decisões
│   ├── roteiro.md         ← roteiro em texto
│   ├── briefing.md        ← briefing em texto
│   └── fontes/            ← PDF e DOCX originais
├── equipe/                ← uma página por pessoa
├── storyboards/           ← uma pasta por peça (MM-XX) com ficha e esboços
├── guias/                 ← como fazer (playback, entrega, aceite, git)
└── templates/             ← modelos de ficha de peça e de atualização
```
