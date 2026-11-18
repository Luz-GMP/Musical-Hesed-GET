# Harness do AI Filmmaker

O Harness é um verificador determinístico e sem dependências externas. Ele não renderiza, não
instala ferramentas, não chama APIs e não substitui inspeção humana. Use-o para detectar contratos
quebrados antes de produzir e para impedir uma entrega declarada como final sem cenas aprovadas.

## Comandos

Na raiz da skill:

```text
node scripts/harness.mjs package
node scripts/harness.mjs project "<pasta-do-projeto>"
node scripts/harness.mjs project "<pasta-do-projeto>" --json
```

`package` verifica entrada única da skill, documentos obrigatórios, links locais, arquivos secretos
indevidos e recursos do Harness. `project` lê `filmmaker.project.json` na pasta informada.

O código de saída é `0` quando não há erros e `1` quando um contrato obrigatório falha. Avisos
descrevem evidência ainda incompleta sem converter julgamento editorial em aprovação automática.

## Contrato mínimo do projeto

Crie `filmmaker.project.json` nos projetos novos. Caminhos são relativos à pasta do projeto e não
podem escapar dela.

```json
{
  "schema": "ai-filmmaker.project/v1",
  "project": {"id": "video-exemplo", "title": "Vídeo exemplo"},
  "workflow": {"phase": "scene-review", "currentScene": "scene-01"},
  "delivery": {"width": 1080, "height": 1920, "fps": 30, "status": "draft"},
  "timeline": {"musicMode": "global"},
  "assets": [
    {
      "id": "source-01",
      "path": "assets/source.txt",
      "kind": "document",
      "status": "ready",
      "provenance": "user",
      "rights": "provided-by-user",
      "sha256": "<64 caracteres hexadecimais>"
    }
  ],
  "scenes": [
    {
      "id": "scene-01",
      "version": 1,
      "status": "review",
      "durationSec": 5,
      "layers": [
        {"id": "background", "role": "background"},
        {"id": "subject", "role": "content", "assetId": "source-01"},
        {"id": "title", "role": "foreground"}
      ],
      "audio": {"voice": [], "music": [], "ambience": [], "sfx": []},
      "approvals": []
    }
  ],
  "capabilities": {
    "semanticMediaIndex": {"status": "not-planned"},
    "externalTimeline": {"status": "not-planned"},
    "backgroundRemoval": {"status": "not-planned"},
    "lipSync": {"status": "not-planned"}
  }
}
```

Estados de cena: `planned`, `production`, `review`, `approved` e `blocked`. Uma cena `approved`
precisa ter uma aprovação da mesma versão com `state: "approved"`. Estados de asset: `planned`,
`ready`, `approved`, `blocked` e `rejected`.

O plano de camadas deve declarar pelo menos uma camada e usar os papéis `background`,
`intermediate`, `content` ou `foreground`. Nem toda função precisa ter conteúdo, mas a separação
deve ser pensada e registrada. Voz, música, ambiência e efeitos permanecem campos distintos,
mesmo quando algum deles é uma lista vazia.

Quando `delivery.status` for `final`, declare também `delivery.output`. O Harness exige que o
arquivo exista e que todas as cenas estejam aprovadas, sem inferir aprovação por presença de render.

## Evidência de capacidades opcionais

Cada capacidade pode usar `not-planned`, `proposed`, `ready`, `applied` ou `blocked`. `ready` e
`applied` exigem `evidence`, uma lista de caminhos relativos existentes. Isso registra evidência de
execução sem instalar ou ativar a ferramenta correspondente.

Exemplo:

```json
"backgroundRemoval": {
  "status": "applied",
  "adapter": "user-provided-output",
  "evidence": ["qa/matte-contact-sheet.jpg", "assets/subject-alpha.mov"]
}
```

## Arquivos opcionais ligados ao manifesto

- `transcript.path`: JSON com `words`, cada palavra contendo `text`, `start` e `end`; o Harness
  verifica ordem e intervalos. `sourceStart/sourceEnd` preservam o relógio original quando houve
  edição.
- `editDecisions.path`: JSON com `cuts`; cada corte contém `start`, `end`, `reason` e `state`.
  Cortes `applied` ou `approved` sem justificativa falham.

O Harness não certifica força do hook, direitos autorais, autenticidade, qualidade de matte,
lip-sync percebido, continuidade musical, leitura ou estética. Esses itens continuam no QA visual e
sonoro da skill e na aprovação do usuário.
