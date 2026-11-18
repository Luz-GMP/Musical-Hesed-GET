/* Cena 15 (50,54–57,66 s): "E como é código, você pode falar: deixa essa transição mais suave,
   muda a cor, desacelera aqui, faz o final voltar pro começo,"
   Um estúdio vivo. À esquerda a JANELA DE PREVIEW (C15.janela: é nela que a caixa "vídeo" da 14
   se transforma) com um quadrado correndo, fantasmas de onion skin (o espaçamento mostra o easing)
   e a régua do tempo; à direita o painel da CURVA (ponto correndo nela) e o painel de CÓDIGO com os
   quatro parâmetros. A frase de abertura fica no alto; cada pedido falado nasce num BALÃO embaixo,
   palavra por palavra, e o preview obedece NA PALAVRA-CHAVE:
     "suave"      a curva vira ease-in-out (morph), os fantasmas se juntam nas pontas
     "cor"        uma onda de cor atravessa o preview e o quadrado vira verde
     "desacelera" o tempo estica: a régua abre, a duração vai de 0,8 s a 1,6 s
     "começo"     surge a seta de loop e o quadrado passa a ir e voltar
   Cada balão, depois de obedecido, encolhe e voa para a linha de código que mudou (que acende e
   reescreve o valor). Sai em corte seco na batida (corteBatida). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, type Palavra, PALETA, RGB, TIPOM, trecho, TRIO } from '../tema';
import { FundoM, HUD, Poeira, timecodeM } from '../visual';

type Ret = { x: number; y: number; w: number; h: number; r: number };
export const C15 = {
  janela: { x: 100, y: 228, w: 1090, h: 590, r: 26 } as Ret,
  curva: { x: 1250, y: 228, w: 570, h: 345, r: 22 } as Ret,
  codigo: { x: 1250, y: 600, w: 570, h: 218, r: 22 } as Ret,
};

const PAPEL: [number, number, number] = [241, 240, 232];
const VERDE: [number, number, number] = TRIO.acento;
const mix = (a: [number, number, number], b: [number, number, number], t: number) => `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
const inOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

const Painel: React.FC<{ r: Ret; titulo: string; aceso?: number; children?: React.ReactNode; entra?: number }> = ({ r, titulo, aceso = 0, children, entra = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      borderRadius: r.r,
      background: 'linear-gradient(180deg, rgba(14,34,22,.94), rgba(5,13,9,.94))',
      border: `2px solid rgba(${RGB.claro},${0.28 + 0.6 * aceso})`,
      boxShadow: `0 30px 80px rgba(0,0,0,.55), 0 0 ${20 + 50 * aceso}px rgba(${RGB.acento},${0.12 + 0.45 * aceso}), inset 0 1px 0 rgba(255,255,255,.06)`,
      overflow: 'hidden',
      opacity: entra,
      transform: `translateY(${(1 - entra) * 60}px)`,
    }}
  >
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 46, borderBottom: `1.5px solid rgba(${RGB.claro},.16)`, background: 'rgba(255,255,255,.03)' }} />
    {[0, 1, 2].map((k) => (
      <div key={k} style={{ position: 'absolute', left: 18 + k * 20, top: 17, width: 12, height: 12, borderRadius: 6, background: k === 0 ? CORM.verde : `rgba(${RGB.claro},.3)` }} />
    ))}
    <div style={{ position: 'absolute', left: 90, top: 7, fontFamily: FONTEM.mono, fontSize: 24, color: CORM.dim, whiteSpace: 'pre' }}>{titulo}</div>
    {children}
  </div>
);

/** Balão de um pedido: nasce na 1ª palavra, cresce com a frase; depois voa para a linha de código. */
const Balao: React.FC<{ palavras: Palavra[]; destaque: string; voa: number; alvo: [number, number] }> = ({ palavras, destaque, voa, alvo }) => {
  const c = useCenaM();
  const f = c.frame;
  const estilo = { ...TIPOM.frase, tamanho: 70, peso: 800 };
  const cx = 960;
  const yTexto = 872;
  const lay = useLayoutFala({ palavras, x: cx, y: yTexto, alinhar: 'centro', estilo, largura: 1700 });
  const q0 = lay.itens[0].q;
  if (f < q0 - 1) return null;
  const wTotal = lay.linhas[0];
  const ultimo = lay.itens.filter((it) => f >= it.q).pop() ?? lay.itens[0];
  const wAgora = ultimo.x + ultimo.w - lay.itens[0].x;
  const nasce = mola(f, 'estalo', q0 - 1);
  const w = lerp(120, Math.max(wAgora, 80), clamp01(nasce)) + 90;
  const h = 120;
  const bx = cx - wTotal / 2 - 45;
  const by = yTexto + estilo.tamanho * estilo.entrelinha * 0.5 - h / 2;
  const k = ease.corte(clamp01(voa));
  if (k >= 1) return null;
  const centroB: [number, number] = [bx + (wTotal + 90) / 2, by + h / 2];
  const tx = (alvo[0] - centroB[0]) * k;
  const ty = (alvo[1] - centroB[1]) * k - Math.sin(Math.PI * k) * 120;
  const s = lerp(1, 0.08, k);
  return (
    <AbsoluteFill style={{ transformOrigin: `${centroB[0]}px ${centroB[1]}px`, transform: `translate(${tx}px, ${ty}px) scale(${s})`, opacity: 1 - clamp01((k - 0.7) / 0.3) }}>
      <div
        style={{
          position: 'absolute',
          left: bx,
          top: by,
          width: w,
          height: h,
          borderRadius: 60,
          background: 'linear-gradient(180deg, rgba(20,48,31,.95), rgba(8,20,13,.95))',
          border: `2.5px solid rgba(${RGB.claro},${0.55 + 0.4 * (1 - nasce)})`,
          boxShadow: `0 20px 60px rgba(0,0,0,.6), 0 0 40px rgba(${RGB.acento},.35)`,
          transformOrigin: '60px 60px',
          transform: `scale(${0.6 + 0.4 * clamp01(nasce)})`,
        }}
      >
        <div style={{ position: 'absolute', left: 54, bottom: -16, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `18px solid rgba(${RGB.claro},.85)` }} />
      </div>
      <Fala palavras={palavras} x={cx - wTotal / 2} y={yTexto} estilo={estilo} largura={1800} cor={CORM.papel} destaque={[destaque]} pesoDestaque={900} />
    </AbsoluteFill>
  );
};

export const M15: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(15, 0);
  const abertura = fala.slice(0, 7);
  const pedidos = [fala.slice(7, 12), fala.slice(12, 15), fala.slice(15, 17), fala.slice(17, 23)];
  const chaves = ['suave', 'cor', 'desacelera', 'começo'];
  const qSuave = c.local(fala[11].s) - 1;
  const qCor = c.local(fala[14].s) - 1;
  const qDes = c.local(fala[15].s);
  const qDesFim = c.local(fala[16].e);
  const qLoop = c.local(fala[20].s) - 1; // "voltar"
  const qComeco = c.local(fala[22].s) - 1;
  const eventos = [qSuave, qCor, qDes + 4, qComeco];
  const voos = [c.local(fala[12].s) - 6, c.local(fala[15].s) - 5, c.local(fala[17].s) - 6, Infinity];

  const suave = (fr: number) => ease.corte(clamp01((fr - qSuave) / 10));
  const cor = ease.sai(clamp01((f - qCor) / 10));
  const estica = (fr: number) => ease.suave(clamp01((fr - qDes) / Math.max(6, qDesFim - qDes)));
  const loopOn = f >= qLoop;

  // fase do quadrado: integra 1/duração (a duração estica sem salto)
  const fase = (fr: number) => {
    let acc = 0;
    for (let k = 0; k < Math.max(0, fr); k++) acc += 1 / lerp(24, 48, estica(k));
    return acc;
  };
  const faseLoop = fase(qLoop);
  const uDe = (fr: number) => {
    const p = fase(fr);
    if (fr < qLoop) return p % 1;
    const x = p - faseLoop + (faseLoop % 1);
    const m = x % 2;
    return m < 1 ? m : 2 - m;
  };
  const E = (u: number, fr: number) => lerp(u, inOut(u), suave(fr));

  const J = C15.janela;
  const pista = { x0: J.x + 90, x1: J.x + J.w - 90 - 130, y: J.y + 250 };
  const xQ = (fr: number) => lerp(pista.x0, pista.x1, E(uDe(fr), fr));
  const corQ = mix(PAPEL, VERDE, cor);
  const glowQ = cor > 0.5 ? BRILHO.verde : '0 0 30px rgba(255,255,255,.35)';

  // entrada (a janela vem da caixa "vídeo"; os outros painéis entram em cascata)
  const entraCurva = mola(f, 'assenta', 8);
  const entraCodigo = mola(f, 'assenta', 12);
  const alteracoes = eventos.filter((q) => f >= q).length;

  // câmera: deriva + empurrão a cada pedido obedecido
  let punch = 0;
  eventos.forEach((q) => {
    const d = f - q;
    if (d >= 0 && d < 12) punch += Math.sin((d / 12) * Math.PI) * 0.018;
  });
  const z = lerp(1.0, 1.05, ease.suave(clamp01(f / 214))) + punch;
  const dx = Math.sin(f / 31) * 10;
  const dy = Math.sin(f / 37) * 7;

  // curva no painel
  const CV = C15.curva;
  const gx0 = CV.x + 60;
  const gx1 = CV.x + CV.w - 50;
  const gy0 = CV.y + CV.h - 50;
  const gy1 = CV.y + 80;
  const pathCurva = Array.from({ length: 41 }, (_, i) => {
    const u = i / 40;
    return `${i === 0 ? 'M' : 'L'} ${(lerp(gx0, gx1, u)).toFixed(1)} ${(lerp(gy0, gy1, E(u, f))).toFixed(1)}`;
  }).join(' ');
  const uAgora = uDe(f);
  const curvaAcesa = Math.max(0, ...eventos.slice(0, 1).map((q) => (f >= q ? 1 - janelaM(f, q, q + 16) : 0)));

  // código
  const CD = C15.codigo;
  const linhas = [
    { k: 'ease', de: 'linear', para: 'inOut(cubic)', q: eventos[0] },
    { k: 'cor', de: "'#F1F0E8'", para: "PALETA.acento", q: eventos[1] },
    { k: 'duração', de: '0.8s', para: '1.6s', q: eventos[2] },
    { k: 'loop', de: 'false', para: 'true', q: eventos[3] },
  ];
  const yLinha = (i: number) => CD.y + 62 + i * 38;
  const codigoAceso = Math.max(0, ...linhas.map((l) => (f >= l.q ? 1 - janelaM(f, l.q, l.q + 14) : 0)));

  // régua do tempo (estica)
  const passoRegua = lerp(60, 120, estica(f));
  const play = J.x + 40 + ((fase(f) % 1) * (J.w - 80));

  return (
    <AbsoluteFill>
      <FundoM brilho={[40, 50]} forcaBrilho={1.1} deriva={0.4} semente="m15" />
      <Poeira semente="m15" velocidade={1.1} opacidade={0.8} />
      <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        <Fala palavras={abertura} x={960} y={104} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 76 }} destaque={['código']} />

        {/* ---------------- preview ---------------- */}
        <Painel r={J} titulo="preview.mp4 · 1920×1080" aceso={Math.max(0, ...eventos.map((q) => (f >= q ? 1 - janelaM(f, q, q + 14) : 0)))}>
          {/* grade do preview */}
          <div style={{ position: 'absolute', left: 0, top: 46, right: 0, bottom: 0, backgroundImage: `linear-gradient(rgba(${RGB.claro},.07) 1px, transparent 1px), linear-gradient(90deg, rgba(${RGB.claro},.07) 1px, transparent 1px)`, backgroundSize: '54px 54px' }} />
          {/* onda de cor */}
          {f >= qCor && f < qCor + 16 ? (
            <div style={{ position: 'absolute', top: 46, bottom: 0, left: -200 + ease.sai((f - qCor) / 16) * (J.w + 400) - 200, width: 260, background: `linear-gradient(90deg, rgba(${RGB.acento},0), rgba(${RGB.acento},.45), rgba(${RGB.acento},0))` }} />
          ) : null}
        </Painel>
        {/* pista, fantasmas e quadrado (fora do painel para o brilho não ser cortado) */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <line x1={pista.x0 + 65} x2={pista.x1 + 65} y1={pista.y + 65 + 100} y2={pista.y + 65 + 100} stroke={`rgba(${RGB.claro},.25)`} strokeWidth={3} strokeDasharray="6 10" />
          {loopOn ? (
            <path
              d={`M ${pista.x1 + 65} ${pista.y - 20} C ${pista.x1 + 40} ${pista.y - 170}, ${pista.x0 + 90} ${pista.y - 170}, ${pista.x0 + 65} ${pista.y - 20}`}
              fill="none"
              stroke={CORM.verde}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={1100}
              strokeDashoffset={1100 * (1 - ease.sai(clamp01((f - qLoop) / 12)))}
              style={{ filter: `drop-shadow(0 0 12px rgba(${RGB.acento},.9))` }}
            />
          ) : null}
          {loopOn && f - qLoop > 10 ? (
            <polygon points={`${pista.x0 + 65},${pista.y - 4} ${pista.x0 + 45},${pista.y - 40} ${pista.x0 + 88},${pista.y - 36}`} fill={CORM.verde} opacity={janelaM(f, qLoop + 10, qLoop + 14)} />
          ) : null}
        </svg>
        {[8, 6, 4, 2].map((atr, j) => (
          <div key={atr} style={{ position: 'absolute', left: xQ(f - atr), top: pista.y, width: 130, height: 130, borderRadius: 16, border: `3px solid ${corQ}`, opacity: 0.12 + j * 0.06 }} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: xQ(f),
            top: pista.y,
            width: 130,
            height: 130,
            borderRadius: 16,
            background: corQ,
            boxShadow: glowQ,
            transform: `rotate(${E(uAgora, f) * 90}deg)`,
          }}
        />
        {loopOn ? (
          <div style={{ position: 'absolute', left: J.x + J.w - 160, top: J.y + 70, fontFamily: FONTEM.mono, fontSize: 30, color: CORM.verde, textShadow: BRILHO.verdeLeve, opacity: janelaM(f, qLoop, qLoop + 6), transform: `rotate(${(f - qLoop) * 6}deg)`, width: 48, height: 48, textAlign: 'center', lineHeight: '48px' }}>
            ⟲
          </div>
        ) : null}
        {/* régua do tempo */}
        <div style={{ position: 'absolute', left: J.x + 40, top: J.y + J.h - 92, width: J.w - 80, height: 60, overflow: 'hidden' }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ position: 'absolute', left: i * passoRegua, top: 0, width: 2, height: i % 2 ? 16 : 28, background: `rgba(${RGB.claro},.5)` }} />
          ))}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 36, height: 6, borderRadius: 3, background: `rgba(${RGB.claro},.18)` }} />
        </div>
        <div style={{ position: 'absolute', left: play, top: J.y + J.h - 100, width: 3, height: 76, background: CORM.papel, boxShadow: BRILHO.branco }} />
        <div style={{ position: 'absolute', left: J.x + J.w - 260, top: J.y + J.h - 150, width: 220, textAlign: 'right', fontFamily: FONTEM.mono, fontSize: 30, color: estica(f) > 0 ? CORM.verde : CORM.dim }}>{`${lerp(0.8, 1.6, estica(f)).toFixed(1)} s`}</div>

        {/* ---------------- curva ---------------- */}
        <Painel r={CV} titulo="easing" aceso={curvaAcesa} entra={clamp01(entraCurva)}>
          <div style={{ position: 'absolute', right: 22, top: 7, fontFamily: FONTEM.mono, fontSize: 24, color: suave(f) > 0.5 ? CORM.verde : CORM.dim }}>{suave(f) > 0.5 ? 'inOut(cubic)' : 'linear'}</div>
        </Painel>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: clamp01(entraCurva) }}>
          <line x1={gx0} x2={gx1} y1={gy0} y2={gy0} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={2} />
          <line x1={gx0} x2={gx0} y1={gy0} y2={gy1 - 10} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={2} />
          <line x1={gx0} x2={gx1} y1={gy0} y2={gy1} stroke={`rgba(${RGB.claro},.15)`} strokeWidth={2} strokeDasharray="6 8" />
          <path d={pathCurva} fill="none" stroke={`rgba(${RGB.acento},.35)`} strokeWidth={14} style={{ filter: 'blur(5px)' }} />
          <path d={pathCurva} fill="none" stroke={CORM.verde} strokeWidth={5} strokeLinecap="round" />
          <line x1={lerp(gx0, gx1, uAgora)} x2={lerp(gx0, gx1, uAgora)} y1={gy0} y2={gy1 - 10} stroke="rgba(241,240,232,.25)" strokeWidth={2} />
          <circle cx={lerp(gx0, gx1, uAgora)} cy={lerp(gy0, gy1, E(uAgora, f))} r={11} fill="#F4FFF7" style={{ filter: `drop-shadow(0 0 10px rgba(${RGB.acento},1))` }} />
        </svg>

        {/* ---------------- código ---------------- */}
        <Painel r={CD} titulo="motion.tsx" aceso={codigoAceso} entra={clamp01(entraCodigo)}>
          {linhas.map((l, i) => {
            const mudou = f >= l.q;
            const t = f - l.q;
            const valor = mudou ? l.para.slice(0, Math.min(l.para.length, 1 + Math.floor(t * 1.5))) : l.de;
            const acende = mudou ? 1 - janelaM(t, 4, 20) : 0;
            return (
              <div key={l.k} style={{ position: 'absolute', left: 0, right: 0, top: yLinha(i) - CD.y - 4, height: 38, background: `rgba(${RGB.acento},${0.22 * acende})` }}>
                <div style={{ position: 'absolute', left: 22, top: 2, fontFamily: FONTEM.mono, fontSize: 28, whiteSpace: 'pre', color: CORM.dim }}>
                  <span style={{ color: CORM.faint }}>{`${i + 1}  `}</span>
                  {`${l.k}: `}
                  <span style={{ color: mudou ? CORM.verde : CORM.papel, textShadow: mudou ? BRILHO.verdeLeve : undefined }}>{valor}</span>
                </div>
              </div>
            );
          })}
        </Painel>

        {/* ---------------- balões ---------------- */}
        {pedidos.map((p, i) => (
          <Balao key={i} palavras={p} destaque={chaves[i]} voa={(f - voos[i]) / 9} alvo={[CD.x + 300, yLinha(i) + 14]} />
        ))}
        {/* faíscas na linha de código quando o balão chega */}
        {voos.slice(0, 3).map((q, i) => {
          const d = f - q - 9;
          if (d < 0 || d > 12) return null;
          return Array.from({ length: 10 }, (_, j) => {
            const a = random(`m15-fa-${i}-${j}`) * Math.PI * 2;
            const dist = ease.sai(d / 12) * (40 + random(`m15-fd-${i}-${j}`) * 90);
            return <div key={`${i}-${j}`} style={{ position: 'absolute', left: CD.x + 300 + Math.cos(a) * dist, top: yLinha(i) + 14 + Math.sin(a) * dist, width: 5, height: 5, borderRadius: 3, background: j % 2 ? '#fff' : CORM.verdeClaro, opacity: 1 - d / 12, boxShadow: `0 0 8px rgba(${RGB.acento},.9)` }} />;
          });
        })}
      </AbsoluteFill>
      <HUD tl="MOTION / 015" tr={`REC  ${timecodeM(c.global)}`} bl="PREVIEW AO VIVO" br={`ALTERAÇÕES · ${alteracoes}`} inicio={6} />
    </AbsoluteFill>
  );
};
