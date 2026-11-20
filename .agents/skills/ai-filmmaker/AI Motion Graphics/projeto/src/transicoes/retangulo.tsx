/* retangulo: um elemento de interface vira a cena seguinte. T 16, k 12.
   'expande', q0-12: um retângulo vai de `de` até `para` (padrão: tela cheia, raio 0) com mola snap.
   A cena que entra aparece dentro dele em escala 1 (só recorte). Contorno de 2 px no acento com
   brilho de borda e as 8 alças de seleção (AlcasSelecao) acompanham os cantos; 2 a 3 contornos
   fantasma seguem atrás enquanto a mola corre. A cena que sai recua 4% por baixo.
   q12-16: alças e contorno encolhem para 0.
   'recolhe': o inverso. A cena que SAI encolhe de tela cheia até `para` e fica viva lá dentro; a
   que entra está inteira em volta (recorte com furo, evenodd).
   Use quando a cena que sai tem um cartão/janela que deve "virar" a próxima cena: passe `de` nele. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { AlcasSelecao } from '../base/AlcasSelecao';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, lerp } from '../base/curvas';
import { COR, type PropsRetangulo, type Ret } from './base-transicoes';
import { ALT, FANTASMAS, jm, LARG } from './flood';
import { RGB } from '../tema';

export type PropsRetanguloT = ComJanela<PropsRetangulo>;

type R4 = { x: number; y: number; w: number; h: number; r: number };

const interp = (a: Ret, b: Ret, t: number): R4 => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  r: Math.max(0, lerp(a.r ?? 0, b.r ?? 0, t)),
});

const inset = (r: R4) =>
  `inset(${r.y.toFixed(1)}px ${(LARG - r.x - r.w).toFixed(1)}px ${(ALT - r.y - r.h).toFixed(1)}px ${r.x.toFixed(1)}px round ${r.r.toFixed(1)}px)`;

const caminhoRet = (r: R4) => {
  const k = Math.min(r.r, r.w / 2, r.h / 2);
  const { x, y, w, h } = r;
  return `M${x + k} ${y}H${x + w - k}A${k} ${k} 0 0 1 ${x + w} ${y + k}V${y + h - k}A${k} ${k} 0 0 1 ${x + w - k} ${y + h}H${x + k}A${k} ${k} 0 0 1 ${x} ${y + h - k}V${y + k}A${k} ${k} 0 0 1 ${x + k} ${y}Z`;
};

/** A cena inteira encaixada no retângulo (cobre, centrada): escala e translação a partir do centro. */
const encaixe = (r: R4) => {
  const s = Math.max(r.w / LARG, r.h / ALT);
  return `translate(${(r.x + r.w / 2 - LARG / 2).toFixed(2)}px, ${(r.y + r.h / 2 - ALT / 2).toFixed(2)}px) scale(${s.toFixed(4)})`;
};

export const RetanguloApresentacao: React.FC<TransitionPresentationComponentProps<PropsRetanguloT>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const fimMola = p.k;
  const ret = (qq: number) => interp(p.de, p.para, jm(qq, 'snap', 0, fimMola));
  const r = ret(q);
  const recolhe = p.modo === 'recolhe';
  const saindo = presentationDirection === 'exiting';

  if (saindo) {
    if (recolhe) {
      // a cena que sai vive dentro do retângulo que encolhe
      return (
        <AbsoluteFill style={{ clipPath: inset(r) }}>
          <AbsoluteFill style={{ transform: encaixe(r) }}>{children}</AbsoluteFill>
        </AbsoluteFill>
      );
    }
    // recua um pouco por baixo, em volta do ponto de onde o retângulo sai
    const m = jm(q, 'snap', 0, fimMola);
    const cx = p.de.x + p.de.w / 2;
    const cy = p.de.y + p.de.h / 2;
    return <AbsoluteFill style={{ transform: `scale(${(1 - 0.04 * m).toFixed(4)})`, transformOrigin: `${cx}px ${cy}px` }}>{children}</AbsoluteFill>;
  }

  // ---- lado 'entering' (camada de cima) ----
  const ra = ret(q - 1);
  const vel = Math.max(Math.abs(r.x - ra.x), Math.abs(r.y - ra.y), Math.abs(r.x + r.w - ra.x - ra.w), Math.abs(r.y + r.h - ra.y - ra.h));
  // alças: aparecem em 2 quadros, ficam, e encolhem q12-16
  const alcas = q < fimMola ? clamp01(0.45 + q / 3) : 1 - clamp01((q - fimMola) / (p.T - fimMola));
  const contorno = 2 * alcas;

  // depois da janela (q ≥ T) o TransitionSeries segue envolvendo a cena: sem recorte, sem moldura
  const acabou = q >= p.T;
  const cena = recolhe ? (
    <AbsoluteFill style={{ clipPath: acabou ? undefined : `path(evenodd, "M0 0H${LARG}V${ALT}H0Z ${caminhoRet(r)}")` }}>{children}</AbsoluteFill>
  ) : (
    <AbsoluteFill style={{ clipPath: q >= p.T - 1 ? undefined : inset(r) }}>{children}</AbsoluteFill>
  );

  const moldura = (m: R4, op: number, esp: number, brilho: boolean, key?: number) => (
    <div
      key={key}
      style={{
        position: 'absolute',
        left: m.x,
        top: m.y,
        width: m.w,
        height: m.h,
        borderRadius: m.r,
        border: `${esp}px solid ${COR.verde}`,
        boxSizing: 'border-box',
        opacity: op,
        boxShadow: brilho ? `0 0 42px rgba(${RGB.claro},${(0.28 * alcas).toFixed(3)}), inset 0 0 28px rgba(${RGB.acento},${(0.22 * alcas).toFixed(3)})` : undefined,
      }}
    />
  );

  return (
    <>
      {cena}
      {vel > 20 && contorno > 0 ? FANTASMAS.map((o, j) => moldura(interp(r, ra, (j + 1) / 3), o, 2, false, j)) : null}
      {contorno > 0.05 && !acabou ? moldura(r, 1, contorno, true) : null}
      {acabou ? null : <AlcasSelecao x={r.x} y={r.y} w={r.w} h={r.h} progresso={alcas} />}
    </>
  );
};

export const retangulo = (props: PropsRetanguloT): TransitionPresentation<PropsRetanguloT> => ({ component: RetanguloApresentacao, props });
