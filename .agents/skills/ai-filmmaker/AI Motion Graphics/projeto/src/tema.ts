/* =====================================================================================
   tema.ts: a identidade e o movimento de tudo o que este projeto anima. As cenas, os blocos e as
   transições leem daqui; para mudar o visual do projeto inteiro, mude aqui.

   O QUE MORA AQUI
   - PALETA: as cores (padrão: a paleta verde do filme). Troque `acento`/`acentoClaro`/`fundo` e
     todas as cenas, blocos e transições acompanham (RGB e CORM são derivados dela).
   - VIDEO_M: tamanho, fps e duração do filme modelo; quadroDe(s).
   - TIPOM: tipografia (Inter + JetBrains Mono). Rótulo nunca abaixo de 28 px em 1080p.
   - MOLAM / CURVAM / ease / mola / tween / janelaM: movimento (nunca linear em coisa visível).
   - PALAVRAS / falaDaCena(n) / trecho(n, de, ate): a fala do filme modelo (filme/tempos.json).
     Para um vídeo novo, use criarTempos(json) de ./tempos com o tempos.json do vídeo.
   Os valores e o porquê de cada um estão no guia de referências da skill (references/).
   ===================================================================================== */
import { Easing, interpolate, spring } from 'remotion';
import TEMPOS_FILME from './filme/tempos.json';
import { criarTempos, type CenaFala, type Palavra, type TemposJson } from './tempos';

export type { CenaFala, Palavra };

/* ---------- paleta (o único lugar para trocar as cores) ---------- */
export const PALETA = {
  /** fundo: preto com um fio da cor do acento */
  fundo: '#030705',
  floresta: '#0A1C11',
  florestaClara: '#123A22',
  /** brilho difuso atrás das cenas (FundoM): um tom escuro do acento */
  halo: '#1C5C34',
  /** o acento: um só por vídeo (destaque, brilho, linha de luz, partículas) */
  acento: '#30DC68',
  acentoClaro: '#85EEA7',
  /** texto claro "quente" e branco puro */
  papel: '#F1F0E8',
  branco: '#FFFFFF',
  /** texto secundário e rótulos (passa contraste sobre o fundo) */
  dim: '#A9B8AE',
  faint: '#6E8075',
  /** só para riscar / "errado" */
  alerta: '#FF3B30',
};

const trioDe = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};

/** As cores do acento como trio [r, g, b] (para misturar cor quadro a quadro). */
export const TRIO = { acento: trioDe(PALETA.acento), claro: trioDe(PALETA.acentoClaro), papel: trioDe(PALETA.papel) };
/** As cores do acento como "r,g,b" para usar em rgba(): `rgba(${RGB.acento},.5)`. */
export const RGB = {
  acento: TRIO.acento.join(','),
  claro: TRIO.claro.join(','),
  alerta: trioDe(PALETA.alerta).join(','),
  halo: trioDe(PALETA.halo).join(','),
  floresta: trioDe(PALETA.floresta).join(','),
  fundo: trioDe(PALETA.fundo).join(','),
};

/* ---------- vídeo (filme modelo) ---------- */
const FPS = 30;
const RESPIRO_S = 0.8;
export const VIDEO_M = {
  largura: 1920,
  altura: 1080,
  fps: FPS,
  /** fim da fala + 0,8 s de respiro */
  duracao: Math.round(((TEMPOS_FILME as TemposJson).fim_fala_s + RESPIRO_S) * FPS),
  /** narração do filme em public/ (ex.: 'narracao.mp3'); null = sem áudio (as cenas funcionam igual) */
  audio: null as string | null,
};

/** segundo → quadro (arredonda para o quadro mais próximo) */
export const quadroDe = (s: number) => Math.round(s * FPS);

/* ---------- cor ---------- */
export const CORM = {
  fundo: PALETA.fundo,
  floresta: PALETA.floresta,
  florestaClara: PALETA.florestaClara,
  /** nome histórico: é o acento da PALETA */
  verde: PALETA.acento,
  /** nome histórico: é o acento claro da PALETA */
  verdeClaro: PALETA.acentoClaro,
  papel: PALETA.papel,
  branco: PALETA.branco,
  dim: PALETA.dim,
  faint: PALETA.faint,
  /** só para riscar / "errado" */
  vermelho: PALETA.alerta,
  linha: `rgba(${RGB.claro},.10)`,
  linhaForte: `rgba(${RGB.claro},.22)`,
  vidro: 'rgba(10,28,17,.72)',
};

/** brilhos prontos (text-shadow / box-shadow) */
export const BRILHO = {
  verde: `0 0 18px rgba(${RGB.acento},.75), 0 0 48px rgba(${RGB.acento},.45), 0 0 110px rgba(${RGB.acento},.25)`,
  verdeLeve: `0 0 14px rgba(${RGB.acento},.5), 0 0 40px rgba(${RGB.acento},.22)`,
  branco: `0 0 16px rgba(255,255,255,.45), 0 0 50px rgba(${RGB.claro},.18)`,
  vermelho: `0 0 12px rgba(${RGB.alerta},.9), 0 0 36px rgba(${RGB.alerta},.55)`,
};

/* ---------- tipografia ---------- */
export const FONTEM = { titulo: 'Inter', mono: 'JetBrains Mono' } as const;

export type EstiloM = { tamanho: number; peso: number; tracking: number; familia: string; entrelinha: number };
export const TIPOM = {
  /** palavra gigante (After Effects?, CLAUDE, plugin, ABSURDO) */
  gigante: { tamanho: 250, peso: 900, tracking: -0.04, familia: FONTEM.titulo, entrelinha: 0.92 },
  /** frase principal falada */
  frase: { tamanho: 112, peso: 800, tracking: -0.03, familia: FONTEM.titulo, entrelinha: 1.04 },
  /** frase de apoio (cabeçalho em cima do elemento principal) */
  apoio: { tamanho: 68, peso: 700, tracking: -0.02, familia: FONTEM.titulo, entrelinha: 1.1 },
  /** máquina de escrever fina (cena 1) */
  fina: { tamanho: 116, peso: 250, tracking: -0.02, familia: FONTEM.titulo, entrelinha: 1.12 },
  /** texto digitado num prompt */
  prompt: { tamanho: 48, peso: 400, tracking: -0.01, familia: FONTEM.mono, entrelinha: 1.3 },
  /** rótulo técnico de canto (mínimo legível filmado) */
  rotulo: { tamanho: 28, peso: 400, tracking: 0.08, familia: FONTEM.mono, entrelinha: 1.2 },
} as const satisfies Record<string, EstiloM>;

/* ---------- movimento ---------- */
export const MOLAM = {
  /** chegada rápida com overshoot curto (palavras) */
  estalo: { mass: 0.55, damping: 13, stiffness: 230 },
  /** assenta sem sobra (blocos de UI) */
  assenta: { mass: 0.8, damping: 17, stiffness: 140 },
  /** pesada, quica (queda de "plugin") */
  quica: { mass: 1, damping: 7.5, stiffness: 170 },
  /** câmera */
  camera: { mass: 1.4, damping: 30, stiffness: 60 },
} as const;
export type NomeMolaM = keyof typeof MOLAM;

export const CURVAM = {
  /** saída rápida, chegada longa (entradas de elementos) */
  sai: [0.16, 1, 0.3, 1],
  /** acelera para o corte */
  entra: [0.7, 0, 0.84, 0],
  /** corte de transição: lento-rápido-lento */
  corte: [0.76, 0, 0.24, 1],
  /** câmera */
  suave: [0.45, 0, 0.55, 1],
  /** exponencial (mergulho de câmera) */
  expo: [0.95, 0, 0.9, 0.2],
} as const;
export type NomeCurvaM = keyof typeof CURVAM;

export const ease: Record<NomeCurvaM, (t: number) => number> = {
  sai: Easing.bezier(...CURVAM.sai),
  entra: Easing.bezier(...CURVAM.entra),
  corte: Easing.bezier(...CURVAM.corte),
  suave: Easing.bezier(...CURVAM.suave),
  expo: Easing.bezier(...CURVAM.expo),
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mola 0→1 a partir do quadro `inicio`; 0 antes dele (não lê quadro negativo). */
export const mola = (frame: number, nome: NomeMolaM, inicio = 0, duracao?: number) =>
  frame <= inicio ? 0 : spring({ frame: frame - inicio, fps: FPS, config: MOLAM[nome], durationInFrames: duracao });

/** de → para na janela [a, b], com curva, sem extrapolar. */
export const tween = (frame: number, a: number, b: number, de = 0, para = 1, curva: NomeCurvaM | 'linear' = 'sai') =>
  interpolate(frame, [a, b], [de, para], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curva === 'linear' ? undefined : ease[curva],
  });

/** progresso 0→1 numa janela [a, b] */
export const janelaM = (frame: number, a: number, b: number, curva: NomeCurvaM | 'linear' = 'sai') => tween(frame, a, b, 0, 1, curva);

/* ---------- fala do filme modelo (filme/tempos.json) ---------- */
const FALA_FILME = criarTempos(TEMPOS_FILME as TemposJson);
export const PALAVRAS: Palavra[] = FALA_FILME.PALAVRAS;
export const CENAS_FALA: CenaFala[] = FALA_FILME.CENAS_FALA;
/** As palavras ditas dentro da cena n (1 a 19) do filme modelo. */
export const falaDaCena = FALA_FILME.falaDaCena;
/** Fatia de palavras de uma cena do filme modelo, por índice inicial e final (inclusive). */
export const trecho = FALA_FILME.trecho;

/** Palavra limpa para comparar (sem pontuação, minúscula, sem aspas). */
export const normalizar = (t: string) => t.toLowerCase().replace(/["“”'.,:;!?…]/g, '');
