/* Cena 6 (12,44–18,98 s): "Tipo, cria uma sequência de quinze segundos, cinematográfica, com
   tipografia cinética, 3D e câmera fluida."
   Chegamos da barra esticada (estica). Um painel de pedido de vidro (inclina e assenta, câmera viva)
   recebe a fala digitada em mono. Antes de "cinematográfica" abre um AUTOCOMPLETAR (texto fantasma
   + lista cinematográfica / épica / elegante / vertical, a seleção sobe e o TAB aceita) e a palavra
   entra inteira de uma vez. Cada palavra-chave dispara um feixe de luz do texto até um cartão de
   MINI-PREVIEW que nasce embaixo e fica rodando: 15 s (anel de tempo), cinematográfica (faixas de
   cinema + flare anamórfico), tipografia cinética (letras quicando e mudando de peso), 3D (cubo de
   arame girando), câmera fluida (paralaxe de três planos). No fim o botão de enviar acende e a
   câmera para em repouso: o túnel 6 → 7 parte do painel (C06.painel). */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { C06 } from '../layoutB';
import { BRILHO, clamp01, CORM, ease, type EstiloM, FONTEM, janelaM, lerp, mola, PALETA, RGB, TIPOM, trecho } from '../tema';
import { FundoM, GradeChao, HUD, Poeira, timecodeM } from '../visual';
import { Fagulhas, Feixe, vidro } from './pecas';

const ESTILO_PROMPT: EstiloM = { ...TIPOM.prompt, tamanho: 56, entrelinha: 1.28 };
const OPCOES = ['cinematográfica', 'épica', 'elegante', 'vertical'];

/* ---------------- mini-previews (cada um desenha numa área de 300 x 250) ---------------- */
const Demo15: React.FC<{ t: number }> = ({ t }) => {
  const R = 84;
  const vol = (t % 40) / 40;
  const p = ease.suave(vol);
  const ang = p * Math.PI * 2 - Math.PI / 2;
  const seg = Math.min(15, Math.floor(p * 16));
  return (
    <>
      <svg width={300} height={250} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const l = i % 5 === 0 ? 12 : 6;
          return <line key={i} x1={150 + Math.cos(a) * (R + 10)} y1={125 + Math.sin(a) * (R + 10)} x2={150 + Math.cos(a) * (R + 10 + l)} y2={125 + Math.sin(a) * (R + 10 + l)} stroke={i / 60 <= p ? CORM.verdeClaro : `rgba(${RGB.claro},.25)`} strokeWidth={2} />;
        })}
        <circle cx={150} cy={125} r={R} fill="none" stroke={`rgba(${RGB.claro},.15)`} strokeWidth={10} />
        <circle cx={150} cy={125} r={R} fill="none" stroke={CORM.verde} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${(2 * Math.PI * R * p).toFixed(1)} 9999`} transform="rotate(-90 150 125)" style={{ filter: `drop-shadow(0 0 8px rgba(${RGB.acento},.9))` }} />
        <circle cx={150 + Math.cos(ang) * R} cy={125 + Math.sin(ang) * R} r={9} fill="#fff" style={{ filter: `drop-shadow(0 0 10px rgba(${RGB.claro},1))` }} />
      </svg>
      <div style={{ position: 'absolute', left: 0, width: 300, top: 88, textAlign: 'center', fontFamily: FONTEM.titulo, fontWeight: 900, fontSize: 64, letterSpacing: '-0.04em', color: CORM.branco, textShadow: BRILHO.branco }}>
        {`${String(seg).padStart(2, '0')}s`}
      </div>
    </>
  );
};

const DemoCinema: React.FC<{ t: number }> = ({ t }) => {
  const barras = mola(t, 'assenta', 2);
  const flare = ((t + 12) % 44) / 44;
  const z = 1 + 0.12 * ease.suave(clamp01(t / 90));
  return (
    <div style={{ position: 'absolute', left: 14, top: 14, width: 272, height: 222, borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(180deg, #02100A 0%, #0B3A20 55%, #1E8A48 78%, #031008 79%)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 75%' }}>
        <div style={{ position: 'absolute', left: 136 - 34, top: 150 - 34 - 14 * ease.suave(clamp01(t / 80)), width: 68, height: 68, borderRadius: '50%', background: `radial-gradient(circle, #F4FFF7 0%, ${PALETA.acentoClaro} 40%, rgba(${RGB.acento},0) 72%)` }} />
        <svg width={272} height={222} style={{ position: 'absolute', inset: 0 }}>
          <polygon points="0,175 40,138 78,160 120,120 160,152 205,128 240,150 272,135 272,222 0,222" fill="#020A06" />
          <polygon points="0,195 60,170 110,188 170,165 230,185 272,175 272,222 0,222" fill="#000" opacity={0.85} />
        </svg>
      </div>
      {/* flare anamórfico */}
      <div style={{ position: 'absolute', left: lerp(-200, 340, flare) - 150, top: 120, width: 300, height: 4, background: `linear-gradient(90deg, rgba(${RGB.claro},0), rgba(220,255,235,.95), rgba(${RGB.claro},0))`, filter: 'blur(1px)', opacity: Math.sin(Math.PI * flare) }} />
      {/* faixas de cinema (2,39:1) */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 272, height: 54 * barras, background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 272, height: 54 * barras, background: '#000' }} />
    </div>
  );
};

const DemoTipo: React.FC<{ t: number }> = ({ t }) => {
  const letras = ['T', 'I', 'P', 'O'];
  const ciclo = t % 36;
  return (
    <div style={{ position: 'absolute', left: 0, top: 40, width: 300, height: 170, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      {letras.map((l, i) => {
        const m = mola(ciclo, 'quica', i * 3);
        const peso = Math.round(500 + 400 * Math.sin(t / 7 + i * 1.3));
        const verde = Math.floor(t / 9) % 4 === i;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: FONTEM.titulo,
              fontWeight: peso,
              fontSize: 112,
              lineHeight: '120px',
              letterSpacing: '-0.03em',
              color: verde ? CORM.verde : CORM.papel,
              textShadow: verde ? BRILHO.verde : BRILHO.branco,
              transform: `translateY(${(1 - m) * -90}px) scaleY(${1 + (1 - m) * 0.25})`,
              opacity: clamp01(m * 3),
            }}
          >
            {l}
          </span>
        );
      })}
    </div>
  );
};

const Demo3D: React.FC<{ t: number }> = ({ t }) => {
  const L = 116;
  const faces = [
    `translateZ(${L / 2}px)`,
    `rotateY(180deg) translateZ(${L / 2}px)`,
    `rotateY(90deg) translateZ(${L / 2}px)`,
    `rotateY(-90deg) translateZ(${L / 2}px)`,
    `rotateX(90deg) translateZ(${L / 2}px)`,
    `rotateX(-90deg) translateZ(${L / 2}px)`,
  ];
  const e = mola(t, 'estalo', 0);
  return (
    <>
      <div style={{ position: 'absolute', left: 150 - 80, top: 205, width: 160, height: 26, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${RGB.acento},.45), rgba(${RGB.acento},0) 70%)` }} />
      <div style={{ position: 'absolute', left: 150 - L / 2, top: 112 - L / 2 + Math.sin(t / 9) * 8, width: L, height: L, perspective: 700 }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `scale(${e}) rotateX(${-24 + t * 2.2}deg) rotateY(${t * 3.4}deg)` }}>
          {faces.map((tr, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, transform: tr, border: `3px solid ${CORM.verdeClaro}`, background: i === 0 ? `rgba(${RGB.acento},.22)` : `rgba(${RGB.acento},.07)`, boxShadow: `inset 0 0 20px rgba(${RGB.acento},.35), 0 0 14px rgba(${RGB.acento},.45)` }} />
          ))}
        </div>
      </div>
    </>
  );
};

const DemoCamera: React.FC<{ t: number }> = ({ t }) => {
  const cam = Math.sin(t / 16) * 1;
  const planos = [
    { n: 7, h: 46, y: 120, vel: 18, op: 0.35, w: 14 },
    { n: 5, h: 90, y: 100, vel: 42, op: 0.6, w: 22 },
    { n: 3, h: 170, y: 70, vel: 90, op: 1, w: 34 },
  ];
  return (
    <div style={{ position: 'absolute', left: 14, top: 14, width: 272, height: 222, borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(180deg, #06140C, #0D2A19)' }}>
      <svg width={272} height={222} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={136} y1={150} x2={136 + (i - 4) * 90 - cam * 30} y2={222} stroke={`rgba(${RGB.claro},.3)`} strokeWidth={1.5} />
        ))}
        {[160, 175, 196].map((y, i) => (
          <line key={i} x1={0} x2={272} y1={y} y2={y} stroke={`rgba(${RGB.claro},.25)`} strokeWidth={1.5} />
        ))}
      </svg>
      {planos.map((pl, k) =>
        Array.from({ length: pl.n }, (_, i) => {
          const x = ((i * (272 / pl.n) * 1.6 - cam * pl.vel) % 420 + 420) % 420 - 74;
          return <div key={`${k}-${i}`} style={{ position: 'absolute', left: x, top: pl.y + (170 - pl.h) * 0.3, width: pl.w, height: pl.h, borderRadius: 4, background: k === 2 ? CORM.verde : CORM.verdeClaro, opacity: pl.op, boxShadow: k === 2 ? `0 0 16px rgba(${RGB.acento},.7)` : undefined }} />;
        }),
      )}
      {/* trilho da câmera */}
      <div style={{ position: 'absolute', left: 136 + cam * 90 - 10, top: 20, width: 20, height: 14, borderRadius: 3, background: '#fff', boxShadow: `0 0 12px rgba(${RGB.claro},1)` }} />
      <div style={{ position: 'absolute', left: 30, top: 26, width: 212, height: 2, background: 'rgba(255,255,255,.35)' }} />
    </div>
  );
};

const CARTOES: { rotulo: string; prefixo: string; Demo: React.FC<{ t: number }> }[] = [
  { rotulo: '15 S', prefixo: 'quinze', Demo: Demo15 },
  { rotulo: 'CINEMATOGRÁFICA', prefixo: 'cinematogr', Demo: DemoCinema },
  { rotulo: 'TIPO CINÉTICA', prefixo: 'tipografia', Demo: DemoTipo },
  { rotulo: '3D', prefixo: '3d', Demo: Demo3D },
  { rotulo: 'CÂMERA FLUIDA', prefixo: 'câmera', Demo: DemoCamera },
];

export const M06: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const P = C06.painel;
  const tipo = trecho(6, 0, 0);
  const prompt = trecho(6, 1);
  const iDe = (prefixo: string) => prompt.findIndex((p) => p.t.toLowerCase().startsWith(prefixo));
  const propsPrompt = {
    palavras: prompt,
    x: C06.texto.x,
    y: C06.texto.y,
    largura: C06.texto.largura,
    estilo: ESTILO_PROMPT,
  };
  const lay = useLayoutFala(propsPrompt);
  const iCine = iDe('cinematogr');
  const cine = lay.itens[iCine];
  const ant = lay.itens[iCine - 1];
  const fim = Number.isFinite(c.saidaInicio) ? c.saidaInicio : c.seqDuracao;
  const ultima = lay.itens[lay.itens.length - 1];

  /* câmera: viva, segue o cartão ativo, e assenta em repouso no início da saída (o túnel parte do painel) */
  const repouso = janelaM(f, fim - 18, fim, 'suave');
  const vida = 1 - repouso;
  const qs = CARTOES.map((k) => lay.itens[iDe(k.prefixo)].q);
  const ativo = qs.reduce((a, q, i) => (f >= q ? i : a), -1);
  const cxCartao = (i: number) => 150 + i * (C06.cards.w + C06.cards.gap) + C06.cards.w / 2;
  const segue = qs.reduce((acc, q, i) => acc + (i === 0 ? 0 : ((960 - cxCartao(i)) * 0.05 - (960 - cxCartao(i - 1)) * 0.05) * mola(f, 'camera', q)), ativo >= 0 ? (960 - cxCartao(0)) * 0.05 * mola(f, 'camera', qs[0]) : 0);
  const z = 1 + (0.035 + 0.035 * ease.suave(clamp01(f / 150))) * vida;
  const dx = (Math.sin(f / 31) * 12 + segue) * vida;
  const dy = Math.cos(f / 37) * 8 * vida;
  const rot = Math.sin(f / 47) * 0.35 * vida;

  /* painel: inclina e assenta */
  const entra = mola(f, 'assenta', 2);
  const rotX = (lerp(18, 0, entra) + Math.sin(f / 23) * 2.2) * vida;
  const rotY = Math.sin(f / 29) * 3 * vida;
  const enviar = ultima.qFim + 1;
  const pulsoEnviar = janelaM(f, enviar, enviar + 8, 'sai');
  const varre = ((f + 10) % 60) / 60;
  const digitando = f >= lay.itens[0].q && f <= ultima.qFim;
  const tokens = Math.round(4 * lay.itens.filter((it) => f >= it.q).length + (digitando ? (f % 3) : 0));

  /* autocompletar */
  const qAbre = ant.q + 6;
  const qAceita = cine.q;
  const abre = mola(f, 'estalo', qAbre);
  const fecha = janelaM(f, qAceita, qAceita + 6, 'entra');
  const listaOn = f >= qAbre && fecha < 1;
  const sel = lerp(2, 0, ease.corte(janelaM(f, qAbre + 3, qAceita - 4)));
  const teclaTab = f >= qAceita - 3 && f < qAceita + 3;
  const hLinha = ESTILO_PROMPT.tamanho * ESTILO_PROMPT.entrelinha;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 40]} forcaBrilho={1.15} deriva={0.5} semente="m06" />
      <AbsoluteFill style={{ transformOrigin: '960px 560px', transform: `translate(${dx}px, ${dy}px) scale(${z}) rotate(${rot}deg)` }}>
        <GradeChao horizonte={760} opacidade={0.5} velocidade={4} progresso={janelaM(f, 0, 24)} />
        <Poeira semente="m06" velocidade={1.4} />

        <Fala palavras={tipo} x={P.x + 6} y={116} estilo={{ ...TIPOM.apoio, tamanho: 64 }} cor={CORM.papel} />

        {/* ---- painel do pedido (3D) ---- */}
        <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: `${P.x + P.w / 2}px ${P.y + P.h / 2}px` }}>
          <AbsoluteFill style={{ transformOrigin: `${P.x + P.w / 2}px ${P.y + P.h / 2}px`, transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${lerp(1.08, 1, entra)})`, opacity: clamp01(entra * 2) }}>
            <div style={{ position: 'absolute', left: P.x - 40, top: P.y + P.h - 20, width: P.w + 80, height: 120, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 20%, rgba(${RGB.acento},.28), rgba(${RGB.acento},0) 70%)` }} />
            <div
              style={{
                position: 'absolute',
                left: P.x - 3,
                top: P.y - 3,
                width: P.w + 6,
                height: P.h + 6,
                borderRadius: P.r + 3,
                background: `conic-gradient(from ${f * 7}deg at 50% 50%, rgba(${RGB.claro},.35) 0deg, #F4FFF7 18deg, rgba(${RGB.claro},.35) 50deg, rgba(${RGB.claro},.35) 180deg, #CFFFE0 200deg, rgba(${RGB.claro},.35) 235deg)`,
                boxShadow: `0 0 ${50 + 30 * pulsoEnviar}px rgba(${RGB.acento},${0.3 + 0.4 * (digitando ? 0.5 + 0.5 * Math.sin(f / 4) : 0)}), 0 40px 100px rgba(0,0,0,.7)`,
              }}
            />
            <div style={{ position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: P.r, background: 'linear-gradient(180deg, rgba(22,52,34,.97), rgba(5,14,9,.98))', overflow: 'hidden', boxShadow: `inset 0 0 50px rgba(${RGB.acento},.12), inset 0 2px 0 rgba(255,255,255,.08)` }}>
              <div style={{ position: 'absolute', top: 0, left: -300 + varre * (P.w + 600), width: 200, height: '100%', background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.07), rgba(255,255,255,0))', transform: 'skewX(-20deg)' }} />
              <div style={{ position: 'absolute', left: 0, top: 70, width: P.w, height: 2, background: CORM.linha }} />
            </div>
            {/* cabeçalho */}
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: P.x + 30 + i * 30, top: P.y + 26, width: 16, height: 16, borderRadius: 8, background: i === 0 ? CORM.verde : `rgba(${RGB.claro},.3)`, boxShadow: i === 0 ? BRILHO.verdeLeve : undefined }} />
            ))}
            <div style={{ position: 'absolute', left: P.x + 140, top: P.y + 18, fontFamily: FONTEM.mono, fontSize: 28, letterSpacing: '0.06em', color: CORM.dim, whiteSpace: 'pre' }}>NOVO PEDIDO · claude-opus-5.5</div>
            <div style={{ position: 'absolute', right: 1920 - P.x - P.w + 32, top: P.y + 18, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre' }}>{`TOKENS ${String(tokens).padStart(3, '0')}`}</div>

            {/* texto fantasma do autocompletar */}
            {f >= qAbre && f < qAceita ? (
              <div style={{ position: 'absolute', left: cine.x, top: cine.y, height: hLinha, lineHeight: `${hLinha}px`, fontFamily: FONTEM.mono, fontSize: ESTILO_PROMPT.tamanho, letterSpacing: `${ESTILO_PROMPT.tracking}em`, color: `rgba(${RGB.claro},.38)`, whiteSpace: 'pre', opacity: clamp01((f - qAbre) / 3) }}>
                cinematográfica
              </div>
            ) : null}
            <Fala {...propsPrompt} modo="maquina" modos={{ [iCine]: 'foco' }} cor={CORM.papel} destaque={[iDe('quinze'), iDe('segundos'), iCine, iDe('tipografia'), iDe('cinética'), iDe('3d'), iDe('câmera'), iDe('fluida')]} />
            {f >= qAceita && f < qAceita + 10 ? (
              <div style={{ position: 'absolute', left: cine.x - 10, top: cine.y + 4, width: cine.w + 20, height: hLinha - 8, borderRadius: 8, background: `rgba(${RGB.acento},${(0.35 * (1 - (f - qAceita) / 10)).toFixed(3)})`, boxShadow: `0 0 30px rgba(${RGB.acento},${(0.6 * (1 - (f - qAceita) / 10)).toFixed(3)})` }} />
            ) : null}

            {/* botão enviar */}
            <div
              style={{
                position: 'absolute',
                left: P.x + P.w - 106,
                top: P.y + P.h - 104,
                width: 78,
                height: 78,
                borderRadius: 39,
                background: f >= enviar ? CORM.verde : `rgba(${RGB.acento},.16)`,
                border: `2px solid ${CORM.verde}`,
                boxShadow: `0 0 ${f >= enviar ? 30 + 60 * (1 - pulsoEnviar) : 12 + 8 * Math.sin(f / 5)}px rgba(${RGB.acento},.9)`,
                transform: `scale(${1 + 0.2 * Math.sin(Math.PI * pulsoEnviar)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTEM.titulo,
                fontWeight: 800,
                fontSize: 44,
                color: f >= enviar ? CORM.fundo : CORM.verde,
              }}
            >
              ↑
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        {/* ---- esqueletos carregando (viram os cartões) ---- */}
        {CARTOES.map((k, i) => {
          const qCard = lay.itens[iDe(k.prefixo)].q + 4;
          const e = mola(f, 'assenta', 6 + i * 2);
          if (f >= qCard + 2 || e <= 0) return null;
          const x = 150 + i * (C06.cards.w + C06.cards.gap);
          const brilho = (((f - i * 4) % 30) + 30) % 30 / 30;
          return (
            <div key={`sk${i}`} style={{ position: 'absolute', left: x, top: C06.cards.y, width: C06.cards.w, height: C06.cards.h, borderRadius: 20, border: `2px dashed rgba(${RGB.claro},.3)`, background: 'rgba(10,28,17,.45)', overflow: 'hidden', opacity: clamp01(e * 2) * (1 - clamp01((f - qCard + 2) / 4)), transform: `translateY(${(1 - e) * 40}px)`, boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: -160 + brilho * 520, width: 120, background: `linear-gradient(90deg, rgba(${RGB.claro},0), rgba(${RGB.claro},.16), rgba(${RGB.claro},0))` }} />
              {[0, 1, 2].map((r) => (
                <div key={r} style={{ position: 'absolute', left: 22, top: 40 + r * 56, width: [200, 150, 230][r], height: 22, borderRadius: 11, background: `rgba(${RGB.claro},.12)` }} />
              ))}
              <div style={{ position: 'absolute', left: 22, top: 274, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.faint }}>{`PRÉVIA 0${i + 1}`}</div>
            </div>
          );
        })}
        {/* ---- cartões de mini-preview ---- */}
        {CARTOES.map((k, i) => {
          const it = lay.itens[iDe(k.prefixo)];
          const q = it.q + 1;
          if (f < q - 1) return null;
          const e = mola(f, 'estalo', q + 3);
          const x = 150 + i * (C06.cards.w + C06.cards.gap);
          const y = C06.cards.y;
          const ativoK = i === ativo ? 1 - 0.5 * janelaM(f, q + 10, q + 30) : 0;
          return (
            <React.Fragment key={k.rotulo}>
              <Feixe f={f} q0={q - 1} de={[it.x + it.w / 2, it.y + hLinha - 4]} para={[x + C06.cards.w / 2, y + 6]} dur={5} fica={8} />
              {f >= q + 3 ? (
                <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: `${x + 150}px ${y}px` }}>
                  <div
                    style={{
                      ...vidro(ativoK),
                      left: x,
                      top: y,
                      width: C06.cards.w,
                      height: C06.cards.h,
                      opacity: clamp01(e * 2.5),
                      transformOrigin: '50% 0%',
                      transform: `translateY(${(1 - e) * 90 + Math.sin(f / 13 + i) * 5}px) rotateX(${(1 - e) * -60}deg) scale(${0.8 + 0.2 * e})`,
                    }}
                  >
                    <k.Demo t={f - q - 3} />
                    <div style={{ position: 'absolute', left: 0, top: 256, width: '100%', height: 2, background: CORM.linha }} />
                    <div style={{ position: 'absolute', left: 20, top: 274, fontFamily: FONTEM.mono, fontSize: 28, letterSpacing: '0.04em', color: i === ativo ? CORM.verdeClaro : CORM.papel, whiteSpace: 'pre' }}>{k.rotulo}</div>
                  </div>
                </AbsoluteFill>
              ) : null}
              <Fagulhas f={f} q0={q + 3} x={x + 150} y={y + 10} semente={`m06-c${i}`} raio={180} n={12} />
            </React.Fragment>
          );
        })}

        {/* ---- lista do autocompletar ---- */}
        {listaOn ? (
          <div
            style={{
              ...vidro(0.8),
              left: cine.x - 16,
              top: cine.y + hLinha + 6,
              width: 520,
              height: 16 + OPCOES.length * 60,
              borderRadius: 14,
              opacity: clamp01(abre * 2) * (1 - fecha),
              transformOrigin: '10% 0%',
              transform: `translateY(${(1 - abre) * -20 - fecha * 30}px) scaleY(${(0.6 + 0.4 * abre) * (1 - 0.5 * fecha)})`,
            }}
          >
            <div style={{ position: 'absolute', left: 8, top: 8 + sel * 60, width: 504, height: 56, borderRadius: 10, background: `rgba(${RGB.acento},.28)`, boxShadow: `inset 0 0 0 2px rgba(${RGB.claro},.7), 0 0 24px rgba(${RGB.acento},.4)` }} />
            {OPCOES.map((o, i) => {
              const on = Math.abs(sel - i) < 0.5;
              return (
                <div key={o} style={{ position: 'absolute', left: 28, top: 8 + i * 60, height: 56, lineHeight: '56px', fontFamily: FONTEM.mono, fontSize: 32, color: on ? CORM.branco : CORM.dim, whiteSpace: 'pre', opacity: clamp01((f - qAbre - i) / 3) }}>
                  {o}
                </div>
              );
            })}
            <div
              style={{
                position: 'absolute',
                right: 18,
                top: 8 + sel * 60 + 10,
                padding: '2px 12px',
                borderRadius: 6,
                border: `2px solid ${CORM.verdeClaro}`,
                fontFamily: FONTEM.mono,
                fontSize: 28,
                fontWeight: 700,
                color: teclaTab ? CORM.fundo : CORM.verdeClaro,
                background: teclaTab ? CORM.verde : 'transparent',
                transform: `translateY(${teclaTab ? 3 : 0}px)`,
                boxShadow: teclaTab ? BRILHO.verde : undefined,
              }}
            >
              TAB
            </div>
          </div>
        ) : null}
        <Fagulhas f={f} q0={qAceita} x={cine.x + cine.w / 2} y={cine.y + hLinha / 2} semente="m06-tab" raio={260} n={18} />
      </AbsoluteFill>
      <HUD tl="MOTION / 006" tr={`REC  ${timecodeM(c.global)}`} bl="PEDIDO · 1 FRASE" br={`PARÂMETROS · ${Math.max(0, ativo + 1)}`} inicio={8} />
    </AbsoluteFill>
  );
};
