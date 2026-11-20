#!/usr/bin/env bash
# Narração: VoiceStudio local, ElevenLabs ou arquivo exportado.
# Execute em Bash (Git Bash/WSL no Windows), não diretamente em PowerShell.
# Requer ffmpeg e ffprobe no PATH; curl apenas para os modos de API.
# Nome original preservado. Este script usa perfis existentes; não cria clones.
# Execute a síntese somente após as aprovações previstas no MD da skill.
#
# Uso: bash "Narração com Voz Clonada (ElevenLabs API) + Sincronização Automática.sh" PROVEDOR ENTRADA [SAIDA.mp3]
# PROVEDOR: voicestudio | elevenlabs | arquivo. Sem seleção automática/fallback.
# ENTRADA: JSON UTF-8 de síntese para API, ou áudio existente para "arquivo".
# SAIDA: narracao.mp3 por padrão; arquivos existentes não são sobrescritos.
#
# VOICESTUDIO (aplicativo/backend aberto):
#   VOICESTUDIO_BASE_URL=http://localhost:3900  # raiz, sem /v1
#   VOICESTUDIO_API_KEY opcional: chave do backend, nunca chave da OpenAI.
#   Consulte GET /.well-known/voicestudio-speech, GET /v1/models e
#   GET /v1/audio/voices na instalação antes de escolher motor/perfil.
#   Crie/selecione a voz clonada no aplicativo; informe seu ID no JSON.
#   Exemplo de pedido.json (substitua motor e perfil por IDs disponíveis):
#   {"model":"omnivoice","voice":"ID_DO_PERFIL","input":"Texto aprovado em português.","response_format":"wav"}
#   bash "Narração com Voz Clonada (ElevenLabs API) + Sincronização Automática.sh" voicestudio pedido.json
#   API documentada: https://github.com/mvpagency/VoiceStudio/blob/main/docs/agentic-voice.md
#   Se a versão instalada não oferecer essa API, exporte WAV/MP3 pelo app
#   e utilize o modo "arquivo". Não instale/atualize o app automaticamente.
#
# ELEVENLABS (opção externa escolhida pelo usuário, consome créditos):
#   Exporte ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID no ambiente.
#   Exemplo de pedido-elevenlabs.json:
#   {"text":"Texto aprovado em português.","model_id":"eleven_multilingual_v2"}
#   bash "Narração com Voz Clonada (ElevenLabs API) + Sincronização Automática.sh" elevenlabs pedido-elevenlabs.json
#   API: https://elevenlabs.io/docs/api-reference/text-to-speech/convert
#
# ARQUIVO EXPORTADO (sem rede/chaves):
#   bash "Narração com Voz Clonada (ElevenLabs API) + Sincronização Automática.sh" arquivo "voz exportada.wav"
#
# Variáveis são lidas do ambiente; .env não é carregado automaticamente.
# A saída MP3 serve à receita de mixagem existente. Para trechos separados,
# forneça SAIDA como cena_1.mp3, cena_2.mp3 etc. e meça cada duração.
# Depois: transcrever se necessário, ajustar cenas/timeline e repetir Self-QA
# se houver mudança de tempos. Este script não edita HTML/GSAP/Remotion.
set -euo pipefail

die() { printf '%s\n' "$*" >&2; exit 1; }
[[ $# -ge 2 && $# -le 3 ]] || die 'Uso: bash SCRIPT PROVEDOR ENTRADA [SAIDA.mp3]'
provider="$1"
input="$2"
output="${3:-narracao.mp3}"
case "$provider" in voicestudio|elevenlabs|arquivo) ;; *) die 'Provedor inválido: use voicestudio, elevenlabs ou arquivo.' ;; esac
[[ -s "$input" ]] || die 'Entrada ausente ou vazia.'
[[ "$output" == *.mp3 ]] || die 'A saída deve ter extensão .mp3.'
[[ ! -e "$output" ]] || die 'A saída já existe; escolha outro nome para preservá-la.'
for tool in ffmpeg ffprobe; do command -v "$tool" >/dev/null || die "Ferramenta ausente: $tool"; done
if [[ "$provider" != arquivo ]]; then
  command -v curl >/dev/null || die 'Ferramenta ausente: curl'
fi

workdir=$(mktemp -d)
trap 'rm -f -- "$workdir/source_audio" "$workdir/narracao.mp3"; rmdir -- "$workdir"' EXIT

if [[ "$provider" == arquivo ]]; then
  cp -- "$input" "$workdir/source_audio"
else
  headers=(-H 'Content-Type: application/json')
  if [[ "$provider" == voicestudio ]]; then
    base="${VOICESTUDIO_BASE_URL:-http://localhost:3900}"
    base="${base%/}"
    [[ "$base" == http://localhost:* || "$base" == http://127.0.0.1:* || "$base" == https://* ]] || die 'Use o backend local ou uma URL HTTPS configurada explicitamente.'
    url="$base/v1/audio/speech"
    if [[ -n "${VOICESTUDIO_API_KEY:-}" ]]; then
      headers+=(-H "Authorization: Bearer $VOICESTUDIO_API_KEY")
    fi
  else
    [[ -n "${ELEVENLABS_API_KEY:-}" && -n "${ELEVENLABS_VOICE_ID:-}" ]] || die 'Configure ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID.'
    [[ "$ELEVENLABS_VOICE_ID" =~ ^[a-zA-Z0-9_-]+$ ]] || die 'ID de voz ElevenLabs inválido.'
    url="https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID?output_format=mp3_44100_128"
    headers+=(-H "xi-api-key: $ELEVENLABS_API_KEY")
  fi
  # Sem retries ou redirecionamentos automáticos: evita repetir cobranças.
  curl --fail --silent --show-error --connect-timeout 10 --max-time 600 \
    "${headers[@]}" --data-binary "@$input" --output "$workdir/source_audio" "$url" \
    || die 'Falha na síntese; confira backend, contrato da API, perfil e modelo. Nenhum outro provedor foi acionado.'
fi

# FFmpeg valida a decodificação e padroniza também WAV exportado pelo app.
ffmpeg -nostdin -v error -i "$workdir/source_audio" -map 0:a:0 -vn \
  -c:a libmp3lame -ar 44100 -b:a 192k "$workdir/narracao.mp3"
duration=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$workdir/narracao.mp3")
[[ -n "$duration" && "$duration" != N/A ]] || die 'Não foi possível medir a duração da narração.'
cp -- "$workdir/narracao.mp3" "$output"
printf 'Narração preparada: %s\nProvedor: %s\nDuração (segundos): %s\n' "$output" "$provider" "$duration"
