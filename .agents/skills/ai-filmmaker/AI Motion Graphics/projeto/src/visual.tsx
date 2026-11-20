/* visual.tsx: as peças de profundidade e de luz que todas as cenas usam.

   <FundoM brilho={[x%, y%]} grade={0..1} deriva={px/q} />  fundo escuro + brilho do acento + grade
       de prancheta (40/200 px) que deriva devagar + vinheta + grão. É o "papel" de toda cena.
   <GradeChao horizonte={y} velocidade={px/q} opacidade inclinacao />  chão em perspectiva que corre
       para a câmera (profundidade sem 3D de verdade).
   <Poeira n semente velocidade />  partículas em 3 planos (perto: grandes e desfocadas; longe:
       pontos finos), sempre andando.
   <Camera zoom={[de, para]} janela={[q0, q1]} origem={[x, y]} deriva={px} giro={graus}>  empurra
       a cena com curva suave e mantém um balanço leve (nada fica parado).
   <HUD tl tr bl br inicio />  rótulos técnicos de canto, JetBrains Mono 28 px, em cascata, com
       cruzes de registro nos cantos.
   <LinhaLuz x1 x2 y progresso cabeca />  filete do acento com núcleo branco, brilho e cabeça de luz
       com rastro horizontal (o "risco de luz" da referência).
   <Flare x y forca />  ponto de luz com estrela horizontal. */
import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { Grao } from './base/Grao';
import { clamp01, CORM, ease, FONTEM, janelaM, lerp, RGB, TIPOM } from './tema';

const W = 1920;
const H = 1080;

/* ------------------------------------------------------------------ fundo */
export const FundoM: React.FC<{
  brilho?: [number, number];
  forcaBrilho?: number;
  grade?: number;
  deriva?: number;
  semente?: string;
  grao?: boolean;
  /** multiplica o contraste das linhas da grade (1 = padrão) */
  forcaGrade?: number;
}> = ({ brilho = [50, 46], forcaBrilho = 1, grade = 1, deriva = 0.35, semente = 'fundo', grao = true, forcaGrade = 1 }) => {
  const f = useCurrentFrame();
  const off = f * deriva;
  const gM = (0.11 * forcaGrade).toFixed(3);
  const gm = (0.045 * forcaGrade).toFixed(3);
  return (
    <AbsoluteFill style={{ background: CORM.fundo, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 62% at ${brilho[0]}% ${brilho[1]}%, rgba(${RGB.halo},${0.55 * forcaBrilho}) 0%, rgba(${RGB.floresta},${0.6 * forcaBrilho}) 45%, rgba(${RGB.fundo},0) 80%)`,
        }}
      />
      {grade > 0 ? (
        <AbsoluteFill
          style={{
            opacity: grade,
            backgroundImage: [
              `linear-gradient(rgba(${RGB.claro},${gM}) 1px, transparent 1px)`,
              `linear-gradient(90deg, rgba(${RGB.claro},${gM}) 1px, transparent 1px)`,
              `linear-gradient(rgba(${RGB.claro},${gm}) 1px, transparent 1px)`,
              `linear-gradient(90deg, rgba(${RGB.claro},${gm}) 1px, transparent 1px)`,
            ].join(','),
            backgroundSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
            backgroundPosition: `${-off}px ${off * 0.4}px, ${-off}px ${off * 0.4}px, ${-off}px ${off * 0.4}px, ${-off}px ${off * 0.4}px`,
            WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, #000 35%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, #000 35%, transparent 100%)',
          }}
        />
      ) : null}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 55%, rgba(0,0,0,.75) 100%)' }} />
      {grao ? <Grao opacidade={0.06} semente={semente} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ chão em perspectiva */
export const GradeChao: React.FC<{
  horizonte?: number;
  velocidade?: number;
  opacidade?: number;
  progresso?: number;
  cor?: string;
}> = ({ horizonte = 640, velocidade = 2.2, opacidade = 1, progresso = 1, cor = RGB.claro }) => {
  const f = useCurrentFrame();
  const fundoY = H + 40;
  const altura = fundoY - horizonte;
  const linhas: React.ReactNode[] = [];
  // longitudinais: saem do ponto de fuga
  const fugaX = W / 2;
  const n = 26;
  for (let i = -n; i <= n; i++) {
    const xb = fugaX + i * 170;
    const p = clamp01(progresso * 1.6 - Math.abs(i) / n * 0.6);
    if (p <= 0) continue;
    linhas.push(<line key={`l${i}`} x1={fugaX + (xb - fugaX) * 0.02} y1={horizonte} x2={lerp(fugaX, xb, 1)} y2={lerp(horizonte, fundoY, p)} stroke={`rgba(${cor},.22)`} strokeWidth={1.2} />);
  }
  // transversais: profundidade z de 1 a 30, andando para a câmera
  const passo = 1;
  const desloc = ((f * velocidade) / 60) % passo;
  for (let k = 0; k < 30; k++) {
    const z = 1 + k * passo - desloc;
    if (z <= 0.35) continue;
    const y = horizonte + altura / z;
    if (y > fundoY) continue;
    const a = clamp01((1 / z) * 1.6) * progresso;
    linhas.push(<line key={`t${k}`} x1={0} x2={W} y1={y} y2={y} stroke={`rgba(${cor},${0.32 * a})`} strokeWidth={1.2} />);
  }
  return (
    <AbsoluteFill style={{ opacity: opacidade, pointerEvents: 'none' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="chaoFade" x1="0" y1={horizonte} x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="1" />
            <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        {linhas}
        <rect x={0} y={horizonte - 2} width={W} height={H - horizonte + 2} fill="url(#chaoFade)" />
        <line x1={0} x2={W} y1={horizonte} y2={horizonte} stroke={`rgba(${cor},${0.35 * progresso})`} strokeWidth={1} />
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ poeira em 3 planos */
export const Poeira: React.FC<{ n?: number; semente?: string; velocidade?: number; opacidade?: number }> = ({
  n = 46,
  semente = 'poeira',
  velocidade = 1,
  opacidade = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: opacidade }}>
      {Array.from({ length: n }, (_, i) => {
        const r = (k: string) => random(`${semente}-${k}-${i}`);
        const plano = r('p'); // 0 longe, 1 perto
        const tam = plano > 0.85 ? 10 + r('t') * 14 : 2 + r('t') * 3.5;
        const vx = (r('vx') - 0.5) * 0.9 * velocidade * (0.4 + plano);
        const vy = (-0.25 - r('vy') * 0.7) * velocidade * (0.4 + plano);
        const x = ((((r('x') * (W + 200) + vx * f) % (W + 200)) + W + 200) % (W + 200)) - 100;
        const y = ((((r('y') * (H + 200) + vy * f) % (H + 200)) + H + 200) % (H + 200)) - 100;
        const pisca = 0.55 + 0.45 * Math.sin(f / (6 + r('f') * 10) + r('o') * 6.28);
        const verde = r('c') < 0.55;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: tam,
              height: tam,
              borderRadius: '50%',
              background: verde ? CORM.verdeClaro : '#FFFFFF',
              opacity: (plano > 0.85 ? 0.16 : 0.5) * pisca,
              filter: plano > 0.85 ? `blur(${3 + tam * 0.3}px)` : undefined,
              boxShadow: plano > 0.85 ? undefined : `0 0 ${tam * 3}px rgba(${RGB.claro},.6)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ câmera */
export const Camera: React.FC<{
  zoom?: [number, number];
  janela?: [number, number];
  origem?: [number, number];
  deriva?: number;
  giro?: number;
  extra?: string;
  children: React.ReactNode;
}> = ({ zoom = [1, 1.05], janela = [0, 90], origem = [960, 540], deriva = 10, giro = 0.4, extra = '', children }) => {
  const f = useCurrentFrame();
  const z = lerp(zoom[0], zoom[1], ease.suave(clamp01((f - janela[0]) / Math.max(1, janela[1] - janela[0]))));
  const dx = Math.sin(f / 37) * deriva;
  const dy = Math.cos(f / 43) * deriva * 0.6;
  const rz = Math.sin(f / 51) * giro;
  return (
    <AbsoluteFill style={{ transformOrigin: `${origem[0]}px ${origem[1]}px`, transform: `${extra} translate(${dx}px, ${dy}px) scale(${z}) rotate(${rz}deg)` }}>
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ HUD de canto */
export const HUD: React.FC<{ tl?: string; tr?: string; bl?: string; br?: string; inicio?: number; cor?: string; opacidade?: number }> = ({
  tl,
  tr,
  bl,
  br,
  inicio = 0,
  cor = CORM.dim,
  opacidade = 1,
}) => {
  const f = useCurrentFrame();
  const margem = 64;
  const rot = (texto: string | undefined, i: number, pos: React.CSSProperties) => {
    if (!texto) return null;
    const t = f - inicio - i * 3;
    if (t < 0) return null;
    // digita em 8 quadros
    const n = Math.ceil(texto.length * clamp01(t / 8));
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          ...pos,
          fontFamily: FONTEM.mono,
          fontSize: TIPOM.rotulo.tamanho,
          letterSpacing: `${TIPOM.rotulo.tracking}em`,
          color: cor,
          whiteSpace: 'pre',
          textTransform: 'uppercase',
          opacity: janelaM(t, 0, 4),
        }}
      >
        {texto.slice(0, n)}
      </div>
    );
  };
  const cruz = (x: number, y: number, i: number) => {
    const p = janelaM(f - inicio - i * 2, 0, 10);
    return (
      <g key={`c${i}`} opacity={0.7 * p} stroke={CORM.verdeClaro} strokeWidth={2}>
        <line x1={x - 14 * p} x2={x + 14 * p} y1={y} y2={y} />
        <line x1={x} x2={x} y1={y - 14 * p} y2={y + 14 * p} />
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: opacidade }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {cruz(36, 36, 0)}
        {cruz(W - 36, 36, 1)}
        {cruz(36, H - 36, 2)}
        {cruz(W - 36, H - 36, 3)}
      </svg>
      {rot(tl, 0, { left: margem, top: margem - 6 })}
      {rot(tr, 1, { right: margem, top: margem - 6 })}
      {rot(bl, 2, { left: margem, bottom: margem - 6 })}
      {rot(br, 3, { right: margem, bottom: margem - 6 })}
    </AbsoluteFill>
  );
};

/** Timecode MM:SS:QQ de um quadro do filme. */
export const timecodeM = (q: number) => {
  const s = Math.floor(q / 30);
  const p = (v: number) => String(v).padStart(2, '0');
  return `${p(Math.floor(s / 60))}:${p(s % 60)}:${p(q % 30)}`;
};

/* ------------------------------------------------------------------ luz */
export const Flare: React.FC<{ x: number; y: number; forca?: number; cor?: string; largura?: number }> = ({ x, y, forca = 1, cor = RGB.claro, largura = 420 }) => {
  if (forca <= 0.01) return null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - largura / 2,
          top: y - 3,
          width: largura,
          height: 6,
          borderRadius: 6,
          background: `linear-gradient(90deg, rgba(${cor},0), rgba(${cor},${0.9 * forca}) 50%, rgba(${cor},0))`,
          filter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 70,
          top: y - 70,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,${forca}) 0%, rgba(${cor},${0.75 * forca}) 12%, rgba(${cor},${0.18 * forca}) 38%, rgba(${cor},0) 70%)`,
        }}
      />
    </>
  );
};

export const LinhaLuz: React.FC<{
  x1: number;
  x2: number;
  y: number;
  /** 0→1: até onde a linha foi desenhada */
  progresso?: number;
  /** 0→1: quanto do começo já apagou (rastro) */
  apaga?: number;
  cabeca?: number;
  espessura?: number;
}> = ({ x1, x2, y, progresso = 1, apaga = 0, cabeca = 1, espessura = 3 }) => {
  const p = clamp01(progresso);
  if (p <= 0) return null;
  const xa = lerp(x1, x2, clamp01(apaga));
  const xb = lerp(x1, x2, p);
  if (xb - xa < 1) return null;
  const grad = `linear-gradient(90deg, rgba(${RGB.acento},0), rgba(${RGB.acento},.9) 35%, rgba(200,255,220,1))`;
  return (
    <>
      <div style={{ position: 'absolute', left: xa, top: y - espessura * 5, width: xb - xa, height: espessura * 10, background: grad, opacity: 0.18, filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', left: xa, top: y - espessura / 2, width: xb - xa, height: espessura, background: grad, boxShadow: `0 0 12px rgba(${RGB.acento},.8)` }} />
      <Flare x={xb} y={y} forca={cabeca} />
    </>
  );
};

/** Faísca de luz quente (núcleo branco, halo creme → verde, estrela horizontal e vertical) com
    rastro de fagulhas nas posições anteriores. `rastro`: posições recentes, mais nova primeiro. */
export const Faisca: React.FC<{ x: number; y: number; forca?: number; rastro?: [number, number][]; semente?: string }> = ({ x, y, forca = 1, rastro = [], semente = 'faisca' }) => {
  const f = useCurrentFrame();
  if (forca <= 0.01) return null;
  const pisca = 0.85 + 0.15 * Math.sin(f * 2.3) + 0.08 * (random(`${semente}-${f}`) - 0.5);
  const k = forca * pisca;
  return (
    <>
      {rastro.map(([rx, ry], i) => {
        const a = (1 - i / Math.max(1, rastro.length)) * 0.8 * forca;
        const tam = 3 + 5 * (1 - i / rastro.length);
        const jy = (random(`${semente}-r-${f}-${i}`) - 0.5) * 18 * (i / rastro.length);
        return <div key={i} style={{ position: 'absolute', left: rx - tam / 2, top: ry - tam / 2 + jy, width: tam, height: tam, borderRadius: '50%', background: i < 3 ? '#FFFFFF' : CORM.verdeClaro, opacity: a, boxShadow: `0 0 10px rgba(${RGB.claro},.9)` }} />;
      })}
      <div style={{ position: 'absolute', left: x - 380, top: y - 4, width: 760, height: 8, borderRadius: 8, background: `linear-gradient(90deg, rgba(${RGB.claro},0), rgba(255,246,220,${0.95 * k}) 50%, rgba(${RGB.claro},0))`, filter: 'blur(1.5px)' }} />
      <div style={{ position: 'absolute', left: x - 2, top: y - 90, width: 4, height: 180, background: `linear-gradient(180deg, rgba(${RGB.claro},0), rgba(255,246,220,${0.7 * k}) 50%, rgba(${RGB.claro},0))`, filter: 'blur(1px)' }} />
      <div
        style={{
          position: 'absolute',
          left: x - 200,
          top: y - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,${k}) 0%, rgba(255,244,214,${k}) 5%, rgba(255,226,170,${0.55 * k}) 11%, rgba(${RGB.claro},${0.38 * k}) 22%, rgba(${RGB.acento},${0.12 * k}) 42%, rgba(${RGB.acento},0) 70%)`,
        }}
      />
    </>
  );
};
