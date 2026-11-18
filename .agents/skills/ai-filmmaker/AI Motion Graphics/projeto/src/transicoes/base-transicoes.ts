/* Tipos e valores padrão das transições de varredura (flood, faixas, pontoAbre, retângulo,
   dispersão). As cores vêm da PALETA do tema: `claro` e `forte` são as duas pontas da luz de borda. */
import { PALETA } from '../tema';
import type { Alinhamento } from '../base/medir';

export type XY = readonly [number, number];
/** Um ponto fixo ou uma função que o calcula medindo texto (chame resolverXY dentro do render). */
export type RefXY = XY | (() => XY);
export const resolverXY = (r: RefXY): XY => (typeof r === 'function' ? r() : r);
export type Ret = { x: number; y: number; w: number; h: number; r?: number };

/** Cores da luz das transições (degradê claro → forte do acento). */
export const COR = {
  claro: PALETA.acentoClaro,
  forte: PALETA.acento,
  verde: PALETA.acento,
  branco: PALETA.branco,
  preto: '#050505',
};

/** tracking padrão do texto que vira partícula (em "em") */
export const TRACKING_PARTICULAS = -0.025;

export type PropsFlood = {
  /** 0 = vem da esquerda, 90 = de baixo, 180 = da direita, 270 = de cima */
  direcao: number;
  inclinacao: number;
  /** 'varredura' = semiplano inclinado; 'linha' = linha que se abre na vertical; 'centro' = cresce do centro */
  variante: 'varredura' | 'linha' | 'centro';
  borda: boolean;
  /** cor da placa = fundo da cena que entra */
  cor: string;
  yLinha: number;
};
export type PropsPontoAbre = { origem: RefXY };
export type PropsRetangulo = { de: Ret; para: Ret; modo: 'expande' | 'recolhe' };
export type PropsFaixas = {
  n: 3 | 5;
  altura: number;
  angulo: number;
  cores: string[];
  coresTexto: string[];
  itens: string[];
  permanece: boolean;
  velocidade: number;
};
export type FonteParticulas =
  | { tipo: 'texto'; texto: string; x: number; base: number; tamanho: number; peso?: number; tracking?: number; alinhar?: Alinhamento }
  | { tipo: 'pontos'; pontos: XY[] };
export type AlvosParticulas = { retangulos?: Ret[]; pontos?: readonly XY[]; raio?: number };
export type PropsDispersao = { fonte: FonteParticulas[]; alvos: AlvosParticulas; semente: string; n: number };

const TELA_CHEIA: Ret = { x: 0, y: 0, w: 1920, h: 1080, r: 0 };

/** T = duração da janela em quadros; k = quadro do corte dentro da janela. */
export const TRANSICOES = {
  flood: { T: 14, k: 11, padrao: { direcao: 0, inclinacao: 12, variante: 'varredura', borda: true, cor: PALETA.acento, yLinha: 540 } as PropsFlood },
  pontoAbre: { T: 14, k: 8, padrao: { origem: [960, 540] } as PropsPontoAbre },
  retangulo: { T: 16, k: 12, padrao: { de: { x: 760, y: 440, w: 400, h: 200, r: 14 }, para: TELA_CHEIA, modo: 'expande' } as PropsRetangulo },
  faixas: {
    T: 18,
    k: 9,
    padrao: { n: 3, altura: 420, angulo: -7, cores: ['#050505', PALETA.acento, '#050505'], coresTexto: [PALETA.branco, '#050505', PALETA.branco], itens: ['MOTION'], permanece: false, velocidade: 10 } as PropsFaixas,
  },
  dispersao: { T: 24, k: 18, padrao: { fonte: [], alvos: {}, semente: 'dispersao', n: 700 } as PropsDispersao },
};
