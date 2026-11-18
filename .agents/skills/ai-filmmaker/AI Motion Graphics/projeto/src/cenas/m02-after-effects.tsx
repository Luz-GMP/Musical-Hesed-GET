/* Cena 2 (3,14–4,84 s): "…sem nem abrir o After Effects?"
   Atrás: uma timeline de camadas recriada (sem logo) em perspectiva, linhas entrando em cascata,
   agulha correndo. "sem nem abrir o" sobe pequeno em cima; "After Effects?" gigante, letra a letra,
   "Effects?" verde. Um laser vermelho corta a timeline em X: um risco em "After", o outro em
   "Effects?" (cada um com tranco de câmera). Sai estilhaçada (transição estilhaca). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { C02 } from '../layout';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { LogoApp } from '../logos';
import { Camera, Flare, FundoM, HUD, Poeira } from '../visual';

const CAMADAS = ['TEXTO 01', 'FORMA 02', 'FORMA 03', 'CÂMERA', 'NULL 05', 'AJUSTE 06'];
const BARRAS: [number, number][] = [
  [0.08, 0.62],
  [0.22, 0.9],
  [0.04, 0.48],
  [0.3, 0.98],
  [0.12, 0.7],
  [0.4, 0.86],
];

const Laser: React.FC<{ de: [number, number]; para: [number, number]; p: number; brilho: number }> = ({ de, para, p, brilho }) => {
  if (p <= 0) return null;
  const x = lerp(de[0], para[0], p);
  const y = lerp(de[1], para[1], p);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line x1={de[0]} y1={de[1]} x2={x} y2={y} stroke={`rgba(${RGB.alerta},.35)`} strokeWidth={22} strokeLinecap="round" />
        <line x1={de[0]} y1={de[1]} x2={x} y2={y} stroke={CORM.vermelho} strokeWidth={7} strokeLinecap="round" />
        <line x1={de[0]} y1={de[1]} x2={x} y2={y} stroke="#FFE1DE" strokeWidth={2.5} strokeLinecap="round" />
      </svg>
      <Flare x={x} y={y} forca={brilho} cor="255,90,70" largura={360} />
    </>
  );
};

export const M02: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const P = C02.painel;
  const apoio = trecho(2, 0, 3);
  const gigante = trecho(2, 4);
  const { itens: gi } = useLayoutFala({ palavras: gigante, x: C02.gigante.x, y: C02.gigante.y, estilo: C02.gigante.estilo });
  const qAfter = gi[0].q + 1;
  const qEffects = gi[1].q + 1;
  const l1 = janelaM(f, qAfter, qAfter + 5, 'corte');
  const l2 = janelaM(f, qEffects, qEffects + 5, 'corte');
  const tranco = (q0: number) => {
    const t = f - q0 - 4;
    return t >= 0 && t < 6 ? (random(`m02-sh-${q0}-${f}`) - 0.5) * 18 * (1 - t / 6) : 0;
  };
  const sx = tranco(qAfter) + tranco(qEffects);
  const sy = tranco(qAfter + 100) + tranco(qEffects + 100);
  const morta = Math.max(l1, l2) > 0.99 ? janelaM(f, qEffects + 5, qEffects + 14) : 0;
  const LOGO = { x: 1530, y: 40, tam: 250 };
  const qLogo = c.local(apoio[2].s) - 2; // "abrir"
  const eLogo = mola(f, 'estalo', qLogo);
  const agulha = 0.18 + 0.5 * ease.suave(clamp01(f / 60));
  const colLabel = 230;
  const trilho = { x: P.x + colLabel, w: P.w - colLabel - 30 };
  const linhaH = 56;
  const topoLinhas = P.y + 110;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 45]} />
      <Poeira semente="m02" />
      <Camera zoom={[1.03, 1.1]} janela={[0, 70]} origem={C02.impacto} deriva={6} extra={`translate(${sx}px, ${sy}px)`}>
        {/* timeline */}
        <AbsoluteFill style={{ perspective: 1800 }}>
          <AbsoluteFill style={{ transform: 'rotateX(16deg) rotateY(-7deg)', transformOrigin: '50% 60%', opacity: 1 - 0.45 * morta, filter: morta > 0 ? `saturate(${1 - 0.7 * morta})` : undefined }}>
            <div
              style={{
                position: 'absolute',
                left: P.x,
                top: P.y,
                width: P.w,
                height: P.h,
                borderRadius: 18,
                background: 'linear-gradient(180deg, rgba(14,34,22,.92), rgba(6,14,9,.92))',
                border: `2px solid ${CORM.linhaForte}`,
                boxShadow: `0 40px 120px rgba(0,0,0,.6), 0 0 60px rgba(${RGB.acento},.12)`,
                transform: `scale(${0.94 + 0.06 * mola(f, 'assenta', 0)})`,
                opacity: janelaM(f, 0, 6),
              }}
            />
            {/* régua */}
            <div style={{ position: 'absolute', left: P.x + 8, top: P.y - 48, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, letterSpacing: '0.08em', opacity: janelaM(f, 2, 8) }}>
              TIMELINE · COMP 1
            </div>
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={`r${i}`}
                style={{
                  position: 'absolute',
                  left: trilho.x + (i * trilho.w) / 5 - 40,
                  top: P.y + 30,
                  width: 80,
                  textAlign: 'center',
                  fontFamily: FONTEM.mono,
                  fontSize: 28,
                  color: CORM.dim,
                  opacity: janelaM(f, 3 + i, 9 + i),
                }}
              >
                {`${i * 2}s`}
              </div>
            ))}
            <div style={{ position: 'absolute', left: trilho.x, top: P.y + 84, width: trilho.w, height: 2, background: CORM.linhaForte }} />
            {/* camadas */}
            {CAMADAS.map((nome, i) => {
              const e = mola(f, 'assenta', 1 + i * 1.5);
              const y = topoLinhas + i * linhaH;
              const [a, b] = BARRAS[i];
              return (
                <React.Fragment key={nome}>
                  <div
                    style={{
                      position: 'absolute',
                      left: P.x + 28,
                      top: y + 8,
                      fontFamily: FONTEM.mono,
                      fontSize: 28,
                      color: CORM.papel,
                      opacity: e,
                      transform: `translateX(${(1 - e) * -60}px)`,
                    }}
                  >
                    {nome}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      left: trilho.x + a * trilho.w,
                      top: y + 8,
                      width: (b - a) * trilho.w * e,
                      height: 34,
                      borderRadius: 8,
                      background: i === 3 ? `rgba(${RGB.claro},.32)` : `rgba(${RGB.acento},.2)`,
                      border: `2px solid rgba(${RGB.claro},.55)`,
                    }}
                  />
                  {[0, 0.33, 0.7, 1].map((k, j) => {
                    const kx = trilho.x + lerp(a, b, k) * trilho.w;
                    const ke = mola(f, 'estalo', 6 + i * 1.5 + j);
                    return (
                      <div
                        key={j}
                        style={{
                          position: 'absolute',
                          left: kx - 9,
                          top: y + 16,
                          width: 18,
                          height: 18,
                          background: CORM.verdeClaro,
                          transform: `rotate(45deg) scale(${ke})`,
                          boxShadow: `0 0 10px rgba(${RGB.claro},.8)`,
                        }}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
            {/* agulha */}
            <div
              style={{
                position: 'absolute',
                left: trilho.x + agulha * trilho.w,
                top: P.y + 70,
                width: 3,
                height: P.h - 90,
                background: CORM.verde,
                boxShadow: BRILHO.verdeLeve,
                opacity: janelaM(f, 4, 10),
              }}
            />
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: 'rotateX(16deg) rotateY(-7deg)', transformOrigin: '50% 60%' }}>
            <Laser de={[P.x - 40, P.y - 30]} para={[P.x + P.w + 40, P.y + P.h + 30]} p={l1} brilho={1 - janelaM(f, qAfter + 5, qAfter + 12) * 0.7} />
            <Laser de={[P.x + P.w + 40, P.y - 30]} para={[P.x - 40, P.y + P.h + 30]} p={l2} brilho={1 - janelaM(f, qEffects + 5, qEffects + 12) * 0.7} />
          </AbsoluteFill>
        </AbsoluteFill>
        {/* antecipa 6: a cena assenta no q5,5 do chicote; "sem" fica nítida no quadro em que soa */}
        <Fala palavras={apoio} x={C02.apoio.x} y={C02.apoio.y} estilo={TIPOM.apoio} cor={CORM.papel} antecipa={6} />
        {/* ícone do app (LogoApp, placeholder): entra em "abrir", leva o X junto com a timeline e estilhaça com a cena */}
        {f >= qLogo ? (
          <div style={{ position: 'absolute', left: LOGO.x, top: LOGO.y, transform: `scale(${0.4 + 0.6 * eLogo}) rotate(${(1 - eLogo) * -18}deg)`, opacity: clamp01((f - qLogo) / 3) * (1 - 0.45 * morta), filter: morta > 0 ? `saturate(${1 - 0.6 * morta})` : undefined }}>
            <LogoApp tam={LOGO.tam} sigla="APP" brilho={1 - 0.6 * morta} />
          </div>
        ) : null}
        <Laser de={[LOGO.x - 30, LOGO.y - 30]} para={[LOGO.x + LOGO.tam + 30, LOGO.y + LOGO.tam + 30]} p={l1} brilho={1 - janelaM(f, qAfter + 5, qAfter + 12) * 0.7} />
        <Laser de={[LOGO.x + LOGO.tam + 30, LOGO.y - 30]} para={[LOGO.x - 30, LOGO.y + LOGO.tam + 30]} p={l2} brilho={1 - janelaM(f, qEffects + 5, qEffects + 12) * 0.7} />
        <Fala
          palavras={gigante}
          x={C02.gigante.x}
          y={C02.gigante.y}
          estilo={C02.gigante.estilo}
          modo="letras"
          staggerLetra={0.7}
          destaque={['effects']}
          estiloPalavra={(i) => (i === 0 ? { textShadow: BRILHO.branco } : {})}
        />
      </Camera>
      <HUD tl="MOTION / 002" bl="LAYERS · 6   KEYFRAMES · 24" br="30 FPS · 1920×1080" />
    </AbsoluteFill>
  );
};
