/* cena.ts: o contexto de cada cena (vale para o filme modelo e para qualquer vídeo novo).

   COMO UMA CENA USA
   const c = useCenaM();
     c.n            número da cena (1, 2, ...)
     c.frame        quadro local (0 = início da Sequence, que começa k quadros ANTES da fala)
     c.global       quadro no filme inteiro
     c.local(s)     segundo da narração → quadro local (use para sincronizar qualquer coisa com a fala)
     c.corteLocal   quadro local do corte de entrada (= k da transição; 2 q antes da fala marcada)
     c.saidaInicio  quadro local em que a transição de saída começa (seqDuracao − T); Infinity na 19
     c.saidaCorte   quadro local do corte da saída (= início da fala da próxima cena)
     c.emSaida      frame >= saidaInicio
     c.pSaida       progresso 0→1 da janela de saída
     c.pEntrada     progresso 0→1 da janela de entrada (1 se não houver)
   Cada cena roda igual no vídeo inteiro e isolada (ex.: M-01): o provedor é o mesmo. */
import { createContext, useContext } from 'react';
import type { TransitionPresentation } from '@remotion/transitions';
import { useCurrentFrame } from 'remotion';
import { clamp01, quadroDe } from './tema';

/** Uma transição de entrada de cena: nome, janela (T quadros, corte no quadro k) e a apresentação. */
export type EntradaM = {
  nome: string;
  T: number;
  k: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  criar: () => TransitionPresentation<any>;
  /** o que este corte faz, em uma frase (documentação) */
  plano?: string;
};

export type CenaDefM = {
  n: number;
  nome: string;
  /** quadro do filme do corte de entrada (tempos.json → inicio_f − ADIANTA; 0 na cena 1) */
  corte: number;
  seqInicio: number;
  seqDuracao: number;
  entrada: EntradaM | null;
  saida: EntradaM | null;
};

export const CenaContextM = createContext<CenaDefM | null>(null);
export const CenaProviderM = CenaContextM.Provider;

export const useDefM = (): CenaDefM => {
  const c = useContext(CenaContextM);
  if (!c) throw new Error('useCenaM: a cena precisa estar dentro de <CenaProviderM value={...}>');
  return c;
};

export const useCenaM = () => {
  const def = useDefM();
  const frame = useCurrentFrame();
  const saidaInicio = def.saida ? def.seqDuracao - def.saida.T : Infinity;
  const corteLocal = def.corte - def.seqInicio;
  return {
    ...def,
    frame,
    global: def.seqInicio + frame,
    local: (s: number) => quadroDe(s) - def.seqInicio,
    corteLocal,
    saidaInicio,
    saidaCorte: def.saida ? saidaInicio + def.saida.k : Infinity,
    emSaida: frame >= saidaInicio,
    pSaida: def.saida ? clamp01((frame - saidaInicio) / def.saida.T) : 0,
    pEntrada: def.entrada ? clamp01(frame / def.entrada.T) : 1,
  };
};
