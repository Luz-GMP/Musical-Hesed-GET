# AI Filmmaker no HESED

A skill fica em `.agents/skills/ai-filmmaker/SKILL.md`. Abra a raiz do HESED na ferramenta. Peça **“Use a skill ai-filmmaker para a peça MM-XX e siga o briefing vigente”**. O pacote inclui o manual editorial, o Harness e o modelo Motion Graphics.

| Plataforma | Descoberta no projeto |
| --- | --- |
| [Codex](https://developers.openai.com/codex/skills/) | `.agents/skills/`. Invocação explícita com `$ai-filmmaker`. Se aparecer outra cópia pessoal, escolha o caminho do projeto. |
| [Google Antigravity](https://antigravity.google/docs/skills) | `.agents/skills/`. Use `/ai-filmmaker` nas interfaces que oferecem o comando ou mencione o nome no prompt. |
| [Claude Code](https://code.claude.com/docs/en/skills) | `.claude/skills/`. A entrada do projeto remete ao pacote compartilhado. Use `/ai-filmmaker` ou mencione a skill. |
| [OpenCode](https://opencode.ai/docs/skills/) | Descobre `.agents/skills/` e entradas compatíveis em `.claude/skills/`. Peça para carregar `ai-filmmaker`. |

Em outro agente com acesso aos arquivos, peça a leitura de `AGENTS.md` e de `.agents/skills/ai-filmmaker/SKILL.md`. Abra uma nova sessão se o catálogo atual estiver desatualizado. Cada ambiente precisa disponibilizar as ferramentas de edição e render usadas pela peça.

A adaptação mantém o formato Agent Skills e um único pacote de produção. A entrada do Claude Code carrega o mesmo procedimento. Descoberta da skill e disponibilidade de Node, FFmpeg, provedor de vídeo e demais ferramentas são verificações separadas.

Para a **MM-07**, use a [instrução pronta para o Antigravity](../storyboards/MM-07/instrucao-antigravity.md).
