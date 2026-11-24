"""Confere o MP4 integral com a régua e as fontes da montagem."""

import json
import re
import subprocess
from pathlib import Path

import numpy as np

projeto = Path(__file__).resolve().parent
raiz = projeto.parents[2]
entrega = raiz / "entregas" / "MM16" / "integral-v01"
arquivo = entrega / "MM16-Maravilhosa-Graca-Integral-v01.mp4"
montagem = json.loads((projeto / "montagem.json").read_text(encoding="utf-8"))
qa = projeto / "qa"


def executar(programa, *argumentos):
    return subprocess.check_output([programa, "-v", "error", *map(str, argumentos)])


def quadro(video, ms):
    dados = executar(
        "ffmpeg", "-ss", f"{ms / 1000:.3f}", "-i", video, "-frames:v", 1,
        "-vf", "scale=320:180", "-pix_fmt", "rgb24", "-f", "rawvideo", "-",
    )
    return np.frombuffer(dados, np.uint8).astype(np.int16)


def faixa(video):
    dados = executar(
        "ffmpeg", "-xerror", "-i", video, "-map", "0:a:0", "-ac", 1, "-ar", 16000,
        "-f", "s16le", "-",
    )
    return np.frombuffer(dados, "<i2").astype(np.float64)


fluxos = json.loads(executar(
    "ffprobe", "-show_streams", "-show_format", "-of", "json", arquivo,
))
video, audio = fluxos["streams"]
assert (
    video["width"], video["height"], video["field_order"], video["r_frame_rate"],
    int(video["nb_frames"]),
) == (1920, 1080, "progressive", "25/1", montagem["totalQuadros"]), video
assert audio["codec_name"] == "aac" and audio["channels"] == 2, audio
assert abs(float(fluxos["format"]["duration"]) - montagem["duracao"]) < .025

quadros = json.loads(executar(
    "ffprobe", "-select_streams", "v:0", "-show_frames", "-show_entries",
    "frame=best_effort_timestamp_time", "-of", "json", arquivo,
))["frames"]
pts = np.array([float(frame["best_effort_timestamp_time"]) for frame in quadros])
assert np.max(np.abs(pts - np.arange(montagem["totalQuadros"]) / 25)) < 1e-7
documento = (entrega / "MM16-Maravilhosa-Graca-Integral-v01-marcadores.md").read_text(encoding="utf-8")
tabela = re.findall(r"^\| (\d+) \| (\d\d):(\d\d):(\d\d\.\d\d\d) \|", documento, re.M)
assert len(tabela) == len(montagem["eventos"])
assert all(abs(pts[int(f)] - (int(h) * 3600 + int(m) * 60 + float(s))) < 1e-7 for f, h, m, s in tabela)
emendas = {}
for clip in montagem["recortes"]:
    ms = clip["inicio"]
    original = raiz / clip["fonte"]
    esperado = quadro(original, clip["deslocamento"])
    encontrado = quadro(arquivo, ms)
    proximidade = float(np.abs(esperado - encontrado).mean())
    emendas[clip["id"]] = {
        "ms": ms,
        "diferença em relação à fonte": round(proximidade, 3),
        "diferença em relação ao quadro anterior": round(float(
            np.abs(quadro(arquivo, ms - 40) - encontrado).mean(),
        ), 3),
    }
    assert proximidade < 6, (clip["id"], emendas[clip["id"]])

matriz = quadro(arquivo, 0)
assert matriz.max() > 80 and matriz.mean() > 18
oclusao = float(np.abs(quadro(arquivo, 27760) - quadro(arquivo, 27800)).mean())
assert oclusao < 3, oclusao
assert emendas["bloco-1"]["diferença em relação ao quadro anterior"] < 5
assert quadro(arquivo, 261280).max() <= 2

original = faixa(raiz / montagem["faixa"])
gravado = faixa(arquivo)
correlacao = {}
janelasSilenciosas = []
for t in [1, 14, 27.5, 33.8, 34.4, 50, 67.04, 83.24, 98.72, 111.92, 137.16, 172.84, 213.88, 247, 253]:
    a, b = round(16000 * t), round(16000 * (t + .65))
    if np.abs(original[a:b]).max() <= 1:
        assert np.abs(gravado[a:b]).max() <= 1, t
        janelasSilenciosas.append(t)
        continue
    correlacao[str(t)] = round(float(np.corrcoef(original[a:b], gravado[a:b])[0, 1]), 5)
assert min(correlacao.values()) > .94, correlacao
assert np.abs(gravado[255 * 16000:]).max() <= 1

selecao = [0, 222, 435, 612, 695, 772, 859, 860, 1034, 1676, 1944, 2081, 2468, 2798, 3429,
          4321, 5347, 6145, 6282, 6532]
filtro = "+".join(f"eq(n,{f})" for f in selecao)
executar(
    "ffmpeg", "-nostdin", "-xerror", "-y", "-i", arquivo,
    "-vf", f"select='{filtro}',scale=384:216,tile=5x4:padding=4:margin=4",
    "-frames:v", 1, qa / "prancha-exportada.jpg",
)
relatorio = {
    "resolução": [video["width"], video["height"]],
    "fps": video["r_frame_rate"],
    "quadros": len(pts),
    "duração": float(fluxos["format"]["duration"]),
    "marcadores": len(tabela),
    "emendas": emendas,
    "diferença na oclusão completa": oclusao,
    "correlação de áudio com o MP3": correlacao,
    "janelas silenciosas verificadas": janelasSilenciosas,
}
(qa / "validacao-exportacao.json").write_text(
    json.dumps(relatorio, indent=2, ensure_ascii=False) + "\n", encoding="utf-8",
)
print(json.dumps(relatorio, ensure_ascii=False))
