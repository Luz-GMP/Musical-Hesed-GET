/* Cena 17 (60,20–67,30 s): "E é por isso que a gente montou uma skill com tudo que usa pra fazer
   motions como esse. As referências, as cenas e as transições."
   Os keyframes da 16 pousam nos traços do SÍMBOLO DA SKILL (simbolo-skill.tsx) em SIMBOLO17 e ele
   acende (clarão). Raios de luz giram atrás; chão em perspectiva com reflexo.
   "montou"   a peça se abre em VISTA EXPLODIDA 3D: placa, contorno, M e keyframe se separam em Z e
              a peça gira de lado;
   "skill"    as partes batem juntas (impacto, anel de choque, tranco de câmera) e a peça ganha
              espessura (12 camadas em Z): vira um objeto sólido girando devagar;
   "com tudo que usa pra fazer"  peças do ofício (Aa, grade, curva, paleta, fotograma, { }) voam de
              fora e são sugadas pela peça, que pulsa a cada uma;
   "motions como esse"  um anel inclinado de fotogramas das cenas deste filme (MOTION, After
              Effects?, plugin, OPUS 5.5, 2009, keyframes) gira em volta da peça;
   "As referências, as cenas e as transições"  três etiquetas nascem do centro, cada uma na sua
              palavra, e ficam em ÓRBITA 3D (passam na frente e atrás da peça).
   Saída: dispersão (o símbolo vira partículas que formam o arco de luz da 18). A peça volta de
   frente, no tamanho e lugar de SIMBOLO17, até o início da saída, e some nesse quadro. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';
import { SIMBOLO17, SimboloSkill } from './simbolo-skill';

const S = SIMBOLO17;

const FERRAMENTAS = ['Aa', '#', '∿', '●●●', '▣', '{ }', '↗', '◆'];
const FOTOGRAMAS = ['MOTION', 'After Effects?', 'plugin', 'OPUS 5.5', '2009', 'keyframes'];
const ETIQUETAS = [
  { texto: 'REFERÊNCIAS', icone: '◎' },
  { texto: 'CENAS', icone: '▣' },
  { texto: 'TRANSIÇÕES', icone: '⇄' },
];

export const M17: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(17, 0);
  const frase1 = fala.slice(0, 19);
  const frase2 = fala.slice(19);
  const qMontou = c.local(fala[7].s) - 2;
  const qSkill = c.local(fala[9].s) - 2;
  const qCom = c.local(fala[10].s) - 2;
  const qMotions = c.local(fala[16].s) - 2;
  const qAs = c.local(fala[19].s) - 2;
  const qEtq = [c.local(fala[20].s) - 2, c.local(fala[22].s) - 2, c.local(fala[25].s) - 2];
  const fim = Number.isFinite(c.saidaInicio) ? c.saidaInicio : 208;
  const escondido = f >= fim;

  // nascimento do símbolo (os pontos pousam ~q20)
  const qAcende = 20;
  const aparece = janelaM(f, qAcende - 3, qAcende + 1);
  const clarao = f >= qAcende ? 1 - janelaM(f, qAcende, qAcende + 14) : 0;

  // vista explodida → impacto
  const abre = ease.sai(clamp01((f - qMontou) / 10));
  const fecha = f >= qSkill ? mola(f, 'estalo', qSkill) : 0;
  const explode = abre * (1 - Math.min(1, fecha));
  const impacto = f >= qSkill + 3 ? 1 - janelaM(f, qSkill + 3, qSkill + 16) : 0;
  const solido = clamp01(fecha);

  // rotação da peça: viva no meio, de frente na saída
  const deFrente = janelaM(f, fim - 14, fim, 'suave');
  const vida = 1 - deFrente;
  const rotY = (Math.sin(f / 22) * 24 + 26 * explode) * vida;
  const rotX = (Math.sin(f / 31) * 10 + 12 * explode) * vida;

  // pulsos de absorção
  const chegadasF = FERRAMENTAS.map((_, i) => qCom + 4 + i * 3.2 + 10);
  const pulso = Math.max(0, ...chegadasF.map((q) => (f >= q && f < q + 8 ? 1 - (f - q) / 8 : 0)));
  const brilhoPeca = Math.max(clarao, impacto, pulso * 0.6);

  // câmera
  let tranco = 0;
  const dS = f - (qSkill + 3);
  if (dS >= 0 && dS < 7) tranco = (random(`m17-tr-${f}`) - 0.5) * 26 * (1 - dS / 7);
  const z = lerp(1.0, 1.07, ease.suave(clamp01((f - 20) / 160))) * (1 - deFrente) + 1 * deFrente;
  const dx = (Math.sin(f / 29) * 10 + tranco) * vida;
  const dy = (Math.sin(f / 37) * 7 + tranco * 0.5) * vida;

  // órbita das etiquetas
  const orbita = (i: number) => {
    const ang = f / 26 + (i * Math.PI * 2) / 3 + 0.6;
    return { ang, x: S.cx + Math.cos(ang) * 600, y: S.cy + 40 + Math.sin(ang) * 150, z: Math.sin(ang) };
  };

  const etiqueta = (i: number) => {
    const q = qEtq[i];
    if (f < q) return null;
    const e = mola(f, 'estalo', q);
    const o = orbita(i);
    const x = lerp(S.cx, o.x, clamp01(e));
    const y = lerp(S.cy, o.y, clamp01(e));
    const prof = 0.82 + 0.22 * o.z;
    const flash = 1 - janelaM(f, q, q + 10);
    return (
      <div
        key={`e${i}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${(0.4 + 0.6 * clamp01(e)) * prof})`,
          padding: '18px 34px 18px 26px',
          borderRadius: 22,
          border: `3px solid ${CORM.verde}`,
          background: 'linear-gradient(180deg, rgba(22,58,36,.95), rgba(7,20,12,.95))',
          boxShadow: `0 0 ${30 + 50 * flash}px rgba(${RGB.acento},${0.45 + 0.4 * flash}), 0 20px 50px rgba(0,0,0,.6)`,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          whiteSpace: 'pre',
          opacity: 0.55 + 0.45 * (o.z * 0.5 + 0.5),
        }}
      >
        <span style={{ fontFamily: FONTEM.titulo, fontSize: 44, color: CORM.verde, textShadow: BRILHO.verdeLeve }}>{ETIQUETAS[i].icone}</span>
        <span style={{ fontFamily: FONTEM.titulo, fontWeight: 900, fontSize: 50, letterSpacing: '0.01em', color: CORM.papel }}>{ETIQUETAS[i].texto}</span>
      </div>
    );
  };
  const atras = [0, 1, 2].filter((i) => orbita(i).z < 0);
  const frente = [0, 1, 2].filter((i) => orbita(i).z >= 0);

  const fotogramas = (lado: 'atras' | 'frente') =>
    f >= qMotions - 4 && f < qAs + 14
      ? FOTOGRAMAS.map((t, i) => {
          const nasce = mola(f, 'estalo', qMotions - 4 + i * 1.5);
          const some = janelaM(f, qAs, qAs + 12, 'entra');
          const ang = (f - qMotions) / 9 + (i / FOTOGRAMAS.length) * Math.PI * 2;
          const raio = lerp(140, 620, clamp01(nasce)) * (1 - some * 0.9);
          const x = S.cx + Math.cos(ang) * raio;
          const y = S.cy + Math.sin(ang) * raio * 0.32 - 10;
          const prof = Math.sin(ang);
          if ((prof >= 0) !== (lado === 'frente')) return null;
          return (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${(0.7 + 0.3 * prof) * clamp01(nasce)})`,
                width: 290,
                height: 160,
                borderRadius: 12,
                border: `2px solid ${i === 0 ? CORM.verde : 'rgba(241,240,232,.55)'}`,
                background: 'rgba(5,14,9,.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTEM.titulo,
                fontWeight: 900,
                fontSize: t.length > 9 ? 36 : 50,
                letterSpacing: '-0.02em',
                color: i === 0 ? CORM.verde : CORM.papel,
                textShadow: i === 0 ? BRILHO.verde : undefined,
                opacity: (0.5 + 0.5 * (prof * 0.5 + 0.5)) * (1 - some),
              }}
            >
              {t}
            </div>
          );
        })
      : null;

  // a peça 3D
  const camadas = 12;
  const peca = (
    <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: `${S.cx}px ${S.cy}px` }}>
      <AbsoluteFill style={{ transformStyle: 'preserve-3d', transformOrigin: `${S.cx}px ${S.cy}px`, transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${1 + 0.06 * pulso})` }}>
        {/* espessura: camadas em Z (só depois de montada) */}
        {solido > 0.05
          ? Array.from({ length: camadas }, (_, k) => (
              <AbsoluteFill key={k} style={{ transform: `translateZ(${-(k + 1) * 5 * solido}px)` }}>
                <SimboloSkill cx={S.cx} cy={S.cy} R={S.R} fantasma opacidade={0.5 * (1 - k / camadas) * solido} />
              </AbsoluteFill>
            ))
          : null}
        <AbsoluteFill style={{ transform: `translateZ(${-220 * explode}px)` }}>
          <SimboloSkill cx={S.cx} cy={S.cy} R={S.R} so={['placa']} opacidade={aparece} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateZ(${-40 * explode}px) rotateZ(${-20 * explode}deg)` }}>
          <SimboloSkill cx={S.cx} cy={S.cy} R={S.R} so={['losango']} brilho={brilhoPeca} opacidade={aparece} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateZ(${110 * explode}px) translateY(${-60 * explode}px)` }}>
          <SimboloSkill cx={S.cx} cy={S.cy} R={S.R} so={['m']} brilho={brilhoPeca} opacidade={aparece} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateZ(${300 * explode}px) translateY(${40 * explode}px)` }}>
          <SimboloSkill cx={S.cx} cy={S.cy} R={S.R} so={['key']} brilho={brilhoPeca} opacidade={aparece} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // raios de luz atrás
  const raios = (
    <div
      style={{
        position: 'absolute',
        left: S.cx - 900,
        top: S.cy - 900,
        width: 1800,
        height: 1800,
        borderRadius: '50%',
        background: `repeating-conic-gradient(from ${f * 0.6}deg at 50% 50%, rgba(${RGB.acento},.16) 0deg 4deg, rgba(${RGB.acento},0) 4deg 15deg)`,
        WebkitMaskImage: 'radial-gradient(circle, #000 8%, rgba(0,0,0,.6) 30%, transparent 62%)',
        maskImage: 'radial-gradient(circle, #000 8%, rgba(0,0,0,.6) 30%, transparent 62%)',
        opacity: aparece * (0.6 + 0.4 * brilhoPeca),
      }}
    />
  );

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 54]} forcaBrilho={1.3 + 0.4 * brilhoPeca} deriva={0.5} semente="m17" />
      <AbsoluteFill style={{ transformOrigin: `${S.cx}px ${S.cy}px`, transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        <GradeChao horizonte={820} opacidade={0.6} velocidade={3} />
        <Poeira semente="m17" velocidade={1.2} />
        {raios}
        {/* halo e reflexo */}
        <div style={{ position: 'absolute', left: S.cx - 420, top: S.cy - 420, width: 840, height: 840, borderRadius: '50%', background: `radial-gradient(circle, rgba(${RGB.acento},${0.25 + 0.35 * brilhoPeca}), rgba(${RGB.acento},0) 62%)`, opacity: aparece }} />
        <div style={{ position: 'absolute', left: S.cx - 300, top: S.cy + S.R + 40, width: 600, height: 90, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${RGB.acento},.35), rgba(${RGB.acento},0) 70%)`, opacity: aparece }} />

        {fotogramas('atras')}
        {atras.map((i) => etiqueta(i))}
        {!escondido ? peca : null}
        {fotogramas('frente')}
        {frente.map((i) => etiqueta(i))}

        {/* anel de choque do impacto */}
        {impacto > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: S.cx - 900 * (1 - impacto),
              top: S.cy - 900 * (1 - impacto) * 0.4,
              width: 1800 * (1 - impacto),
              height: 720 * (1 - impacto),
              borderRadius: '50%',
              border: `${2 + 6 * impacto}px solid ${CORM.verdeClaro}`,
              opacity: impacto,
              boxShadow: `0 0 40px rgba(${RGB.acento},.8)`,
            }}
          />
        ) : null}

        {/* ferramentas sugadas ("com tudo que usa pra fazer") */}
        {FERRAMENTAS.map((t, i) => {
          const q0 = qCom + i * 3.2;
          if (f < q0) return null;
          const k = ease.entra(clamp01((f - q0 - 4) / 10));
          if (k >= 1) return null;
          const ang = random(`m17-fe-${i}`) * Math.PI * 2;
          const x0 = S.cx + Math.cos(ang) * 900;
          const y0 = S.cy + Math.sin(ang) * 460;
          const surge = mola(f, 'estalo', q0);
          const x = lerp(lerp(x0, S.cx + Math.cos(ang) * 620, clamp01(surge)), S.cx, k);
          const y = lerp(lerp(y0, S.cy + Math.sin(ang) * 330, clamp01(surge)), S.cy, k);
          return (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${1 - 0.85 * k}) rotate(${k * 200}deg)`,
                width: 110,
                height: 110,
                borderRadius: 20,
                border: `2.5px solid ${CORM.verdeClaro}`,
                background: 'rgba(10,32,19,.92)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTEM.titulo,
                fontWeight: 900,
                fontSize: t.length > 2 ? 34 : 54,
                color: CORM.papel,
                boxShadow: `0 0 26px rgba(${RGB.acento},.5)`,
              }}
            >
              {t}
            </div>
          );
        })}
        {chegadasF.map((q, i) =>
          f >= q && f < q + 12
            ? Array.from({ length: 10 }, (_, j) => {
                const a = random(`m17-fa-${i}-${j}`) * Math.PI * 2;
                const d = ease.sai((f - q) / 12) * (80 + random(`m17-fd-${i}-${j}`) * 200);
                return <div key={`${i}-${j}`} style={{ position: 'absolute', left: S.cx + Math.cos(a) * d, top: S.cy + Math.sin(a) * d, width: 5, height: 5, borderRadius: 3, background: j % 2 ? '#fff' : CORM.verdeClaro, opacity: 1 - (f - q) / 12, boxShadow: `0 0 8px rgba(${RGB.acento},.9)` }} />;
              })
            : null,
        )}

        {/* clarão de nascimento */}
        {clarao > 0 ? <div style={{ position: 'absolute', left: S.cx - 500, top: S.cy - 500, width: 1000, height: 1000, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,${0.7 * clarao}) 0%, rgba(${RGB.claro},${0.4 * clarao}) 18%, rgba(${RGB.acento},0) 60%)` }} /> : null}

        <Fala
          palavras={frase1}
          x={960}
          y={112}
          alinhar="centro"
          largura={1700}
          estilo={{ ...TIPOM.frase, tamanho: 70 }}
          destaque={['skill', 'motions']}
          quebrarAntes={[10]}
          sai={{ em: qAs - 10, stagger: 0.5, modo: 'foco' }}
        />
        <Fala palavras={frase2} x={960} y={120} alinhar="centro" largura={1800} estilo={{ ...TIPOM.frase, tamanho: 84 }} destaque={['referências', 'cenas', 'transições']} />
      </AbsoluteFill>
      <HUD tl="MOTION / 017" tr={`REC  ${timecodeM(c.global)}`} bl="SKILL · MOTION" br={`PEÇAS · ${f >= qEtq[2] ? 3 : f >= qEtq[1] ? 2 : f >= qEtq[0] ? 1 : 0}/3`} inicio={16} />
    </AbsoluteFill>
  );
};
