/* Partículas que voam de uma fonte (texto medido com a Inter, lido numa grade de 4 px, ou uma
   lista de pontos) até alvos (retângulos e pontos). Tudo por semente: mesmo quadro, mesmo desenho.
   Fases em quadros de uma janela de 24 (escalam com `duracao`):
     0-4 paradas sobre a fonte · 4-18 voo com atraso de 0 a 6 pela distância, curva corte,
     15% acento claro e 10% acento no meio do voo · 18-24 encolhem até 0 sobre os alvos.
   Use `tempo` para dirigir pelo progresso de uma transição (tempo = progresso × T). */
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { random, useCurrentFrame } from 'remotion';
import { COR, TRACKING_PARTICULAS, type AlvosParticulas, type FonteParticulas, type XY } from './base-transicoes';
import { clamp01, curvas } from '../base/curvas';
import { fonteCanvas, geometriaLinha } from '../base/medir';

type Particula = { sx: number; sy: number; ex: number; ey: number; cx: number; cy: number; atraso: number; tam: number; tinta: 0 | 1 | 2 };

const amostrarFonte = (fontes: FonteParticulas[]): XY[] => {
  const c = document.createElement('canvas');
  c.width = 1920;
  c.height = 1080;
  const ctx = c.getContext('2d');
  if (!ctx) return [];
  ctx.fillStyle = '#fff';
  const extras: XY[] = [];
  fontes.forEach((f) => {
    if (f.tipo === 'texto') {
      const estilo = { tamanho: f.tamanho, peso: f.peso ?? 900, tracking: f.tracking ?? TRACKING_PARTICULAS };
      const g = geometriaLinha(f.texto, estilo, f.x, f.base, f.alinhar ?? 'esquerda', false);
      ctx.font = fonteCanvas(estilo);
      g.chars.forEach((ch, i) => ctx.fillText(ch, g.esquerda + g.xs[i], f.base));
    } else {
      extras.push(...f.pontos);
    }
  });
  const dados = ctx.getImageData(0, 0, 1920, 1080).data;
  const pts: XY[] = [];
  for (let y = 0; y < 1080; y += 4) for (let x = 0; x < 1920; x += 4) if (dados[(y * 1920 + x) * 4 + 3] > 128) pts.push([x, y]);
  return [...pts, ...extras];
};

const montar = (fontes: FonteParticulas[], alvos: AlvosParticulas, semente: string, n: number): Particula[] => {
  const origem = amostrarFonte(fontes);
  if (origem.length === 0) return [];
  // embaralha a amostra por semente e pega n (repete se faltar)
  const ordem = origem.map((p, i) => ({ p, k: random(`${semente}-o-${i}`) })).sort((a, b) => a.k - b.k).map((o) => o.p);
  const rets = alvos.retangulos ?? [];
  const pontos = alvos.pontos ?? [];
  const raio = alvos.raio ?? 4;
  const areaRets = rets.reduce((a, r) => a + r.w * r.h, 0);
  const pesoPontos = pontos.length * Math.PI * raio * raio * 6;
  const total = areaRets + pesoPontos || 1;
  const lista: Particula[] = [];
  let maxDist = 1;
  for (let i = 0; i < n; i++) {
    const [sx, sy] = ordem[i % ordem.length];
    const r = (k: string) => random(`${semente}-${k}-${i}`);
    let ex = 960;
    let ey = 540;
    const escolha = r('a') * total;
    if (escolha < areaRets && rets.length) {
      let acc = 0;
      const alvo = rets.find((q) => (acc += q.w * q.h) >= escolha) ?? rets[rets.length - 1];
      ex = alvo.x + r('x') * alvo.w;
      ey = alvo.y + r('y') * alvo.h;
    } else if (pontos.length) {
      const p = pontos[Math.floor(r('p') * pontos.length)];
      const a = r('ang') * Math.PI * 2;
      const rr = Math.sqrt(r('rr')) * raio;
      ex = p[0] + Math.cos(a) * rr;
      ey = p[1] + Math.sin(a) * rr;
    }
    const dx = ex - sx;
    const dy = ey - sy;
    const dist = Math.hypot(dx, dy) || 1;
    maxDist = Math.max(maxDist, dist);
    const curva = (80 + r('c') * 120) * (r('cs') < 0.5 ? -1 : 1);
    const u = r('t');
    lista.push({
      sx,
      sy,
      ex,
      ey,
      cx: (sx + ex) / 2 + (-dy / dist) * curva,
      cy: (sy + ey) / 2 + (dx / dist) * curva,
      atraso: dist,
      tam: 3 + r('s') * 2,
      tinta: u < 0.15 ? 1 : u < 0.25 ? 2 : 0,
    });
  }
  lista.forEach((p) => (p.atraso = (p.atraso / maxDist) * 6));
  return lista;
};

export const Particulas: React.FC<{
  fontes: FonteParticulas[];
  alvos: AlvosParticulas;
  inicio?: number;
  duracao?: number;
  semente?: string;
  n?: number;
  tempo?: number;
}> = ({ fontes, alvos, inicio = 0, duracao = 24, semente = 'particulas', n = 700, tempo }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const chave = JSON.stringify({ fontes, alvos, semente, n });
  // a chave serializada evita remontar a amostra quando o pai recria os arrays a cada quadro
  const parts = useMemo(() => montar(fontes, alvos, semente, n), [chave]);
  const t = tempo ?? frame - inicio;
  const k = duracao / 24;

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);
    if (t < 0 || t > duracao) return;
    const encolhe = 1 - clamp01((t - 18 * k) / (6 * k));
    parts.forEach((p) => {
      const ini = (4 + p.atraso) * k;
      const u = clamp01((t - ini) / (18 * k - ini));
      const e = curvas.corte(u);
      const a = 1 - e;
      const x = a * a * p.sx + 2 * a * e * p.cx + e * e * p.ex;
      const y = a * a * p.sy + 2 * a * e * p.cy + e * e * p.ey;
      const voando = u > 0.2 && u < 0.85;
      ctx.fillStyle = voando && p.tinta === 1 ? COR.claro : voando && p.tinta === 2 ? COR.forte : COR.verde;
      const s = p.tam * encolhe;
      if (s <= 0) return;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    });
  }, [t, parts, duracao, k]);

  return <canvas ref={ref} width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }} />;
};
