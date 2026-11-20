/* =====================================================================================
   transicoes/catalogo.tsx: as 20 transições do filme, cada uma isolada, com props genéricas para
   uma tela 1920x1080, e uma composição de teste para cada (pasta "transicoes" no Studio:
   T-chicoteLuz, T-glitchRGB, ...): cena A → transição → cena B.

   USAR NUM VÍDEO NOVO (dentro da lista ENTRADAS do roteiro do vídeo):
     entrada('glitchRGB')                                   com as props padrão daqui
     entrada('pontoAbre', { origem: [1500, 300] })           trocando props
   T = duração da janela em quadros; k = quadro do corte dentro da janela (o corte cai no som da
   primeira palavra da cena que entra). As que precisam achar algo na tela (atravessa, estica,
   tunel, fotograma, pulsoJanela, despenca, pontosSimbolo, pontoAbre, retangulo) recebem a
   geometria desse algo: a cena que sai deve deixar o elemento PARADO nesse lugar no início da janela.
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Composition, Folder, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming, type TransitionPresentation } from '@remotion/transitions';
import { Palco } from '../montagem';
import type { EntradaM } from '../cena';
import { pontosDoSimbolo } from '../cenas/simbolo-skill';
import { CORM, FONTEM, janelaM, PALETA } from '../tema';
import { FundoM, GradeChao, HUD, Poeira } from '../visual';
import { atravessa } from './atravessa';
import { TRANSICOES } from './base-transicoes';
import { chicoteLuz } from './chicoteLuz';
import { corteBatida } from './corteBatida';
import { despenca } from './despenca';
import { dispersao } from './dispersao';
import { estica } from './estica';
import { estilhaca } from './estilhaca';
import { faixas } from './faixas';
import { flash } from './flash';
import { flood } from './flood';
import { foco } from './foco';
import { fotograma } from './fotograma';
import { fusao } from './fusao';
import { glitchRGB } from './glitchRGB';
import { peliculaGira } from './peliculaGira';
import { pontoAbre } from './pontoAbre';
import { pontosSimbolo } from './pontosSimbolo';
import { pulsoJanela } from './pulsoJanela';
import { retangulo } from './retangulo';
import { tunel } from './tunel';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Item = { T: number; k: number; descricao: string; criar: (extra?: any) => TransitionPresentation<any> };

const CAIXAS_TESTE = [0, 1, 2].map((i) => ({ x: 360 + i * 440, y: 400, w: 320, h: 280, r: 18 }));
const KEYFRAMES_TESTE = Array.from({ length: 120 }, (_, i) => ({ x: 200 + (i % 20) * 80, y: 380 + Math.floor(i / 20) * 60, tam: 16, claro: i % 7 === 0 }));

export const CATALOGO: Record<string, Item> = {
  chicoteLuz: { T: 12, k: 6, descricao: 'chicote: as duas cenas correm para a esquerda com fantasmas e um risco de luz atravessa a tela', criar: (e) => chicoteLuz({ T: 12, k: 6, yLuz: 540, ...e }) },
  estilhaca: { T: 16, k: 5, descricao: 'a cena racha em 30 cacos 3D com borda de luz e faíscas; a próxima abre em círculo do impacto', criar: (e) => estilhaca({ T: 16, k: 5, impacto: [960, 540], ...e }) },
  flash: { T: 6, k: 2, descricao: 'estouro de luz: um quadro chapado de luz e a próxima cena superexposta assentando', criar: (e) => flash({ T: 6, k: 2, ...e }) },
  atravessa: { T: 16, k: 10, descricao: 'a câmera atravessa o miolo de uma letra ou forma (centro/raio) e a próxima cena está lá dentro', criar: (e) => atravessa({ T: 16, k: 10, centro: () => [960, 540], raio: () => [80, 110], ...e }) },
  estica: { T: 14, k: 8, descricao: 'uma barra (de) acende, estica na horizontal e na vertical e vira a próxima cena', criar: (e) => estica({ T: 14, k: 8, de: { x: 330, y: 472, w: 1260, h: 136, r: 68 }, ...e }) },
  tunel: { T: 18, k: 12, descricao: 'um painel (de) vira a boca de um túnel 3D de grade e a câmera voa por ele', criar: (e) => tunel({ T: 18, k: 12, de: { x: 360, y: 374, w: 1200, h: 332, r: 28 }, ...e }) },
  pontoAbre: { T: TRANSICOES.pontoAbre.T, k: TRANSICOES.pontoAbre.k, descricao: 'íris dupla que abre a partir de um ponto (origem)', criar: (e) => pontoAbre({ ...TRANSICOES.pontoAbre.padrao, T: TRANSICOES.pontoAbre.T, k: TRANSICOES.pontoAbre.k, ...e }) },
  glitchRGB: { T: 12, k: 6, descricao: 'glitch: separação RGB, fatias que pulam, varredura; a próxima chega quebrada e assenta', criar: (e) => glitchRGB({ T: 12, k: 6, ...e }) },
  faixas: {
    T: TRANSICOES.faixas.T,
    k: TRANSICOES.faixas.k,
    descricao: 'faixas inclinadas com texto correndo cobrem a tela e saem (itens, cores)',
    criar: (e) => faixas({ ...TRANSICOES.faixas.padrao, T: TRANSICOES.faixas.T, k: TRANSICOES.faixas.k, ...e }),
  },
  foco: { T: 14, k: 7, descricao: 'troca de foco de lente: desfoque com bokeh, volta ao foco com cantos de autofoco', criar: (e) => foco({ T: 14, k: 7, ...e }) },
  fotograma: {
    T: 16,
    k: 10,
    descricao: 'um círculo voa e vira o fotograma central de uma película de filme',
    criar: (e) => fotograma({ T: 16, k: 10, circulo: { cx: 960, cy: 540, r: 120 }, para: { x: 770, y: 455, w: 380, h: 270, r: 10 }, ...e }),
  },
  peliculaGira: { T: 10, k: 5, descricao: 'fusão curta de 5 quadros com um brilho varrendo as caixas do fluxograma (o giro da película mora na cena que sai)', criar: (e) => peliculaGira({ T: 10, k: 5, ...e }) },
  despenca: { T: 14, k: 6, descricao: 'retângulos da cena (caixas) se soltam e caem com gravidade; a próxima sobe por baixo', criar: (e) => despenca({ T: 14, k: 6, caixas: CAIXAS_TESTE, semente: 'teste', ...e }) },
  pulsoJanela: {
    T: 16,
    k: 8,
    descricao: 'um pulso estoura numa caixa (de) e um retângulo de luz vira a janela (para) com a próxima cena dentro',
    criar: (e) => pulsoJanela({ T: 16, k: 8, de: { x: 860, y: 440, w: 200, h: 200, r: 20 }, para: { x: 360, y: 190, w: 1200, h: 700, r: 24 }, ...e }),
  },
  corteBatida: { T: 6, k: 2, descricao: 'corte seco na batida: puxão, soco de câmera, sobre-exposição e réguas de luz', criar: (e) => corteBatida({ T: 6, k: 2, ...e }) },
  pontosSimbolo: {
    T: 26,
    k: 13,
    descricao: 'pontos (de) despencam, quicam e sobem em enxame até formar um desenho (alvos)',
    criar: (e) => pontosSimbolo({ T: 26, k: 13, de: KEYFRAMES_TESTE, alvos: pontosDoSimbolo(960, 560, 215, 4.5), semente: 'teste', ...e }),
  },
  dispersao: {
    T: TRANSICOES.dispersao.T,
    k: TRANSICOES.dispersao.k,
    descricao: 'texto ou pontos viram ~900 partículas que voam até os alvos da próxima cena',
    criar: (e) => dispersao({ ...TRANSICOES.dispersao.padrao, n: 900, T: TRANSICOES.dispersao.T, k: TRANSICOES.dispersao.k, ...e }),
  },
  flood: { T: TRANSICOES.flood.T, k: TRANSICOES.flood.k, descricao: 'varredura de cor inclinada com borda de luz (variantes: varredura, linha, centro)', criar: (e) => flood({ ...TRANSICOES.flood.padrao, T: TRANSICOES.flood.T, k: TRANSICOES.flood.k, ...e }) },
  retangulo: { T: TRANSICOES.retangulo.T, k: TRANSICOES.retangulo.k, descricao: 'um cartão (de) com alças de seleção expande até virar a próxima cena', criar: (e) => retangulo({ ...TRANSICOES.retangulo.padrao, T: TRANSICOES.retangulo.T, k: TRANSICOES.retangulo.k, ...e }) },
  fusao: { T: 10, k: 5, descricao: 'fusão com desfoque (a mais discreta)', criar: (e) => fusao({ T: 10, k: 5, ...e }) },
};

export type NomeTransicao = keyof typeof CATALOGO;

/** Entrada de cena pronta para a lista ENTRADAS de um roteiro. */
export const entrada = (nome: NomeTransicao, extra?: Record<string, unknown>): EntradaM => {
  const t = CATALOGO[nome];
  if (!t) throw new Error(`catalogo: transição "${String(nome)}" não existe`);
  return { nome: String(nome), T: t.T, k: t.k, plano: t.descricao, criar: () => t.criar(extra) };
};

/* ---------------- composições de teste (cena A → transição → cena B) ---------------- */
const Cartao: React.FC<{ letra: string; legenda: string; claro?: boolean }> = ({ letra, legenda, claro }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FundoM grade={1} brilho={claro ? [30, 40] : [70, 60]} />
      <GradeChao horizonte={760} opacidade={0.7} />
      <Poeira semente={letra} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: FONTEM.titulo,
            fontWeight: 900,
            fontSize: 420,
            lineHeight: 1,
            color: claro ? PALETA.acento : CORM.papel,
            transform: `scale(${1 + 0.04 * janelaM(f, 0, 60, 'suave')})`,
            textShadow: claro ? `0 0 60px ${PALETA.acento}` : undefined,
          }}
        >
          {letra}
        </div>
      </AbsoluteFill>
      <HUD tl={`CENA ${letra}`} tr={legenda} br="1920×1080 · 30 FPS" />
    </AbsoluteFill>
  );
};

const ANTES = 30;
const DEPOIS = 30;

const TesteTransicao: React.FC<{ nome: string }> = ({ nome }) => {
  const t = CATALOGO[nome];
  return (
    <Palco>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={ANTES + t.T}>
          <Cartao letra="A" legenda={nome.toUpperCase()} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: t.T })} presentation={t.criar()} />
        <TransitionSeries.Sequence durationInFrames={t.T + DEPOIS}>
          <Cartao letra="B" legenda={nome.toUpperCase()} claro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </Palco>
  );
};

export const ComposicoesTransicoes: React.FC = () => (
  <Folder name="transicoes">
    {Object.entries(CATALOGO).map(([nome, t]) => (
      <Composition key={nome} id={`T-${nome}`} component={TesteTransicao} defaultProps={{ nome }} durationInFrames={ANTES + t.T + DEPOIS} fps={30} width={1920} height={1080} />
    ))}
  </Folder>
);
