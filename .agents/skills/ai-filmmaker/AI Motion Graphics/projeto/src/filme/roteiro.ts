/* =====================================================================================
   filme/roteiro.ts: as 19 cenas do filme modelo, na ordem, com a transição de ENTRADA de cada uma.
   A conta de tempo (prender cada corte ao início da fala) está em ../montagem.tsx (montarRoteiro).
   Para um vídeo novo, copie este arquivo como modelo: uma lista ENTRADAS (null na cena 1) e
   montarRoteiro({ cenasFala, entradas, nomes, duracao }).
   ===================================================================================== */
import { dispersao } from '../transicoes/dispersao';
import { faixas } from '../transicoes/faixas';
import { flood } from '../transicoes/flood';
import { pontoAbre } from '../transicoes/pontoAbre';
import type { EntradaM } from '../cena';
import { C01, C02, C04, C05 } from '../layout';
import { montarRoteiro } from '../montagem';
import { CENAS_FALA, CORM, VIDEO_M } from '../tema';
import { atravessa } from '../transicoes/atravessa';
import { chicoteLuz } from '../transicoes/chicoteLuz';
import { estica } from '../transicoes/estica';
import { estilhaca } from '../transicoes/estilhaca';
import { flash } from '../transicoes/flash';
import { TRANSICOES } from '../transicoes/base-transicoes';
import { C06, C07, C11, C12 } from '../layoutB';
import { foco } from '../transicoes/foco';
import { fotograma } from '../transicoes/fotograma';
import { glitchRGB } from '../transicoes/glitchRGB';
import { peliculaGira } from '../transicoes/peliculaGira';
import { tunel } from '../transicoes/tunel';
import { C13 } from '../cenas/m13-fluxo-velho';
import { C14 } from '../cenas/m14-fluxo-novo';
import { C15 } from '../cenas/m15-ajustes';
import { keyframesTela16 } from '../cenas/m16-keyframes';
import { C18 } from '../cenas/m18-absurdo';
import { pontosDoSimbolo, SIMBOLO17 } from '../cenas/simbolo-skill';
import { corteBatida } from '../transicoes/corteBatida';
import { despenca } from '../transicoes/despenca';
import { pontosSimbolo } from '../transicoes/pontosSimbolo';
import { pulsoJanela } from '../transicoes/pulsoJanela';

/** Transição de entrada de cada cena (índice 0 = cena 1, sem entrada). */
const ENTRADAS: (EntradaM | null)[] = [
  null,
  { nome: 'chicoteLuz', T: 12, k: 6, criar: () => chicoteLuz({ T: 12, k: 6, yLuz: C01.yLuz() }) },
  { nome: 'estilhaca', T: 16, k: 5, criar: () => estilhaca({ T: 16, k: 5, impacto: C02.impacto }) },
  { nome: 'flash', T: 6, k: 2, criar: () => flash({ T: 6, k: 2 }) },
  {
    nome: 'atravessa',
    T: 16,
    k: 10,
    criar: () =>
      atravessa({
        T: 16,
        k: 10,
        centro: C04.centroO,
        raio: () => {
          const [rx, ry] = C04.raioO();
          return [rx * C04.zoomSaida, ry * C04.zoomSaida];
        },
      }),
  },
  { nome: 'estica', T: 14, k: 8, criar: () => estica({ T: 14, k: 8, de: C05.barra }) },
  { nome: 'tunel', T: 18, k: 12, plano: '6→7 o painel do pedido abre um túnel 3D da grade', criar: () => tunel({ T: 18, k: 12, de: C06.painel }) },
  {
    nome: 'pontoAbre',
    T: TRANSICOES.pontoAbre.T,
    k: TRANSICOES.pontoAbre.k,
    plano: '7→8 o ponto abre a próxima cena (ponto da cena 7 em C07.ponto)',
    criar: () => pontoAbre({ origem: C07.ponto, T: TRANSICOES.pontoAbre.T, k: TRANSICOES.pontoAbre.k }),
  },
  { nome: 'glitchRGB', T: 12, k: 6, plano: '8→9 glitch RGB que "conserta" o slide', criar: () => glitchRGB({ T: 12, k: 6 }) },
  {
    nome: 'faixas',
    T: TRANSICOES.faixas.T,
    k: TRANSICOES.faixas.k,
    plano: '9→10 cartões fecham em faixas (com os cinco nomes)',
    criar: () =>
      faixas({
        ...TRANSICOES.faixas.padrao,
        n: 5,
        altura: 260,
        cores: [CORM.verde, CORM.fundo, CORM.verde, CORM.fundo, CORM.verde],
        coresTexto: [CORM.fundo, CORM.verdeClaro, CORM.fundo, CORM.verdeClaro, CORM.fundo],
        itens: ['TIPOGRAFIA', 'GRADE', 'RITMO', 'EASING', 'PALETA'],
        T: TRANSICOES.faixas.T,
        k: TRANSICOES.faixas.k,
      }),
  },
  { nome: 'foco', T: 14, k: 7, plano: '10→11 desfoque de foco', criar: () => foco({ T: 14, k: 7 }) },
  {
    nome: 'fotograma',
    T: 16,
    k: 10,
    plano: '11→12 o círculo vira um fotograma de filme',
    criar: () => fotograma({ T: 16, k: 10, circulo: { cx: C11.circulo.cx, cy: C11.circulo.cy, r: C11.circulo.r * 1.05 }, para: C12.fotograma }),
  },
  { nome: 'peliculaGira', T: 10, k: 5, plano: '12→13 a película gira e vira o fluxograma (o giro é da cena 12)', criar: () => peliculaGira({ T: 10, k: 5 }) },
  { nome: 'despenca', T: 14, k: 6, criar: () => despenca({ T: 14, k: 6, caixas: C13.caixasTela(), semente: 'm13-m14' }) },
  { nome: 'pulsoJanela', T: 16, k: 8, criar: () => pulsoJanela({ T: 16, k: 8, de: C14.videoTela(), para: C15.janela }) },
  { nome: 'corteBatida', T: 6, k: 2, criar: () => corteBatida({ T: 6, k: 2 }) },
  { nome: 'pontosSimbolo', T: 26, k: 13, criar: () => pontosSimbolo({ T: 26, k: 13, de: keyframesTela16(), alvos: pontosDoSimbolo(SIMBOLO17.cx, SIMBOLO17.cy, SIMBOLO17.R, 4.5), semente: 'm16-m17' }) },
  {
    nome: 'dispersao',
    T: TRANSICOES.dispersao.T,
    k: TRANSICOES.dispersao.k,
    plano: '17→18 dispersão: o símbolo da skill vira o arco de luz da 18',
    criar: () =>
      dispersao({
        fonte: [{ tipo: 'pontos', pontos: pontosDoSimbolo(SIMBOLO17.cx, SIMBOLO17.cy, SIMBOLO17.R, 2.5) }],
        alvos: { pontos: C18.pontosArco(90), raio: 7 },
        semente: 'm17-m18',
        n: 900,
        T: TRANSICOES.dispersao.T,
        k: TRANSICOES.dispersao.k,
      }),
  },
  {
    nome: 'flood',
    T: TRANSICOES.flood.T,
    k: TRANSICOES.flood.k,
    plano: '18→19 verde inunda a tela',
    criar: () => flood({ ...TRANSICOES.flood.padrao, cor: CORM.verde, direcao: 0, T: TRANSICOES.flood.T, k: TRANSICOES.flood.k }),
  },
];

const NOMES = [
  'maquina',
  'after-effects',
  'plugin',
  'opus',
  'prompt',
  'pedido',
  'detalhe',
  'powerpoint',
  'referencias',
  'codigo',
  'matematica',
  'quadro-a-quadro',
  'fluxo-velho',
  'fluxo-novo',
  'ajustes',
  'keyframes',
  'skill',
  'absurdo',
  'comenta',
];

export const CENAS_M = montarRoteiro({ cenasFala: CENAS_FALA, entradas: ENTRADAS, nomes: NOMES, duracao: VIDEO_M.duracao });
