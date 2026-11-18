/* Cena 7 (18,98–21,26 s): "Só que tem um detalhe que ninguém te conta."
   Saímos do túnel no ponto de fuga: tudo some. A grade apaga, os restos (riscos e partículas) são
   sugados para o centro, e sobra UM ponto verde em (960, 540) que bate como um coração: cada palavra
   forte (Só, tem, detalhe, ninguém, conta) é uma batida com onda de choque. Em volta, uma mira de
   foco (círculo tracejado girando + quatro cantos que fecham em "detalhe"), uma varredura de radar e
   a leitura X/Y. "Só que tem um detalhe" em cima ("detalhe" verde), "que ninguém te conta" embaixo,
   saindo do desfoque como segredo. A câmera empurra no ponto e para em repouso na saída (o pontoAbre
   abre a cena 8 a partir dele). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { C07 } from '../layoutB';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, PALETA, RGB, TIPOM, trecho } from '../tema';
import { FundoM, HUD, timecodeM } from '../visual';
import { idx, Onda } from './pecas';

export const M07: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const [px, py] = C07.ponto;
  const cima = trecho(7, 0, 4);
  const baixo = trecho(7, 5);
  const fim = Number.isFinite(c.saidaInicio) ? c.saidaInicio : c.seqDuracao;
  const batidas = ['só', 'tem', 'detalhe', 'ninguém', 'conta'].map((p) => c.local(trecho(7, idx(7, p), idx(7, p))[0].s) - 2);
  const qDetalhe = batidas[2];

  // batida: pop rápido em cada palavra forte + respiração
  const pop = batidas.reduce((a, q) => a + (f >= q ? Math.exp(-(f - q) / 3.5) * (1 - Math.exp(-(f - q + 1) * 1.5)) : 0), 0);
  const resp = Math.sin(f / 5) * 0.08;
  const d = 30 * (1 + resp + 0.7 * pop);

  // tudo some
  const some = janelaM(f, 0, 26, 'suave');
  const repouso = janelaM(f, fim - 14, fim, 'suave');
  const vida = 1 - repouso;
  const z = 1 + 0.12 * ease.suave(clamp01(f / fim));
  const dx = Math.sin(f / 19) * 10 * vida;
  const dy = Math.cos(f / 23) * 6 * vida;

  const mira = mola(f, 'assenta', 6);
  const fecha = mola(f, 'estalo', qDetalhe);
  const cantoR = lerp(260, 120, fecha);
  const radar = (f * 6) % 360;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 50]} forcaBrilho={1 - 0.75 * some} grade={1 - 0.92 * some} deriva={0.4} semente="m07" />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${px}px ${py}px, rgba(0,0,0,0) 0px, rgba(0,0,0,${(0.55 * some).toFixed(3)}) 520px)` }} />
      <AbsoluteFill style={{ transformOrigin: `${px}px ${py}px`, transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        {/* restos do túnel sugados para o ponto */}
        {Array.from({ length: 70 }, (_, i) => {
          const r = (k: string) => random(`m07-s-${k}-${i}`);
          const a = r('a') * Math.PI * 2;
          const R0 = 380 + r('r') * 900;
          const q0 = r('q') * 18;
          const u = ease.entra(clamp01((f - q0) / (16 + r('d') * 10)));
          if (u >= 1) return null;
          const R = R0 * (1 - u);
          const len = 6 + 60 * u;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: px + Math.cos(a) * R,
                top: py + Math.sin(a) * R,
                width: len,
                height: 2.5,
                borderRadius: 2,
                background: i % 4 === 0 ? '#fff' : CORM.verdeClaro,
                opacity: 0.8 * (1 - u * 0.5),
                transformOrigin: '0 50%',
                transform: `rotate(${(a * 180) / Math.PI}deg)`,
                boxShadow: `0 0 8px rgba(${RGB.acento},.9)`,
              }}
            />
          );
        })}

        {/* varredura de radar */}
        <div
          style={{
            position: 'absolute',
            left: px - 440,
            top: py - 440,
            width: 880,
            height: 880,
            borderRadius: '50%',
            background: `conic-gradient(from ${radar}deg at 50% 50%, rgba(${RGB.acento},0) 0deg, rgba(${RGB.acento},0) 300deg, rgba(${RGB.acento},.22) 356deg, rgba(${RGB.claro},.5) 360deg)`,
            opacity: 0.8 * mira,
            WebkitMaskImage: 'radial-gradient(circle, #000 30%, transparent 70%)',
            maskImage: 'radial-gradient(circle, #000 30%, transparent 70%)',
          }}
        />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {[150, 260, 380].map((r, i) => (
            <circle key={r} cx={px} cy={py} r={r * (0.7 + 0.3 * mira)} fill="none" stroke={`rgba(${RGB.claro},.16)`} strokeWidth={1.5} opacity={mira} strokeDasharray={i === 1 ? '4 10' : undefined} />
          ))}
          <circle cx={px} cy={py} r={90 * mira} fill="none" stroke={CORM.verdeClaro} strokeWidth={2.5} strokeDasharray="16 12" transform={`rotate(${f * 3} ${px} ${py})`} opacity={0.9 * mira} />
          <line x1={px - 520 * mira} x2={px - 120} y1={py} y2={py} stroke={`rgba(${RGB.claro},.4)`} strokeWidth={1.5} />
          <line x1={px + 120} x2={px + 520 * mira} y1={py} y2={py} stroke={`rgba(${RGB.claro},.4)`} strokeWidth={1.5} />
          {/* cantos que fecham em "detalhe" */}
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sy], i) => {
            const x = px + sx * cantoR;
            const y = py + sy * cantoR * 0.8;
            const L = 46;
            return <path key={i} d={`M${x} ${y - sy * L}V${y}H${x - sx * L}`} fill="none" stroke={f >= qDetalhe ? '#E8FFF0' : CORM.verdeClaro} strokeWidth={4} opacity={mira} style={{ filter: f >= qDetalhe ? `drop-shadow(0 0 8px rgba(${RGB.acento},1))` : undefined }} />;
          })}
        </svg>

        {/* ondas a cada batida */}
        {batidas.map((q, i) => (
          <React.Fragment key={i}>
            <Onda f={f} q0={q} x={px} y={py} r0={16} r1={i === 2 ? 520 : 300} dur={i === 2 ? 22 : 16} espessura={i === 2 ? 4 : 2.5} />
            <Onda f={f} q0={q + 4} x={px} y={py} r0={10} r1={180} dur={14} espessura={1.5} />
          </React.Fragment>
        ))}

        {/* o ponto */}
        <div style={{ position: 'absolute', left: px - 260, top: py - 260, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, rgba(${RGB.acento},${(0.35 + 0.35 * pop).toFixed(3)}) 0%, rgba(${RGB.acento},.08) 30%, rgba(${RGB.acento},0) 62%)` }} />
        <div
          style={{
            position: 'absolute',
            left: px - d / 2,
            top: py - d / 2,
            width: d,
            height: d,
            borderRadius: '50%',
            background: `radial-gradient(circle, #FFFFFF 0%, #C8FFD9 30%, ${PALETA.acento} 62%)`,
            boxShadow: `${BRILHO.verde}, 0 0 ${(40 + 80 * pop).toFixed(0)}px rgba(${RGB.acento},.9)`,
          }}
        />
        <div style={{ position: 'absolute', left: px + 130, top: py + 70, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre', opacity: mira }}>
          {`X ${String(Math.round(960 + Math.sin(f / 3) * 0.6)).padStart(4, '0')}  Y 0540`}
        </div>
        <div style={{ position: 'absolute', left: px - 130 - 260, top: py - 110, width: 260, textAlign: 'right', fontFamily: FONTEM.mono, fontSize: 28, color: CORM.dim, whiteSpace: 'pre', opacity: fecha }}>
          1 PX
        </div>
      </AbsoluteFill>

      {/* fala: fora da câmera, para o ponto empurrar por trás */}
      <Fala palavras={cima} x={960} y={150} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 104 }} destaque={['detalhe']} />
      <Fala
        palavras={baixo}
        x={960}
        y={790}
        alinhar="centro"
        estilo={{ ...TIPOM.frase, tamanho: 96, peso: 700 }}
        modo="foco"
        cor={CORM.papel}
        destaque={['ninguém']}
        corDestaque={CORM.branco}
        pesoDestaque={900}
        brilhoDestaque={BRILHO.branco}
      />
      <HUD tl="MOTION / 007" tr={`REC  ${timecodeM(c.global)}`} bl="SINAL · 1 PONTO" br={`BATIDAS · ${batidas.filter((q) => f >= q).length}`} inicio={4} />
    </AbsoluteFill>
  );
};
