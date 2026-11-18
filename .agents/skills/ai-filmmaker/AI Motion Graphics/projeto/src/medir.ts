/* medir.ts: medição de texto com o canvas do navegador de render (mesma fonte que o DOM).
   Só chame dentro do render, depois que <Fontes/> liberou os filhos (antes disso mede o fallback).

   Convenção de caixa: uma linha de texto ocupa uma caixa de altura tamanho × entrelinha; a linha
   de base fica em topo + (tamanho × entrelinha − (asc + desc)) / 2 + asc, igual ao DOM com
   line-height em px. Com isso a cena sabe onde cada letra está (ex.: o "O" de OPUS da cena 4). */
import type { EstiloM } from './tema';

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

export const fonteCss = (e: Pick<EstiloM, 'peso' | 'tamanho' | 'familia'>) => `${e.peso} ${e.tamanho}px "${e.familia}"`;

const cacheL = new Map<string, number>();
/** Largura do texto com kerning + tracking (o DOM soma o tracking depois de cada caractere). */
export const larguraTexto = (texto: string, e: EstiloM): number => {
  const chave = `${fonteCss(e)}|${e.tracking}|${texto}`;
  const v = cacheL.get(chave);
  if (v !== undefined) return v;
  const k = ctx();
  k.font = fonteCss(e);
  const w = k.measureText(texto).width + e.tracking * e.tamanho * [...texto].length;
  cacheL.set(chave, w);
  return w;
};

/** x de cada caractere dentro da palavra (prefixos medidos, kerning incluído) e a largura de cada um. */
export const posicoesLetras = (texto: string, e: EstiloM): { ch: string; x: number; w: number }[] => {
  const chars = [...texto];
  return chars.map((ch, i) => {
    const x = i === 0 ? 0 : larguraTexto(chars.slice(0, i).join(''), e);
    const w = larguraTexto(chars.slice(0, i + 1).join(''), e) - x;
    return { ch, x, w };
  });
};

const cacheM = new Map<string, { asc: number; desc: number; cap: number }>();
/** Métricas da fonte no tamanho: ascendente e descendente da caixa e altura de maiúscula. */
export const metricas = (e: EstiloM) => {
  const chave = fonteCss(e);
  const v = cacheM.get(chave);
  if (v) return v;
  const k = ctx();
  k.font = fonteCss(e);
  const m = k.measureText('H');
  const r = { asc: m.fontBoundingBoxAscent, desc: m.fontBoundingBoxDescent, cap: m.actualBoundingBoxAscent };
  cacheM.set(chave, r);
  return r;
};

/** Linha de base de uma caixa de linha que começa em `topo`. */
export const baseDaLinha = (topo: number, e: EstiloM) => {
  const m = metricas(e);
  return topo + (e.tamanho * e.entrelinha - (m.asc + m.desc)) / 2 + m.asc;
};
