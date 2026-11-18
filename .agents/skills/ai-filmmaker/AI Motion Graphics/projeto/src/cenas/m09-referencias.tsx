/* Cena 9 (25,14–31,84 s): "O que faz o Opus acertar são as referências certas. A tipografia, a
   grade, o ritmo, o easing, a paleta,"
   Chega do glitch já limpa. Em "acertar" uma flecha de luz crava num alvo no centro (tranco, ondas);
   em "referências" o alvo se parte em CINCO encaixes tracejados que voam para uma fileira. Cada
   cartão vira para dentro do seu encaixe NO INSTANTE da palavra e começa a sua mini demonstração,
   que fica rodando: tipografia ("Aa" trocando de peso 100 ↔ 900 com guias), grade (colunas se
   desenhando e blocos encaixando), ritmo (barras batendo num compasso com agulha), easing (curva
   .16 1 .3 1 com ponto correndo e bola na trilha), paleta (leque de amostras se abrindo). O título
   de cada cartão é a própria fala ("a grade", "o ritmo"...). A câmera acompanha o cartão ativo.
   Sai em faixas com os cinco nomes. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, PALETA, RGB, TIPOM, trecho } from '../tema';
import { FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';
import { Fagulhas, idx, Onda, vidro } from './pecas';

const CW = 316;
const GAP = 26;
const X0 = (1920 - (5 * CW + 4 * GAP)) / 2;
const Y = 392;
const CH = 488;
const ALVO: [number, number] = [960, 630];

const DemoTipografia: React.FC<{ t: number }> = ({ t }) => {
  const w = Math.round(100 + 800 * (0.5 - 0.5 * Math.cos(t / 9)));
  return (
    <>
      <svg width={CW} height={330} style={{ position: 'absolute', inset: 0 }}>
        {[
          [92, 'CAP'],
          [150, 'X'],
          [240, 'BASE'],
        ].map(([y, n]) => (
          <g key={String(n)}>
            <line x1={18} x2={CW - 18} y1={y as number} y2={y as number} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={1.5} strokeDasharray="6 6" />
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 0, width: CW, top: 50, textAlign: 'center', fontFamily: FONTEM.titulo, fontWeight: w, fontSize: 200, lineHeight: '230px', letterSpacing: '-0.04em', color: CORM.papel, textShadow: BRILHO.branco }}>
        Aa
      </div>
      <div style={{ position: 'absolute', left: 20, top: 284, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre' }}>{`PESO ${String(w).padStart(3, '0')}`}</div>
    </>
  );
};

const DemoGrade: React.FC<{ t: number }> = ({ t }) => {
  const cols = 6;
  const blocos = [
    { c: 0, s: 4, y: 60, h: 60, q: 10 },
    { c: 0, s: 2, y: 136, h: 110, q: 15 },
    { c: 2, s: 4, y: 136, h: 50, q: 19 },
    { c: 2, s: 2, y: 196, h: 50, q: 23 },
    { c: 4, s: 2, y: 196, h: 50, q: 26 },
  ];
  const cw = (CW - 40) / cols;
  const varre = ((t % 48) / 48) * cols;
  return (
    <svg width={CW} height={330} style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: cols + 1 }, (_, i) => {
        const p = ease.sai(clamp01((t - i * 1.5) / 8));
        return <line key={i} x1={20 + i * cw} x2={20 + i * cw} y1={30} y2={30 + 250 * p} stroke={`rgba(${RGB.claro},.55)`} strokeWidth={1.5} />;
      })}
      {[30, 280].map((y) => (
        <line key={y} x1={20} x2={20 + (CW - 40) * ease.sai(clamp01(t / 10))} y1={y} y2={y} stroke={`rgba(${RGB.claro},.55)`} strokeWidth={1.5} />
      ))}
      <rect x={20 + Math.floor(varre) * cw} y={30} width={cw} height={250} fill={`rgba(${RGB.acento},.10)`} />
      {blocos.map((b, i) => {
        const m = mola(t, 'estalo', b.q);
        if (m <= 0) return null;
        return <rect key={i} x={20 + b.c * cw + 4} y={b.y - (1 - m) * 40} width={b.s * cw - 8} height={b.h} rx={6} fill={i === 0 ? CORM.verde : `rgba(${RGB.claro},.28)`} stroke={CORM.verdeClaro} strokeWidth={2} opacity={clamp01(m * 2)} style={{ filter: i === 0 ? `drop-shadow(0 0 10px rgba(${RGB.acento},.8))` : undefined }} />;
      })}
    </svg>
  );
};

const DemoRitmo: React.FC<{ t: number }> = ({ t }) => {
  const P = 24;
  const n = 8;
  const fase = ((t % P) + P) % P;
  const agulha = fase / P;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const bate = (i / n) * P;
        const desde = (((fase - bate) % P) + P) % P;
        const acento = i === 0 || i === 4;
        const h = 40 + (acento ? 190 : 120) * Math.exp(-desde / 4);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 26 + i * 34,
              top: 270 - h,
              width: 22,
              height: h,
              borderRadius: 6,
              background: desde < 3 ? '#F4FFF7' : acento ? CORM.verde : `rgba(${RGB.claro},.55)`,
              boxShadow: desde < 4 ? `0 0 18px rgba(${RGB.acento},.95)` : undefined,
            }}
          />
        );
      })}
      <div style={{ position: 'absolute', left: 20 + agulha * (n * 34), top: 24, width: 3, height: 262, background: '#fff', boxShadow: `0 0 10px rgba(${RGB.claro},1)` }} />
      <div style={{ position: 'absolute', left: 20, top: 284, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre' }}>{`${1 + Math.floor(fase / (P / 4))}/4 · 120 BPM`}</div>
    </>
  );
};

const DemoEasing: React.FC<{ t: number }> = ({ t }) => {
  const ox = 34;
  const oy = 236;
  const W = 250;
  const H = 196;
  const P = 36;
  const u = ((t % P) + P) % P / (P - 8);
  const k = clamp01(u);
  const y = ease.sai(k);
  const desenha = ease.sai(clamp01(t / 12));
  const pathD = `M${ox} ${oy} C ${ox + 0.16 * W} ${oy - 1 * H}, ${ox + 0.3 * W} ${oy - 1 * H}, ${ox + W} ${oy - H}`;
  return (
    <>
      <svg width={CW} height={330} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line x1={ox} x2={ox + W} y1={oy} y2={oy} stroke={`rgba(${RGB.claro},.4)`} strokeWidth={1.5} />
        <line x1={ox} x2={ox} y1={oy} y2={oy - H} stroke={`rgba(${RGB.claro},.4)`} strokeWidth={1.5} />
        <line x1={ox} y1={oy} x2={ox + 0.16 * W} y2={oy - H} stroke="rgba(241,240,232,.35)" strokeWidth={1.5} strokeDasharray="4 5" />
        <line x1={ox + W} y1={oy - H} x2={ox + 0.3 * W} y2={oy - H} stroke="rgba(241,240,232,.35)" strokeWidth={1.5} strokeDasharray="4 5" />
        <circle cx={ox + 0.16 * W} cy={oy - H} r={6} fill={CORM.papel} />
        <circle cx={ox + 0.3 * W} cy={oy - H} r={6} fill={CORM.papel} />
        <path d={pathD} fill="none" stroke={CORM.verde} strokeWidth={5} strokeDasharray={`${(600 * desenha).toFixed(0)} 999`} style={{ filter: `drop-shadow(0 0 8px rgba(${RGB.acento},.9))` }} />
        <circle cx={ox + k * W} cy={oy - y * H} r={10} fill="#fff" style={{ filter: `drop-shadow(0 0 10px rgba(${RGB.claro},1))` }} />
        <line x1={ox} x2={ox + W} y1={278} y2={278} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={2} />
        {[0.12, 0.06].map((g, i) => (
          <circle key={i} cx={ox + ease.sai(clamp01(k - g)) * W} cy={278} r={9} fill={CORM.verde} opacity={0.25 - i * 0.1} />
        ))}
        <circle cx={ox + y * W} cy={278} r={11} fill={CORM.verde} style={{ filter: `drop-shadow(0 0 10px rgba(${RGB.acento},1))` }} />
      </svg>
      <div style={{ position: 'absolute', left: 20, top: 292, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre' }}>(.16, 1, .3, 1)</div>
    </>
  );
};

const AMOSTRAS = [PALETA.fundo, PALETA.floresta, PALETA.acento, PALETA.acentoClaro, PALETA.papel];
const DemoPaleta: React.FC<{ t: number }> = ({ t }) => {
  const sel = Math.floor(t / 10) % AMOSTRAS.length;
  return (
    <>
      {AMOSTRAS.map((cor, i) => {
        const m = mola(t, 'estalo', i * 1.5);
        const ang = (i - 2) * 17 * m;
        const sobe = i === sel ? 26 * mola(t % 10, 'estalo', 0) : 0;
        return (
          <div
            key={cor}
            style={{
              position: 'absolute',
              left: CW / 2 - 40,
              top: 40,
              width: 80,
              height: 230,
              borderRadius: 12,
              background: cor,
              border: `2px solid ${i === sel ? '#fff' : `rgba(${RGB.claro},.45)`}`,
              boxShadow: i === sel ? `0 0 22px rgba(${RGB.acento},.8)` : '0 10px 20px rgba(0,0,0,.5)',
              transformOrigin: '50% 100%',
              transform: `rotate(${ang}deg) translateY(${-sobe}px)`,
              zIndex: i === sel ? 9 : i,
            }}
          />
        );
      })}
      <div style={{ position: 'absolute', left: 20, top: 284, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre' }}>{AMOSTRAS[sel].toUpperCase()}</div>
    </>
  );
};

const CARTOES: { nome: string; Demo: React.FC<{ t: number }> }[] = [
  { nome: 'tipografia', Demo: DemoTipografia },
  { nome: 'grade', Demo: DemoGrade },
  { nome: 'ritmo', Demo: DemoRitmo },
  { nome: 'easing', Demo: DemoEasing },
  { nome: 'paleta', Demo: DemoPaleta },
];

export const M09: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const linha1 = trecho(9, 0, 5);
  const linha2 = trecho(9, 6, 9);
  const qAcertar = c.local(linha1[5].s) - 2;
  const qRef = c.local(linha2[2].s) - 2;
  const iNomes = CARTOES.map((k) => idx(9, k.nome));
  const qs = iNomes.map((i) => c.local(trecho(9, i, i)[0].s) - 2);
  const ativo = qs.reduce((a, q, i) => (f >= q ? i : a), -1);
  const cx = (i: number) => X0 + i * (CW + GAP) + CW / 2;

  // câmera: acompanha o cartão ativo
  const segue = qs.reduce((acc, q, i) => acc + (960 - cx(i)) * 0.06 * (mola(f, 'camera', q) - (i < 4 ? mola(f, 'camera', qs[i + 1]) : 0)), 0);
  const z = 1.0 + 0.05 * ease.suave(clamp01(f / c.seqDuracao));
  const dx = Math.sin(f / 33) * 10 + segue;
  const dy = Math.cos(f / 41) * 7;

  // flecha no alvo
  const voo = janelaM(f, qAcertar - 4, qAcertar + 2, 'entra');
  const cravou = f >= qAcertar + 2;
  const tranco = cravou && f < qAcertar + 9 ? (random(`m09-sh-${f}`) - 0.5) * 16 * (1 - (f - qAcertar - 2) / 7) : 0;
  const alvo = mola(f, 'estalo', 4) * (1 - janelaM(f, qRef, qRef + 6, 'entra'));
  const flechaX = lerp(-300, ALVO[0] - 40, voo);

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 62]} deriva={0.45} semente="m09" />
      <AbsoluteFill style={{ transformOrigin: '960px 620px', transform: `translate(${dx + tranco}px, ${dy}px) scale(${z})` }}>
        <GradeChao horizonte={900} opacidade={0.4} velocidade={3} />
        <Poeira semente="m09" n={36} />
        <Fala palavras={linha1} x={960} y={66} alinhar="centro" estilo={{ ...TIPOM.apoio, tamanho: 72 }} cor={CORM.papel} destaque={['acertar']} corDestaque={CORM.branco} pesoDestaque={900} brilhoDestaque={BRILHO.branco} />
        <Fala palavras={linha2} x={960} y={158} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 116 }} destaque={['referências']} />

        {/* alvo e flecha */}
        {alvo > 0.01 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {[150, 110, 70, 30].map((r, i) => (
              <circle key={r} cx={ALVO[0]} cy={ALVO[1]} r={r * alvo} fill={i % 2 === 0 ? `rgba(${RGB.acento},.10)` : 'rgba(3,7,5,.6)'} stroke={i === 3 ? CORM.verde : CORM.verdeClaro} strokeWidth={i === 3 ? 4 : 2} style={{ filter: i === 3 ? `drop-shadow(0 0 12px rgba(${RGB.acento},1))` : undefined }} />
            ))}
            <circle cx={ALVO[0]} cy={ALVO[1]} r={200 * alvo} fill="none" stroke={CORM.verdeClaro} strokeWidth={2.5} strokeDasharray="18 14" transform={`rotate(${f * 3} ${ALVO[0]} ${ALVO[1]})`} opacity={0.7} />
            <line x1={ALVO[0] - 260 * alvo} x2={ALVO[0] + 260 * alvo} y1={ALVO[1]} y2={ALVO[1]} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={1.5} />
            <line x1={ALVO[0]} x2={ALVO[0]} y1={ALVO[1] - 230 * alvo} y2={ALVO[1] + 230 * alvo} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={1.5} />
          </svg>
        ) : null}
        {f >= qAcertar - 4 && alvo > 0.05 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <line x1={flechaX - 260} y1={ALVO[1]} x2={flechaX} y2={ALVO[1]} stroke={`rgba(${RGB.acento},.4)`} strokeWidth={14} strokeLinecap="round" opacity={alvo} />
            <line x1={flechaX - 260} y1={ALVO[1]} x2={flechaX + 40} y2={ALVO[1]} stroke="#E8FFF0" strokeWidth={4} opacity={alvo} />
            <polygon points={`${flechaX + 40},${ALVO[1] - 16} ${flechaX + 72},${ALVO[1]} ${flechaX + 40},${ALVO[1] + 16}`} fill="#E8FFF0" opacity={alvo} />
            <path d={`M${flechaX - 260} ${ALVO[1]} l-30 -22 M${flechaX - 260} ${ALVO[1]} l-30 22 M${flechaX - 236} ${ALVO[1]} l-30 -22 M${flechaX - 236} ${ALVO[1]} l-30 22`} stroke={CORM.verdeClaro} strokeWidth={3} opacity={alvo} />
          </svg>
        ) : null}
        {cravou ? (
          <>
            <Onda f={f} q0={qAcertar + 2} x={ALVO[0]} y={ALVO[1]} r0={30} r1={420} dur={18} espessura={4} />
            <Onda f={f} q0={qAcertar + 6} x={ALVO[0]} y={ALVO[1]} r0={20} r1={260} dur={14} />
            <Fagulhas f={f} q0={qAcertar + 2} x={ALVO[0]} y={ALVO[1]} semente="m09-alvo" raio={300} n={22} />
          </>
        ) : null}

        {/* encaixes e cartões */}
        {CARTOES.map((k, i) => {
          const qSlot = qRef + 1 + i * 2;
          if (f < qSlot) return null;
          const s = mola(f, 'assenta', qSlot);
          const x = lerp(ALVO[0] - 40, X0 + i * (CW + GAP), s);
          const y = lerp(ALVO[1] - 40, Y, s);
          const w = lerp(80, CW, s);
          const h = lerp(80, CH, s);
          const q = qs[i];
          const vira = mola(f, 'estalo', q);
          const tDemo = f - q;
          const ativoK = i === ativo ? 1 - 0.55 * janelaM(f, q + 10, q + 30) : 0;
          const artigo = trecho(9, iNomes[i] - 1, iNomes[i] - 1);
          const nome = trecho(9, iNomes[i], iNomes[i]);
          return (
            <React.Fragment key={k.nome}>
              {/* encaixe tracejado */}
              <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, border: `2px dashed rgba(${RGB.claro},${(0.55 * (1 - vira)).toFixed(3)})`, boxSizing: 'border-box' }}>
                <div style={{ position: 'absolute', left: 18, top: 14, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.faint, opacity: s * (1 - vira) }}>{`0${i + 1}`}</div>
              </div>
              {f >= q ? (
                <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: `${cx(i)}px ${Y + CH / 2}px` }}>
                  <div
                    style={{
                      ...vidro(ativoK),
                      left: X0 + i * (CW + GAP),
                      top: Y,
                      width: CW,
                      height: CH,
                      transformOrigin: '50% 50%',
                      transform: `rotateY(${(1 - vira) * -95}deg) translateY(${Math.sin(f / 14 + i * 1.3) * 5}px)`,
                      opacity: clamp01(vira * 3),
                    }}
                  >
                    <k.Demo t={tDemo} />
                    <div style={{ position: 'absolute', left: 0, top: 336, width: CW, height: 2, background: CORM.linha }} />
                    <div style={{ position: 'absolute', right: 18, top: 14, fontFamily: FONTEM.mono, fontSize: 28, color: i === ativo ? CORM.verdeClaro : CORM.faint }}>{`0${i + 1}`}</div>
                  </div>
                </AbsoluteFill>
              ) : null}
              {/* título = a fala */}
              <Fala palavras={artigo} x={X0 + i * (CW + GAP) + 22} y={Y + 350} estilo={{ ...TIPOM.rotulo, tamanho: 30, peso: 400 }} cor={CORM.dim} limpar />
              <Fala palavras={nome} x={X0 + i * (CW + GAP) + 22} y={Y + 392} estilo={{ ...TIPOM.frase, tamanho: 48, peso: 800 }} cor={CORM.papel} destaque={i === ativo ? [0] : []} />
              <Fagulhas f={f} q0={q + 2} x={cx(i)} y={Y + 20} semente={`m09-c${i}`} raio={200} n={12} />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <HUD tl="MOTION / 009" tr={`REC  ${timecodeM(c.global)}`} bl="REFERÊNCIAS" br={`CARREGADAS · ${Math.max(0, ativo + 1)}/5`} inicio={8} />
    </AbsoluteFill>
  );
};
