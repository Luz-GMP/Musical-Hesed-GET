/* Túnel (cena 6 → 7): o painel do pedido abre um túnel 3D da grade e a câmera voa por ele.
   T 18, k 12. `de` é o painel da cena 6 em repouso (C06.painel).
   q0-5   o miolo do painel escurece e vira a boca de um túnel: anéis retangulares em profundidade
          (13 anéis, d = 1 a 7) e linhas de grade nas quatro paredes, todos convergindo para o fundo;
          a seção vai da forma do painel para 16:9.
   q0-k   a câmera avança (s cresce em curva de aceleração): os anéis passam pela câmera, riscos de
          luz correm nas paredes, o centro do túnel desliza do painel para o centro da tela. No fundo
          (d = 7) a cena 7 aparece pequena, recortada no último anel, e cresce com ele: no quadro k o
          fundo cobre a tela (o ponto verde da cena 7 está no ponto de fuga o tempo todo).
   q k-T  o último anel passa pela câmera e some. A cena que sai cresce com a boca e apaga.
   Atravessa: a grade (o mesmo desenho da grade de fundo do filme). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import type { RetB } from '../layoutB';
import { clamp01, ease, lerp, RGB } from '../tema';

export type PropsTunel = ComJanela<{ de: RetB }>;

const D = 7;
const ANEIS = Array.from({ length: 13 }, (_, i) => 1 + i * 0.5);

export const TunelApresentacao: React.FC<TransitionPresentationComponentProps<PropsTunel>> = ({ children, presentationDirection, presentationProgress, passedProps: p }) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const P = p.de;
  const pc: [number, number] = [P.x + P.w / 2, P.y + P.h / 2];
  const Hx = P.w / 2;
  const a = Hx / 960;
  const sK = D - a; // no quadro k o fundo cobre a tela
  const sDe = (qq: number) => (qq <= p.k ? sK * Math.pow(clamp01(qq / p.k), 2.1) : sK + (qq - p.k) * 0.16);
  const s = sDe(q);
  const vel = s - sDe(q - 1);
  const forma = ease.sai(clamp01(q / 5));
  const Hy = lerp(P.h / 2, 540 * a, forma);
  const desliza = ease.suave(clamp01(q / p.k));
  const cx = lerp(pc[0], 960, desliza);
  const cy = lerp(pc[1], 540, desliza);
  const g = (d: number) => 1 / Math.max(0.04, d - s);

  if (presentationDirection === 'exiting') {
    if (q <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
    const gs = Math.min(8, g(1));
    if (gs >= 7.9 || q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    return (
      <AbsoluteFill style={{ transformOrigin: `${pc[0]}px ${pc[1]}px`, transform: `translate(${(cx - pc[0]).toFixed(1)}px, ${(cy - pc[1]).toFixed(1)}px) scale(${gs.toFixed(4)})`, filter: `brightness(${(1 - 0.5 * clamp01(q / 6)).toFixed(3)})${vel > 0.2 ? ` blur(${Math.min(5, vel * 3).toFixed(2)}px)` : ''}` }}>
        {children}
      </AbsoluteFill>
    );
  }

  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const ret = (d: number) => {
    const k = g(d);
    return { x0: cx - Hx * k, x1: cx + Hx * k, y0: cy - Hy * k, y1: cy + Hy * k };
  };
  const fundo = ret(D);
  const scFundo = Math.min(1, (Hx * g(D)) / 960);
  const aberto = q >= p.k;
  const dPerto = Math.max(1, s + 0.06);
  const perto = ret(dPerto);
  const boca = ret(1);
  const paredes = clamp01(q / 3);
  const fora = 1 - clamp01((q - p.k) / (p.T - p.k));
  const caminho = (r: { x0: number; x1: number; y0: number; y1: number }) => `M${r.x0.toFixed(1)} ${r.y0.toFixed(1)}H${r.x1.toFixed(1)}V${r.y1.toFixed(1)}H${r.x0.toFixed(1)}Z`;

  // linhas longitudinais: mesma fração na borda do anel perto e do fundo
  const longas: React.ReactNode[] = [];
  const lado = (n: number, ponto: (r: ReturnType<typeof ret>, u: number) => [number, number], chave: string) => {
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const [x0, y0] = ponto(perto, u);
      const [x1, y1] = ponto(fundo, u);
      longas.push(<line key={`${chave}${i}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke={`rgba(${RGB.claro},.5)`} strokeWidth={i === 0 || i === n ? 2.4 : 1.4} />);
    }
  };
  lado(10, (r, u) => [lerp(r.x0, r.x1, u), r.y0], 't');
  lado(10, (r, u) => [lerp(r.x0, r.x1, u), r.y1], 'b');
  lado(6, (r, u) => [r.x0, lerp(r.y0, r.y1, u)], 'l');
  lado(6, (r, u) => [r.x1, lerp(r.y0, r.y1, u)], 'r');

  // riscos de luz correndo nas paredes para a câmera
  const riscos = Array.from({ length: 22 }, (_, i) => {
    const rr = (k: string) => random(`tunel-${k}-${i}`);
    const parede = Math.floor(rr('p') * 4);
    const u = rr('u');
    const d0 = D - ((s * 1.6 + rr('o') * D) % (D - 1));
    const d1 = d0 + 0.5 + vel * 0.8;
    if (d0 - s < 0.08) return null;
    const pt = (d: number): [number, number] => {
      const r = ret(Math.max(d, s + 0.08));
      if (parede === 0) return [lerp(r.x0, r.x1, u), r.y0];
      if (parede === 1) return [lerp(r.x0, r.x1, u), r.y1];
      if (parede === 2) return [r.x0, lerp(r.y0, r.y1, u)];
      return [r.x1, lerp(r.y0, r.y1, u)];
    };
    const [xa, ya] = pt(d0);
    const [xb, yb] = pt(Math.min(D, d1));
    return <line key={`r${i}`} x1={xa} y1={ya} x2={xb} y2={yb} stroke="#E8FFF0" strokeWidth={3} strokeLinecap="round" opacity={0.9 * paredes} style={{ filter: `drop-shadow(0 0 6px rgba(${RGB.acento},1))` }} />;
  });

  return (
    <>
      {/* cena que entra: no fundo do túnel, crescendo com o último anel */}
      <AbsoluteFill
        style={{
          clipPath: aberto ? undefined : `inset(${fundo.y0.toFixed(1)}px ${(1920 - fundo.x1).toFixed(1)}px ${(1080 - fundo.y1).toFixed(1)}px ${fundo.x0.toFixed(1)}px)`,
          visibility: q <= 0 ? 'hidden' : 'visible',
        }}
      >
        <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: aberto ? undefined : `translate(${(cx - 960).toFixed(1)}px, ${(cy - 540).toFixed(1)}px) scale(${scFundo.toFixed(4)})` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {!aberto && q > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <radialGradient id="tunelParede" cx={cx} cy={cy} r={1100} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0B3A20" />
              <stop offset="0.35" stopColor="#061A0E" />
              <stop offset="1" stopColor="#020604" />
            </radialGradient>
          </defs>
          {/* paredes: entre a boca (ou a tela) e o fundo */}
          <path d={`${s < 1 ? caminho(boca) : 'M-50 -50H1970V1130H-50Z'} ${caminho(fundo)}`} fillRule="evenodd" fill="url(#tunelParede)" opacity={paredes} />
          <g opacity={paredes}>
            {longas}
            {ANEIS.filter((d) => d - s > 0.06).map((d) => {
              const r = ret(d);
              const prox = clamp01(1.4 / (d - s) / 3);
              return <path key={d} d={caminho(r)} fill="none" stroke={`rgba(${RGB.claro},${(0.25 + 0.6 * prox).toFixed(3)})`} strokeWidth={1.2 + 3 * prox} />;
            })}
            {riscos}
          </g>
          <path d={caminho(fundo)} fill="none" stroke="#DFFFEA" strokeWidth={3} style={{ filter: `drop-shadow(0 0 14px rgba(${RGB.acento},1))` }} />
        </svg>
      ) : null}
      {aberto && fora > 0 ? (
        <AbsoluteFill style={{ pointerEvents: 'none', boxShadow: `inset 0 0 ${(160 * fora).toFixed(0)}px rgba(${RGB.acento},${(0.55 * fora).toFixed(3)})`, border: `${(6 * fora).toFixed(1)}px solid rgba(223,255,234,${fora.toFixed(3)})` }} />
      ) : null}
    </>
  );
};

export const tunel = (props: PropsTunel): TransitionPresentation<PropsTunel> => ({ component: TunelApresentacao, props });
