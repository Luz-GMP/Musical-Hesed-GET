/* Peças pequenas que várias cenas repetem: estouro de fagulhas, onda de choque,
   feixe de luz entre dois pontos e o achador de palavra na fala. */
import React from 'react';
import { random } from 'remotion';
import { FLUXO_13 } from '../layoutB';
import { clamp01, CORM, ease, falaDaCena, lerp, normalizar, type Palavra, PALETA, RGB } from '../tema';

/** Índice da 1ª palavra da cena n que começa com `prefixo` (normalizado). Lança se não achar. */
export const idx = (n: number, prefixo: string, depois = 0): number => {
  const fala = falaDaCena(n);
  const alvo = normalizar(prefixo);
  for (let i = depois; i < fala.length; i++) if (normalizar(fala[i].t).startsWith(alvo)) return i;
  throw new Error(`pecas: "${prefixo}" não está na fala da cena ${n}`);
};
export const palavra = (n: number, prefixo: string, depois = 0): Palavra => falaDaCena(n)[idx(n, prefixo, depois)];

/** Fagulhas que estouram de (x, y) a partir do quadro q0. */
export const Fagulhas: React.FC<{ f: number; q0: number; x: number; y: number; n?: number; raio?: number; dur?: number; semente: string; gravidade?: number }> = ({
  f,
  q0,
  x,
  y,
  n = 14,
  raio = 220,
  dur = 16,
  semente,
  gravidade = 60,
}) => {
  const d = f - q0;
  if (d < 0 || d >= dur) return null;
  const u = d / dur;
  return (
    <>
      {Array.from({ length: n }, (_, j) => {
        const r = (k: string) => random(`${semente}-${k}-${j}`);
        const a = r('a') * Math.PI * 2;
        const dist = ease.sai(u) * raio * (0.35 + 0.65 * r('d'));
        const tam = 3 + r('s') * 5;
        return (
          <div
            key={j}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * dist - tam / 2,
              top: y + Math.sin(a) * dist * 0.75 + u * u * gravidade - tam / 2,
              width: tam,
              height: tam,
              borderRadius: '50%',
              background: j % 3 === 0 ? '#FFFFFF' : CORM.verdeClaro,
              opacity: 1 - u,
              boxShadow: `0 0 10px rgba(${RGB.acento},.95)`,
            }}
          />
        );
      })}
    </>
  );
};

/** Anel que se expande a partir de (x, y) (onda de choque). */
export const Onda: React.FC<{ f: number; q0: number; x: number; y: number; r0?: number; r1?: number; dur?: number; cor?: string; espessura?: number }> = ({
  f,
  q0,
  x,
  y,
  r0 = 10,
  r1 = 260,
  dur = 18,
  cor = RGB.claro,
  espessura = 3,
}) => {
  const d = f - q0;
  if (d < 0 || d >= dur) return null;
  const u = ease.sai(d / dur);
  const r = lerp(r0, r1, u);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `${espessura}px solid rgba(${cor},${(0.9 * (1 - d / dur)).toFixed(3)})`,
        boxShadow: `0 0 24px rgba(${cor},${(0.6 * (1 - d / dur)).toFixed(3)}), inset 0 0 18px rgba(${cor},${(0.35 * (1 - d / dur)).toFixed(3)})`,
      }}
    />
  );
};

/** Feixe de luz de A para B: desenha em `dur` quadros a partir de q0 e apaga depois de `fica`. */
export const Feixe: React.FC<{ f: number; q0: number; de: [number, number]; para: [number, number]; dur?: number; fica?: number }> = ({ f, q0, de, para, dur = 6, fica = 10 }) => {
  const d = f - q0;
  if (d < 0) return null;
  const p = ease.sai(clamp01(d / dur));
  const apaga = clamp01((d - dur - fica) / 8);
  if (apaga >= 1) return null;
  const x = lerp(de[0], para[0], p);
  const y = lerp(de[1], para[1], p);
  const op = 1 - apaga;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <line x1={de[0]} y1={de[1]} x2={x} y2={y} stroke={`rgba(${RGB.acento},.35)`} strokeWidth={14} strokeLinecap="round" opacity={op} />
        <line x1={de[0]} y1={de[1]} x2={x} y2={y} stroke="#E6FFEE" strokeWidth={2.5} strokeLinecap="round" opacity={op} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: x - 40,
          top: y - 40,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(${RGB.claro},.6) 22%, rgba(${RGB.acento},0) 70%)`,
          opacity: op * (1 - 0.6 * clamp01((d - dur) / 6)),
        }}
      />
    </>
  );
};

/** Retângulo de vidro (cartão / painel). */
export const vidro = (ativo = 0): React.CSSProperties => ({
  position: 'absolute',
  borderRadius: 20,
  background: 'linear-gradient(180deg, rgba(20,48,31,.92), rgba(6,16,10,.94))',
  border: `2px solid ${ativo > 0.01 ? `rgba(${RGB.claro},${(0.25 + 0.7 * ativo).toFixed(3)})` : CORM.linhaForte}`,
  boxShadow: `0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.07)${ativo > 0.01 ? `, 0 0 ${(20 + 50 * ativo).toFixed(0)}px rgba(${RGB.acento},${(0.5 * ativo).toFixed(3)})` : ''}`,
  boxSizing: 'border-box',
  overflow: 'hidden',
});

/* ---------------- película (cena 11 → 12 → 13) ---------------- */

/** Um quadro renderizado da cena 11 em miniatura (MOTION, quadrado, círculo, partículas), com
    tarja de cinema. `t` muda a pose (cada fotograma é um instante diferente). */
export const QuadroMini: React.FC<{ w: number; h: number; t: number }> = ({ w, h, t }) => {
  const s = w / 1920;
  const hc = 1080 * s;
  const oy = (h - hc) / 2;
  const rot = t * 9;
  const ox = Math.sin(t / 3) * 40;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: oy, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${s})`, background: `radial-gradient(ellipse 70% 62% at 50% 46%, #1C5C34 0%, ${PALETA.floresta} 45%, ${PALETA.fundo} 80%)`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${RGB.claro},.14) 2px, transparent 2px), linear-gradient(90deg, rgba(${RGB.claro},.14) 2px, transparent 2px)`, backgroundSize: '200px 200px' }} />
        <div style={{ position: 'absolute', left: 140, top: 250 - Math.abs(Math.sin(t / 2)) * 40, fontFamily: 'Inter', fontWeight: 900, fontSize: 210, letterSpacing: '-0.04em', lineHeight: '230px', color: '#F1F0E8', textShadow: '0 0 30px rgba(255,255,255,.4)' }}>MOTION</div>
        <div style={{ position: 'absolute', left: 1170, top: 300 + 150 * Math.abs(Math.sin(t / 4)), width: 170, height: 170, border: `8px solid ${PALETA.acentoClaro}`, background: `rgba(${RGB.acento},.2)`, transform: `rotate(${rot}deg)` }} />
        <div style={{ position: 'absolute', left: 1540 - 130 + ox, top: 400 - 130, width: 260, height: 260, borderRadius: '50%', border: `8px solid ${PALETA.acento}`, background: `radial-gradient(circle, rgba(${RGB.acento},.45), rgba(${RGB.acento},.05) 70%)`, boxShadow: `0 0 60px rgba(${RGB.acento},.8)` }} />
        {Array.from({ length: 26 }, (_, i) => {
          const a = random(`qm-a-${i}`) * Math.PI * 2;
          const d = 160 + random(`qm-d-${i}`) * 500 + t * 14;
          return <div key={i} style={{ position: 'absolute', left: 1540 + Math.cos(a) * d, top: 400 + Math.sin(a) * d * 0.7, width: 16, height: 16, borderRadius: 8, background: PALETA.acentoClaro, opacity: 0.8 }} />;
        })}
        <div style={{ position: 'absolute', left: 140, top: 860, fontFamily: 'Inter', fontWeight: 800, fontSize: 96, color: PALETA.acento }}>matemática</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: Math.max(0, oy), background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: w, height: Math.max(0, oy), background: '#000' }} />
    </div>
  );
};

/** Um fotograma ainda em CÓDIGO (barras de sintaxe), antes de passar pela cabeça de render. */
export const QuadroCodigo: React.FC<{ w: number; h: number; semente: string }> = ({ w, h, semente }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0B1F14, #050D09)', overflow: 'hidden' }}>
    {Array.from({ length: 9 }, (_, i) => {
      const r = (k: string) => random(`${semente}-${k}-${i}`);
      const ind = Math.floor(r('i') * 3) * 22;
      return (
        <div key={i} style={{ position: 'absolute', left: 22 + ind, top: 22 + i * ((h - 40) / 9), height: 10, display: 'flex', gap: 8 }}>
          <div style={{ width: 30 + r('a') * 60, height: 10, borderRadius: 5, background: PALETA.acentoClaro, opacity: 0.75 }} />
          <div style={{ width: 20 + r('b') * (w * 0.4), height: 10, borderRadius: 5, background: 'rgba(241,240,232,.45)' }} />
          {r('c') > 0.5 ? <div style={{ width: 16 + r('d') * 40, height: 10, borderRadius: 5, background: PALETA.acento }} /> : null}
        </div>
      );
    })}
  </div>
);

/** Trilho de perfurações da película (faixa horizontal). `desloc` anda com a película. */
export const Trilho: React.FC<{ x: number; y: number; w: number; h: number; desloc: number }> = ({ x, y, w, h, desloc }) => {
  const passo = 60;
  const off = ((desloc % passo) + passo) % passo;
  const n = Math.ceil(w / passo) + 2;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: '#0A0F0C', overflow: 'hidden', borderTop: `2px solid rgba(${RGB.claro},.35)`, borderBottom: `2px solid rgba(${RGB.claro},.35)`, boxSizing: 'border-box' }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: i * passo - off - passo / 2, top: h / 2 - 14, width: 30, height: 28, borderRadius: 6, background: PALETA.fundo, boxShadow: `inset 0 0 0 2px rgba(${RGB.claro},.4)` }} />
      ))}
    </div>
  );
};

/** A película inteira na horizontal (trilhos + fotogramas). offset = quanto a fita andou para a
    esquerda (px). Fotogramas cujo centro já passou de `cabeca` estão RENDERIZADOS (QuadroMini);
    os outros ainda são CÓDIGO. Na cena 12 e na transição 11 → 12 com o mesmo offset o desenho é
    idêntico (é isso que deixa o corte invisível). */
export const FitaFilme: React.FC<{ offset: number; cy?: number; cabeca?: number; de?: number; ate?: number; pular?: (j: number) => boolean; opacidadeTrilho?: number }> = ({
  offset,
  cy = 590,
  cabeca = 1170,
  de = -4,
  ate = 10,
  pular,
  opacidadeTrilho = 1,
}) => {
  const FW = 380;
  const FH = 270;
  const PASSO = 420;
  const X0 = 960 - FW / 2;
  const hT = 66;
  return (
    <>
      <div style={{ position: 'absolute', left: -100, top: cy - FH / 2 - hT - 4, width: 2120, height: FH + 2 * hT + 8, background: '#060B08', opacity: opacidadeTrilho }} />
      <div style={{ opacity: opacidadeTrilho }}>
        <Trilho x={-100} y={cy - FH / 2 - hT - 4} w={2120} h={hT} desloc={offset} />
        <Trilho x={-100} y={cy + FH / 2 + 4} w={2120} h={hT} desloc={offset} />
      </div>
      {Array.from({ length: ate - de + 1 }, (_, k) => {
        const j = de + k;
        if (pular?.(j)) return null;
        const x = X0 + j * PASSO - offset;
        if (x > 2000 || x + FW < -80) return null;
        const xc = x + FW / 2;
        const pronto = xc <= cabeca + 0.5;
        const flash = pronto ? clamp01(1 - (cabeca - xc) / 70) : 0;
        return (
          <div key={j} style={{ position: 'absolute', left: x, top: cy - FH / 2, width: FW, height: FH, borderRadius: 10, overflow: 'hidden', boxShadow: pronto ? `0 0 ${(18 + 50 * flash).toFixed(0)}px rgba(${RGB.acento},${(0.35 + 0.5 * flash).toFixed(3)})` : undefined, border: `2px solid ${pronto ? `rgba(${RGB.claro},.75)` : `rgba(${RGB.claro},.25)`}`, boxSizing: 'border-box' }}>
            {pronto ? <QuadroMini w={FW} h={FH} t={j * 5} /> : <QuadroCodigo w={FW} h={FH} semente={`fq-${j}`} />}
            {flash > 0 ? <div style={{ position: 'absolute', inset: 0, background: `rgba(230,255,240,${(0.75 * flash).toFixed(3)})` }} /> : null}
            <div style={{ position: 'absolute', left: 10, top: 6, fontFamily: 'JetBrains Mono', fontSize: 28, color: pronto ? '#E8FFF0' : 'rgba(169,184,174,.7)', textShadow: '0 0 6px #000' }}>{`Q${String(j + 120).padStart(4, '0')}`}</div>
          </div>
        );
      })}
    </>
  );
};

/** Caixa apagada do fluxograma antigo, no desenho da cena 13 no quadro de entrada (FLUXO_13). */
export const CaixaFluxo: React.FC<{ x: number; y: number; w: number; h: number; r: number; i: number; opacidade?: number }> = ({ x, y, w, h, r, i, opacidade = 1 }) => {
  const C = FLUXO_13.cor;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: `linear-gradient(180deg, ${C.topo}, ${C.corpo})`, border: `2.5px solid ${C.borda}`, boxShadow: '0 24px 60px rgba(0,0,0,.6)', opacity: FLUXO_13.opacidade * opacidade, overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 34, background: 'rgba(255,255,255,.05)', borderBottom: `1.5px solid ${C.borda}` }} />
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: 'absolute', left: 14 + k * 18, top: 12, width: 10, height: 10, borderRadius: 5, background: C.borda }} />
      ))}
      <div style={{ position: 'absolute', right: 14, top: 4, fontFamily: 'JetBrains Mono', fontSize: 20, color: C.tinta }}>{`0${i + 1}`}</div>
    </div>
  );
};
