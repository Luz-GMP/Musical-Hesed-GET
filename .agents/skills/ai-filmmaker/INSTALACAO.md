# Instalação e uso do AI Filmmaker

Há uma única skill pública: `ai-filmmaker`. O módulo Motion está incluído em
`AI Motion Graphics/MOTION.md` e não é registrado separadamente. Instale o pacote completo;
copiar apenas o módulo perde o fluxo de edição, aprovação e áudio da principal.

## Instalação local

Na pasta fonte, execute com Node disponível no terminal:

```text
node scripts/instalar.mjs "<pasta-de-skills>/ai-filmmaker"
```

Exemplo de destino pessoal comum: `~/.agents/skills/ai-filmmaker` (expanda `~` para seu diretório
de usuário). Codex, Cursor e Antigravity documentam `.agents/skills/` nos escopos suportados;
confira a versão do agente e a localização escolhida. Para uso em um projeto, use a pasta
`.agents/skills/ai-filmmaker/` desse projeto. Não instale simultaneamente cópias com o mesmo nome.

O instalador exige destino novo ou vazio e copia somente os recursos do pacote. Exclui projetos
piloto, dependências, renders, caches, `.git`, `.DS_Store` e arquivos `.env`. Não instala executáveis,
não muda configurações do editor e não sobrescreve instalações existentes. Registra a lista e o
hash SHA-256 de cada arquivo em `pacote-instalado.json` no destino.

Para verificar a integridade da cópia:

```text
node scripts/instalar.mjs --verificar "<pasta-de-skills>/ai-filmmaker"
```

Atualizações exigem revisar as diferenças e preservar alterações locais; não apague a instalação
automaticamente. A pasta fonte permanece o local de desenvolvimento. Para disponibilizar a skill
em outro agente ou computador, transporte o mesmo pacote completo e instale no destino apropriado.

## Reconhecimento pelo agente

Atualize/reabra a sessão se necessário e procure `ai-filmmaker` na lista de skills. No Codex,
mencione `$ai-filmmaker` ou selecione a skill pela interface disponível. Uma verificação do
`skills/list` do Codex confirma descoberta no runtime consultado; não comprova que todas as sessões
abertas já atualizaram sua lista. Nesta conversa, a leitura explícita do pacote permite iniciar já.

Pedido de exemplo:

> Use a skill ai-filmmaker para um vídeo de 6 segundos sobre meu produto. Apresente o storyboard,
> liste os sons necessários e entregue uma cena por vez para minha aprovação.

O agente carrega Motion quando necessário; não há comando separado nem outro agente obrigatório.

## Projeto de vídeo e execução

Prepare cada projeto fora do pacote instalado. Para usar Remotion:

```text
node "<pacote-instalado>/AI Motion Graphics/scripts/preparar.mjs" projeto "<pasta-do-video>"
cd "<pasta-do-video>"
npm ci
npm run diagnostico
npm run typecheck
```

No PowerShell, `npm.cmd` pode ser usado quando `npm.ps1` estiver bloqueado, sem alterar a política
do sistema. O primeiro render pode precisar de navegador headless e rede. Para reaproveitar Chrome
compatível, `stills.mjs` aceita `REMOTION_BROWSER_EXECUTABLE`; a CLI aceita `--browser-executable`.

Narração/transcrição são opcionais e exigem suas próprias ferramentas. Não prometa acesso a API,
voz clonada ou transcritor apenas porque a skill foi instalada. Instalar Node/FFmpeg/Python ou
baixar modelos é uma operação separada. As dependências do projeto seguem o `package-lock.json`.

## Validação e piloto

Na fonte ou no pacote instalado, rode:

```text
node scripts/harness.mjs package
node --test scripts/pacote.test.mjs
node --test scripts/harness.test.mjs
node --test "AI Motion Graphics/scripts/portabilidade.test.mjs"
```

Para um projeto que possua `filmmaker.project.json`:

```text
node "<pacote-instalado>/scripts/harness.mjs" project "<pasta-do-projeto>"
```

O contrato e os estados aceitos estão em [Harness do AI Filmmaker](references/harness.md). O Harness
usa somente módulos nativos do Node, não instala dependências, não baixa modelos, não chama APIs e
não renderiza. Ele valida estrutura, caminhos, hashes, camadas, stems, aprovações e a coerência de uma
entrega declarada como final.

Esses testes não usam APIs pagas. Para validar o fluxo criativo, use um projeto piloto separado e
registre storyboard, arquivos, versões, sons, evidências de QA e aprovações. Aprovação do storyboard
autoriza a primeira cena; aprovação de cada cena autoriza a seguinte; só então renderize o integral.
Uma passagem de testes técnicos não substitui aprovação humana nem certifica todos os agentes/SOs.

Fontes oficiais de instalação/descoberta:
[Codex](https://developers.openai.com/codex/skills/),
[Cursor](https://cursor.com/docs/skills),
[Antigravity](https://antigravity.google/docs/skills).
