/* Faixa inclinada que corre. O texto se repete sem emenda (a largura do ciclo é medida); o
   separador é um ponto. y = centro da faixa.
   velocidade em px por quadro (negativa corre para a direita). */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONTEM, PALETA } from '../tema';
import { larguraTexto } from './medir';

export const Marquee: React.FC<{
  itens: readonly string[];
  velocidade?: number;
  angulo?: number;
  altura?: number;
  y?: number;
  corFaixa?: string;
  corTexto?: string;
  tamanhoTexto?: number;
  deslocamento?: number;
}> = ({
  itens,
  velocidade = 10,
  angulo = -7,
  altura = 150,
  y = 540,
  corFaixa = '#050505',
  corTexto = PALETA.branco,
  tamanhoTexto = 76,
  deslocamento = 0,
}) => {
  const frame = useCurrentFrame();
  const gap = 48;
  const sep = tamanhoTexto * 0.19;
  const estilo = { tamanho: tamanhoTexto, peso: 800, tracking: -0.02, familia: FONTEM.titulo };
  // CSS soma o tracking também depois da última letra; o kerning fica desligado nos dois lados
  const ciclo = itens.reduce((a, t) => a + larguraTexto(t, estilo) + estilo.tracking * tamanhoTexto + gap * 2 + sep, 0);
  const largura = 2800;
  const copias = Math.ceil(largura / Math.max(1, ciclo)) + 2;
  const off = (((frame * velocidade + deslocamento) % ciclo) + ciclo) % ciclo;
  return (
    <div
      style={{
        position: 'absolute',
        left: (1920 - largura) / 2,
        top: y - altura / 2,
        width: largura,
        height: altura,
        background: corFaixa,
        transform: `rotate(${angulo}deg)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, height: altura, left: -off, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        {Array.from({ length: copias }).flatMap((_, c) =>
          itens.map((t, i) => (
            <div key={`${c}-${i}`} style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: FONTEM.titulo,
                  fontWeight: 800,
                  fontSize: tamanhoTexto,
                  letterSpacing: '-0.02em',
                  color: corTexto,
                  padding: `0 ${gap}px`,
                  lineHeight: 1,
                  fontKerning: 'none',
                }}
              >
                {t}
              </span>
              <div style={{ width: sep, height: sep, borderRadius: '50%', background: corTexto }} />
            </div>
          )),
        )}
      </div>
    </div>
  );
};
