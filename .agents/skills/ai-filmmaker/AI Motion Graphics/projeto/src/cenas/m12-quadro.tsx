/* Cena 12 (40,82–43,76 s): "E aí, esse código é renderizado quadro a quadro."
   Chega do círculo que virou fotograma: a película está parada com o fotograma central no lugar
   (C12.fotograma) e começa a correr. Os fotogramas da direita ainda são CÓDIGO (barras de sintaxe);
   ao passar pela cabeça de RENDER (laser vertical em x 1170) cada um pisca e vira o quadro
   renderizado da cena anterior (MOTION, quadrado, círculo, partículas), com o contador subindo.
   Atrás, uma segunda película desfocada cruza na diagonal (profundidade). Em "quadro a quadro" a fita
   anda em DEGRAUS, um fotograma por palavra. No último "quadro" a película GIRA (uma volta inteira no
   plano, encolhe e volta, com rastros), os trilhos somem e os cinco fotogramas centrais viram as
   cinco caixas cinza apagadas da cena 13 (FLUXO_13 = C13.caixas), paradas: é o corte. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { C12, FLUXO_13 } from '../layoutB';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, RGB, TIPOM, trecho } from '../tema';
import { FundoM, HUD, Poeira, timecodeM } from '../visual';
import { CaixaFluxo, FitaFilme, QuadroCodigo, QuadroMini, Trilho } from './pecas';

const CABECA = 1170;
const PASSO = C12.passo;

export const M12: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const cima = trecho(12, 0, 5);
  const baixo = trecho(12, 6);
  const q0 = c.corteLocal;
  const qQ1 = c.local(baixo[0].s) - 2;
  const qA = c.local(baixo[1].s) - 2;
  const g0 = c.local(baixo[2].s) - 1;
  const g1 = g0 + 14;

  // a fita: corre (2 fotogramas, suave), depois dois degraus
  const corre = 4 * PASSO * ease.suave(clamp01((f - q0) / (qQ1 - 2 - q0)));
  const degrau = (q: number) => PASSO * ease.corte(clamp01((f - q) / 5));
  const offset = corre + degrau(qQ1) + degrau(qA);
  const ug = clamp01((f - g0) / (g1 - g0));
  const jCentro = Math.round(offset / PASSO);
  const giro = ease.corte(ug);
  const girando = f >= g0;
  const contador = 120 + Math.floor((offset + (960 - CABECA) + PASSO / 2) / PASSO) + 1;

  // câmera viva só no meio (no quadro de entrada e no fim do giro está em repouso)
  const vida = janelaM(f, q0, q0 + 14) * (1 - janelaM(f, g0 - 8, g0));
  const z = 1 + 0.045 * Math.sin(Math.PI * clamp01((f - q0) / (g0 - q0)));
  const dx = Math.sin(f / 17) * 10 * vida;
  const dy = Math.cos(f / 21) * 6 * vida;
  const cabecaOn = 1 - janelaM(f, g0, g0 + 5);

  // giro: pivô e escala do grupo
  const cyFluxo = FLUXO_13.caixas[0].y + FLUXO_13.caixas[0].h / 2;
  const cyGrupo = lerp(C12.faixa.cy, cyFluxo, giro);
  const escGrupo = 1 - 0.32 * Math.sin(Math.PI * giro);
  const grupo = (rot: number, op: number, chave: string) => (
    <AbsoluteFill key={chave} style={{ transformOrigin: `960px ${cyGrupo}px`, transform: `rotate(${rot}deg) scale(${escGrupo})`, opacity: op }}>
      <div style={{ opacity: 1 - clamp01(giro * 1.7) }}>
        <div style={{ position: 'absolute', left: -100, top: cyGrupo - 135 - 70, width: 2120, height: 410, background: '#060B08' }} />
        <Trilho x={-100} y={cyGrupo - 135 - 70} w={2120} h={66} desloc={offset} />
        <Trilho x={-100} y={cyGrupo + 135 + 4} w={2120} h={66} desloc={offset} />
      </div>
      {FLUXO_13.caixas.map((b, i) => {
        const j = jCentro - 2 + i;
        const xF = 960 - 190 + j * PASSO - offset;
        const xc = lerp(xF + 190, b.x + b.w / 2, giro);
        const yc = lerp(C12.faixa.cy, b.y + b.h / 2, giro);
        const w = lerp(380, b.w, giro);
        const h = lerp(270, b.h, giro);
        const pronto = xF + 190 <= CABECA + 0.5;
        const caixa = clamp01((giro - 0.35) / 0.35);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: xc - w / 2, top: yc - h / 2, width: w, height: h, borderRadius: lerp(10, b.r, giro), overflow: 'hidden', border: `2px solid rgba(${RGB.claro},${(0.7 * (1 - caixa)).toFixed(3)})`, boxSizing: 'border-box', opacity: 1 - caixa }}>
              {pronto ? <QuadroMini w={380} h={270} t={j * 5} /> : <QuadroCodigo w={380} h={270} semente={`fq-${j}`} />}
            </div>
            {caixa > 0 ? <CaixaFluxo x={xc - w / 2} y={yc - h / 2} w={w} h={h} r={lerp(10, b.r, giro)} i={i} opacidade={caixa} /> : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 54]} deriva={0.5} semente="m12" />
      <AbsoluteFill style={{ transformOrigin: '960px 590px', transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        <Poeira semente="m12" n={30} velocidade={1.4} />
        {/* película de trás, desfocada, na diagonal (profundidade) */}
        <AbsoluteFill style={{ transformOrigin: '960px 590px', transform: `rotate(-14deg) scale(.62) translateY(-40px)`, filter: 'blur(4px)', opacity: 0.32 * (1 - clamp01(giro * 2)) }}>
          <FitaFilme offset={-offset * 0.6 - 2000} cabeca={-9999} de={-8} ate={12} />
        </AbsoluteFill>

        {!girando ? (
          <FitaFilme offset={offset} cabeca={CABECA} />
        ) : (
          <>
            {ug < 0.85 ? [grupo(360 * giro - 26, 0.16, 'g2'), grupo(360 * giro - 13, 0.28, 'g1')] : null}
            {grupo(360 * giro, 1, 'g0')}
          </>
        )}

        {/* cabeça de render */}
        {cabecaOn > 0 ? (
          <div style={{ opacity: cabecaOn }}>
            <div style={{ position: 'absolute', left: CABECA - 14, top: 330, width: 28, height: 520, background: `linear-gradient(90deg, rgba(${RGB.acento},0), rgba(${RGB.acento},.28), rgba(${RGB.acento},0))` }} />
            <div style={{ position: 'absolute', left: CABECA - 1.5, top: 330, width: 3, height: 520, background: '#E8FFF0', boxShadow: `0 0 16px rgba(${RGB.acento},1)`, opacity: 0.8 + 0.2 * Math.sin(f * 1.7) }} />
            <div style={{ position: 'absolute', left: CABECA - 9, top: 322, width: 18, height: 18, borderRadius: 9, background: CORM.verde, boxShadow: BRILHO.verde }} />
            <div style={{ position: 'absolute', left: CABECA + 22, top: 312, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre' }}>{`RENDER  Q${String(Math.max(120, contador)).padStart(4, '0')}`}</div>
          </div>
        ) : null}
      </AbsoluteFill>

      <Fala palavras={cima} x={960} y={110} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 96 }} destaque={['renderizado']} sai={{ em: g0 + 3, stagger: 0, modo: 'foco' }} />
      <Fala palavras={baixo} x={960} y={858} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 112 }} destaque={[0, 2]} modo="slam" sai={{ em: g0 + 5, stagger: 0, modo: 'foco' }} />
      <HUD tl="MOTION / 012" tr={`REC  ${timecodeM(c.global)}`} bl="30 QUADROS / SEGUNDO" br={`FILA · ${String(Math.max(0, 450 - contador)).padStart(3, '0')}`} inicio={4} />
    </AbsoluteFill>
  );
};
