/* Cena 18 (67,30–74,24 s): "Substitui o After Effects? Não, mas sair de uma ideia pra uma animação
   pronta sem tocar numa timeline é bem absurdo."
   Um ARCO DE LUZ (meia elipse, C18.arco) domina a tela: as partículas da peça da 17 pousam nele
   e ele acende. Por baixo:
   A "Substitui o After Effects?"  pergunta grande; o ícone do app (LogoApp) balança no alto do arco.
   B "Não,"   chega pesado no centro (papel, sem drama); a pergunta sobe e apaga.
   C "mas sair de uma ideia pra uma animação pronta"  um ponto de luz ("ideia") nasce na ponta
              esquerda do arco e corre por cima dele, enchendo o arco de luz, até a ponta direita,
              onde estoura num player ("animação pronta") no instante de "pronta".
   D "sem tocar numa timeline"  uma timeline pequena aparece embaixo; um cursor desce para pegá-la
              e ela se desfaz em poeira verde antes do toque.
   E "é bem absurdo"  tudo sai; "ABSURDO" gigante entra letra a letra incandescente (branco → verde,
              clarão e fagulhas por letra) sob o arco, que lança raios de luz sobre a palavra.
   Saída: verde inunda a tela (flood). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { LogoApp } from '../logos';
import { metricas } from '../medir';
import { BRILHO, clamp01, CORM, ease, type EstiloM, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho, TRIO } from '../tema';
import { Flare, FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';

type XY = [number, number];
const ARCO = { cx: 960, cy: 905, rx: 790, ry: 650 };
const ptArco = (t: number): XY => {
  // t = 0 na ponta esquerda, 1 na direita
  const th = Math.PI * (1 - t);
  return [ARCO.cx + ARCO.rx * Math.cos(th), ARCO.cy - ARCO.ry * Math.sin(th)];
};
export const C18 = {
  arco: ARCO,
  ptArco,
  /** pontos do arco: alvo da dispersão 17→18 */
  pontosArco: (n = 70): XY[] => Array.from({ length: n }, (_, i) => ptArco(i / (n - 1))),
};

const ABS_ESTILO: EstiloM = { ...TIPOM.gigante, tamanho: 300, tracking: -0.04, entrelinha: 0.92 };
type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number) => `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;

export const M18: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(18, 0);
  const pergunta = fala.slice(0, 4);
  const nao = fala.slice(4, 5);
  const jornada = fala.slice(5, 14);
  const semTocar = fala.slice(14, 18);
  const eBem = fala.slice(18, 20);
  const absurdo = fala.slice(20);
  const qNao = c.local(nao[0].s) - 2;
  const qMas = c.local(jornada[0].s) - 2;
  const qIdeia = c.local(fala[9].s) - 2;
  const qPronta = c.local(fala[13].s) - 2;
  const qSem = c.local(fala[14].s) - 2;
  const qTimeline = c.local(fala[17].s) - 2;
  const qE = c.local(fala[18].s) - 2;
  const fim = Number.isFinite(c.saidaInicio) ? c.saidaInicio : 215;

  // o arco acende quando as partículas pousam (dispersão: q18-24)
  const arcoOn = janelaM(f, 16, 24);
  const viagem = ease.suave(clamp01((f - qIdeia) / Math.max(1, qPronta - qIdeia)));
  const [ix, iy] = ptArco(viagem);
  const chegou = f >= qPronta;
  const estouroPronta = chegou ? 1 - janelaM(f, qPronta, qPronta + 14) : 0;

  // ABSURDO
  const la = useLayoutFala({ palavras: absurdo, x: 960, y: 455, alinhar: 'centro', estilo: ABS_ESTILO, textos: { 0: 'ABSURDO' } });
  const A = la.itens[0];
  const capA = metricas(ABS_ESTILO).cap;
  const qLetra = (i: number) => A.q + i * 1.6;
  let tranco = 0;
  A.letras.forEach((_, i) => {
    const d = f - qLetra(i);
    if (d >= 0 && d < 5) tranco += (random(`m18-sh-${i}-${f}`) - 0.5) * 12 * (1 - d / 5);
  });
  const absOn = f >= A.q;
  const raiosAbs = absOn ? janelaM(f, A.q, A.q + 10) : 0;

  // câmera
  const z = lerp(1.0, 1.08, ease.suave(clamp01(f / fim))) + 0.04 * raiosAbs;
  const dx = Math.sin(f / 33) * 10 + tranco;
  const dy = Math.sin(f / 41) * 7 + tranco * 0.4;

  // timeline que se desfaz
  const tlNasce = mola(f, 'assenta', qSem);
  const desfaz = janelaM(f, qTimeline + 2, qTimeline + 14);
  const cursorDesce = ease.corte(clamp01((f - qSem - 4) / (qTimeline + 6 - qSem - 4)));
  const saiTudo = qE - 4;
  const saiB = janelaM(f, saiTudo, saiTudo + 8, 'entra');

  const arcoPath = `M ${ARCO.cx - ARCO.rx} ${ARCO.cy} A ${ARCO.rx} ${ARCO.ry} 0 0 1 ${ARCO.cx + ARCO.rx} ${ARCO.cy}`;
  const compArco = Math.PI * Math.sqrt((ARCO.rx * ARCO.rx + ARCO.ry * ARCO.ry) / 2);
  const brilhoArco = 0.55 + 0.25 * Math.sin(f / 7) + 0.6 * raiosAbs + 0.5 * estouroPronta;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 40]} forcaBrilho={1.1 + 0.5 * raiosAbs} deriva={0.4} semente="m18" />
      <AbsoluteFill style={{ transformOrigin: '960px 560px', transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        <GradeChao horizonte={905} opacidade={0.6} velocidade={4} />
        <Poeira semente="m18" velocidade={1.3} />
        {/* brilho sob o arco */}
        <div style={{ position: 'absolute', left: 160, top: 240, width: 1600, height: 900, borderRadius: '50% 50% 0 0', background: `radial-gradient(ellipse 60% 70% at 50% 100%, rgba(${RGB.acento},${0.1 + 0.18 * raiosAbs}), rgba(${RGB.acento},0) 70%)`, opacity: arcoOn }} />
        {/* o arco */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: arcoOn }}>
          <path d={arcoPath} fill="none" stroke={`rgba(${RGB.acento},.3)`} strokeWidth={34} style={{ filter: 'blur(14px)' }} opacity={brilhoArco} />
          <path d={arcoPath} fill="none" stroke={`rgba(${RGB.claro},.35)`} strokeWidth={5} />
          {/* parte já percorrida pela ideia: mais forte */}
          <path d={arcoPath} fill="none" stroke={CORM.verde} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${compArco} ${compArco}`} strokeDashoffset={compArco * (1 - (f >= qIdeia ? viagem : 0))} style={{ filter: `drop-shadow(0 0 14px rgba(${RGB.acento},.95))` }} />
          <path d={arcoPath} fill="none" stroke="#F0FFF5" strokeWidth={2.5} strokeDasharray={`${compArco} ${compArco}`} strokeDashoffset={compArco * (1 - (f >= qIdeia ? viagem : 0))} />
          {/* raios do arco sobre ABSURDO */}
          {raiosAbs > 0
            ? Array.from({ length: 22 }, (_, i) => {
                const [x, y] = ptArco(0.08 + (i / 21) * 0.84);
                const alvoX = 960 + (x - 960) * 0.25;
                const len = raiosAbs;
                return <line key={i} x1={x} y1={y} x2={lerp(x, alvoX, len * 0.6)} y2={lerp(y, 600, len * 0.6)} stroke={`rgba(${RGB.claro},.5)`} strokeWidth={3} opacity={(0.4 + 0.4 * Math.sin(f / 3 + i)) * raiosAbs} />;
              })
            : null}
        </svg>
        {/* faíscas correndo no arco o tempo todo */}
        {Array.from({ length: 6 }, (_, i) => {
          const t = (((f / 60 + i / 6) % 1) + 1) % 1;
          const [x, y] = ptArco(t);
          return <div key={i} style={{ position: 'absolute', left: x - 4, top: y - 4, width: 8, height: 8, borderRadius: 4, background: '#F4FFF7', boxShadow: `0 0 16px rgba(${RGB.acento},1)`, opacity: arcoOn * 0.8 }} />;
        })}

        {/* A: ícone do app no alto do arco */}
        {f >= c.local(fala[2].s) - 4 && f < qMas + 10 ? (
          <div
            style={{
              position: 'absolute',
              left: 960 - 75,
              top: 300,
              transformOrigin: '75px -60px',
              transform: `scale(${mola(f, 'estalo', c.local(fala[2].s) - 4)}) rotate(${Math.sin(f / 9) * 8}deg)`,
              opacity: 1 - janelaM(f, qMas, qMas + 10),
            }}
          >
            <LogoApp tam={150} sigla="APP" />
          </div>
        ) : null}
        <Fala palavras={pergunta} x={960} y={500} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 104 }} cor={CORM.papel} destaque={['effects?']} corDestaque={CORM.papel} brilhoDestaque={BRILHO.branco} pesoDestaque={900} sai={{ em: qNao - 9, stagger: 0.3, modo: 'sobe' }} />
        <Fala palavras={nao} x={960} y={430} alinhar="centro" estilo={{ ...TIPOM.gigante, tamanho: 230 }} cor={CORM.papel} modo="slam" sai={{ em: qMas, modo: 'foco' }} />

        {/* C: jornada da ideia */}
        <Fala palavras={jornada} x={960} y={420} alinhar="centro" largura={980} estilo={{ ...TIPOM.frase, tamanho: 80 }} destaque={['ideia', 'pronta']} sai={{ em: saiTudo, stagger: 0.4, modo: 'foco' }} />
        <Fala palavras={semTocar} x={960} y={600} alinhar="centro" largura={1100} estilo={{ ...TIPOM.frase, tamanho: 80 }} destaque={['timeline']} corDestaque={CORM.papel} brilhoDestaque={BRILHO.branco} sai={{ em: saiTudo + 2, stagger: 0.4, modo: 'foco' }} />
        {f >= qIdeia && !chegou ? (
          <>
            {Array.from({ length: 10 }, (_, j) => {
              const [rx, ry] = ptArco(Math.max(0, viagem - (j + 1) * 0.012));
              return <div key={j} style={{ position: 'absolute', left: rx - 5, top: ry - 5, width: 10, height: 10, borderRadius: 5, background: j < 3 ? '#fff' : CORM.verdeClaro, opacity: (1 - j / 10) * 0.8, boxShadow: `0 0 12px rgba(${RGB.acento},.9)` }} />;
            })}
            <Flare x={ix} y={iy} forca={1} largura={560} />
            <div style={{ position: 'absolute', left: ix - 70, top: iy - 92, width: 140, textAlign: 'center', fontFamily: FONTEM.mono, fontSize: 30, color: CORM.verdeClaro, textShadow: BRILHO.verdeLeve }}>ideia</div>
          </>
        ) : null}
        {chegou && f < saiTudo + 10 ? (
          <div
            style={{
              position: 'absolute',
              left: ptArco(1)[0] - 150,
              top: ptArco(1)[1] - 230,
              width: 260,
              height: 150,
              borderRadius: 16,
              border: `3px solid ${CORM.verde}`,
              background: 'rgba(8,24,14,.95)',
              boxShadow: `0 0 ${40 + 60 * estouroPronta}px rgba(${RGB.acento},.8)`,
              transform: `scale(${mola(f, 'estalo', qPronta)})`,
              opacity: 1 - saiB,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            <div style={{ width: 0, height: 0, borderTop: '26px solid transparent', borderBottom: '26px solid transparent', borderLeft: `42px solid ${CORM.verde}`, filter: `drop-shadow(0 0 10px rgba(${RGB.acento},.9))` }} />
            <div style={{ fontFamily: FONTEM.mono, fontSize: 28, color: CORM.papel }}>{`${Math.min(100, Math.max(0, f - qPronta) * 5)}%`}</div>
          </div>
        ) : null}
        {estouroPronta > 0 ? <Flare x={ptArco(1)[0]} y={ptArco(1)[1]} forca={estouroPronta} largura={800} /> : null}

        {/* D: timeline que se desfaz antes do toque */}
        {f >= qSem && f < saiTudo + 10
          ? (() => {
              const tx = 640;
              const ty = 790;
              return (
                <>
                  {Array.from({ length: 3 }, (_, r) =>
                    Array.from({ length: 16 }, (_, k) => {
                      const id = r * 16 + k;
                      const rr = (s: string) => random(`m18-tl-${s}-${id}`);
                      const d = clamp01((desfaz - rr('d') * 0.4) / 0.6);
                      const x = tx + k * 40 + (rr('x') - 0.5) * 200 * d;
                      const y = ty + r * 30 - 140 * d * (0.5 + rr('y'));
                      return <div key={id} style={{ position: 'absolute', left: x, top: y, width: d > 0 ? 6 : 36, height: d > 0 ? 6 : 14, borderRadius: 3, background: d > 0 ? CORM.verdeClaro : 'rgba(241,240,232,.55)', opacity: clamp01(tlNasce) * (1 - d) * (1 - saiB), boxShadow: d > 0 ? `0 0 8px rgba(${RGB.acento},.9)` : undefined }} />;
                    }),
                  )}
                  <svg width={60} height={70} style={{ position: 'absolute', left: lerp(1400, 960, cursorDesce), top: lerp(1080, 760, cursorDesce), overflow: 'visible', opacity: 1 - saiB, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.6))' }}>
                    <path d="M0 0 L0 44 L11 34 L19 52 L27 48 L19 31 L34 31 Z" fill="#FFFFFF" stroke="#06110B" strokeWidth={2.5} strokeLinejoin="round" />
                  </svg>
                </>
              );
            })()
          : null}

        {/* E: é bem ABSURDO */}
        <Fala palavras={eBem} x={960} y={330} alinhar="centro" estilo={{ ...TIPOM.apoio, tamanho: 76, peso: 800 }} cor={CORM.papel} />
        {absOn
          ? A.letras.map((l, i) => {
              const qi = qLetra(i);
              const d = f - qi;
              if (d < 0) return null;
              const m = mola(f, 'estalo', qi);
              const quente = 1 - janelaM(f, qi + 2, qi + 20, 'suave');
              const cx = A.x + l.x + l.w / 2;
              const comum: React.CSSProperties = {
                position: 'absolute',
                left: A.x + l.x,
                top: A.y,
                height: A.h,
                lineHeight: `${A.h}px`,
                fontFamily: ABS_ESTILO.familia,
                fontWeight: 900,
                fontSize: ABS_ESTILO.tamanho,
                whiteSpace: 'pre',
                transformOrigin: `${l.w / 2}px ${A.base - A.y}px`,
                transform: `translateY(${(1 - m) * -80}px) scale(${1 + 0.6 * (1 - m)})`,
              };
              return (
                <React.Fragment key={i}>
                  <div style={{ ...comum, color: mix([255, 255, 255], TRIO.acento, 0.5 + 0.5 * (1 - quente)), opacity: clamp01(d / 2) * (0.3 + 0.4 * quente), filter: `blur(${20 + 10 * quente}px)` }}>{l.ch}</div>
                  <div
                    style={{
                      ...comum,
                      backgroundImage: `linear-gradient(180deg, ${mix([255, 255, 255], [150, 250, 180], 1 - quente)} 0%, ${mix([255, 255, 255], TRIO.acento, 1 - quente * 0.85)} 58%, ${mix([200, 255, 220], [30, 180, 82], 1 - quente)} 100%)`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      WebkitTextStroke: `${(2 + 4 * quente).toFixed(1)}px rgba(${RGB.claro},${(0.55 + 0.4 * quente).toFixed(2)})`,
                      opacity: clamp01(d / 2),
                      filter: `${d < 2 ? `blur(${((1 - d / 2) * 12).toFixed(1)}px) ` : ''}drop-shadow(0 0 ${(12 + 26 * quente).toFixed(0)}px rgba(255,255,255,${(0.25 + 0.55 * quente).toFixed(2)})) drop-shadow(0 0 ${(34 + 40 * quente).toFixed(0)}px rgba(${RGB.acento},.7))`,
                    }}
                  >
                    {l.ch}
                  </div>
                  <Flare x={cx} y={A.base - capA / 2} forca={1 - janelaM(f, qi, qi + 8)} largura={640} />
                  {d < 16
                    ? Array.from({ length: 10 }, (_, j) => {
                        const r = (k: string) => random(`m18-fa-${k}-${i}-${j}`);
                        const a = r('a') * Math.PI * 2;
                        const dist = ease.sai(d / 16) * (80 + r('d') * 240);
                        return (
                          <div
                            key={j}
                            style={{
                              position: 'absolute',
                              left: cx + Math.cos(a) * dist,
                              top: A.base - capA / 2 + Math.sin(a) * dist * 0.7 + (d / 16) ** 2 * 60,
                              width: 5,
                              height: 5,
                              borderRadius: 3,
                              background: j % 3 === 0 ? '#fff' : CORM.verdeClaro,
                              opacity: 1 - d / 16,
                              boxShadow: `0 0 8px rgba(${RGB.acento},.9)`,
                            }}
                          />
                        );
                      })
                    : null}
                </React.Fragment>
              );
            })
          : null}
      </AbsoluteFill>
      <HUD tl="MOTION / 018" tr={`REC  ${timecodeM(c.global)}`} bl="TIMELINE TOCADA · 0" br="AFTER EFFECTS · CONTINUA" inicio={20} />
    </AbsoluteFill>
  );
};
