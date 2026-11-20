/* Medição de texto com o canvas do próprio navegador de render.
   Só chame depois que <Fontes/> liberou os filhos: antes disso o canvas mede a fonte de fallback.
   Não importa tema.ts de propósito (tema.ts importa este arquivo). */

export type EstiloTexto = {
  tamanho: number;
  peso?: number;
  /** em "em": -0.05 = -5% do tamanho */
  tracking?: number;
  familia?: string;
};

const FAMILIA_PADRAO = 'Inter';

let ctxCache: CanvasRenderingContext2D | null = null;
const ctx = (): CanvasRenderingContext2D => {
  if (!ctxCache) {
    const c = document.createElement('canvas');
    c.width = 8;
    c.height = 8;
    const k = c.getContext('2d');
    if (!k) throw new Error('medir: canvas 2d indisponível');
    ctxCache = k;
  }
  return ctxCache;
};

export const fonteCanvas = (e: EstiloTexto) =>
  `${e.peso ?? 900} ${e.tamanho}px "${e.familia ?? FAMILIA_PADRAO}"`;

const cacheAvanco = new Map<string, number>();

/** Avanço de um caractere isolado (sem kerning: as letras animadas são desenhadas uma a uma). */
export const avancoChar = (ch: string, e: EstiloTexto): number => {
  const chave = `${fonteCanvas(e)}|${ch}`;
  const v = cacheAvanco.get(chave);
  if (v !== undefined) return v;
  const k = ctx();
  k.font = fonteCanvas(e);
  const w = k.measureText(ch).width;
  cacheAvanco.set(chave, w);
  return w;
};

/** Posição x (a partir de 0) de cada caractere e a largura visível total.
    A largura não inclui o tracking depois da última letra. */
export const layoutLetras = (texto: string, e: EstiloTexto) => {
  const chars = Array.from(texto);
  const tr = (e.tracking ?? 0) * e.tamanho;
  const xs: number[] = [];
  const ws: number[] = [];
  let x = 0;
  chars.forEach((ch, i) => {
    const w = avancoChar(ch, e);
    xs.push(x);
    ws.push(w);
    x += w + (i < chars.length - 1 ? tr : 0);
  });
  return { chars, xs, ws, largura: x };
};

export const larguraTexto = (texto: string, e: EstiloTexto) => layoutLetras(texto, e).largura;

const cacheMetrica = new Map<string, { asc: number; desc: number }>();

/** Ascendente e descendente da fonte (px), como o navegador usa para a caixa de linha. */
export const metricas = (e: EstiloTexto) => {
  const chave = fonteCanvas(e);
  const v = cacheMetrica.get(chave);
  if (v) return v;
  const k = ctx();
  k.font = chave;
  const m = k.measureText('Hg');
  const r = { asc: m.fontBoundingBoxAscent, desc: m.fontBoundingBoxDescent };
  cacheMetrica.set(chave, r);
  return r;
};

/* ---------- Geometria do ponto final (assinatura 1) ----------
   O ponto nunca é o caractere ".": é um círculo de 0,19em, assentado na linha de base,
   a 0,05em da última letra. */
export const PONTO_EM = { diametro: 0.19, folga: 0.05 } as const;

export type Alinhamento = 'esquerda' | 'direita' | 'centro';

/** Centro e diâmetro do ponto de um texto alinhado à direita em `xDireita` (não precisa medir). */
export const pontoApos = (xDireita: number, base: number, tamanho: number) => ({
  x: xDireita + (PONTO_EM.folga + PONTO_EM.diametro / 2) * tamanho,
  y: base - (PONTO_EM.diametro / 2) * tamanho,
  d: PONTO_EM.diametro * tamanho,
});

/** Layout completo de uma linha: posição de cada letra e do ponto.
    alinhar 'esquerda': x = borda esquerda; 'direita': x = borda direita do texto (sem o ponto);
    'centro': x = centro do conjunto texto + ponto. */
export const geometriaLinha = (
  texto: string,
  estilo: EstiloTexto,
  x: number,
  base: number,
  alinhar: Alinhamento = 'esquerda',
  comPonto = false,
) => {
  const lay = layoutLetras(texto, estilo);
  const t = estilo.tamanho;
  const d = PONTO_EM.diametro * t;
  const folga = PONTO_EM.folga * t;
  const total = lay.largura + (comPonto ? folga + d : 0);
  const esquerda = alinhar === 'esquerda' ? x : alinhar === 'direita' ? x - lay.largura : x - total / 2;
  return {
    ...lay,
    esquerda,
    base,
    ponto: { x: esquerda + lay.largura + folga + d / 2, y: base - d / 2, d },
  };
};
