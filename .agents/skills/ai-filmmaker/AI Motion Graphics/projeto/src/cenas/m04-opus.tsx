/* Cena 4 (6,26–9,06 s): "Isso aqui é o Claude Opus 5.5."
   "Isso aqui é o" sobe pequeno; "CLAUDE" e "OPUS 5.5" (Inter 900, 290 px) caem letra a letra na
   palavra dita, "5.5" verde com brilho e uma linha de luz por baixo. Grade e chão em perspectiva,
   câmera empurrando ANCORADA no miolo do "O" de OPUS (ele não sai do lugar: a transição atravessa
   por ele). Rótulos técnicos em cascata: MODELO / ENTRADA / KEYFRAMES 0 (o contador sorteia e
   trava em 0). A deriva da câmera morre antes da saída para o "O" estar onde C04.centroO() diz. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { C04 } from '../layout';
import { BRILHO, clamp01, CORM, ease, FONTEM, janelaM, lerp, mola, TIPOM, trecho } from '../tema';
import { LogoApp } from '../logos';
import { Flare, FundoM, GradeChao, HUD, LinhaLuz, Poeira, timecodeM } from '../visual';

export const M04: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const apoio = trecho(4, 0, 3);
  const claude = trecho(4, 4, 4);
  const opus = trecho(4, 5);
  const hL = C04.estilo.tamanho * C04.estilo.entrelinha;
  const yOpus = C04.y + hL;
  const { itens: op } = useLayoutFala({ palavras: opus, x: C04.x, y: yOpus, estilo: C04.estilo, textos: { 0: 'OPUS', 1: '5.5' } });
  const cinco = op[1];
  const [ox, oy] = C04.centroO();

  // câmera: empurra até zoomSaida no início da saída, ancorada no "O"; a deriva morre antes
  const fimPush = Number.isFinite(c.saidaInicio) ? c.saidaInicio : 80;
  const z = lerp(1, C04.zoomSaida, ease.suave(clamp01(f / fimPush)));
  const vida = 1 - janelaM(f, fimPush - 24, fimPush, 'suave');
  const dx = Math.sin(f / 31) * 7 * vida;
  const dy = Math.cos(f / 37) * 5 * vida;

  // rótulos técnicos
  const qRot = c.local(claude[0].s);
  const rotulos: [string, string][] = [
    ['MODELO', 'claude-opus-5.5'],
    ['ENTRADA', 'palavras → código'],
    ['KEYFRAMES', '0'],
  ];
  const qTrava = c.local(opus[1].s) + 4;
  // ícone do modelo (LogoApp, placeholder): gira e acende no centro desde o 1º quadro (nasce de
  // dentro do flash), e no "Claude" voa para o lado de CLAUDE com impacto
  const qVoa = c.local(claude[0].s) - 4;
  const acende = janelaM(f, 0, 12, 'sai');
  const voa = janelaM(f, qVoa, qVoa + 8, 'corte');
  const impacto = 1 - janelaM(f, qVoa + 8, qVoa + 18, 'sai');
  const LOGO_TAM = 520;
  const lx = lerp(960, 1610, voa);
  const ly = lerp(560, 345, voa);
  const lEsc = lerp(lerp(2.0, 1.2, mola(f, 'assenta', 0)), 0.54, voa) * (1 + 0.06 * impacto * (f >= qVoa + 8 ? 1 : 0));
  const lGiro = lerp(-220, 0, ease.sai(clamp01(f / (qVoa + 8)))) + Math.sin(f / 14) * 4;
  const sorteio = f < qTrava ? String(Math.floor(random(`m04-k-${Math.floor(f / 2)}`) * 900 + 100)) : '0';

  return (
    <AbsoluteFill>
      <FundoM brilho={[34, 62]} />
      <GradeChao horizonte={905} opacidade={0.8} velocidade={2.4} />
      <Poeira semente="m04" />
      <AbsoluteFill style={{ transformOrigin: `${ox}px ${oy}px`, transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        <div style={{ position: 'absolute', left: lx - LOGO_TAM / 2, top: ly - LOGO_TAM / 2, transform: `scale(${lEsc}) rotate(${lGiro}deg)`, opacity: acende, filter: voa > 0 && voa < 1 ? `blur(${(Math.sin(Math.PI * voa) * 6).toFixed(1)}px)` : undefined }}>
          <LogoApp tam={LOGO_TAM} sigla="IA" redondo cor="#FFD2BE" fundo="#3A1E14" brilho={0.5 + 0.5 * Math.max(1 - acende * 0.6, impacto) + 0.1 * Math.sin(f / 4)} />
        </div>
        <Flare x={lx} y={ly} forca={f >= qVoa + 8 ? impacto : 0.35 * (1 - acende) + 0.2} cor="255,190,150" largura={900} />
        {/* filete do topo */}
        <div style={{ position: 'absolute', left: 150, top: 96, width: 1620 * janelaM(f, 0, 14, 'sai'), height: 2, background: CORM.linhaForte }} />
        {/* antecipa 4: a frase nasce de dentro do flash (o som de "Isso" começa no quadro do flash) */}
        <Fala palavras={apoio} x={C04.apoio.x} y={C04.apoio.y} estilo={TIPOM.apoio} cor={CORM.papel} antecipa={4} />
        <Fala palavras={claude} x={C04.x} y={C04.y} estilo={C04.estilo} modo="letras"
          staggerLetra={0.7} textos={{ 0: 'CLAUDE' }} estiloPalavra={() => ({ textShadow: BRILHO.branco })} />
        <Fala
          palavras={opus}
          x={C04.x}
          y={yOpus}
          estilo={C04.estilo}
          modo="letras"
          staggerLetra={0.7}
          textos={{ 0: 'OPUS', 1: '5.5' }}
          destaque={[1]}
          estiloPalavra={(i) => (i === 0 ? { textShadow: BRILHO.branco } : {})}
        />
        <LinhaLuz x1={cinco.x - 10} x2={cinco.x + cinco.w + 60} y={cinco.base + 46} progresso={janelaM(f, cinco.q + 2, cinco.q + 14, 'sai')} />
        {/* rótulos técnicos */}
        <div style={{ position: 'absolute', left: 160, top: 850, width: 1600, height: 2, background: CORM.linhaForte, transform: `scaleX(${janelaM(f, qRot - 4, qRot + 10)})`, transformOrigin: '0 0' }} />
        {rotulos.map(([k, v], i) => {
          const e = mola(f, 'assenta', qRot + i * 3);
          const ultimo = i === 2;
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 160,
                top: 872 + i * 44,
                fontFamily: FONTEM.mono,
                fontSize: 30,
                letterSpacing: '0.06em',
                whiteSpace: 'pre',
                opacity: e,
                transform: `translateX(${(1 - e) * -40}px)`,
                color: CORM.dim,
              }}
            >
              {k.padEnd(12, ' ')}
              <span style={{ color: ultimo ? CORM.verde : CORM.papel, textShadow: ultimo ? BRILHO.verdeLeve : undefined, fontWeight: ultimo ? 700 : 400 }}>{ultimo ? sorteio : v}</span>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            right: 260,
            top: 872,
            fontFamily: FONTEM.mono,
            fontSize: 30,
            color: CORM.dim,
            textAlign: 'right',
            lineHeight: '44px',
            opacity: janelaM(f, qRot + 8, qRot + 14),
            whiteSpace: 'pre',
          }}
        >
          {'fig. 1 — o modelo\npalavras entram, código sai'}
        </div>
      </AbsoluteFill>
      <HUD tr={`REC  ${timecodeM(c.global)}`} />
    </AbsoluteFill>
  );
};
