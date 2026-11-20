/* logos.tsx: <LogoApp />, o lugar reservado para o ícone de um aplicativo dentro das cenas.
   É um PLACEHOLDER genérico (quadrado ou círculo com uma sigla). Para usar um logo de verdade, ponha
   o SVG/PNG em public/ e troque o conteúdo por <Img src={staticFile('meu-logo.svg')} />; use só
   logo que você tem direito de usar.

   <LogoApp tam={150} sigla="APP" />                       quadrado de cantos arredondados
   <LogoApp tam={300} sigla="IA" redondo cor="#FFD2BE" />  círculo
   brilho 0→1 acende um halo da cor da tinta. */
import React from 'react';
import { FONTEM } from './tema';

export const LogoApp: React.FC<{
  tam: number;
  sigla?: string;
  /** cor da tinta (borda e sigla) */
  cor?: string;
  /** cor do miolo */
  fundo?: string;
  redondo?: boolean;
  brilho?: number;
  style?: React.CSSProperties;
}> = ({ tam, sigla = 'APP', cor = '#C9D2E3', fundo = '#1B2333', redondo = false, brilho = 0, style }) => (
  <div
    style={{
      width: tam,
      height: tam,
      borderRadius: redondo ? '50%' : tam * 0.2,
      background: fundo,
      border: `${Math.max(2, tam * 0.035)}px solid ${cor}`,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONTEM.titulo,
      fontWeight: 800,
      fontSize: tam * (sigla.length > 2 ? 0.3 : 0.42),
      letterSpacing: '-0.02em',
      color: cor,
      boxShadow: brilho > 0 ? `0 0 ${40 * brilho}px ${cor}88, 0 0 ${110 * brilho}px ${cor}44` : undefined,
      ...style,
    }}
  >
    {sigla}
  </div>
);
