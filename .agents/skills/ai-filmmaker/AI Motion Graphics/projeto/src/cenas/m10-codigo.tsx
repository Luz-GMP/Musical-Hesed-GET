/* Cena 10 (31,84–35,96 s): "porque o Claude não gera o vídeo direto. Ele escreve a animação como
   código."
   Chega das faixas. Em cima, "porque o Claude não gera o vídeo direto." ("não" e "direto" em
   destaque). Embaixo, em "Claude" nasce um chip do modelo com um pulso; em "gera" uma seta
   tracejada sai dele rumo a um player de vídeo FANTASMA (contorno, play, barra 00:00/00:15) que
   aparece em "vídeo" e em "direto" fica em ruído ("vídeo.mp4 · 0 bytes"): não sai vídeo direto.
   Em "Ele" as LETRAS da frase se desmancham, da esquerda para a direita, em caracteres de código
   que chovem para baixo; o player vira (giro em Y) e o verso é um EDITOR de código que rola sem
   parar, com números de linha, sintaxe em verde e a linha atual acesa. "Ele escreve a animação como
   código." entra no lugar da frase; em "código" chaves { } se fecham em volta da palavra. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { BRILHO, clamp01, CORM, ease, type EstiloM, FONTEM, janelaM, lerp, mola, PALETA, RGB, TIPOM, trecho } from '../tema';
import { Camera, FundoM, HUD, Poeira, timecodeM } from '../visual';
import { idx, Onda } from './pecas';

const FRASE: EstiloM = { ...TIPOM.frase, tamanho: 100 };
const ED = { x: 400, y: 410, w: 1120, h: 560 };
const CHIP = { x: 120, y: 620 };

const CODIGO = [
  'export const Cena = () => {',
  '  const f = useCurrentFrame();',
  '  const y = spring({ frame: f, fps: 30 });',
  '  const blur = interpolate(f, [0, 8], [12, 0]);',
  '  return (',
  '    <Camera zoom={[1, 1.12]} deriva={10}>',
  '      <Texto x={960} y={540 - 80 * y}>',
  '        MOTION',
  '      </Texto>',
  '      <Circulo r={130} cor={PALETA.acento} />',
  '      <Particulas n={240} semente="m11" />',
  '    </Camera>',
  '  );',
  '};',
  '',
  'const easing = bezier(0.16, 1, 0.3, 1);',
  'const x = interpolate(f, [0, 20], [0, 1], { easing });',
  'const grade = { colunas: 12, passo: 40 };',
  'const paleta = [PALETA.fundo, PALETA.acento, "#F1F0E8"];',
  'export const Transicao = ({ q, k }) => {',
  '  const s = Math.pow(q / k, 2.1);',
  '  return <Tunel profundidade={7} s={s} />;',
  '};',
];

const LinhaCodigo: React.FC<{ texto: string; n: number; y: number; atual: boolean; visiveis: number }> = ({ texto, n, y, atual, visiveis }) => {
  const t = texto.slice(0, visiveis);
  // pinta: palavras-chave verde claro, strings papel, números verde, tags verde
  const partes: React.ReactNode[] = [];
  let resto = t;
  let k = 0;
  const re = /("[^"]*"?)|(\b\d+(?:\.\d+)?\b)|(<\/?[A-Za-z]+)|(\b(?:export|const|return)\b)/;
  while (resto.length) {
    const m = re.exec(resto);
    if (!m) {
      partes.push(<span key={k++}>{resto}</span>);
      break;
    }
    if (m.index > 0) partes.push(<span key={k++}>{resto.slice(0, m.index)}</span>);
    const cor = m[1] ? CORM.papel : m[2] ? CORM.verde : m[3] ? CORM.verdeClaro : '#B7F5CB';
    partes.push(
      <span key={k++} style={{ color: cor, fontWeight: m[4] ? 700 : 400 }}>
        {m[0]}
      </span>,
    );
    resto = resto.slice(m.index + m[0].length);
  }
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: ED.w, height: 44, background: atual ? `rgba(${RGB.acento},.12)` : undefined, borderLeft: atual ? `4px solid ${CORM.verde}` : '4px solid transparent' }}>
      <div style={{ position: 'absolute', left: 14, width: 54, textAlign: 'right', fontFamily: FONTEM.mono, fontSize: 28, lineHeight: '44px', color: atual ? CORM.verdeClaro : CORM.faint }}>{n}</div>
      <div style={{ position: 'absolute', left: 96, fontFamily: FONTEM.mono, fontSize: 30, lineHeight: '44px', color: CORM.dim, whiteSpace: 'pre' }}>{partes}</div>
    </div>
  );
};

export const M10: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fraseA = trecho(10, 0, 7);
  const fraseB = trecho(10, 8);
  const propsA = { palavras: fraseA, x: 960, y: 100, alinhar: 'centro' as const, largura: 1640, estilo: FRASE };
  const la = useLayoutFala(propsA);
  const propsB = { palavras: fraseB, x: 960, y: 100, alinhar: 'centro' as const, largura: 1640, estilo: FRASE, destaque: ['escreve', 'código'], pesoDestaque: 900, antecipa: 0 };
  const lb = useLayoutFala(propsB);
  const qClaude = c.local(fraseA[idx(10, 'claude')].s) - 2;
  const qGera = c.local(fraseA[idx(10, 'gera')].s) - 2;
  const qVideo = c.local(fraseA[idx(10, 'vídeo')].s) - 2;
  const qDireto = c.local(fraseA[idx(10, 'direto')].s) - 2;
  const qEle = c.local(fraseB[0].s) - 2;
  const iCod = fraseB.length - 1;
  const cod = lb.itens[iCod];

  // desmanche: começa ainda em "direto" (da esquerda para a direita, "direto" por último) e termina
  // até o "Ele" nascer, para a frase nova não aparecer por cima dos restos da antiga
  const qDes = qEle - 12;
  const xMin = Math.min(...la.itens.map((it) => it.x));
  const xMax = Math.max(...la.itens.map((it) => it.x + it.w));
  const atrasoX = (x: number) => ((x - xMin) / Math.max(1, xMax - xMin)) * 6;

  // player → editor
  const fantasma = Math.max(0.45 * mola(f, 'assenta', 4), mola(f, 'assenta', qVideo));
  const ruido = f >= qDireto ? 1 : 0;
  const vira = janelaM(f, qEle - 2, qEle + 10, 'corte');
  const rotY = vira * 180;
  const verso = rotY > 90;
  const tEd = f - (qEle + 4);
  const rola = Math.max(0, tEd) * 3.2;
  const tipados = Math.max(0, tEd) * 4.5; // caracteres digitados por quadro (somados)
  const seta = janelaM(f, qGera, qVideo + 4, 'sai');
  const chip = mola(f, 'estalo', qClaude);
  const chaves = mola(f, 'estalo', cod.q + 3);

  // linhas de código visíveis
  const linhas: React.ReactNode[] = [];
  const hL = 44;
  const primeira = Math.floor(rola / hL);
  for (let j = 0; j < 14; j++) {
    const n = primeira + j;
    const texto = CODIGO[n % CODIGO.length];
    const y = 70 + j * hL - (rola % hL);
    const inicioN = n * 26;
    const vis = Math.max(0, Math.min(texto.length, Math.floor(tipados - inicioN + 140)));
    if (y < 56 || y > ED.h - 40) continue;
    linhas.push(<LinhaCodigo key={n} texto={texto} n={n + 1} y={y} atual={j === 8} visiveis={vis} />);
  }

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 60]} deriva={0.5} semente="m10" />
      <Camera zoom={[1.0, 1.07]} janela={[0, c.seqDuracao]} origem={[960, 600]} deriva={9} giro={0.3}>
        <Poeira semente="m10" n={34} velocidade={1.2} />

        {/* frase A, que se desmancha letra a letra */}
        <Fala
          {...propsA}
          destaque={['não', 'direto']}
          corDestaque={CORM.verde}
          sai={{ em: qDes, stagger: 0.6, modo: 'foco' }}
        />
        {/* chuva de caracteres saindo das letras */}
        {la.itens.flatMap((it) =>
          it.letras.map((l, j) => {
            const x0 = it.x + l.x + l.w / 2;
            const y0 = it.base - FRASE.tamanho * 0.35;
            const q0 = qDes + atrasoX(x0);
            const tt = f - q0;
            if (tt < 0 || tt > 26) return null;
            return Array.from({ length: 2 }, (_, m) => {
              const r = (k: string) => random(`m10-ch-${k}-${it.i}-${j}-${m}`);
              // sai rápido da faixa do texto (a frase nova nasce ali) e assenta no editor
              const u = ease.sai(clamp01(tt / (18 + r('d') * 8)));
              const xa = lerp(x0, ED.x + 110 + r('x') * (ED.w - 200), u);
              const ya = lerp(y0, ED.y + 120 + r('y') * (ED.h - 180), u) + Math.sin(tt / 3 + r('o') * 6) * 6;
              const ch = '{}()<>=;:01/*xyf+'[Math.floor(r('c') * 17)];
              return (
                <div key={`${it.i}-${j}-${m}`} style={{ position: 'absolute', left: xa, top: ya, fontFamily: FONTEM.mono, fontWeight: 700, fontSize: lerp(46, 28, u), color: m === 0 ? CORM.verdeClaro : CORM.papel, opacity: 1 - u * 0.85, textShadow: BRILHO.verdeLeve }}>
                  {ch}
                </div>
              );
            });
          }),
        )}

        {/* chip do modelo e seta tracejada */}
        {f >= qClaude ? (
          <div style={{ position: 'absolute', left: CHIP.x, top: CHIP.y, padding: '14px 24px', borderRadius: 14, border: `2px solid ${CORM.verdeClaro}`, background: 'rgba(12,30,19,.9)', fontFamily: FONTEM.mono, fontSize: 30, color: CORM.papel, whiteSpace: 'pre', opacity: clamp01(chip * 2) * (1 - 0.6 * vira), transform: `scale(${0.7 + 0.3 * chip})`, boxShadow: `0 0 30px rgba(${RGB.acento},.35)` }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: CORM.verde, marginRight: 14, boxShadow: BRILHO.verde, opacity: 0.6 + 0.4 * Math.sin(f / 3) }} />
            claude
          </div>
        ) : null}
        <Onda f={f} q0={qClaude + 2} x={CHIP.x + 120} y={CHIP.y + 34} r0={20} r1={180} dur={14} />
        {seta > 0 && vira < 1 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 1 - vira }}>
            <line x1={CHIP.x + 260} y1={CHIP.y + 34} x2={lerp(CHIP.x + 260, ED.x - 20, seta)} y2={CHIP.y + 34} stroke={CORM.dim} strokeWidth={4} strokeDasharray="14 12" strokeDashoffset={-f * 2} />
            {seta > 0.95 ? <path d={`M${ED.x - 40} ${CHIP.y + 16} L${ED.x - 16} ${CHIP.y + 34} L${ED.x - 40} ${CHIP.y + 52}`} fill="none" stroke={CORM.dim} strokeWidth={4} /> : null}
          </svg>
        ) : null}

        {/* player fantasma → editor (vira em Y) */}
        {f >= 4 ? (
          <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: `${ED.x + ED.w / 2}px ${ED.y + ED.h / 2}px` }}>
            <div
              style={{
                position: 'absolute',
                left: ED.x,
                top: ED.y,
                width: ED.w,
                height: ED.h,
                transformOrigin: '50% 50%',
                transform: `rotateY(${verso ? rotY - 180 : rotY}deg) scale(${(0.85 + 0.15 * fantasma) * (1 + 0.05 * Math.sin(Math.PI * vira))})`,
                opacity: f >= qVideo ? clamp01(fantasma * 2) : fantasma,
              }}
            >
              {!verso ? (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: `3px dashed ${CORM.dim}`, background: 'rgba(8,16,11,.6)', overflow: 'hidden' }}>
                  {ruido ? (
                    <svg width={ED.w} height={ED.h} style={{ position: 'absolute', inset: 0, opacity: 0.55 }}>
                      {Array.from({ length: 90 }, (_, i) => {
                        const r = (k: string) => random(`m10-rz-${k}-${i}-${Math.floor(f / 2)}`);
                        return <rect key={i} x={r('x') * ED.w} y={r('y') * ED.h} width={6 + r('w') * 90} height={3 + r('h') * 6} fill={r('c') < 0.5 ? '#9AA59F' : '#3B4540'} />;
                      })}
                    </svg>
                  ) : null}
                  <div style={{ position: 'absolute', left: ED.w / 2 - 70, top: ED.h / 2 - 90, width: 140, height: 140, borderRadius: 70, border: `4px solid ${CORM.dim}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={60} height={60}>
                      <polygon points="14,6 54,30 14,54" fill={CORM.dim} />
                    </svg>
                  </div>
                  <div style={{ position: 'absolute', left: 40, right: 40, bottom: 70, height: 6, borderRadius: 3, background: 'rgba(169,184,174,.3)' }} />
                  <div style={{ position: 'absolute', left: 40, bottom: 20, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.dim, whiteSpace: 'pre' }}>{ruido ? 'vídeo.mp4 · 0 bytes' : '00:00 / 00:15'}</div>
                </div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: `2px solid ${CORM.verdeClaro}`, background: 'linear-gradient(180deg, rgba(14,34,22,.97), rgba(4,12,8,.98))', overflow: 'hidden', boxShadow: `0 0 60px rgba(${RGB.acento},.35), 0 40px 100px rgba(0,0,0,.7)` }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: ED.w, height: 56, background: `rgba(${RGB.acento},.08)`, borderBottom: `2px solid ${CORM.linha}` }} />
                  <div style={{ position: 'absolute', left: 24, top: 10, padding: '2px 16px', borderRadius: 8, background: `rgba(${RGB.acento},.18)`, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre' }}>cena-11.tsx</div>
                  <div style={{ position: 'absolute', right: 24, top: 12, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.faint, whiteSpace: 'pre' }}>{`LN ${primeira + 9}`}</div>
                  {linhas}
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(180deg, rgba(4,12,8,0), rgba(4,12,8,1))' }} />
                </div>
              )}
            </div>
          </AbsoluteFill>
        ) : null}

        {/* frase B (antecipa 0: nasce 2 quadros depois do padrão, com a frase A já fora) */}
        <Fala {...propsB} />
        {f >= cod.q + 3 ? (
          <>
            {[-1, 1].map((lado) => (
              <div
                key={lado}
                style={{
                  position: 'absolute',
                  left: lado < 0 ? cod.x - 70 - (1 - chaves) * 120 : cod.x + cod.w + 10 + (1 - chaves) * 120,
                  top: cod.y - 6,
                  height: cod.h,
                  lineHeight: `${cod.h}px`,
                  fontFamily: FONTEM.mono,
                  fontWeight: 700,
                  fontSize: 104,
                  color: CORM.verdeClaro,
                  textShadow: BRILHO.verde,
                  opacity: clamp01(chaves * 2),
                }}
              >
                {lado < 0 ? '{' : '}'}
              </div>
            ))}
          </>
        ) : null}
      </Camera>
      <HUD tl="MOTION / 010" tr={`REC  ${timecodeM(c.global)}`} bl={verso ? 'SAÍDA · CÓDIGO' : 'SAÍDA · VÍDEO?'} br={verso ? `LINHAS · ${String(primeira + 9).padStart(3, '0')}` : 'RENDER · —'} inicio={10} />
    </AbsoluteFill>
  );
};
