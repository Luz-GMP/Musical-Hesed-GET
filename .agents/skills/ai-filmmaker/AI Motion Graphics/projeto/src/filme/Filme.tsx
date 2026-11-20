/* O filme modelo (16:9): 19 cenas e 18 transições. Registra (pasta "filme" no Studio):
   - Filme-16x9: o filme inteiro (VIDEO_M.duracao quadros, 1920x1080, 30 fps)
   - M-01 ... M-19: cada cena isolada, com a duração da própria Sequence.
   Sem áudio por padrão: as cenas seguem os tempos de filme/tempos.json. Para pôr uma narração, copie
   o arquivo para public/ e aponte VIDEO_M.audio para ele (ex.: 'narracao.mp3') no tema.ts. */
import React from 'react';
import { Composition, Folder } from 'remotion';
import { M01 } from '../cenas/m01-maquina';
import { M02 } from '../cenas/m02-after-effects';
import { M03 } from '../cenas/m03-plugin';
import { M04 } from '../cenas/m04-opus';
import { M05 } from '../cenas/m05-prompt';
import { M06 } from '../cenas/m06-pedido';
import { M07 } from '../cenas/m07-detalhe';
import { M08 } from '../cenas/m08-powerpoint';
import { M09 } from '../cenas/m09-referencias';
import { M10 } from '../cenas/m10-codigo';
import { M11 } from '../cenas/m11-matematica';
import { M12 } from '../cenas/m12-quadro';
import { M13 } from '../cenas/m13-fluxo-velho';
import { M14 } from '../cenas/m14-fluxo-novo';
import { M15 } from '../cenas/m15-ajustes';
import { M16 } from '../cenas/m16-keyframes';
import { M17 } from '../cenas/m17-skill';
import { M18 } from '../cenas/m18-absurdo';
import { M19 } from '../cenas/m19-comenta';
import { CenaIsolada, VideoMontado } from '../montagem';
import { VIDEO_M } from '../tema';
import { CENAS_M } from './roteiro';

export const COMPONENTES_M: React.FC[] = [M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17, M18, M19];

export const FilmeMotion: React.FC = () => <VideoMontado cenas={CENAS_M} componentes={COMPONENTES_M} audio={VIDEO_M.audio} />;

const CenaDoFilme: React.FC<{ n: number }> = ({ n }) => <CenaIsolada cena={CENAS_M[n - 1]} Comp={COMPONENTES_M[n - 1]} audio={VIDEO_M.audio} />;

const comum = { fps: VIDEO_M.fps, width: VIDEO_M.largura, height: VIDEO_M.altura } as const;

export const ComposicoesFilme: React.FC = () => (
  <Folder name="filme">
    <Composition id="Filme-16x9" component={FilmeMotion} durationInFrames={VIDEO_M.duracao} {...comum} />
    <Folder name="filme-cenas">
      {CENAS_M.map((c) => (
        <Composition key={c.n} id={`M-${String(c.n).padStart(2, '0')}`} component={CenaDoFilme} defaultProps={{ n: c.n }} durationInFrames={c.seqDuracao} {...comum} />
      ))}
    </Folder>
  </Folder>
);
