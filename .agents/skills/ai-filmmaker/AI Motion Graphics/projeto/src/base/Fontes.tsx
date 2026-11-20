/* Carrega Inter (variável, 100 a 900) e JetBrains Mono (400 e 700) de public/fonts (licença OFL,
   arquivos de licença na mesma pasta). Funciona sem internet.
   Com filhos, só os mostra depois que as fontes carregaram: quem mede texto (<Fala>, partículas,
   posição de letra) precisa da fonte certa já no primeiro render. */
import React, { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';
import { FONTEM } from '../tema';

const ARQUIVOS = {
  inter: 'fonts/Inter-Variable.ttf',
  monoRegular: 'fonts/JetBrainsMono-Regular.ttf',
  monoBold: 'fonts/JetBrainsMono-Bold.ttf',
};

let promessa: Promise<void> | null = null;
let prontas = false;

const carregar = () => {
  if (!promessa) {
    const faces = [
      new FontFace(FONTEM.titulo, `url(${staticFile(ARQUIVOS.inter)}) format('truetype')`, { weight: '100 900', style: 'normal' }),
      new FontFace(FONTEM.mono, `url(${staticFile(ARQUIVOS.monoRegular)}) format('truetype')`, { weight: '400' }),
      new FontFace(FONTEM.mono, `url(${staticFile(ARQUIVOS.monoBold)}) format('truetype')`, { weight: '700' }),
    ];
    promessa = Promise.all(
      faces.map((f) =>
        f.load().then((ok) => {
          // o lib DOM do TS 5.7 não tipa FontFaceSet.add
          (document.fonts as unknown as { add: (f: FontFace) => void }).add(ok);
        }),
      ),
    ).then(() => {
      prontas = true;
    });
  }
  return promessa;
};

export const Fontes: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [pronto, setPronto] = useState(prontas);
  const [handle] = useState(() => (prontas ? null : delayRender('fontes')));

  useEffect(() => {
    if (pronto) return;
    carregar()
      .then(() => setPronto(true))
      .catch((err) => cancelRender(new Error(`Fontes: falhou ao carregar (${String(err)})`)));
  }, [pronto]);

  // Libera o render só depois que os filhos já montaram com a fonte certa.
  useEffect(() => {
    if (pronto && handle !== null) continueRender(handle);
  }, [pronto, handle]);

  if (!children) return null;
  return pronto ? <>{children}</> : null;
};
