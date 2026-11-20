/* Grão: canvas 480x270 de ruído cinza, escalado para a tela, trocando a 15 fps (semente = quadro / 2).
   O ruído vem de um PRNG simples semeado por random() do Remotion: determinístico e rápido
   (130 mil amostras por quadro seriam lentas chamando random() uma a uma). */
import React, { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

const mulberry32 = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const Grao: React.FC<{ opacidade?: number; semente?: string }> = ({ opacidade = 0.05, semente = 'grao' }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const passo = Math.floor(frame / 2);

  useLayoutEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const img = ctx.createImageData(480, 270);
    const r = mulberry32(Math.floor(random(`${semente}-${passo}`) * 4294967296));
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.floor(r() * 255);
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [passo, semente]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: opacidade }}>
      <canvas ref={ref} width={480} height={270} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
};
