const { createHash } = require("node:crypto");
const { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "../../..");
const entregas = path.join(raiz, "entregas", "MM16");
const cena = path.join(__dirname, "cena");
const musica = "Maravilhosa-Graça_Samuel Mizrahy.mp3";
const fps = 25;
const quadroMs = 1000 / fps;
const fimIntroducao = 34400;
const duracaoFaixa = 254.338322;
const blocos = [
  ["zoom-ate-a-cruz-v12", 34400, 816, "Cura, encontro, caminho e aproximação da cruz"],
  ["cruz-texto-e-giro-v16", 67000, 269, "Cruz, sangue, luz e giro"],
  ["escrito-de-divida-v17", 77720, 138, "Escrito de dívida"],
  ["refrão-na-penitenciaria-v21", 83200, 388, "Refrão na penitenciária"],
  ["correntes-e-libertacao-v26", 98680, 331, "Correntes e libertação"],
  ["ressurreicao-e-pre-refrao-v28", 111880, 632, "Ressurreição e pré-refrão"],
  ["refrao-cinetico-v30", 137120, 893, "Duas passagens do refrão cinético"],
  ["transformacao-em-movimento-v38", 172800, 1027, "Declaração e transformação em papel"],
  ["encerramento-v43", 213840, 1187, "Encerramento v43 aprovado"],
];
const introducao = [
  [0, "INÍCIO · Fio dourado na dobra de papel, matriz comum com Brilha Tua Luz"],
  [280, "TELÃO · Começa a aproximação da câmera"],
  [8920, "TELÃO · O fio de luz se estende pelo relevo, revelando a trama e o primeiro plano"],
  [17400, "TELÃO · Dobra de tecido começa a cruzar à frente da lente"],
  [27800, "TELÃO · Troca de fundo sob a cobertura integral do tecido"],
  [29320, "TELÃO · O tecido libera o close dos olhos cinzentos e a luz se acomoda"],
  [34360, "TELÃO · A introdução chega à mesma imagem do primeiro quadro da cura"],
];
const eventos = introducao.map(([ms, acao]) => [ms, "Abertura", acao]);
const materiais = [
  ["papel", "papel-matriz.png", "image", "ImageGen · matriz nova baseada na materialidade do retrato aprovado da cura."],
  ["olhos", "olhos-ancora.png", "image", "Primeiro quadro decodificado da montagem v12, em 00:34.400 da faixa."],
  ["faixa", "faixa.mp3", "audio", "Cópia integral do MP3 local de Maravilhosa Graça, Samuel Mizrahy."],
];
const arquivoMusica = path.join(cena, "faixa.mp3");
if (!existsSync(arquivoMusica)) copyFileSync(path.join(raiz, musica), arquivoMusica);
mkdirSync(path.join(cena, "trechos"), { recursive: true });

const tempo = ms => new Date(ms).toISOString().slice(11, 23);
const tempoLocal = /^(\d\d):(\d\d):(\d\d)\.(\d\d\d)$/;
let proximo = fimIntroducao;
const recortes = blocos.map(([pasta, origem, quadros, titulo], i) => {
  const dir = path.join(entregas, pasta);
  const nomes = readdirSync(dir);
  const original = nomes.find(nome => nome.endsWith(".mp4"));
  const marcadores = nomes.find(nome => nome.endsWith("-marcadores.md"));
  if (!original || !marcadores) throw new Error(`Fonte incompleta: ${pasta}`);
  const id = `bloco-${i + 1}`;
  const arquivo = `trechos/${id}.mp4`;
  if (!existsSync(path.join(cena, arquivo))) copyFileSync(path.join(dir, original), path.join(cena, arquivo));
  materiais.push([id, arquivo, "video", `MM-16 · ${titulo} · entregas/MM16/${pasta}/${original}`]);
  const deslocamento = i === 0 ? 0 : quadroMs;
  const inicio = origem + deslocamento;
  const fim = origem + quadros * quadroMs;
  if (inicio !== proximo) throw new Error(`Intervalo sem continuidade em ${pasta}: ${inicio} / ${proximo}`);
  proximo = fim;
  for (const linha of readFileSync(path.join(dir, marcadores), "utf8").split(/\r?\n/)) {
    if (!linha.startsWith("|")) continue;
    const partes = linha.split("|").slice(1, -1).map(x => x.trim());
    const m = partes[1]?.match(tempoLocal);
    if (!m) continue;
    const [horas, minutos, segundos, milis] = m.slice(1).map(Number);
    const local = (((horas * 60) + minutos) * 60 + segundos) * 1000 + milis;
    const acao = /^\d+$/.test(partes[0]) ? partes.at(-1) : partes[0];
    if (!Number.isInteger(local / quadroMs) || local >= fim - origem) {
      throw new Error(`Marcador fora da grade em ${pasta}: ${linha}`);
    }
    eventos.push([origem + local, titulo, acao]);
  }
  return {
    id, inicio, fim, deslocamento, arquivo, titulo,
    fonte: `entregas/MM16/${pasta}/${original}`,
  };
});
const duracao = proximo / 1000;
const totalQuadros = proximo / quadroMs;
const segundos = ms => (ms / 1000).toFixed(2);

function pagina(completa) {
  const id = "mm16";
  const extensao = completa ? duracao : 34.4;
  const videos = completa ? recortes.map(r => (
    `    <video id="${r.id}" class="clip" src="${r.arquivo}" data-start="${segundos(r.inicio)}" ` +
    `data-duration="${segundos(r.fim - r.inicio)}" data-media-start="${segundos(r.deslocamento)}" ` +
    `data-track-index="0" muted playsinline></video>`
  )) : [];
  const audio = completa
    ? `    <audio id="faixa" class="clip" src="faixa.mp3" data-start="0" data-duration="${duracaoFaixa}" data-track-index="1" data-volume="1"></audio>`
    : "";
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>MM-16 · Maravilhosa Graça</title>
  <style>
    html, body { margin: 0; overflow: hidden; background: #000; }
    main { position: relative; width: 1920px; height: 1080px; overflow: hidden; }
    canvas, video { position: absolute; inset: 0; width: 1920px; height: 1080px; }
    video { object-fit: fill; }
  </style>
  <script src="gsap.min.js"></script>
  <script>window.__timelines = {};</script>
  <script src="introducao.js" defer></script>
</head>
<body>
  <main data-composition-id="${id}" data-start="0" data-duration="${extensao}" data-width="1920" data-height="1080" data-fps="25">
    <canvas id="filme" class="clip" data-start="0" data-duration="34.4" data-track-index="0" width="1920" height="1080" aria-label="Introdução em papel e luz"></canvas>
    <img id="papel" hidden src="papel-matriz.png" alt="">
    <img id="olhos" hidden src="olhos-ancora.png" alt="">
${videos.join("\n")}
${audio}
  </main>
</body>
</html>
`;
}
writeFileSync(path.join(cena, "index.html"), pagina(true));
const provaDaIntroducao = path.join(__dirname, "qa", "composicao-introducao");
mkdirSync(provaDaIntroducao, { recursive: true });
for (const arquivo of ["introducao.js", "gsap.min.js", "papel-matriz.png", "olhos-ancora.png"]) {
  copyFileSync(path.join(cena, arquivo), path.join(provaDaIntroducao, arquivo));
}
writeFileSync(path.join(provaDaIntroducao, "index.html"), pagina(false));

const assets = materiais.map(([id, nome, kind, provenance]) => ({
  id, path: `cena/${nome}`, kind, provenance, status: "ready", rights: "material de trabalho do espetáculo",
  sha256: createHash("sha256").update(readFileSync(path.join(cena, nome))).digest("hex"),
}));
const layers = assets.filter(x => x.kind !== "audio").map(a => ({
  id: a.id, assetId: a.id, role: a.id === "papel" ? "background" : "content",
}));
const manifesto = {
  schema: "ai-filmmaker.project/v1",
  project: { id: "mm16-integral-v01", title: "MM-16 · Maravilhosa Graça · Integral v01" },
  workflow: { phase: "scene-review", currentScene: "scene-01" },
  delivery: { width: 1920, height: 1080, fps, status: "draft" },
  timeline: { musicMode: "global" },
  assets,
  capabilities: {
    semanticMediaIndex: { status: "not-planned" },
    backgroundRemoval: { status: "not-planned" },
    externalTimeline: { status: "not-planned" },
    lipSync: { status: "not-planned" },
  },
  scenes: [{
    id: "scene-01", version: 1, status: "review", durationSec: duracao, layers,
    audio: { music: ["faixa"], voice: [], ambience: [], sfx: [] },
    approvals: [], preview: { engine: "hyperframes", source: "cena/index.html" },
  }],
};
const json = data => JSON.stringify(data, null, 2) + "\n";
writeFileSync(path.join(__dirname, "filmmaker.project.json"), json(manifesto));
writeFileSync(path.join(__dirname, "montagem.json"), json({
  fps, duracao, totalQuadros, faixa: musica, duracaoFaixa, introducao, recortes, eventos,
}));

const marcador = [
  "# MM-16 · Maravilhosa Graça integral v01 · Marcadores",
  "",
  "**Cena 9 · Victor · Prévia de montagem.** 1920 × 1080 progressivo, 25 fps, 6.533 quadros, 04:21.320.",
  "",
  "GO após o fim da troca de figurino e cenário que sucede Brilha Tua Luz. O primeiro quadro retoma a dobra escura com fio dourado. O último quadro é preto integral. O acendimento de Natal no refrão final e a visibilidade do telão durante a troca serão confirmados em ensaio.",
  "",
  "O relógio do MP4 começa no início do MP3 local de Samuel Mizrahy. As janelas foram alinhadas pelos quadros compartilhados. Confirmar as deixas vocais no playback de palco.",
  "",
  "| Quadro (base 0) | Tempo no MP4 | Bloco | Deixa |",
  "| ---: | --- | --- | --- |",
  ...eventos.sort((a, b) => a[0] - b[0]).map(([ms, bloco, acao]) =>
    `| ${ms / quadroMs} | ${tempo(ms)} | ${bloco} | ${acao} |`),
  "",
].join("\n");
writeFileSync(path.join(entregas, "integral-v01", "MM16-Maravilhosa-Graca-Integral-v01-marcadores.md"), marcador);
