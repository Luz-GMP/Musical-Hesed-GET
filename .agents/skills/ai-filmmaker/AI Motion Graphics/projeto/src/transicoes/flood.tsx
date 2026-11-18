/* flood: varredura de cor. T 14, k 11.
   A cena que entra aparece recortada por um semiplano inclinado cuja borda de ataque atravessa a
   tela (curva corte) e chega ao outro lado no quadro k; na borda, linha de 6 px com a luz do acento
   (claro → forte) e faixa de brilho de 90 px atrás dela; q k..k+3 o brilho residual some.
   Variantes: 'linha' (linha branca em yLinha que se abre na vertical) e 'centro' (retângulo
   inclinado que cresce do centro).
   Este arquivo também exporta utilidades comuns das transições (AnelLuz, jm, cantoMaisLonge, ...). */
import React, { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, curvas, lerp, mola } from '../base/curvas';
import { COR, type PropsFlood } from './base-transicoes';
import type { NomeMola } from '../base/curvas';

/* =============================== utilidades comuns =============================== */

export const LARG = 1920;
export const ALT = 1080;

/** Mola que vale 0 até `inicio` (não lê a mola em quadro negativo). */
export const jm = (q: number, nome: NomeMola, inicio: number, duracao?: number) => (q <= inicio ? 0 : mola(q, nome, inicio, duracao));

/** Id seguro para <defs> de SVG. */
export const useIdSvg = (prefixo: string) => `${prefixo}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

/** Distância de (x, y) até o canto mais longe da tela. */
export const cantoMaisLonge = (x: number, y: number) =>
  Math.max(Math.hypot(x, y), Math.hypot(LARG - x, y), Math.hypot(x, ALT - y), Math.hypot(LARG - x, ALT - y));

/** Opacidades dos fantasmas de desfoque (2.4): .30, .15, .08. Só com velocidade acima de 20 px/q. */
export const FANTASMAS = [0.3, 0.15, 0.08] as const;

const mascara = (m: string): React.CSSProperties => ({ WebkitMaskImage: m, maskImage: m });

/** Anel de luz claro ↔ forte do acento (gradiente cônico recortado por máscara radial), com uma faixa de
    brilho em volta. Duas camadas de gradiente, sem filtro. */
export const AnelLuz: React.FC<{ x: number; y: number; r: number; espessura?: number; opacidade?: number; brilho?: number; giro?: number }> = ({
  x,
  y,
  r,
  espessura = 2,
  opacidade = 1,
  brilho = 0.35,
  giro = 0,
}) => {
  if (r <= 0.5 || opacidade <= 0) return null;
  const e = espessura / 2;
  const fundo = `conic-gradient(from ${giro}deg at ${x}px ${y}px, ${COR.claro}, ${COR.forte}, ${COR.claro}, ${COR.forte}, ${COR.claro})`;
  const px = (v: number) => `${Math.max(0, v).toFixed(2)}px`;
  return (
    <>
      {brilho > 0 ? (
        <AbsoluteFill
          style={{
            background: fundo,
            opacity: opacidade * brilho,
            ...mascara(`radial-gradient(circle at ${x}px ${y}px, transparent ${px(r - 26)}, #000 ${px(r)}, transparent ${px(r + 26)})`),
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background: fundo,
          opacity: opacidade,
          ...mascara(
            `radial-gradient(circle at ${x}px ${y}px, transparent ${px(r - e - 0.6)}, #000 ${px(r - e)}, #000 ${px(r + e)}, transparent ${px(r + e + 0.6)})`,
          ),
        }}
      />
    </>
  );
};

/* ===================================== Flood ===================================== */

export type PropsFloodT = ComJanela<PropsFlood>;

type V = readonly [number, number];
const C: V = [LARG / 2, ALT / 2];
const pt = (u: V, t: V, a: number, b: number): V => [C[0] + u[0] * a + t[0] * b, C[1] + u[1] * a + t[1] * b];
const poli = (v: V[]) => `polygon(${v.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`;
const pts = (v: V[]) => v.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const BRILHO = 90;
const LINHA = 6;

/** Varredura: semiplano {p : (p − centro)·u ≤ s}; s anda de −E até E (E = meia projeção da tela em u). */
const Varredura: React.FC<{ p: PropsFloodT; q: number; children: React.ReactNode }> = ({ p, q, children }) => {
  const id = useIdSvg('fl');
  const d = (p.direcao * Math.PI) / 180;
  const v: V = [Math.cos(d), -Math.sin(d)];
  const i = (p.inclinacao * Math.PI) / 180;
  const u: V = [v[0] * Math.cos(i) - v[1] * Math.sin(i), v[0] * Math.sin(i) + v[1] * Math.cos(i)];
  const t: V = [-u[1], u[0]];
  const E = (LARG / 2) * Math.abs(u[0]) + (ALT / 2) * Math.abs(u[1]);
  const sDe = (qq: number) => lerp(-E - 24, E, curvas.corte(clamp01(qq / p.k)));
  const s = sDe(q);
  const vel = s - sDe(q - 1);
  const coberto = q >= p.k;
  const residual = coberto ? 1 - clamp01((q - p.k) / 3) : 1;
  const clip = coberto ? undefined : poli([pt(u, t, s, 3000), pt(u, t, s, -3000), pt(u, t, s - 6000, -3000), pt(u, t, s - 6000, 3000)]);
  const a0 = pt(u, t, s, 0);
  const a1 = pt(u, t, s - BRILHO, 0);
  const l0 = pt(u, t, s, -1300);
  const l1 = pt(u, t, s, 1300);
  return (
    <>
      <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
      {p.borda && residual > 0 ? (
        <svg width={LARG} height={ALT} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1={a0[0]} y1={a0[1]} x2={a1[0]} y2={a1[1]}>
              <stop offset="0" stopColor={COR.claro} stopOpacity={0.35} />
              <stop offset="0.55" stopColor={COR.forte} stopOpacity={0.12} />
              <stop offset="1" stopColor={COR.forte} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1={l0[0]} y1={l0[1]} x2={l1[0]} y2={l1[1]}>
              <stop offset="0" stopColor={COR.claro} />
              <stop offset="1" stopColor={COR.forte} />
            </linearGradient>
          </defs>
          <polygon
            points={pts([pt(u, t, s, -3000), pt(u, t, s, 3000), pt(u, t, s - BRILHO, 3000), pt(u, t, s - BRILHO, -3000)])}
            fill={`url(#${id}b)`}
            opacity={residual}
          />
          {!coberto && Math.abs(vel) > 20
            ? FANTASMAS.map((o, j) => {
                const sg = s - Math.sign(vel) * Math.min(Math.abs(vel), 60) * ((j + 1) / 3);
                const g0 = pt(u, t, sg, -1300);
                const g1 = pt(u, t, sg, 1300);
                return <line key={j} x1={g0[0]} y1={g0[1]} x2={g1[0]} y2={g1[1]} stroke={`url(#${id}l)`} strokeWidth={LINHA} opacity={o} />;
              })
            : null}
          <line x1={l0[0]} y1={l0[1]} x2={l1[0]} y2={l1[1]} stroke={`url(#${id}l)`} strokeWidth={LINHA} opacity={residual} />
        </svg>
      ) : null}
    </>
  );
};

/** Variante 'linha': linha branca de 3 px em yLinha cresce do centro (q0-3) e se abre na vertical até
    cobrir a tela no quadro k; as duas bordas levam a luz do acento. */
const Linha: React.FC<{ p: PropsFloodT; q: number; children: React.ReactNode }> = ({ p, q, children }) => {
  const id = useIdSvg('fn');
  const y0 = p.yLinha;
  const hMax = Math.max(y0, ALT - y0) + 8;
  const risco = curvas.saida(clamp01((q + 1) / 3));
  const hDe = (qq: number) => hMax * curvas.corte(clamp01((qq - 2) / (p.k - 2)));
  const h = hDe(q);
  const vel = h - hDe(q - 1);
  const coberto = q >= p.k;
  const residual = coberto ? 1 - clamp01((q - p.k) / 3) : 1;
  const topo = y0 - h;
  const base = y0 + h;
  // as duas faixas de brilho não se cruzam enquanto a abertura é estreita
  const brilho = Math.min(BRILHO, h / 2);
  const clip = coberto ? undefined : `inset(${topo.toFixed(1)}px 0px ${(ALT - base).toFixed(1)}px 0px)`;
  const linhaBranca = h < 4;
  return (
    <>
      <AbsoluteFill style={{ clipPath: clip, visibility: h <= 0.5 && !coberto ? 'hidden' : 'visible' }}>{children}</AbsoluteFill>
      {residual > 0 ? (
        <svg width={LARG} height={ALT} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={COR.claro} />
              <stop offset="1" stopColor={COR.forte} />
            </linearGradient>
            <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={COR.claro} stopOpacity={0.35} />
              <stop offset="1" stopColor={COR.forte} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${id}b`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={COR.claro} stopOpacity={0.35} />
              <stop offset="1" stopColor={COR.forte} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={COR.branco} stopOpacity={0} />
              <stop offset="0.2" stopColor={COR.branco} />
              <stop offset="0.8" stopColor={COR.branco} />
              <stop offset="1" stopColor={COR.branco} stopOpacity={0} />
            </linearGradient>
          </defs>
          {linhaBranca ? (
            <>
              <rect x={LARG / 2 - (LARG / 2) * risco} y={y0 - 14} width={LARG * risco} height={28} fill={`url(#${id}w)`} opacity={0.12} />
              <rect x={LARG / 2 - (LARG / 2) * risco} y={y0 - 1.5} width={LARG * risco} height={3} fill={COR.branco} />
            </>
          ) : (
            <g opacity={residual}>
              <rect x={0} y={topo} width={LARG} height={brilho} fill={`url(#${id}t)`} />
              <rect x={0} y={base - brilho} width={LARG} height={brilho} fill={`url(#${id}b)`} />
              {!coberto && vel > 20 && h > 2 * BRILHO
                ? FANTASMAS.map((o, j) => {
                    const hg = h - Math.min(vel, 60) * ((j + 1) / 3);
                    return (
                      <g key={j} opacity={o}>
                        <rect x={0} y={y0 - hg - LINHA / 2} width={LARG} height={LINHA} fill={`url(#${id}l)`} />
                        <rect x={0} y={y0 + hg - LINHA / 2} width={LARG} height={LINHA} fill={`url(#${id}l)`} />
                      </g>
                    );
                  })
                : null}
              <rect x={0} y={topo - LINHA / 2} width={LARG} height={LINHA} fill={`url(#${id}l)`} />
              <rect x={0} y={base - LINHA / 2} width={LARG} height={LINHA} fill={`url(#${id}l)`} />
            </g>
          )}
        </svg>
      ) : null}
    </>
  );
};

/** Variante 'centro': retângulo girado pela inclinação cresce do centro até passar dos cantos. */
const Centro: React.FC<{ p: PropsFloodT; q: number; children: React.ReactNode }> = ({ p, q, children }) => {
  const id = useIdSvg('fc');
  const i = (p.inclinacao * Math.PI) / 180;
  const cos = Math.cos(i);
  const sin = Math.sin(i);
  // meias medidas mínimas para o retângulo girado cobrir a tela, mais folga para a luz sair
  const hw = (LARG / 2) * cos + (ALT / 2) * sin + 110;
  const hh = (LARG / 2) * sin + (ALT / 2) * cos + 110;
  const aDe = (qq: number) => curvas.corte(clamp01(qq / p.k));
  const a = aDe(q);
  const vel = (a - aDe(q - 1)) * hh;
  const coberto = q >= p.k;
  const cantos = (f: number): V[] =>
    (
      [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ] as const
    ).map(([sx, sy]) => {
      const x = sx * hw * f;
      const y = sy * hh * f;
      return [C[0] + x * cos - y * sin, C[1] + x * sin + y * cos] as V;
    });
  const c = cantos(a);
  const clip = coberto ? undefined : poli(c);
  return (
    <>
      <AbsoluteFill style={{ clipPath: clip, visibility: a <= 0.001 && !coberto ? 'hidden' : 'visible' }}>{children}</AbsoluteFill>
      {!coberto && p.borda && a > 0.001 ? (
        <svg width={LARG} height={ALT} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1={c[0][0]} y1={c[0][1]} x2={c[2][0]} y2={c[2][1]}>
              <stop offset="0" stopColor={COR.claro} />
              <stop offset="1" stopColor={COR.forte} />
            </linearGradient>
            <clipPath id={`${id}c`}>
              <polygon points={pts(c)} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}c)`}>
            <polygon points={pts(c)} fill="none" stroke={COR.claro} strokeWidth={BRILHO * 2} opacity={0.08} />
            <polygon points={pts(c)} fill="none" stroke={COR.claro} strokeWidth={BRILHO} opacity={0.12} />
            <polygon points={pts(c)} fill="none" stroke={COR.forte} strokeWidth={30} opacity={0.18} />
          </g>
          {vel > 20
            ? FANTASMAS.map((o, j) => (
                <polygon
                  key={j}
                  points={pts(cantos(a - (Math.min(vel, 60) / hh) * ((j + 1) / 3)))}
                  fill="none"
                  stroke={`url(#${id}l)`}
                  strokeWidth={LINHA}
                  opacity={o}
                />
              ))
            : null}
          <polygon points={pts(c)} fill="none" stroke={`url(#${id}l)`} strokeWidth={LINHA} />
        </svg>
      ) : null}
    </>
  );
};

export const FloodApresentacao: React.FC<TransitionPresentationComponentProps<PropsFloodT>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  // a cena que sai fica parada por baixo: a placa passa por cima dela
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  // depois da janela o TransitionSeries segue envolvendo a cena com progresso 1: as três variantes
  // já chegam lá sem recorte e sem luz (residual 0)
  if (p.variante === 'linha')
    return (
      <Linha p={p} q={q}>
        {children}
      </Linha>
    );
  if (p.variante === 'centro')
    return (
      <Centro p={p} q={q}>
        {children}
      </Centro>
    );
  return (
    <Varredura p={p} q={q}>
      {children}
    </Varredura>
  );
};

export const flood = (props: PropsFloodT): TransitionPresentation<PropsFloodT> => ({ component: FloodApresentacao, props });
