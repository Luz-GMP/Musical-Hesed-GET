/* Glitch RGB que "conserta" (cena 8 → 9). T 12, k 6.
   q0-k   a cena que sai se separa em canais (vermelho para a direita, azul para a esquerda, filtro
          SVG no próprio quadro), fatias horizontais pulam de lado, linhas de varredura e blocos de
          ruído verde e branco aparecem; a força cresce até o corte.
   q k    troca seca no pico do glitch: entra a cena limpa.
   q k-T  a cena que entra chega ainda separada e fatiada e ASSENTA: a separação cai a zero, as
          fatias voltam ao lugar. É a leitura de "consertou".
   Atravessa: o próprio ruído (a mesma semente de fatias dos dois lados do corte). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, PALETA } from '../tema';

export type PropsGlitch = ComJanela<object>;

const FATIAS = 7;

const FiltroRGB: React.FC<{ id: string; d: number }> = ({ id, d }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <defs>
      <filter id={id} x="-5%" y="0%" width="110%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={d} dy={0} result="r2" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feOffset in="b" dx={-d} dy={d * 0.15} result="b2" />
        <feBlend mode="screen" in="r2" in2="g" result="rg" />
        <feBlend mode="screen" in="rg" in2="b2" />
      </filter>
    </defs>
  </svg>
);

export const GlitchApresentacao: React.FC<TransitionPresentationComponentProps<PropsGlitch>> = ({ children, presentationDirection, presentationProgress, passedProps: p }) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const qi = Math.floor(q + 1e-6);
  const entrando = presentationDirection === 'entering';
  // força: cresce até o corte e cai depois dele
  const forca = entrando ? 1 - ease.sai(clamp01((q - p.k) / (p.T - p.k))) : ease.entra(clamp01(q / p.k)) * 0.85 + 0.15 * clamp01(q);
  if (entrando && q < p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
  if (!entrando && q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
  if (forca <= 0.02 || q <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const id = `glitch-${presentationDirection}-${qi}`;
  const d = 6 + 46 * forca;
  const salto = Math.floor(qi / 1);
  const fatias = Array.from({ length: FATIAS }, (_, i) => {
    const r = (k: string) => random(`glitch-${k}-${i}-${salto}`);
    if (r('on') > 0.35 + 0.5 * forca) return null;
    const y0 = r('y') * 1000;
    const h = 20 + r('h') * 120 * (0.4 + forca);
    const dx = (r('dx') - 0.5) * 260 * forca;
    return (
      <AbsoluteFill key={i} style={{ clipPath: `inset(${y0.toFixed(0)}px 0 ${Math.max(0, 1080 - y0 - h).toFixed(0)}px 0)`, transform: `translateX(${dx.toFixed(1)}px)`, filter: `url(#${id}) brightness(${(1 + 0.4 * r('b')).toFixed(2)})` }}>
        {children}
      </AbsoluteFill>
    );
  });
  const blocos = Array.from({ length: 10 }, (_, i) => {
    const r = (k: string) => random(`glitch-bl-${k}-${i}-${salto}`);
    if (r('on') > forca * 0.9) return null;
    return <div key={i} style={{ position: 'absolute', left: r('x') * 1800, top: r('y') * 1040, width: 40 + r('w') * 260, height: 8 + r('h') * 40, background: r('c') < 0.5 ? PALETA.acento : r('c') < 0.8 ? '#F1F0E8' : '#000', opacity: 0.85, mixBlendMode: r('c') < 0.5 ? 'screen' : 'normal' }} />;
  });
  return (
    <AbsoluteFill>
      <FiltroRGB id={id} d={d} />
      <AbsoluteFill style={{ filter: `url(#${id})`, transform: `translateX(${((random(`glitch-x-${salto}`) - 0.5) * 30 * forca).toFixed(1)}px) scale(${1 + 0.02 * forca})` }}>{children}</AbsoluteFill>
      {fatias}
      <AbsoluteFill style={{ pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0px, rgba(0,0,0,.35) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)', opacity: forca }} />
      {blocos}
      {qi === p.k ? <AbsoluteFill style={{ background: 'rgba(200,255,220,.18)', mixBlendMode: 'screen' }} /> : null}
    </AbsoluteFill>
  );
};

export const glitchRGB = (props: PropsGlitch): TransitionPresentation<PropsGlitch> => ({ component: GlitchApresentacao, props });
