/* Cena 5 (9,06–12,44 s): "Você não controla programa nenhum, só descreve como quer que fique."
   Chegamos de dentro do "O": o miolo da letra se abre numa barra de prompt de vidro em 3D (inclinada,
   assentando), com uma luz que corre pela borda, reflexo no chão, brilho por baixo e um reflexo
   especular que varre o vidro. A câmera empurra e balança e converge para o repouso no início da
   saída (a transição estica parte de C05.barra). "Você não controla programa nenhum" sobe em cima;
   em "programa" cinco etiquetas (TIMELINE, CAMADAS, KEYFRAMES, GRAPH EDITOR, RENDER) aparecem em volta
   e em "nenhum" são SUGADAS pelo cursor da barra (rastro, encolhem, cada uma acende a barra e solta
   fagulhas). Partículas correm para a barra o tempo todo. "só descreve como quer que fique" é
   digitado dentro dela (mono, "descreve" verde); no fim o botão de enviar pulsa. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { C05 } from '../layout';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';

const PROGRAMAS = [
  { nome: 'TIMELINE', x: 260, y: 430 },
  { nome: 'CAMADAS', x: 1420, y: 420 },
  { nome: 'KEYFRAMES', x: 200, y: 800 },
  { nome: 'GRAPH EDITOR', x: 1300, y: 810 },
  { nome: 'RENDER', x: 800, y: 880 },
];

export const M05: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const B = C05.barra;
  const fala = trecho(5, 0, 4);
  const prompt = trecho(5, 5);
  const qPrograma = c.local(fala[3].s);
  const qNenhum = c.local(fala[4].s);
  const qSo = c.local(prompt[0].s) - 2;
  const qFique = c.local(prompt[prompt.length - 1].e);
  const fim = Number.isFinite(c.saidaInicio) ? c.saidaInicio : 100;
  const hTexto = C05.prompt.tamanho * C05.prompt.entrelinha;

  // câmera: empurra e balança, converge ao repouso no início da saída
  const repouso = janelaM(f, fim - 22, fim, 'suave');
  const vida = 1 - repouso;
  const z = lerp(1.12, 1, ease.suave(clamp01(f / fim)));
  const dx = Math.sin(f / 23) * 14 * vida;
  const dy = Math.cos(f / 29) * 9 * vida;
  const rotX = (lerp(26, 0, mola(f, 'assenta', 6)) + Math.sin(f / 17) * 3) * vida;
  const rotY = Math.sin(f / 31) * 5 * vida;

  // nascimento: miolo do O → barra
  const nasce = mola(f, 'assenta', 8);
  const abre = mola(f, 'estalo', 13);
  const w = lerp(96, B.w, abre);
  const h = lerp(150, B.h, nasce);
  const r = Math.min(h / 2, lerp(48, B.r, abre));
  const cx = B.x + B.w / 2;
  const cy = B.y + B.h / 2;
  const pronto = clamp01((abre - 0.6) * 3);
  const cursor: [number, number] = [B.x + 100, cy];

  // sucção das etiquetas: cada uma que chega acende a barra
  const chegadas = PROGRAMAS.map((_, i) => qNenhum + 2 + i * 2 + 9);
  const flashBarra = Math.max(0, ...chegadas.map((q) => (f >= q && f < q + 8 ? 1 - (f - q) / 8 : 0)));
  const pulso = janelaM(f, qFique, qFique + 8, 'sai');
  const digitando = f >= qSo && f <= qFique;
  const halo = 0.55 + 0.25 * Math.sin(f / 6) + 0.4 * flashBarra + (digitando ? 0.2 : 0);
  const giroLuz = f * 9;
  const varre = ((f - 20) % 46) / 46; // reflexo especular
  const piscaAntes = Math.floor(f / 8) % 2 === 0;

  const etiquetas = PROGRAMAS.map((p, i) => {
    const q0 = qPrograma + i * 2;
    if (f < q0) return null;
    const e = mola(f, 'estalo', q0);
    const qs = qNenhum + 2 + i * 2;
    const s = janelaM(f, qs, qs + 9, 'entra');
    if (s >= 1) return null;
    const flutua = Math.sin(f / 11 + i * 1.7) * 8 * (1 - s);
    const px = (k: number) => lerp(p.x + 100, cursor[0], k);
    const py = (k: number) => lerp(p.y + flutua + 30, cursor[1], k) - Math.sin(Math.PI * k) * 120;
    const corpo = (k: number, op: number, key: string) => (
      <div
        key={key}
        style={{
          position: 'absolute',
          left: px(k) - 100,
          top: py(k) - 30,
          padding: '14px 26px',
          borderRadius: 12,
          border: `2px solid ${k > 0 ? CORM.verdeClaro : CORM.linhaForte}`,
          background: 'rgba(12,30,19,.88)',
          fontFamily: FONTEM.mono,
          fontSize: 30,
          letterSpacing: '0.08em',
          color: CORM.papel,
          whiteSpace: 'pre',
          opacity: e * op,
          transform: `scale(${(0.7 + 0.3 * e) * (1 - 0.9 * k)}) rotate(${(random(`m05-g-${i}`) - 0.5) * 60 * k}deg)`,
          boxShadow: k > 0 ? `0 0 24px rgba(${RGB.acento},.6)` : undefined,
        }}
      >
        {p.nome}
      </div>
    );
    return (
      <React.Fragment key={p.nome}>
        {s > 0.05 ? [0.3, 0.18, 0.08].map((op, j) => corpo(Math.max(0, s - (j + 1) * 0.1), op, `g${j}`)) : null}
        {corpo(s, 1, 'c')}
      </React.Fragment>
    );
  });

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 60]} forcaBrilho={1.2} deriva={0.5} />
      <AbsoluteFill style={{ transformOrigin: '960px 620px', transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        <GradeChao horizonte={720} opacidade={0.6} velocidade={5} progresso={janelaM(f, 4, 30)} />
        <Poeira semente="m05" velocidade={1.6} />
        {/* partículas correndo para a barra */}
        {Array.from({ length: 36 }, (_, i) => {
          const rr = (k: string) => random(`m05-fl-${k}-${i}`);
          const per = 26 + rr('p') * 20;
          const t = (((f + rr('o') * per) % per) + per) % per / per;
          const lado = rr('l') < 0.5 ? -1 : 1;
          const x0 = cx + lado * (700 + rr('x') * 400);
          const y0 = cy + (rr('y') - 0.5) * 700;
          const k = ease.entra(t);
          const x = lerp(x0, cx + lado * w * 0.3, k);
          const y = lerp(y0, cy, k);
          return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 4 + 10 * k, height: 3, borderRadius: 2, background: CORM.verdeClaro, opacity: 0.6 * Math.sin(Math.PI * t) * pronto, boxShadow: `0 0 8px rgba(${RGB.acento},.9)` }} />;
        })}
        <Fala palavras={fala} x={C05.apoio.x} y={C05.apoio.y} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 88 }} destaque={['nenhum']} corDestaque={CORM.papel} brilhoDestaque={BRILHO.branco} pesoDestaque={900} />
        {etiquetas}

        {/* barra em 3D */}
        <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: `${cx}px ${cy}px` }}>
          <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
            {/* brilho e reflexo no chão */}
            <div style={{ position: 'absolute', left: cx - w * 0.6, top: cy - 40, width: w * 1.2, height: 260, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 30%, rgba(${RGB.acento},${0.35 * halo}), rgba(${RGB.acento},0) 70%)`, opacity: janelaM(f, 2, 10) }} />
            <div
              style={{
                position: 'absolute',
                left: cx - w / 2,
                top: cy + h / 2 + 16,
                width: w,
                height: h * 0.7,
                borderRadius: r,
                background: `linear-gradient(180deg, rgba(${RGB.claro},.16), rgba(${RGB.claro},0))`,
                opacity: pronto,
              }}
            />
            {/* borda com luz correndo */}
            <div
              style={{
                position: 'absolute',
                left: cx - w / 2 - 3,
                top: cy - h / 2 - 3,
                width: w + 6,
                height: h + 6,
                borderRadius: r + 3,
                background: `conic-gradient(from ${giroLuz}deg at 50% 50%, rgba(${RGB.claro},${0.45 + 0.5 * flashBarra}) 0deg, #F4FFF7 22deg, rgba(${RGB.claro},${0.45 + 0.5 * flashBarra}) 60deg, rgba(${RGB.claro},${0.45 + 0.5 * flashBarra}) 180deg, #CFFFE0 205deg, rgba(${RGB.claro},${0.45 + 0.5 * flashBarra}) 240deg)`,
                boxShadow: `0 0 ${40 + 40 * halo}px rgba(${RGB.acento},${0.35 + 0.3 * halo}), 0 30px 80px rgba(0,0,0,.6)`,
                opacity: janelaM(f, 2, 8),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: cx - w / 2,
                top: cy - h / 2,
                width: w,
                height: h,
                borderRadius: r,
                background: 'linear-gradient(180deg, rgba(22,52,34,.97), rgba(6,16,10,.97))',
                boxShadow: `inset 0 0 40px rgba(${RGB.acento},.16), inset 0 2px 0 rgba(255,255,255,.08)`,
                overflow: 'hidden',
                opacity: janelaM(f, 2, 8),
              }}
            >
              {pronto > 0 ? (
                <div style={{ position: 'absolute', top: 0, left: -300 + varre * (w + 600), width: 180, height: '100%', background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.10), rgba(255,255,255,0))', transform: 'skewX(-20deg)' }} />
              ) : null}
            </div>
            {pronto > 0 ? (
              <>
                <div style={{ position: 'absolute', left: B.x + 44, top: cy - hTexto / 2, fontFamily: FONTEM.mono, fontSize: 50, lineHeight: `${hTexto}px`, color: CORM.verde, textShadow: BRILHO.verdeLeve, opacity: pronto }}>›</div>
                {f < qSo ? (
                  <>
                    <div style={{ position: 'absolute', left: B.x + 100, top: cy - hTexto / 2, fontFamily: FONTEM.mono, fontSize: 50, lineHeight: `${hTexto}px`, color: CORM.faint, opacity: pronto }}>descreva o que você quer</div>
                    {piscaAntes ? <div style={{ position: 'absolute', left: B.x + 96, top: cy - 25, width: 5, height: 50, background: CORM.verde, boxShadow: BRILHO.verdeLeve }} /> : null}
                  </>
                ) : null}
                <Fala palavras={prompt} x={B.x + 100} y={cy - hTexto / 2} largura={B.w - 220} estilo={C05.prompt} modo="maquina" destaque={['descreve']} cor={CORM.papel} />
                {/* fagulhas quando uma etiqueta é sugada */}
                {chegadas.map((q, i) =>
                  f >= q && f < q + 12
                    ? Array.from({ length: 10 }, (_, j) => {
                        const a = random(`m05-fa-${i}-${j}`) * Math.PI * 2;
                        const d = ease.sai((f - q) / 12) * (60 + random(`m05-fd-${i}-${j}`) * 120);
                        return <div key={`${i}-${j}`} style={{ position: 'absolute', left: cursor[0] + Math.cos(a) * d, top: cursor[1] + Math.sin(a) * d, width: 5, height: 5, borderRadius: 3, background: j % 2 ? '#fff' : CORM.verdeClaro, opacity: 1 - (f - q) / 12, boxShadow: `0 0 8px rgba(${RGB.acento},.9)` }} />;
                      })
                    : null,
                )}
                {/* botão enviar */}
                <div
                  style={{
                    position: 'absolute',
                    left: B.x + B.w - 112,
                    top: cy - 44,
                    width: 88,
                    height: 88,
                    borderRadius: 44,
                    background: f >= qFique ? CORM.verde : `rgba(${RGB.acento},.18)`,
                    border: `2px solid ${CORM.verde}`,
                    boxShadow: `0 0 ${f >= qFique ? 30 + 60 * (1 - pulso) : 14 + 10 * Math.sin(f / 5)}px rgba(${RGB.acento},.9)`,
                    transform: `scale(${1 + 0.18 * Math.sin(Math.PI * pulso)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTEM.titulo,
                    fontWeight: 800,
                    fontSize: 48,
                    color: f >= qFique ? CORM.fundo : CORM.verde,
                    opacity: pronto,
                  }}
                >
                  ↑
                </div>
              </>
            ) : null}
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      <HUD tl="MOTION / 005" tr={`REC  ${timecodeM(c.global)}`} bl="PROMPT · 1 LINHA" br={`PROGRAMAS ABERTOS · ${f >= chegadas[4] ? 0 : PROGRAMAS.filter((_, i) => f >= qPrograma + i * 2 && f < chegadas[i]).length}`} inicio={10} />
    </AbsoluteFill>
  );
};
