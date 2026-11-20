/* layoutB.ts: geometria que as cenas 6 a 12 dividem com as transições delas e com a cena 13
   (layout.ts tem a das cenas 1 a 5).

   FLUXO_13: no corte 12 → 13 (quadro 1311 do filme) a película da cena 12 terminou de girar e virou
   exatamente as cinco caixas da cena 13, paradas (ver abaixo). */
import { C13 } from './cenas/m13-fluxo-velho';

type XY = [number, number];
export type RetB = { x: number; y: number; w: number; h: number; r: number };

/* ---------- cena 6: painel do pedido (o túnel 6 → 7 nasce dele) ---------- */
export const C06 = {
  painel: { x: 210, y: 196, w: 1500, h: 332, r: 28 } as RetB,
  /** área do texto digitado dentro do painel */
  texto: { x: 262, y: 290, largura: 1400 },
  cards: { y: 598, w: 300, h: 330, gap: 30 },
};

/* ---------- cena 7: o ponto (pontoAbre 7 → 8 parte daqui) ---------- */
export const C07 = { ponto: [960, 540] as XY };

/* ---------- cena 11: o círculo que vira fotograma ---------- */
export const C11 = {
  /** centro e raio do círculo no repouso (a cena para o círculo aqui antes da saída) */
  circulo: { cx: 1540, cy: 400, r: 130 },
  quadrado: { x: 1170, y: 300, lado: 170 },
  /** "MOTION": topo-esquerdo e corpo (Inter 900) */
  motion: { x: 140, y: 250, tamanho: 210 },
};

/* ---------- cena 12: película ---------- */
export const C12 = {
  /** fotograma central da película no quadro local k da entrada (o círculo da 11 cai aqui) */
  fotograma: { x: 960 - 190, y: 590 - 135, w: 380, h: 270, r: 10 } as RetB,
  /** passo entre fotogramas (largura + espaço) */
  passo: 420,
  /** faixa da película (altura total com as perfurações) */
  faixa: { cy: 590, h: 400 },
};

/* ---------- 12 → 13: o fluxograma em que a película termina ---------- */
/* A geometria é a da cena 13 (C13.caixas em cenas/m13-fluxo-velho.tsx): cinco caixas de
   300 x 250, vão de 50, centradas (x0 110), topo em 440, raio 18, SEM câmera. Importada de lá para
   as duas cenas nunca divergirem. O desenho (painel cinza escuro com aba e três pontos, borda
   #4A504D, opacidade .72, sem rótulo) é o da caixa apagada da cena 13 no quadro de entrada: os
   rótulos caem dentro das caixas na fala da cena 13. */
export const FLUXO_13 = {
  caixas: C13.caixas as RetB[],
  cor: { topo: '#2B2F2D', corpo: '#1A1D1C', borda: '#4A504D', tinta: '#8C948F' },
  opacidade: 0.72,
};
