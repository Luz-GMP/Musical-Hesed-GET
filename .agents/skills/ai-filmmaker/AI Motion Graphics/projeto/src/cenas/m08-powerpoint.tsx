/* Cena 8 (21,26–25,14 s): "Se você só pedir, sai isso: [risada] um PowerPoint de 2009."
   "Se você só pedir," entra em cima e, ao lado, um pedido genérico é digitado num campo pobre
   ("faz um vídeo legal") e enviado. Em "sai isso:" o slide chega com a transição GIRAR do PowerPoint
   (duas voltas em Y, rastros), e é ridículo de propósito: degradê arco-íris, borda chanfrada prata,
   título em WordArt (Comic Sans, amarelo, contorno azul-marinho, extrusão, em arco), sol de clip-art
   sorridente girando, estrela "NOVO!!!", marcadores com setinha, "Clique para adicionar texto",
   brilhinhos piscando e o cursor de seta do Windows. Na RISADA tudo balança: o título treme, os
   marcadores voam da esquerda, a estrela pulsa, a câmera inclina. "um PowerPoint de 2009." embaixo
   ("PowerPoint" em arco-íris WordArt) e, em "2009", um CARIMBO vermelho bate no canto do slide com
   tranco de câmera. Sai em glitch RGB que conserta o slide (cena 9). */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { BRILHO, clamp01, CORM, ease, type EstiloM, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { larguraTexto, posicoesLetras } from '../medir';
import { FundoM, HUD, Poeira, timecodeM } from '../visual';
import { Fagulhas, idx, Onda } from './pecas';

const COMIC = '"Comic Sans MS", "Comic Sans", cursive';
const S = { x: 470, y: 268, w: 980, h: 552 };
const TITULO = 'Meu Vídeo Incrível!!!';
const ESTILO_TITULO: EstiloM = { tamanho: 72, peso: 700, tracking: 0, familia: 'Comic Sans MS', entrelinha: 1 };
const ARCO_IRIS = 'linear-gradient(90deg, #FF2A2A, #FF9A00, #FFE600, #22D84A, #1E7BFF, #9B30FF)';

const Brilhinho: React.FC<{ x: number; y: number; t: number; tam?: number }> = ({ x, y, t, tam = 40 }) => {
  const s = 0.4 + 0.6 * Math.abs(Math.sin(t / 4));
  return (
    <svg width={tam * 2} height={tam * 2} style={{ position: 'absolute', left: x - tam, top: y - tam, transform: `scale(${s}) rotate(${t * 4}deg)` }}>
      <path d={`M${tam} 0 Q${tam} ${tam} ${tam * 2} ${tam} Q${tam} ${tam} ${tam} ${tam * 2} Q${tam} ${tam} 0 ${tam} Q${tam} ${tam} ${tam} 0Z`} fill="#FFF7A0" stroke="#FFD000" strokeWidth={2} />
    </svg>
  );
};

const Slide: React.FC<{ t: number; risada: number; tRisada: number }> = ({ t, risada, tRisada }) => {
  const letrasTitulo = posicoesLetras(TITULO, ESTILO_TITULO);
  const larguraTitulo = larguraTexto(TITULO, ESTILO_TITULO);
  const treme = risada * Math.sin(tRisada * 1.9) * 5;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: S.w, height: S.h, background: 'linear-gradient(135deg, #FF3B3B 0%, #FF9A00 18%, #FFE600 34%, #33D45A 52%, #1E7BFF 70%, #8F2DE2 88%, #FF4FD8 100%)', border: '10px ridge #C9C9C9', boxSizing: 'border-box', overflow: 'hidden', boxShadow: '14px 14px 0 #000, 0 0 60px rgba(0,0,0,.6)' }}>
      {/* brilho "vidro" de 2009 */}
      <div style={{ position: 'absolute', left: -100, top: -260, width: S.w + 200, height: 420, borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.08))' }} />
      {/* sol de clip-art */}
      <svg width={190} height={190} style={{ position: 'absolute', left: 6, top: 6, transform: `scale(.8) rotate(${t * 6}deg)` }}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <polygon key={i} points={`${95 + Math.cos(a - 0.12) * 52},${95 + Math.sin(a - 0.12) * 52} ${95 + Math.cos(a) * 92},${95 + Math.sin(a) * 92} ${95 + Math.cos(a + 0.12) * 52},${95 + Math.sin(a + 0.12) * 52}`} fill="#FFB800" stroke="#B35A00" strokeWidth={2} />;
        })}
        <circle cx={95} cy={95} r={54} fill="#FFE600" stroke="#B35A00" strokeWidth={3} />
      </svg>
      <svg width={190} height={190} style={{ position: 'absolute', left: 6, top: 6, transform: 'scale(.8)' }}>
        <circle cx={76} cy={84} r={7} fill="#222" />
        <circle cx={114} cy={84} r={7} fill="#222" />
        <path d="M70 108 Q95 132 120 108" stroke="#222" strokeWidth={5} fill="none" strokeLinecap="round" />
      </svg>
      {/* título em WordArt, em arco */}
      <div style={{ position: 'absolute', left: 0, top: 70, width: S.w, height: 160, transform: `rotate(${treme}deg)` }}>
        {letrasTitulo.map(({ ch, x: lx, w: lw }, i) => {
          const cxl = lx + lw / 2 - larguraTitulo / 2;
          const u = cxl / larguraTitulo;
          const x = S.w / 2 + 40 + cxl;
          const y = 120 - Math.cos(u * Math.PI * 0.9) * 52;
          const pula = risada * Math.sin(tRisada * 1.4 + i * 0.7) * 14;
          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: x - 40,
                top: y - 90 + pula,
                width: 80,
                textAlign: 'center',
                fontFamily: COMIC,
                fontWeight: 700,
                fontSize: ESTILO_TITULO.tamanho,
                color: '#FFE600',
                WebkitTextStroke: '3px #0A1F8F',
                textShadow: '2px 2px 0 #0A1F8F, 4px 4px 0 #0A1F8F, 6px 6px 0 #0A1F8F, 8px 8px 0 #0A1F8F, 10px 10px 0 #061266, 14px 16px 10px rgba(0,0,0,.6)',
                transform: `rotate(${u * 34}deg)`,
                display: 'inline-block',
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      {/* estrela NOVO!!! */}
      <div style={{ position: 'absolute', left: S.w - 250, top: 236, width: 220, height: 220, transform: `rotate(${-14 + Math.sin(t / 3) * 6}deg) scale(${1 + 0.12 * Math.abs(Math.sin(t / 2.5)) + 0.15 * risada})` }}>
        <svg width={220} height={220} style={{ position: 'absolute', inset: 0 }}>
          <polygon
            points={Array.from({ length: 28 }, (_, i) => {
              const a = (i / 28) * Math.PI * 2;
              const r = i % 2 === 0 ? 108 : 74;
              return `${110 + Math.cos(a) * r},${110 + Math.sin(a) * r}`;
            }).join(' ')}
            fill="#FF2A2A"
            stroke="#FFE600"
            strokeWidth={5}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: COMIC, fontWeight: 700, fontSize: 46, color: '#FFE600', WebkitTextStroke: '1.5px #6B0000', transform: 'rotate(8deg)' }}>NOVO!!!</div>
      </div>
      {/* marcadores que voam da esquerda */}
      {['Muito profissional', 'Animação top', 'Efeitos incríveis'].map((m, i) => {
        const v = ease.sai(clamp01((tRisada - i * 3) / 8));
        const qv = v;
        return (
          <div key={m} style={{ position: 'absolute', left: 90 + lerp(-700, 0, qv), top: 262 + i * 66, fontFamily: '"Times New Roman", serif', fontWeight: 700, fontSize: 46, color: '#0A1F8F', whiteSpace: 'pre', textShadow: '2px 2px 0 #fff' }}>
            {'➤ '}
            <span style={{ textDecoration: 'underline', textDecorationColor: '#FF2A2A' }}>{m}</span>
          </div>
        );
      })}
      {/* caixa de placeholder */}
      <div style={{ position: 'absolute', left: 90, top: 470, width: 520, height: 52, border: '3px dashed #333', fontFamily: '"Arial", sans-serif', fontSize: 30, color: '#333', display: 'flex', alignItems: 'center', paddingLeft: 14, boxSizing: 'border-box', background: 'rgba(255,255,255,.35)' }}>
        Clique para adicionar texto
      </div>
      <div style={{ position: 'absolute', right: 24, bottom: 14, fontFamily: COMIC, fontSize: 28, color: '#fff', textShadow: '2px 2px 0 #000' }}>Slide 1 de 47</div>
      <Brilhinho x={330} y={60} t={t} />
      <Brilhinho x={820} y={50} t={t + 9} tam={30} />
      <Brilhinho x={700} y={480} t={t + 4} tam={34} />
    </div>
  );
};

export const M08: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(8, 0, 5); // Se você só pedir, sai isso:
  const fim = trecho(8, 6); // um PowerPoint de 2009.
  const propsFim = { palavras: fim, x: 960, y: 858, alinhar: 'centro' as const, estilo: { ...TIPOM.frase, tamanho: 104 } };
  const pp = useLayoutFala(propsFim).itens[1];
  const qPedir = c.local(fala[2].s) - 2; // começa a digitar em "só"
  const qSai = c.local(fala[4].s) - 2;
  const qIsso = c.local(fala[5].s);
  const qRisada = c.local(fala[5].e) + 1;
  const qUm = c.local(fim[0].s) - 2;
  const q2009 = c.local(trecho(8, idx(8, '2009'))[0].s) - 2;

  // pedido genérico digitado e enviado
  const pedido = 'faz um vídeo legal';
  const nPed = Math.max(0, Math.min(pedido.length, Math.floor((f - qPedir) * 1.3)));
  const enviado = f >= qPedir + 16;
  const campo = mola(f, 'estalo', 6);
  const sobe = janelaM(f, qSai - 4, qSai + 4, 'entra');

  // slide: transição "girar" (duas voltas em Y) e risada
  const g = janelaM(f, qSai + 2, qSai + 22, 'sai');
  const rotY = (1 - g) * 720;
  const esc = lerp(0.12, 1, ease.sai(clamp01((f - qSai - 2) / 16))) * (1 + 0.06 * Math.sin(Math.PI * clamp01((f - qSai - 18) / 8)));
  const risada = janelaM(f, qRisada, qRisada + 4) * (1 - janelaM(f, qUm + 6, qUm + 14));
  const tRisada = Math.max(0, f - qRisada);
  const carimbo = mola(f, 'quica', q2009);
  const tranco = f >= q2009 + 2 && f < q2009 + 10 ? (random(`m08-sh-${f}`) - 0.5) * 26 * (1 - (f - q2009 - 2) / 8) : 0;
  const tranco2 = f >= q2009 + 2 && f < q2009 + 10 ? (random(`m08-sh2-${f}`) - 0.5) * 18 * (1 - (f - q2009 - 2) / 8) : 0;
  const inclina = risada * Math.sin(tRisada / 2.2) * 2.2 + Math.sin(f / 30) * 0.6;
  const z = 1.02 + 0.07 * ease.suave(clamp01(f / c.seqDuracao));
  const fantasmas = g > 0 && g < 0.85 ? [0.18, 0.1] : [];

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 55]} semente="m08" deriva={0.5} />
      <Poeira semente="m08" n={30} />
      <AbsoluteFill style={{ transformOrigin: '960px 560px', transform: `translate(${tranco}px, ${tranco2}px) scale(${z}) rotate(${inclina}deg)` }}>
        <Fala palavras={fala} x={960} y={74} alinhar="centro" estilo={{ ...TIPOM.apoio, tamanho: 84 }} destaque={['isso']} cor={CORM.papel} />
        {/* campo pobre com o pedido genérico */}
        {f >= 6 && sobe < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 510,
              top: 360,
              width: 900,
              height: 110,
              borderRadius: 55,
              border: `2px solid ${CORM.linhaForte}`,
              background: 'rgba(10,28,17,.9)',
              fontFamily: FONTEM.mono,
              fontSize: 48,
              lineHeight: '106px',
              paddingLeft: 48,
              boxSizing: 'border-box',
              color: CORM.dim,
              whiteSpace: 'pre',
              opacity: clamp01(campo * 2) * (1 - sobe),
              transform: `translateY(${(1 - campo) * 30 - sobe * 160}px) scale(${1 - 0.5 * sobe})`,
            }}
          >
            {nPed === 0 ? <span style={{ color: CORM.faint }}>descreva o vídeo</span> : pedido.slice(0, nPed)}
            {!enviado && Math.floor(f / 4) % 2 === 0 ? <span style={{ color: CORM.verde }}>▍</span> : null}
            <div style={{ position: 'absolute', right: 14, top: 14, width: 78, height: 78, borderRadius: 39, background: enviado ? CORM.verde : `rgba(${RGB.acento},.15)`, color: enviado ? CORM.fundo : CORM.verde, textAlign: 'center', lineHeight: '78px', fontSize: 44, fontWeight: 700, boxShadow: enviado ? `0 0 30px rgba(${RGB.acento},.9)` : undefined }}>↑</div>
          </div>
        ) : null}

        <Onda f={f} q0={qPedir + 16} x={1356} y={415} r0={30} r1={260} dur={14} />
        <Fagulhas f={f} q0={qPedir + 16} x={1356} y={415} semente="m08-env" raio={240} n={16} />
        {f >= 6 && f < qSai + 2
          ? Array.from({ length: 24 }, (_, i) => {
              const r = (k: string) => random(`m08-fl-${k}-${i}`);
              const per = 30 + r('p') * 20;
              const t = ((f + r('o') * per) % per) / per;
              const x = lerp(200 + r('x') * 1520, 960, ease.entra(t) * 0.3);
              const y = 700 + r('y') * 260 - t * 220;
              return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 4, height: 4, borderRadius: 2, background: CORM.verdeClaro, opacity: 0.6 * Math.sin(Math.PI * t), boxShadow: `0 0 8px rgba(${RGB.acento},.9)` }} />;
            })
          : null}
        {/* slide */}
        {f >= qSai + 2 ? (
          <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: `${S.x + S.w / 2}px ${S.y + S.h / 2}px` }}>
            {fantasmas.map((op, i) => (
              <div key={i} style={{ position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h, opacity: op, transformOrigin: '50% 50%', transform: `rotateY(${rotY + (i + 1) * 40}deg) scale(${esc})` }}>
                <Slide t={f} risada={risada} tRisada={tRisada} />
              </div>
            ))}
            <div style={{ position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h, transformOrigin: '50% 50%', transform: `rotateY(${rotY}deg) scale(${esc}) rotate(${risada * Math.sin(tRisada / 1.6) * 1.5}deg)` }}>
              <Slide t={f} risada={risada} tRisada={tRisada} />
            </div>
          </AbsoluteFill>
        ) : null}

        {/* cursor de seta clicando à toa */}
        {f >= qIsso + 4 ? (
          <svg
            width={44}
            height={64}
            style={{
              position: 'absolute',
              left: lerp(1500, 1180, ease.sai(clamp01((f - qIsso - 4) / 12))) + risada * Math.sin(tRisada / 1.3) * 40,
              top: lerp(900, 640, ease.sai(clamp01((f - qIsso - 4) / 12))) + risada * Math.cos(tRisada / 1.7) * 26,
              transform: `scale(${Math.floor(f / 5) % 3 === 0 && risada > 0 ? 0.85 : 1})`,
            }}
          >
            <path d="M2 2 L2 50 L14 38 L22 58 L30 54 L22 35 L38 35 Z" fill="#fff" stroke="#000" strokeWidth={3} strokeLinejoin="round" />
          </svg>
        ) : null}

        {/* carimbo 2009 */}
        {f >= q2009 ? (
          <div
            style={{
              position: 'absolute',
              left: S.x + S.w - 330,
              top: S.y - 70,
              padding: '4px 30px',
              border: `9px solid ${CORM.vermelho}`,
              borderRadius: 16,
              fontFamily: FONTEM.mono,
              fontWeight: 700,
              fontSize: 120,
              lineHeight: '130px',
              color: CORM.vermelho,
              textShadow: BRILHO.vermelho,
              boxShadow: `${BRILHO.vermelho}, inset 0 0 20px rgba(${RGB.alerta},.4)`,
              background: 'rgba(30,0,0,.35)',
              opacity: clamp01(carimbo * 3),
              transform: `rotate(-12deg) scale(${lerp(2.6, 1, carimbo)})`,
            }}
          >
            2009
          </div>
        ) : null}

        <Fala {...propsFim} modo="slam" ocultar={[1]} />
        {f >= pp.q ? (
          <div
            style={{
              position: 'absolute',
              left: pp.x,
              top: pp.y,
              height: pp.h,
              lineHeight: `${pp.h}px`,
              fontFamily: pp.estilo.familia,
              fontWeight: pp.estilo.peso,
              fontSize: pp.estilo.tamanho,
              letterSpacing: `${pp.estilo.tracking}em`,
              whiteSpace: 'pre',
              opacity: clamp01((f - pp.q) / 2),
              transformOrigin: '50% 70%',
              transform: `scale(${1 + (1 - mola(f, 'estalo', pp.q)) * 1.2}) rotate(${risada * Math.sin(tRisada / 1.4) * 3 + Math.sin(f / 6) * 1.5}deg)`,
              filter: `drop-shadow(4px 4px 0 #0A1F8F) drop-shadow(8px 8px 0 #061266) drop-shadow(0 0 24px rgba(255,230,0,.45))${f - pp.q < 4 ? ` blur(${((1 - (f - pp.q) / 4) * 14).toFixed(1)}px)` : ''}`,
            }}
          >
            <span style={{ backgroundImage: ARCO_IRIS, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextStroke: '2px #FFFFFF' }}>{pp.texto}</span>
          </div>
        ) : null}
      </AbsoluteFill>
      <HUD tl="MOTION / 008" tr={`REC  ${timecodeM(c.global)}`} bl="SEM REFERÊNCIA" br={f >= c.saidaInicio - 8 ? 'CORRIGINDO ▮▮▮' : 'ESTILO · 2009'} inicio={10} />
    </AbsoluteFill>
  );
};
