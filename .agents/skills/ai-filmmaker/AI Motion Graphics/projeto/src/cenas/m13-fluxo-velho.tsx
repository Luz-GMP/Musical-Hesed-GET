/* Cena 13 (43,76–48,02 s): "Em vez de After Effects, camada, keyframe, graph editor e render,"
   O fluxo antigo. Cinco caixas CINZA em fila, horizontais e centradas (C13.caixas: é a geometria
   que a película da cena 12 tem que encontrar ao virar fluxograma). Começam apagadas, com esqueleto
   de interface; cada uma ACENDE (branco, nunca verde: verde é o fluxo novo) na palavra dita, com a
   palavra caindo dentro dela e uma mini demonstração do programa: painel com o ícone do programa
   (LogoApp, placeholder), pilha de camadas, trilha de keyframes com agulha, curva do graph editor com alça
   sendo puxada, barra de render que não anda (ETA subindo). Setas tracejadas ligam as caixas e
   andam. A câmera acompanha a caixa ativa e empurra; o HUD conta o tempo gasto acelerando.
   Em "e render" um laser VERMELHO risca as cinco caixas da esquerda para a direita (faíscas na
   cabeça, cada caixa trinca e apaga quando o laser passa, tranco de câmera).
   Sai pela transição `despenca` (as caixas caem): no início da saída a câmera está em repouso
   (escala C13.zoomSaida em torno do centro, sem deriva), então C13.caixasTela() é onde elas estão. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { LogoApp } from '../logos';
import { clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { Flare, FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';

type Ret = { x: number; y: number; w: number; h: number; r: number };

const CW = 320;
const CH = 340;
const GAP = 30;
const X0 = (1920 - (5 * CW + 4 * GAP)) / 2; // 100
const Y0 = 360;
const ZOOM_SAIDA = 1.05;

export const C13 = {
  /** as cinco caixas na tela, sem câmera (1920x1080): 320x340, vão de 30, centradas, topo em 360 */
  caixas: Array.from({ length: 5 }, (_, i): Ret => ({ x: X0 + i * (CW + GAP), y: Y0, w: CW, h: CH, r: 18 })),
  /** escala da câmera (em torno de 960, 540) quando a saída começa */
  zoomSaida: ZOOM_SAIDA,
  /** as caixas como aparecem na tela no início da saída (já com a câmera) */
  caixasTela: (): Ret[] =>
    Array.from({ length: 5 }, (_, i) => {
      const x = X0 + i * (CW + GAP);
      return { x: 960 + (x - 960) * ZOOM_SAIDA, y: 540 + (Y0 - 540) * ZOOM_SAIDA, w: CW * ZOOM_SAIDA, h: CH * ZOOM_SAIDA, r: 18 * ZOOM_SAIDA };
    }),
  yLaser: Y0 + CH / 2,
};

const CINZA = { borda: '#4A504D', bordaViva: '#E6E8E3', topo: '#2B2F2D', corpo: '#1A1D1C', tinta: '#8C948F' };

/* ---------- mini demonstrações (área 260x110 dentro da caixa) ---------- */
const Demo: React.FC<{ i: number; t: number; f: number; vivo: number; morto: number }> = ({ i, t, f, vivo, morto }) => {
  const cor = `rgba(230,232,227,${0.35 + 0.6 * vivo})`;
  const fraco = `rgba(140,148,143,${0.35 + 0.3 * vivo})`;
  const a = clamp01(t / 10);
  if (i === 0) {
    // painel do programa abrindo: ícone (LogoApp) + barras de menu carregando
    const carrega = clamp01(t / 26);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', left: 18, top: 16, transform: `scale(${0.6 + 0.4 * mola(t, 'estalo', 0)}) rotate(${(1 - mola(t, 'estalo', 0)) * -30}deg)`, opacity: t > 0 ? 1 - 0.6 * morto : 0.35, filter: vivo < 0.5 ? 'grayscale(1)' : undefined }}>
          <LogoApp tam={78} sigla="APP" />
        </div>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: 'absolute', left: 116, top: 22 + k * 26, width: 128, height: 12, borderRadius: 6, background: fraco }}>
            <div style={{ width: `${100 * clamp01(carrega * 1.6 - k * 0.3)}%`, height: '100%', borderRadius: 6, background: cor }} />
          </div>
        ))}
        <div style={{ position: 'absolute', left: 116, top: 98, fontFamily: FONTEM.mono, fontSize: 18, color: CINZA.tinta, opacity: a }}>{t > 0 ? `carregando${'.'.repeat(1 + (Math.floor(f / 5) % 3))}` : ''}</div>
      </div>
    );
  }
  if (i === 1) {
    // pilha de camadas em perspectiva, entrando uma a uma
    return (
      <div style={{ position: 'absolute', inset: 0, perspective: 500 }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const e = mola(t, 'estalo', k * 2);
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 40 + k * 8,
                top: 76 - k * 15 - (1 - e) * 40,
                width: 180,
                height: 34,
                borderRadius: 6,
                border: `2px solid ${k === 4 ? cor : fraco}`,
                background: `rgba(60,66,63,${0.5 + 0.1 * k})`,
                transform: 'rotateX(55deg) rotateZ(-8deg)',
                opacity: t > 0 ? e : 0.3,
              }}
            />
          );
        })}
      </div>
    );
  }
  if (i === 2) {
    // trilha com losangos e agulha varrendo
    const ag = 20 + ((f * 7) % 220);
    return (
      <svg width={260} height={110} style={{ position: 'absolute', inset: 0 }}>
        {[34, 66, 96].map((y, r) => (
          <line key={r} x1={10} x2={250} y1={y} y2={y} stroke={fraco} strokeWidth={2} />
        ))}
        {Array.from({ length: 11 }, (_, k) => {
          const x = 24 + random(`m13-k-${k}`) * 210;
          const y = [34, 66, 96][k % 3];
          const e = t > 0 ? mola(t, 'estalo', k) : 0.6;
          const s = 9 * e;
          const toca = Math.abs(ag - x) < 10 && t > 0;
          return <polygon key={k} points={`${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`} fill={toca ? '#FFFFFF' : cor} />;
        })}
        {t > 0 ? <line x1={ag} x2={ag} y1={10} y2={108} stroke={cor} strokeWidth={2.5} /> : null}
      </svg>
    );
  }
  if (i === 3) {
    // graph editor: curva com alça sendo puxada (vai e volta, nunca acerta)
    const puxa = t > 0 ? Math.sin(t / 4) * 34 : 0;
    const h1: [number, number] = [96 + puxa, 100];
    const h2: [number, number] = [164 - puxa * 0.6, 14 + puxa * 0.4];
    return (
      <svg width={260} height={110} style={{ position: 'absolute', inset: 0 }}>
        <line x1={10} x2={250} y1={100} y2={100} stroke={fraco} strokeWidth={1.5} />
        <line x1={20} x2={20} y1={6} y2={104} stroke={fraco} strokeWidth={1.5} />
        <line x1={20} y1={100} x2={h1[0]} y2={h1[1]} stroke={fraco} strokeWidth={2} />
        <line x1={240} y1={12} x2={h2[0]} y2={h2[1]} stroke={fraco} strokeWidth={2} />
        <path d={`M 20 100 C ${h1[0]} ${h1[1]}, ${h2[0]} ${h2[1]}, 240 12`} stroke={cor} strokeWidth={4} fill="none" strokeDasharray={320} strokeDashoffset={320 * (1 - (t > 0 ? janelaM(t, 0, 10) : 1))} />
        <circle cx={h1[0]} cy={h1[1]} r={7} fill={cor} />
        <circle cx={h2[0]} cy={h2[1]} r={7} fill={cor} />
        {t > 0 ? (
          // cursor puxando a alça
          <polygon points={`${h1[0] + 6},${h1[1] - 2} ${h1[0] + 6},${h1[1] - 30} ${h1[0] + 26},${h1[1] - 12}`} fill="#FFFFFF" stroke="#000" strokeWidth={1.5} transform={`rotate(-20 ${h1[0] + 6} ${h1[1] - 2})`} />
        ) : null}
      </svg>
    );
  }
  // render: barra que quase não anda, ETA subindo
  const prog = t > 0 ? 0.03 + 0.04 * clamp01(t / 30) : 0;
  const eta = t > 0 ? 4 * 3600 + 12 * 60 + Math.floor(t * 137) : 0;
  const hh = Math.floor(eta / 3600);
  const mm = Math.floor((eta % 3600) / 60);
  const ss = eta % 60;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 16, top: 30, width: 228, height: 22, borderRadius: 11, border: `2px solid ${fraco}` }}>
        <div style={{ width: `${100 * prog}%`, height: '100%', borderRadius: 11, background: cor }} />
      </div>
      <svg width={40} height={40} style={{ position: 'absolute', left: 16, top: 66 }}>
        <circle cx={20} cy={20} r={14} stroke={fraco} strokeWidth={4} fill="none" />
        <circle cx={20} cy={20} r={14} stroke={cor} strokeWidth={4} fill="none" strokeDasharray="22 66" transform={`rotate(${f * 14} 20 20)`} />
      </svg>
      <div style={{ position: 'absolute', left: 66, top: 70, fontFamily: FONTEM.mono, fontSize: 24, color: t > 0 ? CINZA.bordaViva : CINZA.tinta }}>
        {t > 0 ? `ETA ${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : 'ETA --:--'}
      </div>
    </div>
  );
};

export const M13: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(13, 0);
  const apoio = fala.slice(0, 3); // Em vez de
  const rotulos = [fala.slice(3, 5), fala.slice(5, 6), fala.slice(6, 7), fala.slice(7, 9), fala.slice(10, 11)];
  const eFala = fala.slice(9, 10);
  const qAtiva = rotulos.map((r) => c.local(r[0].s) - 2);
  const qLaser = c.local(eFala[0].s) - 2;
  const durLaser = 9;
  const fimSaida = Number.isFinite(c.saidaInicio) ? c.saidaInicio : 140;

  // índice contínuo da caixa ativa (a câmera segue)
  let ativo = -0.6;
  qAtiva.forEach((q, i) => {
    ativo = lerp(ativo, i, ease.corte(clamp01((f - q + 4) / 10)));
  });
  const xLaser = lerp(60, 1860, ease.corte(clamp01((f - qLaser) / durLaser)));
  const laserOn = f >= qLaser;
  // câmera: segue a caixa ativa, volta ao centro no laser, repousa em ZOOM_SAIDA na saída
  const volta = janelaM(f, qLaser - 2, qLaser + durLaser, 'suave');
  const repouso = janelaM(f, fimSaida - 10, fimSaida, 'suave');
  // a cena 12 entrega as caixas paradas em C13.caixas: a câmera acorda depois do corte
  const ent = ease.suave(clamp01((f - c.corteLocal) / 14));
  const vida = (1 - repouso) * ent;
  const xAtiva = X0 + CW / 2 + ativo * (CW + GAP);
  const pan = -(xAtiva - 960) * 0.07 * (1 - volta) * ent;
  const z = lerp(1.0, 1.1, ease.suave(clamp01(f / (qLaser + 4)))) * (1 - volta) + ZOOM_SAIDA * volta;
  const tilt = Math.sin(Math.PI * clamp01((f - c.corteLocal) / 60)) * 9 * vida;
  const dx = Math.sin(f / 21) * 8 * vida;
  const dy = Math.cos(f / 27) * 6 * vida;
  // tranco a cada caixa que trinca
  const cortes = C13.caixas.map((b) => qLaser + durLaser * Math.min(1, Math.max(0, ((b.x + b.w / 2 - 60) / 1800))) * 0.9);
  let tranco = 0;
  cortes.forEach((q, i) => {
    const d = f - q;
    if (d >= 0 && d < 5) tranco += (random(`m13-tr-${i}-${f}`) - 0.5) * 16 * (1 - d / 5);
  });
  const lampejo = laserOn ? 0.1 * (1 - janelaM(f, qLaser + durLaser, qLaser + durLaser + 12)) : 0;

  // relógio do HUD: acelera a cada caixa
  const horas = qAtiva.reduce((acc, q, i) => acc + clamp01((f - q) / 14) * [0.6, 1.3, 2.1, 1.7, 1.0][i], 0);
  const relogio = `${String(Math.floor(horas)).padStart(2, '0')}h${String(Math.floor((horas % 1) * 60)).padStart(2, '0')}`;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 58]} forcaBrilho={0.8} deriva={0.5} semente="m13" />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 55%, rgba(${RGB.alerta},${lampejo}), rgba(${RGB.alerta},0) 70%)` }} />
      <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `translate(${pan + dx + tranco}px, ${dy + tranco * 0.4}px) scale(${z})` }}>
        <GradeChao horizonte={760} opacidade={0.55} velocidade={3} cor="190,200,195" />
        <Poeira semente="m13" velocidade={1.2} opacidade={0.7} />
        <Fala palavras={apoio} x={X0} y={150} estilo={{ ...TIPOM.frase, tamanho: 120, peso: 900 }} cor={CORM.papel} />
        <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: '960px 560px' }}>
          <AbsoluteFill style={{ transformOrigin: '960px 560px', transform: `rotateX(${tilt}deg)` }}>
            {/* setas entre as caixas */}
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              {[0, 1, 2, 3].map((i) => {
                const a = C13.caixas[i];
                const x1 = a.x + a.w + 6;
                const x2 = a.x + a.w + GAP - 6;
                const y = a.y + a.h / 2;
                const p = janelaM(f, qAtiva[i + 1] - 6, qAtiva[i + 1], 'sai');
                const morta = f > cortes[i] + 2;
                return (
                  <g key={i} opacity={(0.3 + 0.7 * p) * (morta ? 0.35 : 1)}>
                    <line x1={x1} x2={lerp(x1, x2, Math.max(0.15, p))} y1={y} y2={y} stroke={CINZA.bordaViva} strokeWidth={4} strokeDasharray="8 7" strokeDashoffset={-f * 1.5} />
                    {p > 0.8 ? <polygon points={`${x2},${y} ${x2 - 12},${y - 9} ${x2 - 12},${y + 9}`} fill={CINZA.bordaViva} /> : null}
                  </g>
                );
              })}
            </svg>
            {C13.caixas.map((b, i) => {
              const t = f - qAtiva[i];
              const vivo = t >= 0 ? mola(f, 'estalo', qAtiva[i]) : 0;
              const pulso = t >= 0 ? 1 - janelaM(t, 0, 14) : 0;
              const morto = janelaM(f, cortes[i], cortes[i] + 6);
              const flutua = Math.sin(f / 13 + i * 1.3) * 5 * vida;
              const lift = -14 * vivo * (1 - morto) * (i === Math.round(ativo) ? 1 : 0.45) * (1 - repouso);
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: b.x,
                    top: b.y,
                    width: b.w,
                    height: b.h,
                    transform: `translateY(${lift + flutua * (1 - morto)}px) scale(${1 + 0.05 * pulso})`,
                    filter: morto > 0 ? `saturate(${1 - morto}) brightness(${1 - 0.35 * morto})` : undefined,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: b.r,
                      background: `linear-gradient(180deg, ${CINZA.topo}, ${CINZA.corpo})`,
                      border: `2.5px solid ${vivo > 0.3 && morto < 0.5 ? CINZA.bordaViva : CINZA.borda}`,
                      boxShadow: `0 24px 60px rgba(0,0,0,.6)${pulso > 0 ? `, 0 0 ${50 * pulso}px rgba(255,255,255,${0.35 * pulso})` : ''}`,
                      opacity: 0.6 + 0.4 * Math.max(vivo, 0.3),
                      overflow: 'hidden',
                    }}
                  >
                    {/* aba do painel */}
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 34, background: 'rgba(255,255,255,.05)', borderBottom: `1.5px solid ${CINZA.borda}` }} />
                    {[0, 1, 2].map((k) => (
                      <div key={k} style={{ position: 'absolute', left: 14 + k * 18, top: 12, width: 10, height: 10, borderRadius: 5, background: CINZA.borda }} />
                    ))}
                    <div style={{ position: 'absolute', right: 14, top: 4, fontFamily: FONTEM.mono, fontSize: 20, color: CINZA.tinta }}>{`0${i + 1}`}</div>
                    <div style={{ position: 'absolute', left: 17, top: 52, width: 260, height: 110, transformOrigin: '0 0', transform: 'scale(1.1)' }}>
                      <Demo i={i} t={t} f={f} vivo={vivo} morto={morto} />
                    </div>
                    {/* trinca do laser */}
                    {morto > 0 ? (
                      <svg width={b.w} height={b.h} style={{ position: 'absolute', inset: 0 }}>
                        <polyline
                          points={Array.from({ length: 8 }, (_, k) => `${(k / 7) * b.w},${b.h / 2 + (random(`m13-cr-${i}-${k}`) - 0.5) * 30}`).join(' ')}
                          fill="none"
                          stroke="rgba(255,120,110,.8)"
                          strokeWidth={2}
                          opacity={morto}
                        />
                      </svg>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {/* rótulos: a palavra dita cai dentro da caixa */}
            {rotulos.map((r, i) => {
              const b = C13.caixas[i];
              const morto = janelaM(f, cortes[i], cortes[i] + 6);
              const flutua = Math.sin(f / 13 + i * 1.3) * 5 * vida;
              const vivo = f >= qAtiva[i] ? mola(f, 'estalo', qAtiva[i]) : 0;
              const lift = -14 * vivo * (1 - morto) * (i === Math.round(ativo) ? 1 : 0.45) * (1 - repouso);
              return (
                <AbsoluteFill key={i} style={{ transform: `translateY(${lift + flutua * (1 - morto)}px)`, opacity: 1 - 0.45 * morto }}>
                  <Fala
                    palavras={r}
                    x={b.x + b.w / 2}
                    y={b.y + (r.length > 1 ? 196 : 222)}
                    alinhar="centro"
                    largura={b.w - 30}
                    estilo={{ ...TIPOM.apoio, tamanho: 50, peso: 800, entrelinha: 1.0 }}
                    cor={CORM.papel}
                    modo="letras"
                    staggerLetra={0.6}
                  />
                </AbsoluteFill>
              );
            })}
            {/* "e" pequeno na seta entre graph editor e render */}
            <Fala palavras={eFala} x={C13.caixas[3].x + CW + GAP / 2} y={C13.caixas[3].y - 70} alinhar="centro" estilo={{ ...TIPOM.apoio, tamanho: 56 }} cor={CORM.dim} />
          </AbsoluteFill>
        </AbsoluteFill>
        {/* laser vermelho */}
        {laserOn ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <line x1={40} y1={C13.yLaser} x2={xLaser} y2={C13.yLaser} stroke={`rgba(${RGB.alerta},.3)`} strokeWidth={26} strokeLinecap="round" />
              <line x1={40} y1={C13.yLaser} x2={xLaser} y2={C13.yLaser} stroke={CORM.vermelho} strokeWidth={8} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px rgba(${RGB.alerta},.9))` }} />
              <line x1={40} y1={C13.yLaser} x2={xLaser} y2={C13.yLaser} stroke="#FFE1DE" strokeWidth={2.5} strokeLinecap="round" />
            </svg>
            <Flare x={xLaser} y={C13.yLaser} forca={1 - janelaM(f, qLaser + durLaser, qLaser + durLaser + 8)} cor="255,90,70" largura={460} />
            {Array.from({ length: 40 }, (_, j) => {
              const nasce = qLaser + (j / 40) * durLaser;
              const d = f - nasce;
              if (d < 0 || d > 14) return null;
              const x0 = lerp(60, 1860, ease.corte(clamp01((nasce - qLaser) / durLaser)));
              const a = -Math.PI / 2 + (random(`m13-fa-${j}`) - 0.5) * 2.4;
              const v = 9 + random(`m13-fv-${j}`) * 16;
              return (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    left: x0 + Math.cos(a) * v * d,
                    top: C13.yLaser + Math.sin(a) * v * d + 0.9 * d * d,
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                    background: j % 3 === 0 ? '#FFFFFF' : '#FF8A7A',
                    opacity: 1 - d / 14,
                    boxShadow: `0 0 8px rgba(${RGB.alerta},.9)`,
                  }}
                />
              );
            })}
          </>
        ) : null}
      </AbsoluteFill>
      <HUD tl="MOTION / 013" tr={`REC  ${timecodeM(c.global)}`} bl="FLUXO ANTIGO · 5 PROGRAMAS" br={`TEMPO GASTO · ${relogio}`} inicio={4} />
    </AbsoluteFill>
  );
};
