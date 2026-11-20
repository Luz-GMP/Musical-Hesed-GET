/* =====================================================================================
   videos/demo: a demonstração curta (~9,5 s, 3 cenas, 2 transições). É também o MODELO de vídeo
   novo: copie esta pasta para src/videos/<nome>/, troque o tempos.json e as cenas, registre no Root.

   Peças usadas: <Fala> (palavra cinética sincronizada), <Faisca>, <LinhaLuz>, <MiraLaser>,
   <FundoM>, <GradeChao>, <Poeira>, <Camera>, <HUD>, <Fagulhas>, <Onda>, e as transições
   glitchRGB (1→2) e chicoteLuz (2→3) do catálogo.
   Sem narração: os tempos vêm de tempos.json, gerado com
     node scripts/tempos-de-texto.mjs "Cada palavra entra quando é dita. | A mira acha o alvo, a faísca acende. | Tudo escrito em código."
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Composition } from 'remotion';
import { Camera, Fagulhas, Faisca, Fala, FundoM, GradeChao, HUD, LinhaLuz, MiraLaser, Onda, Poeira, timecodeM, useLayoutFala } from '../../blocos';
import { useCenaM } from '../../cena';
import { montarRoteiro, VideoMontado } from '../../montagem';
import { clamp01, CORM, ease, janelaM, lerp, mola, TIPOM } from '../../tema';
import { criarTempos, type TemposJson } from '../../tempos';
import { entrada } from '../../transicoes/catalogo';
import TEMPOS from './tempos.json';

const T = criarTempos(TEMPOS as TemposJson);
const FPS = 30;
const DURACAO = Math.round((T.fimFala + 0.8) * FPS);

/* ---------- cena 1: a faísca escreve a frase; "dita" acende ---------- */
const D1: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = T.falaDaCena(1);
  const props = { palavras: fala, x: 960, y: 420, alinhar: 'centro' as const, estilo: { ...TIPOM.frase, tamanho: 100 }, largura: 1760 };
  const lf = useLayoutFala(props);
  const ultimo = lf.itens[lf.itens.length - 1];
  // a faísca corre na ponta do texto já dito
  const ponta = (q: number) => {
    let x = lf.itens[0].x;
    for (const it of lf.itens) if (q >= it.q) x = it.x + it.w * clamp01((q - it.q) / Math.max(1, it.qFim - it.q));
    return x;
  };
  const yLinha = ultimo.base + 34;
  const qDita = ultimo.q;
  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 48]} grade={0.6 + 0.4 * janelaM(f, 0, 30, 'suave')} />
      <GradeChao horizonte={720} progresso={janelaM(f, 0, 40, 'sai')} />
      <Poeira semente="d1" />
      <Camera zoom={[1, 1.08]} janela={[0, c.saidaInicio]}>
        <LinhaLuz x1={lf.itens[0].x - 30} x2={ponta(f) + 6} y={yLinha} cabeca={0} espessura={3} />
        <Fala {...props} modo="maquina" cursor={false} cor={CORM.papel} destaque={['dita']} />
        <Faisca x={ponta(f)} y={yLinha - 4} forca={1 - janelaM(f, ultimo.qFim + 4, ultimo.qFim + 14)} rastro={Array.from({ length: 8 }, (_, j) => [ponta(f - j - 1), yLinha] as [number, number])} semente="d1f" />
        <Onda f={f} q0={qDita} x={ultimo.x + ultimo.w / 2} y={ultimo.base - 40} r1={320} />
        <Fagulhas f={f} q0={qDita} x={ultimo.x + ultimo.w / 2} y={ultimo.base - 40} semente="d1-fag" />
      </Camera>
      <HUD tl="DEMO / 01" tr={`REC  ${timecodeM(c.global)}`} bl="FALA SINCRONIZADA" br="30 FPS · 1920×1080" inicio={2} />
    </AbsoluteFill>
  );
};

/* ---------- cena 2: a mira varre a grade e trava no alvo; "faísca" estoura ---------- */
const D2: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = T.falaDaCena(2);
  const props = { palavras: fala, x: 140, y: 640, estilo: { ...TIPOM.frase, tamanho: 104 }, largura: 1640, destaque: ['alvo', 'faísca'] };
  const lf = useLayoutFala(props);
  const alvo = lf.itens.find((it) => it.texto.startsWith('alvo')) ?? lf.itens[0];
  const faisca = lf.itens.find((it) => it.texto.startsWith('faísca')) ?? lf.itens[0];
  const destino: [number, number] = [alvo.x + alvo.w / 2, alvo.base - 38];
  const a = janelaM(f, c.corteLocal, c.corteLocal + 14, 'corte');
  const b = janelaM(f, c.corteLocal + 14, alvo.q, 'corte');
  const mx = f < c.corteLocal + 14 ? lerp(1700, 1180, a) : lerp(1180, destino[0], b);
  const my = f < c.corteLocal + 14 ? lerp(200, 300, a) : lerp(300, destino[1], b);
  const travou = mola(f, 'estalo', alvo.q);
  const fora = janelaM(f, faisca.q, faisca.q + 10, 'sai');
  return (
    <AbsoluteFill>
      <FundoM brilho={[60, 40]} grade={1} forcaGrade={1 + travou} />
      <Poeira semente="d2" velocidade={1.4} />
      <Camera zoom={[1.04, 1]} janela={[0, 40]} deriva={6}>
        <MiraLaser x={mx} y={my} raio={(150 + 80 * (1 - travou)) * (1 - fora)} fora={fora} opacidade={janelaM(f, 0, 6)} />
        <Fala {...props} />
        <Faisca x={faisca.x + faisca.w / 2} y={faisca.base - 40} forca={clamp01(1 - Math.abs(f - faisca.q - 4) / 10) * 1.4} semente="d2f" />
        <Fagulhas f={f} q0={faisca.q + 2} x={faisca.x + faisca.w / 2} y={faisca.base - 40} n={24} raio={300} semente="d2-fag" />
      </Camera>
      <HUD tl="DEMO / 02" tr={`REC  ${timecodeM(c.global)}`} bl={`ALVO X ${Math.round(destino[0])} Y ${Math.round(destino[1])}`} br="MIRA DE LASER" />
    </AbsoluteFill>
  );
};

/* ---------- cena 3: "código" bate gigante com a linha de luz ---------- */
const D3: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = T.falaDaCena(3);
  const apoio = fala.slice(0, 3);
  const codigo = fala.slice(3);
  const lg = useLayoutFala({ palavras: codigo, x: 960, y: 430, alinhar: 'centro', estilo: { ...TIPOM.gigante, tamanho: 260 } });
  const g = lg.itens[0];
  const linha = janelaM(f, g.q + 2, g.q + 14, 'sai');
  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 55]} forcaBrilho={1 + 0.6 * ease.sai(clamp01((f - g.q) / 12))} />
      <GradeChao horizonte={780} velocidade={3} />
      <Poeira semente="d3" />
      <Camera zoom={[1.06, 1]} janela={[0, 30]}>
        <Fala palavras={apoio} x={960} y={300} alinhar="centro" estilo={TIPOM.apoio} cor={CORM.papel} />
        <Fala palavras={codigo} x={960} y={430} alinhar="centro" estilo={{ ...TIPOM.gigante, tamanho: 260 }} modo="slam" destaque={[0]} />
        <LinhaLuz x1={g.x - 40} x2={g.x + g.w + 40} y={g.base + 40} progresso={linha} />
        <Onda f={f} q0={g.q + 1} x={960} y={g.base - 100} r1={700} dur={22} />
      </Camera>
      <HUD tl="DEMO / 03" tr={`REC  ${timecodeM(c.global)}`} bl="ESCRITO EM CÓDIGO" br="FIM" />
    </AbsoluteFill>
  );
};

const CENAS = montarRoteiro({
  cenasFala: T.CENAS_FALA,
  entradas: [null, entrada('glitchRGB'), entrada('chicoteLuz', { yLuz: 560 })],
  nomes: ['frase', 'mira', 'codigo'],
  duracao: DURACAO,
});

export const Demo: React.FC = () => <VideoMontado cenas={CENAS} componentes={[D1, D2, D3]} audio={null} />;

export const ComposicaoDemo: React.FC = () => <Composition id="Demo" component={Demo} durationInFrames={DURACAO} fps={FPS} width={1920} height={1080} />;
