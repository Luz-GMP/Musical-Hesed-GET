/* =====================================================================================
   montagem.tsx: monta um vídeo de cenas + transições preso à fala. Serve para o filme modelo e
   para qualquer vídeo novo.

   A CONTA (cada corte cai no som da primeira palavra da cena)
     corte_i     = quadro em que a fala da cena i começa (cenas[i].inicio_f) − adianta
                   (adianta = 2: transcrições automáticas marcam o início da palavra 1 a 3 quadros
                   DEPOIS do som começar; a cena 1 fica no quadro 0)
     seqInicio_i = corte_i − k_i              (a Sequence começa k quadros antes da fala: é a
                                               pré-rolagem da transição de entrada)
     seqDur_i    = (corte_{i+1} − k_{i+1} + T_{i+1}) − seqInicio_i     (última: até `duracao`)
   O <TransitionSeries> sobrepõe T_{i+1} quadros entre i e i+1, então o quadro k de cada transição
   (o corte) cai exatamente em corte_i, e o quadro local de uma palavra é quadroDe(s) − seqInicio
   (useCenaM().local(s)): o tempo da palavra não depende da transição.

   USO
     const CENAS = montarRoteiro({ cenasFala: T.CENAS_FALA, entradas: ENTRADAS, nomes, duracao });
     <VideoMontado cenas={CENAS} componentes={[Cena1, Cena2]} audio="narracao.mp3" />
     conferirTempos(CENAS, duracao).ok  → true se a soma fecha e nenhuma cena é curta demais.
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { Fontes } from './base/Fontes';
import { CenaProviderM, type CenaDefM, type EntradaM } from './cena';
import { CORM } from './tema';
import type { CenaFala } from './tempos';

export const ADIANTA = 2;

export const montarRoteiro = ({
  cenasFala,
  entradas,
  nomes = [],
  duracao,
  adianta = ADIANTA,
}: {
  cenasFala: CenaFala[];
  /** transição de ENTRADA de cada cena (índice 0 = cena 1, sempre null) */
  entradas: (EntradaM | null)[];
  nomes?: string[];
  /** duração total do vídeo em quadros */
  duracao: number;
  adianta?: number;
}): CenaDefM[] => {
  const corteDe = (i: number) => (i === 0 ? 0 : cenasFala[i].inicio_f - adianta);
  return cenasFala.map((_, i) => {
    const entrada = entradas[i] ?? null;
    const prox = entradas[i + 1] ?? null;
    const corte = corteDe(i);
    const seqInicio = corte - (entrada?.k ?? 0);
    const fim = i + 1 < cenasFala.length && prox ? corteDe(i + 1) - prox.k + prox.T : i + 1 < cenasFala.length ? corteDe(i + 1) : duracao;
    return { n: i + 1, nome: nomes[i] ?? `cena-${i + 1}`, corte, seqInicio, seqDuracao: fim - seqInicio, entrada, saida: prox };
  });
};

/** Soma das Sequences menos as sobreposições = duração; e cada Sequence cabe as duas janelas. */
export const conferirTempos = (cenas: CenaDefM[], duracao: number) => {
  const somaSeq = cenas.reduce((a, c) => a + c.seqDuracao, 0);
  const somaT = cenas.reduce((a, c) => a + (c.entrada?.T ?? 0), 0);
  const curtas = cenas.filter((c) => c.seqDuracao < (c.entrada?.T ?? 0) + (c.saida?.T ?? 0)).map((c) => c.n);
  return { somaSeq, somaT, total: somaSeq - somaT, esperado: duracao, ok: somaSeq - somaT === duracao && curtas.length === 0, curtas };
};

export const timingM = (e: EntradaM) => linearTiming({ durationInFrames: e.T });

/** Fundo da cor do tema + fontes carregadas antes de qualquer medição de texto. */
export const Palco: React.FC<{ children: React.ReactNode; fundo?: string }> = ({ children, fundo = CORM.fundo }) => (
  <AbsoluteFill style={{ background: fundo }}>
    <Fontes>{children}</Fontes>
  </AbsoluteFill>
);

/** As cenas em sequência, com as transições de entrada de cada uma e o áudio opcional (em public/). */
export const VideoMontado: React.FC<{ cenas: CenaDefM[]; componentes: React.FC[]; audio?: string | null }> = ({ cenas, componentes, audio }) => (
  <Palco>
    <TransitionSeries>
      {cenas.flatMap((c) => {
        const Comp = componentes[c.n - 1];
        const seq = (
          <TransitionSeries.Sequence key={`s${c.n}`} durationInFrames={c.seqDuracao} name={`${String(c.n).padStart(2, '0')} ${c.nome}`}>
            <CenaProviderM value={c}>
              <Comp />
            </CenaProviderM>
          </TransitionSeries.Sequence>
        );
        return c.entrada ? [<TransitionSeries.Transition key={`t${c.n}`} timing={timingM(c.entrada)} presentation={c.entrada.criar()} />, seq] : [seq];
      })}
    </TransitionSeries>
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </Palco>
);

/** Uma cena sozinha, com a duração da própria Sequence (e o trecho certo do áudio, se houver). */
export const CenaIsolada: React.FC<{ cena: CenaDefM; Comp: React.FC; audio?: string | null }> = ({ cena, Comp, audio }) => (
  <Palco>
    <CenaProviderM value={cena}>
      <Comp />
    </CenaProviderM>
    {audio ? <Audio src={staticFile(audio)} trimBefore={cena.seqInicio} /> : null}
  </Palco>
);
