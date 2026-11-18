/* Cena 3 (4,84–6,26 s): "E não, não é plugin. [risada]"
   Desde o 1º quadro, uma zona tracejada "SOLTE O PLUGIN AQUI · .AEX" (marcha de formigas, cantos
   respirando, + pulsando) espera no chão; ela explode no impacto. "E não, não é" sobe no alto. "plugin" (Inter 900, 330 px) cai de cima com gravidade no instante
   em que é dito, bate no chão (amassa 0,78 / estica 1,15), quica duas vezes com poeira e tranco de
   câmera; quando a palavra termina, um risco vermelho a corta da esquerda para a direita, ela
   apaga para cinza e treme com a risada. Sai com flash de um quadro. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { C03 } from '../layout';
import { baseDaLinha, larguraTexto, metricas } from '../medir';
import { BRILHO, clamp01, CORM, ease, falaDaCena, FONTEM, janelaM, mola, RGB, TIPOM } from '../tema';
import { Camera, FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';

const QUEDA = 6;

export const M03: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = falaDaCena(3);
  const iPlugin = fala.findIndex((p) => p.t.startsWith('plugin'));
  const pal = fala[iPlugin];
  const q0 = c.local(pal.s) - 2; // começa a cair 2 q antes: no quadro dito já está na tela, caindo
  const qFim = c.local(pal.e);
  const est = C03.estilo;
  const w = larguraTexto(C03.palavra, est);
  const h = est.tamanho * est.entrelinha;
  const base = baseDaLinha(C03.yTopo, est);
  const chao = base + 18;
  const t = f - q0;

  // queda com gravidade até o chão, depois dois quiques amortecidos
  let dy = 0;
  let sy = 1;
  let sx = 1;
  if (t < QUEDA) {
    const k = clamp01(t / QUEDA);
    dy = -760 * (1 - k * k);
    sy = 1 + 0.12 * k; // estica na queda
    sx = 1 - 0.05 * k;
  } else {
    const tb = t - QUEDA;
    const quique = (a: number, ini: number, dur: number) => (tb >= ini && tb < ini + dur ? -a * Math.sin((Math.PI * (tb - ini)) / dur) : 0);
    dy = quique(110, 0, 8) + quique(32, 8, 5);
    const amassa = (ini: number, forca: number) => {
      const d = tb - ini;
      return d >= 0 && d < 4 ? forca * (1 - d / 4) : 0;
    };
    const a = amassa(0, 0.22) + amassa(8, 0.1) + amassa(13, 0.05);
    sy = 1 - a;
    sx = 1 + a * 0.7;
  }
  const visivel = t >= 0;
  const impacto = (ini: number) => {
    const d = t - QUEDA - ini;
    return d >= 0 && d < 7 ? (random(`m03-sh-${ini}-${f}`) - 0.5) * 26 * (1 - d / 7) : 0;
  };
  const tremor = impacto(0) + impacto(8) * 0.4;
  const risco = janelaM(f, qFim, qFim + 4, 'corte');
  const morto = janelaM(f, qFim + 2, qFim + 8);
  const ri = f - qFim - 4;
  const riso = ri > 0 ? Math.sin(ri * 1.9) * 2.2 * Math.max(0, 1 - ri / 14) : 0;
  const m = metricas(est);
  // zona de "solte o plugin aqui": viva desde o 1º quadro, explode no impacto
  const Z = { x: C03.cx - 640, y: C03.yTopo - 40, w: 1280, h: h + 80 };
  const zEntra = mola(f, 'assenta', 0);
  const zQuebra = t >= QUEDA ? janelaM(t, QUEDA, QUEDA + 10, 'sai') : 0;
  const respira = 1 + 0.015 * Math.sin(f / 5);
  const mais = 1 - janelaM(f, q0 - 4, q0 + 2, 'entra');
  const x0 = C03.cx - w / 2;
  const yRisco = base - m.cap * 0.45;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 60]} />
      <GradeChao horizonte={chao} opacidade={0.7} velocidade={1.5} />
      <Poeira semente="m03" />
      <Camera zoom={[1.06, 1]} janela={[0, 50]} origem={[960, 560]} deriva={5} extra={`translate(${tremor}px, ${tremor * 0.6}px)`}>
        <Fala palavras={fala.slice(0, iPlugin)} x={C03.apoio.x} y={C03.apoio.y} alinhar="centro" estilo={{ ...TIPOM.apoio, tamanho: 110, peso: 800 }} cor={CORM.papel} />
        {zQuebra < 1 ? (
          <AbsoluteFill style={{ perspective: 1600 }}>
            <AbsoluteFill
              style={{
                transformOrigin: `${C03.cx}px ${Z.y + Z.h / 2}px`,
                transform: `rotateX(${(1 - zEntra) * 40 + 8}deg) scale(${(0.8 + 0.2 * zEntra) * respira * (1 + 0.3 * zQuebra)})`,
                opacity: zEntra * (1 - zQuebra),
              }}
            >
              <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                <rect x={Z.x} y={Z.y} width={Z.w} height={Z.h} rx={36} fill={`rgba(${RGB.acento},.06)`} stroke={CORM.verdeClaro} strokeWidth={4} strokeDasharray="26 16" strokeDashoffset={-f * 4} />
                {[
                  [Z.x, Z.y, 1, 1],
                  [Z.x + Z.w, Z.y, -1, 1],
                  [Z.x, Z.y + Z.h, 1, -1],
                  [Z.x + Z.w, Z.y + Z.h, -1, -1],
                ].map(([x, y, sx2, sy2], i) => (
                  <path key={i} d={`M${x} ${y + sy2 * 70} L${x} ${y} L${x + sx2 * 70} ${y}`} fill="none" stroke="#E8FFF0" strokeWidth={6} transform={`translate(${-sx2 * 14 * (1 + Math.sin(f / 4)) * 0.5} ${-sy2 * 14 * (1 + Math.sin(f / 4)) * 0.5})`} />
                ))}
              </svg>
              {mais > 0 ? (
                <>
                  <div style={{ position: 'absolute', left: C03.cx - 60, top: Z.y + Z.h / 2 - 100, width: 120, height: 120, borderRadius: 60, border: `4px solid ${CORM.verde}`, boxShadow: BRILHO.verdeLeve, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 300, fontSize: 96, color: CORM.verde, transform: `scale(${(1 + 0.08 * Math.sin(f / 3)) * mais})`, opacity: mais }}>+</div>
                  <div style={{ position: 'absolute', left: 0, width: 1920, top: Z.y + Z.h / 2 + 46, textAlign: 'center', fontFamily: FONTEM.mono, fontSize: 32, letterSpacing: '0.1em', color: CORM.papel, opacity: mais }}>
                    {'SOLTE O PLUGIN AQUI  ·  .AEX'.slice(0, Math.ceil(28 * clamp01(f / 12)))}
                  </div>
                </>
              ) : null}
            </AbsoluteFill>
          </AbsoluteFill>
        ) : null}
        {/* chão aceso no impacto */}
        <div
          style={{
            position: 'absolute',
            left: 260,
            top: chao,
            width: 1400,
            height: 3,
            background: `linear-gradient(90deg, rgba(${RGB.acento},0), rgba(${RGB.claro},.9), rgba(${RGB.acento},0))`,
            opacity: 0.35 + 0.65 * (t >= QUEDA ? 1 - janelaM(t, QUEDA, QUEDA + 10) : 0),
            boxShadow: `0 0 24px rgba(${RGB.acento},.7)`,
          }}
        />
        {visivel ? (
          <div
            style={{
              position: 'absolute',
              left: x0,
              top: C03.yTopo,
              height: h,
              lineHeight: `${h}px`,
              fontFamily: est.familia,
              fontWeight: est.peso,
              fontSize: est.tamanho,
              letterSpacing: `${est.tracking}em`,
              whiteSpace: 'pre',
              color: morto > 0 ? `rgb(${255 - 120 * morto},${255 - 115 * morto},${255 - 118 * morto})` : CORM.branco,
              textShadow: morto < 1 ? BRILHO.branco : undefined,
              transformOrigin: `50% ${base - C03.yTopo}px`,
              transform: `translateY(${dy}px) scale(${sx}, ${sy}) rotate(${riso}deg)`,
              filter: t < QUEDA ? `blur(${(1 - t / QUEDA) * 6}px)` : undefined,
            }}
          >
            {C03.palavra}
          </div>
        ) : null}
        {/* poeira do impacto */}
        {t >= QUEDA
          ? Array.from({ length: 34 }, (_, i) => {
              const r = (k: string) => random(`m03-p-${k}-${i}`);
              const d = t - QUEDA;
              const vida = 14 + r('v') * 8;
              if (d > vida) return null;
              const lado = r('l') < 0.5 ? -1 : 1;
              const px = C03.cx + lado * (w * 0.2 + r('x') * w * 0.35) + lado * ease.sai(d / vida) * (80 + r('d') * 220);
              const py = chao - ease.sai(d / vida) * (20 + r('h') * 90) + (d / vida) ** 2 * 40;
              const tam = 3 + r('s') * 6;
              return (
                <div
                  key={i}
                  style={{ position: 'absolute', left: px, top: py, width: tam, height: tam, borderRadius: '50%', background: r('c') < 0.6 ? CORM.verdeClaro : '#fff', opacity: 1 - d / vida, boxShadow: `0 0 8px rgba(${RGB.acento},.8)` }}
                />
              );
            })
          : null}
        {/* risco vermelho */}
        {risco > 0 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <line x1={x0 - 40} y1={yRisco + 10} x2={x0 - 40 + (w + 80) * risco} y2={yRisco - 10 * risco} stroke={`rgba(${RGB.alerta},.35)`} strokeWidth={34} strokeLinecap="round" />
            <line x1={x0 - 40} y1={yRisco + 10} x2={x0 - 40 + (w + 80) * risco} y2={yRisco - 10 * risco} stroke={CORM.vermelho} strokeWidth={14} strokeLinecap="round" />
          </svg>
        ) : null}
      </Camera>
      <HUD tl="MOTION / 003" tr={`REC  ${timecodeM(c.global)}`} bl="GRAVIDADE · 9,8" br="PLUGINS · 0" />
    </AbsoluteFill>
  );
};
