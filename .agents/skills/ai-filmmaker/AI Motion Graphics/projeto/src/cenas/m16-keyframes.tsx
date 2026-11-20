/* Cena 16 (57,66–60,20 s): "em vez de arrastar centenas de keyframes na mão. [risada]"
   Entra no corte seco. Uma timeline de 14 trilhas ocupa a metade de baixo; um cursor de mouse
   pega um keyframe e arrasta (retângulo de seleção, rastro) em "arrastar"; em "centenas" os
   losangos brotam aos montes, em ondas da esquerda para a direita (pop com mola, brilho), e em
   "keyframes" vem a última leva: a tela fica cheia (KF16.n = 320). Dois contadores embaixo:
   "keyframes na tela" sobe correndo; "keyframes movidos à mão: 0" fica cravado no zero, verde.
   Em "mão" começa a saída `pontosSimbolo`: a cena some com os losangos (a transição desenha os
   mesmos nas mesmas posições e os derruba), o cursor cai junto e as trilhas apagam.
   A câmera está em repouso a partir da saída: escala C16_ZOOM em torno de (960, 540). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { FundoM, HUD, Poeira, timecodeM } from '../visual';

const TRILHAS = 14;
const Y_TRILHA0 = 400;
const PASSO_TRILHA = 38;
const X_INI = 150;
const X_FIM = 1790;
const C16_ZOOM = 1.04;

type KF = { x: number; y: number; onda: 0 | 1 | 2; atraso: number; tam: number; claro: boolean };

/** Os 320 keyframes (posição sem câmera, onda em que nascem, atraso dentro da onda). */
export const KF16: { n: number; zoom: number; lista: KF[] } = (() => {
  const lista: KF[] = [];
  const n = 320;
  for (let i = 0; i < n; i++) {
    const r = (k: string) => random(`kf16-${k}-${i}`);
    const trilha = Math.floor(r('t') * TRILHAS);
    const x = X_INI + r('x') * (X_FIM - X_INI);
    const onda: 0 | 1 | 2 = i < 70 ? 0 : i < 240 ? 1 : 2;
    // dentro da onda, nasce da esquerda para a direita
    const atraso = ((x - X_INI) / (X_FIM - X_INI)) * (onda === 0 ? 6 : 12) + r('a') * 3;
    lista.push({ x, y: Y_TRILHA0 + trilha * PASSO_TRILHA, onda, atraso, tam: 9 + r('s') * 4, claro: r('c') < 0.18 });
  }
  return { n, zoom: C16_ZOOM, lista };
})();

/** Posição na tela (com a câmera em repouso) de cada keyframe: é de onde a transição 16→17 parte. */
export const keyframesTela16 = () => KF16.lista.map((k) => ({ x: 960 + (k.x - 960) * C16_ZOOM, y: 540 + (k.y - 540) * C16_ZOOM, tam: k.tam * C16_ZOOM, claro: k.claro }));

export const M16: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(16, 0);
  const l1 = fala.slice(0, 4);
  const l2 = fala.slice(4);
  const qArrastar = c.local(fala[3].s) - 2;
  const qCentenas = c.local(fala[4].s) - 2;
  const qKeyframes = c.local(fala[6].s) - 2;
  const ondas = [-3, qCentenas, qKeyframes];
  const fim = Number.isFinite(c.saidaInicio) ? c.saidaInicio : 70;
  const saindo = f >= fim;
  const ts = f - fim;

  const repouso = janelaM(f, fim - 10, fim, 'suave');
  const vida = 1 - repouso;
  const z = lerp(lerp(1.0, 1.07, ease.suave(clamp01(f / fim))), C16_ZOOM, repouso);
  const dx = Math.sin(f / 17) * 9 * vida;
  const dy = Math.sin(f / 23) * 6 * vida;

  const nasceu = (k: KF) => ondas[k.onda] + k.atraso;
  const naTela = KF16.lista.filter((k) => f >= nasceu(k)).length;

  // cursor: chega, pega um keyframe e arrasta (vai e volta), cai na saída
  const alvo = KF16.lista[5];
  const qPega = qArrastar + 4;
  const chega = ease.corte(clamp01((f - (qArrastar - 8)) / 12));
  const arrasta = f > qPega ? Math.sin((f - qPega) / 5) * 70 + (f - qPega) * 2.2 : 0;
  let cx = lerp(1300, alvo.x + 6, chega) + arrasta;
  let cy = lerp(1000, alvo.y + 6, chega) + (f > qPega ? Math.cos((f - qPega) / 4) * 12 : 0);
  let rotCursor = 0;
  if (saindo) {
    cy += 0.5 * 13 * ts * ts;
    cx += ts * 4;
    rotCursor = ts * 9;
  }

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 62]} forcaBrilho={1.1} deriva={0.8} semente="m16" />
      <Poeira semente="m16" velocidade={1.5} opacidade={0.7} />
      <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        {/* trilhas */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: saindo ? 1 - janelaM(ts, 0, 10) : 1 }}>
          {Array.from({ length: TRILHAS }, (_, i) => {
            const y = Y_TRILHA0 + i * PASSO_TRILHA;
            const p = ease.sai(clamp01((f - i * 0.8) / 12));
            return <line key={i} x1={X_INI - 40} x2={lerp(X_INI - 40, X_FIM + 40, p)} y1={y} y2={y} stroke={`rgba(${RGB.claro},.2)`} strokeWidth={2} />;
          })}
          {/* régua de tempo em cima */}
          {Array.from({ length: 42 }, (_, i) => (
            <line key={`r${i}`} x1={X_INI + i * 40} x2={X_INI + i * 40} y1={Y_TRILHA0 - 40} y2={Y_TRILHA0 - (i % 5 === 0 ? 18 : 28)} stroke={`rgba(${RGB.claro},.4)`} strokeWidth={2} opacity={ease.sai(clamp01((f - i * 0.3) / 10))} />
          ))}
          {/* agulha correndo */}
          <line x1={X_INI + ((f * 14) % (X_FIM - X_INI))} x2={X_INI + ((f * 14) % (X_FIM - X_INI))} y1={Y_TRILHA0 - 44} y2={Y_TRILHA0 + TRILHAS * PASSO_TRILHA} stroke={CORM.papel} strokeWidth={2.5} opacity={0.6} />
        </svg>
        {/* keyframes */}
        {!saindo
          ? KF16.lista.map((k, i) => {
              const q = nasceu(k);
              if (f < q) return null;
              const m = mola(f, 'estalo', q);
              const s = k.tam * m;
              const pegou = i === 5 && f > qPega;
              const x = pegou ? cx - 6 : k.x;
              const y = pegou ? cy - 6 : k.y;
              const brilho = 1 - janelaM(f, q, q + 8);
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x - s,
                    top: y - s,
                    width: 2 * s,
                    height: 2 * s,
                    transform: 'rotate(45deg)',
                    background: k.claro || pegou ? '#F4FFF7' : CORM.verde,
                    border: `2px solid ${CORM.verdeClaro}`,
                    boxShadow: brilho > 0.05 || pegou ? `0 0 ${10 + 18 * brilho}px rgba(${RGB.claro},${0.5 + 0.5 * brilho})` : undefined,
                    opacity: 0.92,
                  }}
                />
              );
            })
          : null}
        {/* retângulo de seleção do arraste */}
        {f > qPega && !saindo ? (
          <div style={{ position: 'absolute', left: Math.min(alvo.x, cx) - 30, top: Math.min(alvo.y, cy) - 40, width: Math.abs(cx - alvo.x) + 60, height: Math.abs(cy - alvo.y) + 80, border: '2px dashed rgba(241,240,232,.7)', background: `rgba(${RGB.claro},.06)` }} />
        ) : null}
        {/* cursor */}
        {f >= qArrastar - 8 ? (
          <svg width={60} height={70} style={{ position: 'absolute', left: cx, top: cy, overflow: 'visible', transform: `rotate(${rotCursor}deg)`, transformOrigin: '0 0', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.6))' }}>
            <path d="M0 0 L0 44 L11 34 L19 52 L27 48 L19 31 L34 31 Z" fill="#FFFFFF" stroke="#06110B" strokeWidth={2.5} strokeLinejoin="round" />
          </svg>
        ) : null}
        <Fala palavras={l1} x={960} y={62} alinhar="centro" estilo={{ ...TIPOM.apoio, tamanho: 80, peso: 800 }} cor={CORM.papel} destaque={['arrastar']} corDestaque={CORM.papel} brilhoDestaque={BRILHO.branco} />
        <Fala palavras={l2} x={960} y={160} alinhar="centro" largura={1800} estilo={{ ...TIPOM.frase, tamanho: 116, peso: 900 }} destaque={['centenas', 'mão']} modos={{ 0: 'slam' }} />
      </AbsoluteFill>
      {/* contadores */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 968, display: 'flex', justifyContent: 'center', gap: 80, fontFamily: FONTEM.mono, fontSize: 38, letterSpacing: '0.02em', whiteSpace: 'pre', opacity: janelaM(f, 2, 8) }}>
        <div style={{ color: CORM.dim }}>
          keyframes na tela: <span style={{ color: CORM.papel }}>{String(saindo ? KF16.n : naTela).padStart(3, '0')}</span>
        </div>
        <div style={{ color: CORM.papel }}>
          keyframes movidos à mão:{' '}
          <span style={{ color: CORM.verde, textShadow: BRILHO.verde, fontWeight: 700, fontSize: 52, display: 'inline-block', transform: `scale(${1 + 0.35 * (f >= fim - 2 ? 1 - janelaM(f, fim - 2, fim + 8) : 0)})` }}>0</span>
        </div>
      </div>
      <HUD tl="MOTION / 016" tr={`REC  ${timecodeM(c.global)}`} inicio={2} />
    </AbsoluteFill>
  );
};
