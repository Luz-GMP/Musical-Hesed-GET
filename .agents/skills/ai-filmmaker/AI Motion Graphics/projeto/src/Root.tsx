/* Todas as composições do projeto.
   - Demo: demonstração curta (src/videos/demo) e modelo de vídeo novo
   - filme: o filme modelo inteiro (Filme-16x9) e as 19 cenas isoladas (M-01 ... M-19)
   - transicoes: cada uma das 20 transições isolada (T-chicoteLuz, T-glitchRGB, ...)
   Vídeo novo: crie a pasta em src/videos/<nome>/ (copie a demo) e registre a composição aqui. */
import React from 'react';
import { ComposicoesFilme } from './filme/Filme';
import { ComposicoesTransicoes } from './transicoes/catalogo';
import { ComposicaoDemo } from './videos/demo/Demo';

export const RemotionRoot: React.FC = () => (
  <>
    <ComposicaoDemo />
    <ComposicoesFilme />
    <ComposicoesTransicoes />
  </>
);
