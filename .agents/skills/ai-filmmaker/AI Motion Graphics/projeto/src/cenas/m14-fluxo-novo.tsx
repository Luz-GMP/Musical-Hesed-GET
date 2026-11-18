/* Cena 14 (48,02–50,54 s): "é pedido, código, render, vídeo."
   O fluxo novo. Quatro caixas de vidro escuro CAEM do alto (rimando com as cinzas que despencaram)
   e assentam com poeira de luz. Um PULSO de luz verde (orbe com rastro) corre pela linha que liga
   as caixas e chega em cada uma no instante da palavra: a caixa estoura em verde cheio, assenta
   em vidro com borda verde, a palavra cai dentro e a mini demonstração liga (prompt sendo digitado,
   código rolando, quadros de render correndo até 100%, player tocando um quadrado). "é" fica no
   alto, no lugar do "Em vez de" da cena 13. A câmera segue o pulso e empurra.
   Sai pela `pulsoJanela`: o pulso estoura na caixa "vídeo" e ela vira a janela de preview da 15.
   No início da saída a câmera está em repouso (C14.camSaida), então C14.videoTela() é a caixa. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { Flare, FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';

type Ret = { x: number; y: number; w: number; h: number; r: number };
const CW = 380;
const CH = 300;
const GAP = 60;
const X0 = (1920 - (4 * CW + 3 * GAP)) / 2; // 110
const Y0 = 360;
const CAM_SAIDA = { z: 1.06, pan: -70 };

export const C14 = {
  caixas: Array.from({ length: 4 }, (_, i): Ret => ({ x: X0 + i * (CW + GAP), y: Y0, w: CW, h: CH, r: 22 })),
  camSaida: CAM_SAIDA,
  yLinha: Y0 + CH / 2,
  /** a caixa "vídeo" na tela no início da saída (câmera em repouso: translate(pan) scale(z) em 960,540) */
  videoTela: (): Ret => {
    const x = X0 + 3 * (CW + GAP);
    const z = CAM_SAIDA.z;
    return { x: 960 + (x - 960) * z + CAM_SAIDA.pan, y: 540 + (Y0 - 540) * z, w: CW * z, h: CH * z, r: 22 * z };
  },
};

const Demo: React.FC<{ i: number; t: number; f: number }> = ({ i, t, f }) => {
  const on = t >= 0;
  const verde = on ? CORM.verde : `rgba(${RGB.claro},.25)`;
  if (i === 0) {
    const txt = 'faz um motion';
    const n = on ? Math.min(txt.length, Math.floor(t * 1.4)) : 0;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', left: 6, top: 8, width: 288, height: 64, borderRadius: 18, border: `2px solid ${verde}`, background: `rgba(${RGB.acento},.08)` }}>
          <div style={{ position: 'absolute', left: 18, top: 12, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.papel, whiteSpace: 'pre' }}>
            {txt.slice(0, n)}
            {on && Math.floor(f / 6) % 2 === 0 ? <span style={{ color: CORM.verde }}>▍</span> : null}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 30, top: 70, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: `14px solid ${verde}` }} />
      </div>
    );
  }
  if (i === 1) {
    const linhas = ['spring({ frame })', 'interpolate(t)', '<Sequence from>', 'easing.bezier()', 'translateY(y)'];
    const rola = on ? t * 2.2 : 0;
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {linhas.map((l, k) => {
          const y = 4 + k * 30 - (rola % 30) - Math.floor(rola / 30) * 0;
          return (
            <div key={k} style={{ position: 'absolute', left: 8, top: y, fontFamily: FONTEM.mono, fontSize: 22, color: k % 2 ? CORM.verdeClaro : CORM.papel, opacity: on ? 0.95 * clamp01((t - k * 2) / 4) : 0.2, whiteSpace: 'pre' }}>
              <span style={{ color: CORM.faint }}>{`${k + 1} `}</span>
              {l}
            </div>
          );
        })}
      </div>
    );
  }
  if (i === 2) {
    const prog = on ? ease.sai(clamp01(t / 16)) : 0;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 6 }, (_, k) => {
          const acende = prog * 6 > k;
          return <div key={k} style={{ position: 'absolute', left: 6 + k * 48, top: 6, width: 40, height: 40, borderRadius: 6, border: `2px solid ${verde}`, background: acende ? `rgba(${RGB.acento},.55)` : 'transparent', boxShadow: acende ? `0 0 14px rgba(${RGB.acento},.7)` : undefined }} />;
        })}
        <div style={{ position: 'absolute', left: 6, top: 62, width: 210, height: 16, borderRadius: 8, border: `2px solid ${verde}` }}>
          <div style={{ width: `${100 * prog}%`, height: '100%', borderRadius: 8, background: CORM.verde, boxShadow: BRILHO.verdeLeve }} />
        </div>
        <div style={{ position: 'absolute', left: 228, top: 56, fontFamily: FONTEM.mono, fontSize: 24, color: CORM.papel }}>{`${Math.round(prog * 100)}%`}</div>
      </div>
    );
  }
  // vídeo: player tocando
  const xq = on ? 60 + (Math.sin(t / 5) * 0.5 + 0.5) * 150 : 60;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 6, top: 2, width: 288, height: 80, borderRadius: 10, border: `2px solid ${verde}`, background: 'rgba(0,0,0,.35)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: xq, top: 22, width: 34, height: 34, borderRadius: 6, background: on ? CORM.verde : `rgba(${RGB.claro},.25)`, boxShadow: on ? BRILHO.verdeLeve : undefined, transform: `rotate(${on ? t * 6 : 0}deg)` }} />
        <div style={{ position: 'absolute', left: 14, top: 26, width: 0, height: 0, borderTop: '14px solid transparent', borderBottom: '14px solid transparent', borderLeft: `22px solid ${on ? CORM.papel : 'rgba(241,240,232,.3)'}` }} />
      </div>
      <div style={{ position: 'absolute', left: 6, top: 90, width: 288, height: 4, background: `rgba(${RGB.claro},.2)` }}>
        <div style={{ width: `${on ? 100 * clamp01(t / 40) : 0}%`, height: '100%', background: CORM.verde }} />
      </div>
    </div>
  );
};

export const M14: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(14, 0);
  const apoio = fala.slice(0, 1);
  const rotulos = fala.slice(1).map((p) => [p]);
  const qAtiva = rotulos.map((r) => c.local(r[0].s) - 1);
  const fim = Number.isFinite(c.saidaInicio) ? c.saidaInicio : 80;
  const centro = (i: number) => C14.caixas[i].x + CW / 2;

  // pulso: entra pela esquerda e chega em cada caixa na palavra
  const xPulso = (fr: number) => {
    if (fr <= qAtiva[0]) return lerp(-60, centro(0), ease.corte(clamp01((fr - 2) / Math.max(1, qAtiva[0] - 2))));
    for (let i = 0; i < 3; i++) if (fr <= qAtiva[i + 1]) return lerp(centro(i), centro(i + 1), ease.corte(clamp01((fr - qAtiva[i] - 2) / Math.max(1, qAtiva[i + 1] - qAtiva[i] - 2))));
    return centro(3);
  };
  const xp = xPulso(f);
  const yp = C14.yLinha;
  const rastro = Array.from({ length: 8 }, (_, j) => xPulso(f - (j + 1) * 0.7));
  const ultimoAtivo = qAtiva.reduce((acc, q, i) => (f >= q ? i : acc), -1);

  // câmera: segue o pulso, repousa em CAM_SAIDA no início da saída
  const repouso = janelaM(f, fim - 14, fim, 'suave');
  const vida = 1 - repouso;
  const panVivo = -(xp - 960) * 0.12;
  const zVivo = lerp(1.0, 1.08, ease.suave(clamp01(f / fim)));
  const pan = lerp(panVivo, CAM_SAIDA.pan, repouso);
  const z = lerp(zVivo, CAM_SAIDA.z, repouso);
  let tranco = 0;
  qAtiva.forEach((q, i) => {
    const d = f - q;
    if (d >= 0 && d < 5) tranco += (random(`m14-tr-${i}-${f}`) - 0.5) * 12 * (1 - d / 5);
  });
  const dx = Math.sin(f / 19) * 7 * vida + tranco * vida;
  const dy = Math.cos(f / 25) * 5 * vida;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 55]} forcaBrilho={1.25} deriva={0.6} semente="m14" />
      <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `translate(${pan + dx}px, ${dy}px) scale(${z})` }}>
        <GradeChao horizonte={760} opacidade={0.7} velocidade={6} />
        <Poeira semente="m14" velocidade={1.6} />
        <Fala palavras={apoio} x={X0} y={150} estilo={{ ...TIPOM.frase, tamanho: 120, peso: 900 }} cor={CORM.papel} antecipa={3} />
        {/* linha que liga as caixas: acende atrás do pulso */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <line x1={-100} x2={2020} y1={yp} y2={yp} stroke={`rgba(${RGB.claro},.16)`} strokeWidth={3} strokeDasharray="10 10" strokeDashoffset={-f * 3} />
          <line x1={-100} x2={xp} y1={yp} y2={yp} stroke={`rgba(${RGB.acento},.35)`} strokeWidth={16} style={{ filter: 'blur(6px)' }} />
          <line x1={-100} x2={xp} y1={yp} y2={yp} stroke={CORM.verde} strokeWidth={4} />
          <line x1={-100} x2={xp} y1={yp} y2={yp} stroke="#E9FFF0" strokeWidth={1.5} />
        </svg>
        {C14.caixas.map((b, i) => {
          // queda de entrada
          const qCai = 1 + i * 1.4;
          const cai = mola(f, 'quica', qCai);
          const yCai = lerp(-700, 0, Math.min(1, cai)) + (cai > 1 ? (cai - 1) * 40 : 0);
          const visivel = f >= qCai;
          const t = f - qAtiva[i];
          const on = t >= 0;
          const estouro = on ? 0.6 * (1 - janelaM(t, 0, 10, 'sai')) : 0;
          const pop = on ? mola(f, 'estalo', qAtiva[i]) : 0;
          const flutua = Math.sin(f / 14 + i * 1.1) * 5 * vida;
          const brilhoVivo = on ? 0.55 + 0.25 * Math.sin(f / 6 + i) : 0;
          if (!visivel) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                transform: `translateY(${yCai + flutua - 10 * pop * (i === ultimoAtivo ? 1 : 0.4) * vida}px) scale(${1 + 0.08 * estouro})`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: b.r,
                  background: on ? `linear-gradient(180deg, rgba(${Math.round(lerp(18, 48, estouro))},${Math.round(lerp(48, 220, estouro))},${Math.round(lerp(30, 104, estouro))},.96), rgba(6,18,11,.96))` : 'linear-gradient(180deg, rgba(14,32,21,.92), rgba(5,12,8,.92))',
                  border: `3px solid ${on ? CORM.verde : `rgba(${RGB.claro},.28)`}`,
                  boxShadow: on ? `0 0 ${40 + 60 * estouro}px rgba(${RGB.acento},${0.4 * brilhoVivo + 0.5 * estouro}), inset 0 0 40px rgba(${RGB.acento},.22), 0 30px 70px rgba(0,0,0,.6)` : '0 30px 70px rgba(0,0,0,.6)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', left: 18, top: 30, width: 300, height: 100, transformOrigin: '0 0', transform: 'scale(1.14)' }}>
                  <Demo i={i} t={t} f={f} />
                </div>
                <div style={{ position: 'absolute', right: 16, top: 10, fontFamily: FONTEM.mono, fontSize: 20, color: on ? CORM.verdeClaro : CORM.faint }}>{`0${i + 1}`}</div>
              </div>
              {/* reflexo no chão */}
              <div style={{ position: 'absolute', left: 10, right: 10, top: b.h + 14, height: 60, borderRadius: b.r, background: `linear-gradient(180deg, rgba(${RGB.acento},${on ? 0.18 : 0.05}), rgba(${RGB.acento},0))` }} />
            </div>
          );
        })}
        {/* poeira de luz quando cada caixa assenta */}
        {C14.caixas.map((b, i) => {
          const qPousa = 1 + i * 1.4 + 6;
          const d = f - qPousa;
          if (d < 0 || d > 14) return null;
          return Array.from({ length: 12 }, (_, j) => {
            const r = (k: string) => random(`m14-po-${k}-${i}-${j}`);
            const lado = j % 2 ? 1 : -1;
            const x = b.x + b.w / 2 + lado * (b.w / 2 - 10 + d * (3 + r('v') * 6));
            const y = b.y + b.h - d * (1 + r('u') * 2.5);
            return <div key={`${i}-${j}`} style={{ position: 'absolute', left: x, top: y, width: 4, height: 4, borderRadius: 2, background: CORM.verdeClaro, opacity: 1 - d / 14, boxShadow: `0 0 8px rgba(${RGB.acento},.9)` }} />;
          });
        })}
        {/* as palavras caem dentro das caixas */}
        {rotulos.map((r, i) => {
          const b = C14.caixas[i];
          const flutua = Math.sin(f / 14 + i * 1.1) * 5 * vida;
          const pop = f >= qAtiva[i] ? mola(f, 'estalo', qAtiva[i]) : 0;
          return (
            <AbsoluteFill key={i} style={{ transform: `translateY(${flutua - 10 * pop * (i === ultimoAtivo ? 1 : 0.4) * vida}px)` }}>
              <Fala palavras={r} x={b.x + b.w / 2} y={b.y + 178} alinhar="centro" estilo={{ ...TIPOM.apoio, tamanho: 80, peso: 900 }} cor={CORM.papel} modo="slam" estiloPalavra={() => ({ textShadow: '0 2px 14px rgba(0,20,8,.75)' })} />
            </AbsoluteFill>
          );
        })}
        {/* o pulso */}
        {rastro.map((x, j) => (
          <div key={j} style={{ position: 'absolute', left: x - 6, top: yp - 6, width: 12, height: 12, borderRadius: 6, background: j < 2 ? '#FFFFFF' : CORM.verdeClaro, opacity: (1 - j / 8) * 0.7, boxShadow: `0 0 14px rgba(${RGB.acento},.9)` }} />
        ))}
        <Flare x={xp} y={yp} forca={0.9 + 0.1 * Math.sin(f / 2)} largura={520} />
        {qAtiva.map((q, i) => {
          const d = f - q;
          if (d < 0 || d > 14) return null;
          const k = ease.sai(d / 14);
          return (
            <div
              key={i}
              style={{ position: 'absolute', left: centro(i) - 260 * k, top: yp - 260 * k, width: 520 * k, height: 520 * k, borderRadius: '50%', border: `${3 * (1 - k) + 1}px solid ${CORM.verdeClaro}`, opacity: 1 - k, boxShadow: `0 0 30px rgba(${RGB.acento},.7)` }}
            />
          );
        })}
      </AbsoluteFill>
      <HUD tl="MOTION / 014" tr={`REC  ${timecodeM(c.global)}`} bl="FLUXO NOVO · 1 CONVERSA" br={`PASSOS · ${Math.max(0, ultimoAtivo + 1)}/4`} inicio={4} />
    </AbsoluteFill>
  );
};
