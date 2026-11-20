/* Cena 19 (74,24 s–fim): "Comenta MOTION que eu te mando a skill."  O CTA.
   Chega com a tela inteira verde (o flood da 18). "Comenta" nasce em tinta escura sobre o verde;
   o verde se recolhe para a direita e vira a borda de luz de uma caixa de comentários recriada
   (estilo Instagram, sem logo: alça, "Comentários", três comentários em esqueleto, campo
   "Adicione um comentário…" e "Publicar"). Enquanto a narração diz "motion", o cursor DIGITA
   M-O-T-I-O-N no campo e o "MOTION" gigante da esquerda acende junto.
   "que"    Publicar é apertado: o comentário sobe para o topo da lista (os outros descem).
   "mando"  o MOTION do comentário esquenta até o branco e EXPLODE: clarão, três anéis de choque,
            fagulhas com rastro, estrela anamórfica; a caixa é soprada para trás.
   "skill"  dentro do clarão aparece o símbolo da skill, incandescente.
   FIM      tudo se recolhe num ponto de luz que viaja até onde a faísca da cena 1 começa a
            escrever "E se eu te dissesse": o último quadro é o primeiro quadro do filme (fundo da
            cena 1, grade fraca, faísca, filete de luz e o "E"), para rodar em loop. */
import React from 'react';
import { AbsoluteFill, Freeze, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { C01 } from '../layout';
import { BRILHO, clamp01, CORM, ease, falaDaCena, FONTEM, janelaM, lerp, mola, PALETA, RGB, TIPOM, trecho } from '../tema';
import { Faisca, Flare, FundoM, HUD, LinhaLuz, Poeira, timecodeM } from '../visual';
import { SimboloSkill } from './simbolo-skill';

const P = { x: 1050, y: 120, w: 720, h: 840, r: 44 };
const VERDE_FUNDO = PALETA.acento;

export const M19: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const total = c.seqDuracao;
  const ult = total - 1;
  const fala = trecho(19, 0);
  const l1 = fala.slice(0, 2);
  const l2 = fala.slice(2);
  const qComenta = c.local(fala[0].s) - 2;
  const qMotion = c.local(fala[1].s) - 2;
  const qMotionFim = c.local(fala[1].e);
  const qQue = c.local(fala[2].s) - 2;
  const qMando = c.local(fala[5].s) - 2;
  const qSkill = c.local(fala[7].s) - 2;
  const qSkillFim = c.local(fala[7].e);

  // ---- a primeira faísca da cena 1 (o loop termina nela) ----
  const l01 = useLayoutFala({ palavras: falaDaCena(1).slice(0, 5), x: C01.frase.x, y: C01.frase.y, alinhar: 'centro', estilo: C01.frase.estilo, largura: 1800 });
  const E0 = l01.itens[0];
  const yLinha01 = E0.base + 30;
  const faisca01: [number, number] = [E0.x + E0.w * (2 / 3), yLinha01 - 6];

  // ---- verde que recolhe ----
  const recolhe = ease.corte(clamp01((f - (qComenta + 1)) / 10));
  const verdeRet = {
    x: lerp(-40, P.x, recolhe),
    y: lerp(-40, P.y, recolhe),
    w: lerp(2000, P.w, recolhe),
    h: lerp(1160, P.h, recolhe),
    r: lerp(0, P.r, recolhe),
  };
  const verdeOp = 1 - janelaM(f, qComenta + 6, qComenta + 12);

  // ---- digitação ----
  const palavra = 'MOTION';
  const nLetras = f < qMotion ? 0 : Math.min(6, 1 + Math.floor(((f - qMotion) / Math.max(6, qMotionFim - qMotion - 1)) * 6));
  const enviou = f >= qQue;
  const aperta = enviou ? 1 - janelaM(f, qQue, qQue + 8) : 0;
  const sobe = enviou ? mola(f, 'assenta', qQue + 2) : 0;

  // ---- explosão ----
  const aquece = janelaM(f, qMando - 2, qMando + 3);
  const qBum = qMando + 3;
  const bum = f >= qBum ? ease.sai(clamp01((f - qBum) / 16)) : 0;
  const clarao = f >= qBum ? 1 - janelaM(f, qBum, qBum + 20) : 0;
  const sopro = f >= qBum ? mola(f, 'assenta', qBum) : 0;

  // posição do comentário postado (topo da lista)
  const yInput = P.y + P.h - 110;
  const yTopo = P.y + 150;
  const yComent = lerp(yInput, yTopo, clamp01(sobe));
  const centroBum: [number, number] = [P.x + 300, yTopo + 58];

  // ---- recolhe tudo num ponto e viaja até a faísca da cena 1 ----
  const qJunta = Math.max(qSkillFim + 1, ult - 22);
  const junta = ease.entra(clamp01((f - qJunta) / 8));
  const qViaja = qJunta + 8;
  const viaja = ease.corte(clamp01((f - qViaja) / Math.max(4, ult - 3 - qViaja)));
  const fimLoop = janelaM(f, qJunta, ult - 2, 'suave');
  const pontoX = lerp(centroBum[0], faisca01[0], viaja);
  const pontoY = lerp(centroBum[1], faisca01[1], viaja) - Math.sin(Math.PI * viaja) * 160;
  const rastroPonto: [number, number][] = Array.from({ length: 10 }, (_, j) => {
    const v = ease.corte(clamp01((f - j - 1 - qViaja) / Math.max(4, ult - 3 - qViaja)));
    return [lerp(centroBum[0], faisca01[0], v), lerp(centroBum[1], faisca01[1], v) - Math.sin(Math.PI * v) * 160];
  });
  const cenaSome = 1 - fimLoop; // o que é da cena 19 apaga

  // câmera: viva, com tranco no bum; repousa no fim (cena 1 começa sem câmera)
  let tranco = 0;
  const dB = f - qBum;
  if (dB >= 0 && dB < 8) tranco = (random(`m19-tr-${f}`) - 0.5) * 30 * (1 - dB / 8);
  const vida = 1 - fimLoop;
  const z = (lerp(1.0, 1.06, ease.suave(clamp01(f / qJunta))) - 0.03 * sopro) * vida + 1 * fimLoop;
  const dx = (Math.sin(f / 23) * 8 + tranco) * vida;
  const dy = (Math.sin(f / 29) * 6 + tranco * 0.5) * vida;

  const comentarios = [0, 1, 2];
  const yEsq = (i: number) => P.y + 150 + i * 150 + 150 * clamp01(sobe);

  return (
    <AbsoluteFill>
      {/* fundo: o mesmo da cena 1 no quadro 0 (grade fraca, sem deriva) */}
      <FundoM brilho={[50, 52]} grade={lerp(0.5, 0.18, fimLoop)} deriva={0} forcaBrilho={1 + 0.6 * clarao * vida} />
      <AbsoluteFill style={{ opacity: cenaSome }}>
        <Poeira semente="m19" velocidade={1.4} />
      </AbsoluteFill>
      {fimLoop > 0 ? (
        <AbsoluteFill style={{ opacity: fimLoop }}>
          <Freeze frame={0}>
            <Poeira semente="m01" velocidade={1.3} />
          </Freeze>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `translate(${dx}px, ${dy}px) scale(${z})`, opacity: cenaSome }}>
        {/* ---------- caixa de comentários ---------- */}
        <AbsoluteFill style={{ transformOrigin: `${centroBum[0]}px ${centroBum[1]}px`, transform: `scale(${1 - 0.08 * sopro * (1 - junta)})`, filter: sopro > 0.05 ? `blur(${(4 * clarao).toFixed(1)}px) brightness(${1 - 0.3 * clarao})` : undefined }}>
          <div
            style={{
              position: 'absolute',
              left: P.x,
              top: P.y,
              width: P.w,
              height: P.h,
              borderRadius: P.r,
              background: 'linear-gradient(180deg, #0F1F16, #070F0B)',
              border: `2.5px solid rgba(${RGB.claro},.55)`,
              boxShadow: `0 0 ${60 + 40 * Math.sin(f / 6)}px rgba(${RGB.acento},.35), 0 40px 100px rgba(0,0,0,.7)`,
              overflow: 'hidden',
              opacity: recolhe,
            }}
          >
            <div style={{ position: 'absolute', left: P.w / 2 - 40, top: 18, width: 80, height: 8, borderRadius: 4, background: 'rgba(241,240,232,.35)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 48, textAlign: 'center', fontFamily: FONTEM.titulo, fontWeight: 800, fontSize: 40, color: CORM.papel }}>Comentários</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 118, height: 1.5, background: 'rgba(241,240,232,.12)' }} />
            {/* campo de comentar */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, borderTop: '1.5px solid rgba(241,240,232,.12)', background: 'rgba(255,255,255,.02)' }} />
          </div>
          {/* comentários em esqueleto (descem quando o novo chega) */}
          {comentarios.map((i) => {
            const e = mola(f, 'assenta', qComenta + 10 + i * 2);
            const y = yEsq(i);
            if (y > P.y + P.h - 200) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: P.x + 40, top: y, width: P.w - 80, height: 110, opacity: clamp01(e) * 0.9 * recolhe, transform: `translateX(${(1 - clamp01(e)) * 40}px)` }}>
                <div style={{ position: 'absolute', left: 0, top: 6, width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, rgba(${RGB.claro},.5), rgba(241,240,232,.25))` }} />
                <div style={{ position: 'absolute', left: 90, top: 10, width: 150 + 40 * i, height: 20, borderRadius: 10, background: 'rgba(241,240,232,.4)' }} />
                <div style={{ position: 'absolute', left: 90, top: 46, width: 380 - 50 * i, height: 18, borderRadius: 9, background: 'rgba(241,240,232,.18)' }} />
                <div style={{ position: 'absolute', left: 90, top: 76, width: 220 + 30 * i, height: 18, borderRadius: 9, background: 'rgba(241,240,232,.12)' }} />
                <svg width={36} height={34} style={{ position: 'absolute', right: 0, top: 20 }}>
                  <path d="M18 31 C 4 21, 2 13, 6 8 C 10 3, 16 4, 18 9 C 20 4, 26 3, 30 8 C 34 13, 32 21, 18 31 Z" fill="none" stroke="rgba(241,240,232,.45)" strokeWidth={2.5} />
                </svg>
              </div>
            );
          })}
          {/* campo: avatar, texto digitado, Publicar */}
          <div style={{ position: 'absolute', left: P.x + 30, top: yInput - 34, width: 68, height: 68, borderRadius: 34, background: `linear-gradient(135deg, ${PALETA.acento}, ${PALETA.floresta})`, border: '2px solid rgba(241,240,232,.5)', opacity: recolhe }} />
          <div style={{ position: 'absolute', left: P.x + 116, top: yInput - 38, width: 420, height: 76, borderRadius: 38, border: '2px solid rgba(241,240,232,.25)', opacity: recolhe }} />
          {!enviou ? (
            <div style={{ position: 'absolute', left: P.x + 146, top: yInput - 30, height: 60, lineHeight: '60px', fontFamily: FONTEM.titulo, fontWeight: nLetras ? 900 : 500, fontSize: nLetras ? 44 : 30, color: nLetras ? CORM.papel : CORM.faint, whiteSpace: 'pre', opacity: recolhe }}>
              {nLetras ? palavra.slice(0, nLetras) : 'Adicione um comentário…'}
              {Math.floor(f / 7) % 2 === 0 || (f >= qMotion && f < qMotionFim + 2) ? <span style={{ color: CORM.verde, fontWeight: 400 }}>|</span> : null}
            </div>
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: P.x + P.w - 190,
              top: yInput - 30,
              height: 60,
              lineHeight: '60px',
              padding: '0 18px',
              borderRadius: 30,
              fontFamily: FONTEM.titulo,
              fontWeight: 800,
              fontSize: 34,
              color: nLetras ? CORM.verde : `rgba(${RGB.acento},.35)`,
              textShadow: nLetras ? BRILHO.verdeLeve : undefined,
              background: `rgba(${RGB.acento},${0.25 * aperta})`,
              transform: `scale(${1 - 0.12 * Math.sin(Math.PI * aperta)})`,
              opacity: recolhe,
            }}
          >
            Publicar
          </div>
          {/* o comentário postado */}
          {enviou ? (
            <div style={{ position: 'absolute', left: P.x + 40, top: yComent - 58, width: P.w - 80, height: 116, borderRadius: 20, background: `rgba(${RGB.acento},${0.1 + 0.15 * (1 - clamp01(sobe))})`, border: `2px solid rgba(${RGB.acento},.5)` }}>
              <div style={{ position: 'absolute', left: 14, top: 22, width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${PALETA.acento}, ${PALETA.floresta})`, border: '2px solid rgba(241,240,232,.5)' }} />
              <div style={{ position: 'absolute', left: 100, top: 14, fontFamily: FONTEM.titulo, fontWeight: 700, fontSize: 28, color: CORM.dim }}>você · agora</div>
              <div
                style={{
                  position: 'absolute',
                  left: 100,
                  top: 46,
                  fontFamily: FONTEM.titulo,
                  fontWeight: 900,
                  fontSize: 52,
                  letterSpacing: '0.02em',
                  color: aquece > 0 ? `rgb(${Math.round(lerp(48, 255, aquece))},${Math.round(lerp(220, 255, aquece))},${Math.round(lerp(104, 255, aquece))})` : CORM.verde,
                  textShadow: `0 0 ${18 + 50 * aquece}px rgba(${aquece > 0.5 ? '255,255,255' : RGB.acento},.9), 0 0 ${40 + 80 * aquece}px rgba(${RGB.acento},.7)`,
                  transformOrigin: '0 50%',
                  transform: `scale(${1 + 0.25 * aquece})`,
                  opacity: 1 - bum,
                }}
              >
                MOTION
              </div>
            </div>
          ) : null}
        </AbsoluteFill>

        {/* ---------- o verde que recolhe ---------- */}
        {verdeOp > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: verdeRet.x,
              top: verdeRet.y,
              width: verdeRet.w,
              height: verdeRet.h,
              borderRadius: verdeRet.r,
              background: VERDE_FUNDO,
              boxShadow: `0 0 ${80 * recolhe}px rgba(${RGB.acento},.8)`,
              opacity: verdeOp,
            }}
          />
        ) : null}

        {/* ---------- fala ---------- */}
        <Fala
          palavras={l1}
          x={130}
          y={260}
          largura={900}
          estilo={{ ...TIPOM.frase, tamanho: 136, peso: 900 }}
          cor={verdeRet.x < 600 && verdeOp > 0.4 ? CORM.fundo : CORM.papel}
          destaque={['motion']}
          textos={{ 1: 'MOTION' }}
          quebrarAntes={[1]}
          modos={{ 1: 'letras' }}
          staggerLetra={1.8}
          sai={{ em: qJunta - 2, modo: 'foco' }}
        />
        <Fala palavras={l2} x={136} y={560} largura={880} estilo={{ ...TIPOM.apoio, tamanho: 76, peso: 800 }} cor={CORM.papel} destaque={['skill']} sai={{ em: qJunta, modo: 'foco', stagger: 0.4 }} />
      </AbsoluteFill>

      {/* ---------- explosão (fora da câmera viva para não tremer o clarão) ---------- */}
      {f >= qBum - 2 ? (
        <AbsoluteFill style={{ opacity: 1 - junta, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left: centroBum[0] - 900 * bum,
              top: centroBum[1] - 900 * bum,
              width: 1800 * bum,
              height: 1800 * bum,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,${0.95 * clarao}) 0%, rgba(220,255,232,${0.8 * clarao}) 10%, rgba(${RGB.acento},${0.45 * (0.3 + 0.7 * clarao)}) 30%, rgba(${RGB.acento},0) 62%)`,
            }}
          />
          {/* raios girando em volta do clarão */}
          <div
            style={{
              position: 'absolute',
              left: centroBum[0] - 1300,
              top: centroBum[1] - 1300,
              width: 2600,
              height: 2600,
              borderRadius: '50%',
              background: `repeating-conic-gradient(from ${f * 1.2}deg at 50% 50%, rgba(200,255,220,.5) 0deg 2.5deg, rgba(${RGB.acento},0) 2.5deg 11deg)`,
              WebkitMaskImage: 'radial-gradient(circle, #000 4%, rgba(0,0,0,.5) 22%, transparent 50%)',
              maskImage: 'radial-gradient(circle, #000 4%, rgba(0,0,0,.5) 22%, transparent 50%)',
              opacity: clamp01((f - qBum + 2) / 3) * (0.35 + 0.65 * clarao),
              transform: `scale(${0.5 + 0.5 * bum})`,
            }}
          />
          {/* núcleo */}
          <div style={{ position: 'absolute', left: centroBum[0] - 380, top: centroBum[1] - 380, width: 760, height: 760, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,${0.9 * Math.max(clarao, 0.25)}) 0%, rgba(160,255,195,${0.6 * Math.max(clarao, 0.3)}) 16%, rgba(${RGB.acento},0) 60%)`, opacity: clamp01((f - qBum + 2) / 2) }} />
          {/* lampejo de tela inteira no estouro */}
          {f >= qBum && f < qBum + 7 ? <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 30%, rgba(240,255,245,.75), rgba(${RGB.acento},.35) 60%, rgba(${RGB.acento},.15))`, opacity: 1 - (f - qBum) / 7 }} /> : null}
          {[0, 4, 8].map((atr, j) => {
            const d = f - qBum - atr;
            if (d < 0 || d > 20) return null;
            const k = ease.sai(d / 20);
            return <div key={j} style={{ position: 'absolute', left: centroBum[0] - 1100 * k, top: centroBum[1] - 1100 * k, width: 2200 * k, height: 2200 * k, borderRadius: '50%', border: `${2 + 8 * (1 - k)}px solid ${j === 0 ? '#FFFFFF' : CORM.verdeClaro}`, opacity: 1 - k, boxShadow: `0 0 40px rgba(${RGB.acento},.8)` }} />;
          })}
          {/* estrela anamórfica */}
          <div style={{ position: 'absolute', left: centroBum[0] - 1400, top: centroBum[1] - 5, width: 2800, height: 10, borderRadius: 10, background: `linear-gradient(90deg, rgba(${RGB.claro},0), rgba(255,255,255,${0.95 * Math.max(clarao, 0.35)}) 50%, rgba(${RGB.claro},0))`, filter: 'blur(2px)' }} />
          <div style={{ position: 'absolute', left: centroBum[0] - 3, top: centroBum[1] - 500, width: 6, height: 1000, background: `linear-gradient(180deg, rgba(${RGB.claro},0), rgba(255,255,255,${0.7 * clarao}) 50%, rgba(${RGB.claro},0))`, filter: 'blur(1.5px)' }} />
          {/* fagulhas com rastro */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {Array.from({ length: 150 }, (_, j) => {
              const d = f - qBum;
              if (d < 0 || d > 30) return null;
              const r = (k: string) => random(`m19-fa-${k}-${j}`);
              const a = r('a') * Math.PI * 2;
              const v = 18 + r('v') * 46;
              const dist = (u: number) => v * 14 * ease.sai(clamp01(u / 26));
              const x = centroBum[0] + Math.cos(a) * dist(d);
              const y = centroBum[1] + Math.sin(a) * dist(d) * 0.75 + 0.5 * d * d * 0.6;
              const xb = centroBum[0] + Math.cos(a) * dist(d - 1.5);
              const yb = centroBum[1] + Math.sin(a) * dist(d - 1.5) * 0.75 + 0.5 * (d - 1.5) * (d - 1.5) * 0.6;
              const op = 1 - d / 30;
              return <line key={j} x1={xb} y1={yb} x2={x} y2={y} stroke={j % 4 === 0 ? '#FFFFFF' : PALETA.acentoClaro} strokeWidth={2 + r('s') * 3} strokeLinecap="round" opacity={op} />;
            })}
          </svg>
          {/* o símbolo da skill nasce no clarão */}
          {f >= qSkill - 1 ? (
            <AbsoluteFill style={{ transformOrigin: `${centroBum[0]}px ${centroBum[1]}px`, transform: `scale(${(0.6 + 0.4 * mola(f, 'estalo', qSkill - 1)) * (1 - junta)})` }}>
              <SimboloSkill cx={centroBum[0]} cy={centroBum[1]} R={130} brilho={1 - janelaM(f, qSkill, qSkill + 14)} opacidade={janelaM(f, qSkill - 1, qSkill + 2)} />
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* ---------- o ponto de luz que volta ao começo ---------- */}
      {f >= qJunta ? (
        <>
          {viaja >= 0.98 ? <LinhaLuz x1={E0.x - 40} x2={faisca01[0] + 6} y={yLinha01} cabeca={0} espessura={2.5} /> : null}
          <Faisca x={pontoX} y={pontoY} forca={lerp(1.6, 1, viaja) * clamp01((f - qJunta) / 3 + 0.4)} rastro={viaja > 0 ? rastroPonto : []} semente="m19f" />
          {viaja < 0.9 ? <Flare x={pontoX} y={pontoY} forca={1 - viaja} largura={900} /> : null}
        </>
      ) : null}
      {/* o "E" da cena 1 nasce nos dois últimos quadros */}
      {f >= ult - 1 ? (
        <div
          style={{
            position: 'absolute',
            left: E0.x,
            top: E0.y,
            height: E0.h,
            lineHeight: `${E0.h}px`,
            fontFamily: C01.frase.estilo.familia,
            fontWeight: C01.frase.estilo.peso,
            fontSize: C01.frase.estilo.tamanho,
            letterSpacing: `${C01.frase.estilo.tracking}em`,
            whiteSpace: 'pre',
            color: CORM.papel,
            textShadow: `0 0 ${f >= ult ? 22 : 30}px rgba(${RGB.claro},${f >= ult ? 0.55 : 0.8})`,
            transform: `translateY(${f >= ult ? 0.04 * C01.frase.estilo.tamanho : 0.08 * C01.frase.estilo.tamanho}px)`,
          }}
        >
          E
        </div>
      ) : null}
      <HUD tl="MOTION / 019" tr={`REC  ${timecodeM(c.global)}`} bl="CAIXA DE COMENTÁRIOS" br="PALAVRA · MOTION" inicio={22} opacidade={cenaSome} />
    </AbsoluteFill>
  );
};
