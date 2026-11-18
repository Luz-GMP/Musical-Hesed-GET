/* =====================================================================================
   Fala.tsx: "fala na tela". Toda cena escreve a fala com isto: cada
   palavra aparece animada no instante em que é dita (tempos.json), a palavra-chave ganha destaque.

   USO MÍNIMO
     <Fala palavras={falaDaCena(5)} x={120} y={300} destaque={['descreve']} />
   Para dividir uma frase em blocos (ex.: frase de apoio pequena + palavra gigante), passe fatias:
     <Fala palavras={trecho(2, 0, 3)} estilo={TIPOM.apoio} ... />     // "sem nem abrir o"
     <Fala palavras={trecho(2, 4)} estilo={TIPOM.gigante} modo="letras" ... />  // "After Effects?"

   PROPS
     palavras      Palavra[] (de falaDaCena(n) / trecho(n, de, ate)). Os tempos são da narração.
     x, y          âncora do bloco; y = topo da 1ª linha; x = esquerda | centro | direita (ver alinhar)
     largura       largura máxima antes de quebrar linha (padrão 1680)
     alinhar       'esquerda' (padrão) | 'centro' | 'direita'
     estilo        EstiloM (tamanho, peso, tracking, familia, entrelinha). Padrão TIPOM.frase
     modo          'sobe' (padrão: sobe 0,42 em com mola e desfoque) | 'maquina' (letra a letra
                   durante a palavra, com cursor) | 'letras' (cada letra cai com mola, stagger 1,2 q)
                   | 'slam' (chega de 2,2x com desfoque) | 'foco' (sai do desfoque, escala x 1,15→1)
     modos         Record<índice, ModoFala> para trocar o modo de palavras específicas
     cor           cor do texto (padrão branco)
     destaque      (string | número)[]: palavras normalizadas ('descreve') ou índices na fatia
     corDestaque   padrão verde ${PALETA.acento} com brilho; pesoDestaque (padrão = estilo.peso)
     quebrarAntes  índices que começam linha nova
     textos        Record<índice, string>: troca o texto exibido (ex.: {2: '5.5'})
     limpar        tira aspas e . , : ; do fim (padrão true; "?" fica)
     antecipa      quadros antes do início marcado da palavra em que a animação começa (padrão 2).
                   O Scribe marca o início 1 a 3 quadros depois do som (medido no áudio); com 2 a
                   palavra começa a aparecer junto com o som e está inteira ~2 quadros depois.
     sai           { em: quadro local, stagger?: 1, modo?: 'sobe' | 'foco' }: as palavras saem
     ocultar       índices que não desenham (a cena desenha ela mesma, mas a geometria fica)
     estiloPalavra (i, t) => CSSProperties extra por palavra (t = quadros desde o início dela)
     cursor        'maquina': mostra o cursor (padrão true); corCursor (padrão verde)

   GEOMETRIA
     useLayoutFala(props) devolve { itens, linhas, altura } com x, y (topo), w, h, base (linha de
     base), q (quadro local de início), qFim, destaque e as letras ({ch, x, w}) de cada palavra.
     Use para prender elementos à fala (linha de luz sob a palavra, risco, partículas).
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useCenaM } from './cena';
import { baseDaLinha, larguraTexto, posicoesLetras } from './medir';
import { BRILHO, clamp01, CORM, type EstiloM, janelaM, mola, normalizar, type Palavra, PALETA, RGB, TIPOM } from './tema';

export type ModoFala = 'sobe' | 'maquina' | 'letras' | 'slam' | 'foco';

export type FalaProps = {
  palavras: Palavra[];
  x: number;
  y: number;
  largura?: number;
  alinhar?: 'esquerda' | 'centro' | 'direita';
  estilo?: EstiloM;
  modo?: ModoFala;
  modos?: Record<number, ModoFala>;
  cor?: string;
  destaque?: (string | number)[];
  corDestaque?: string;
  pesoDestaque?: number;
  brilhoDestaque?: string;
  quebrarAntes?: number[];
  textos?: Record<number, string>;
  limpar?: boolean;
  antecipa?: number;
  sai?: { em: number; stagger?: number; modo?: 'sobe' | 'foco' };
  ocultar?: number[];
  estiloPalavra?: (i: number, t: number) => React.CSSProperties;
  cursor?: boolean;
  corCursor?: string;
  staggerLetra?: number;
};

export type ItemFala = {
  i: number;
  texto: string;
  linha: number;
  x: number;
  y: number;
  w: number;
  h: number;
  base: number;
  q: number;
  qFim: number;
  destaque: boolean;
  estilo: EstiloM;
  letras: { ch: string; x: number; w: number }[];
};

const limparTexto = (t: string) => t.replace(/["“”]/g, '').replace(/[.,:;]+$/g, '');

export const useLayoutFala = (p: FalaProps) => {
  const c = useCenaM();
  const estilo = p.estilo ?? TIPOM.frase;
  const largura = p.largura ?? 1680;
  const alinhar = p.alinhar ?? 'esquerda';
  const antecipa = p.antecipa ?? 2;
  const alvo = new Set((p.destaque ?? []).map((d) => (typeof d === 'number' ? `#${d}` : normalizar(d))));
  const hLinha = estilo.tamanho * estilo.entrelinha;
  const espaco = larguraTexto(' ', estilo);

  type Bruto = Omit<ItemFala, 'x' | 'y' | 'linha' | 'base'> & { linha: number; xr: number };
  const brutos: Bruto[] = [];
  const largLinhas: number[] = [0];
  let linha = 0;
  let cursorX = 0;
  p.palavras.forEach((pal, i) => {
    const texto = p.textos?.[i] ?? ((p.limpar ?? true) ? limparTexto(pal.t) : pal.t);
    const destaque = alvo.has(`#${i}`) || alvo.has(normalizar(pal.t));
    const est: EstiloM = destaque && p.pesoDestaque ? { ...estilo, peso: p.pesoDestaque } : estilo;
    const w = larguraTexto(texto, est);
    const forca = p.quebrarAntes?.includes(i) && i > 0;
    if (i > 0 && (forca || cursorX + espaco + w > largura)) {
      linha += 1;
      cursorX = 0;
      largLinhas[linha] = 0;
    } else if (i > 0) {
      cursorX += espaco;
    }
    brutos.push({
      i,
      texto,
      linha,
      xr: cursorX,
      w,
      h: hLinha,
      q: c.local(pal.s) - antecipa,
      qFim: c.local(pal.e),
      destaque,
      estilo: est,
      letras: posicoesLetras(texto, est),
    });
    cursorX += w;
    largLinhas[linha] = cursorX;
  });

  const itens: ItemFala[] = brutos.map((b) => {
    const L = largLinhas[b.linha];
    const x0 = alinhar === 'esquerda' ? p.x : alinhar === 'centro' ? p.x - L / 2 : p.x - L;
    const y = p.y + b.linha * hLinha;
    return { ...b, x: x0 + b.xr, y, base: baseDaLinha(y, b.estilo) };
  });
  return { itens, linhas: largLinhas, altura: (linha + 1) * hLinha, estilo, frame: c.frame };
};

/** Saída comum a todos os modos. */
const saidaDe = (frame: number, i: number, sai: FalaProps['sai'], em: number) => {
  if (!sai) return { op: 1, y: 0, blur: 0 };
  const ts = frame - (sai.em + i * (sai.stagger ?? 1));
  if (ts <= 0) return { op: 1, y: 0, blur: 0 };
  const k = janelaM(ts, 0, 9, 'entra');
  return sai.modo === 'foco' ? { op: 1 - k, y: 0, blur: k * 18 } : { op: 1 - k, y: -0.35 * em * k, blur: k * 10 };
};

export const Fala: React.FC<FalaProps> = (p) => {
  const { itens, frame } = useLayoutFala(p);
  const cor = p.cor ?? CORM.branco;
  const corD = p.corDestaque ?? CORM.verde;
  const brilhoD = p.brilhoDestaque ?? BRILHO.verde;
  const ocultar = new Set(p.ocultar ?? []);
  const corCursor = p.corCursor ?? CORM.verde;

  // a palavra mais recente que já começou: é nela que mora o cursor da máquina de escrever
  const ultima = itens.filter((it) => frame >= it.q).pop();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {itens.map((it) => {
        if (ocultar.has(it.i)) return null;
        const t = frame - it.q;
        if (t < 0) return null;
        const modo = p.modos?.[it.i] ?? p.modo ?? 'sobe';
        const em = it.estilo.tamanho;
        const s = saidaDe(frame, it.i, p.sai, em);
        if (s.op <= 0) return null;
        const corP = it.destaque ? corD : cor;
        const pop = it.destaque ? 1 + 0.1 * (1 - janelaM(t, 2, 12, 'sai')) * clamp01(t / 2) : 1;
        const base: React.CSSProperties = {
          position: 'absolute',
          left: it.x,
          top: it.y,
          height: it.h,
          lineHeight: `${it.h}px`,
          fontFamily: it.estilo.familia,
          fontWeight: it.estilo.peso,
          fontSize: em,
          letterSpacing: `${it.estilo.tracking}em`,
          whiteSpace: 'pre',
          color: corP,
          textShadow: it.destaque ? brilhoD : undefined,
          transformOrigin: '50% 70%',
          ...(p.estiloPalavra?.(it.i, t) ?? {}),
        };

        if (modo === 'letras' || modo === 'maquina') {
          const maquina = modo === 'maquina';
          const dur = Math.max(1, it.qFim - it.q - 1);
          const visiveis = maquina ? Math.min(it.letras.length, 1 + Math.floor(clamp01(t / dur) * it.letras.length)) : it.letras.length;
          const ultimaLetra = it.letras[visiveis - 1];
          const mostraCursor = maquina && (p.cursor ?? true) && ultima?.i === it.i && s.op > 0.5;
          const piscaApos = it.qFim + 2;
          const cursorOn = frame < piscaApos || Math.floor((frame - piscaApos) / 8) % 2 === 0;
          return (
            <div
              key={it.i}
              style={{ ...base, width: it.w, opacity: s.op, transform: `translateY(${s.y}px) scale(${pop})`, filter: s.blur > 0.2 ? `blur(${s.blur}px)` : undefined }}
            >
              {it.letras.slice(0, visiveis).map((l, j) => {
                if (maquina) {
                  // a letra recém-batida acende e assenta em 3 quadros
                  const qL = it.q + (j === 0 ? 0 : (j / it.letras.length) * dur);
                  const tl = frame - qL;
                  const flash = 1 - clamp01(tl / 4);
                  return (
                    <span
                      key={j}
                      style={{
                        position: 'absolute',
                        left: l.x,
                        top: 0,
                        textShadow: flash > 0 ? `0 0 ${10 + 20 * flash}px rgba(${RGB.claro},${0.8 * flash})` : base.textShadow,
                        transform: `translateY(${(1 - clamp01(tl / 2)) * 0.08 * em}px)`,
                      }}
                    >
                      {l.ch}
                    </span>
                  );
                }
                const qL = it.q + j * (p.staggerLetra ?? 1.2);
                const tl = frame - qL;
                if (tl < 0) return null;
                const m = mola(frame, 'estalo', qL);
                const b = (1 - clamp01(tl / 4)) * 16;
                return (
                  <span
                    key={j}
                    style={{
                      position: 'absolute',
                      left: l.x,
                      top: 0,
                      display: 'inline-block',
                      opacity: clamp01(tl / 2.5),
                      transform: `translateY(${(1 - m) * -0.55 * em}px) scale(${1 + (1 - m) * 0.5})`,
                      transformOrigin: '50% 80%',
                      filter: b > 0.3 ? `blur(${b}px)` : undefined,
                    }}
                  >
                    {l.ch}
                  </span>
                );
              })}
              {mostraCursor && cursorOn ? (
                <div
                  style={{
                    position: 'absolute',
                    left: (ultimaLetra ? ultimaLetra.x + ultimaLetra.w : 0) + 0.06 * em,
                    top: it.h * 0.16,
                    width: Math.max(4, 0.05 * em),
                    height: it.h * 0.68,
                    background: corCursor,
                    boxShadow: BRILHO.verdeLeve,
                  }}
                />
              ) : null}
            </div>
          );
        }

        let op = clamp01(t / 3);
        let ty = 0;
        let sc = 1;
        let sx = 1;
        let blur = 0;
        if (modo === 'sobe') {
          const m = mola(frame, 'estalo', it.q);
          ty = (1 - m) * 0.42 * em;
          blur = (1 - clamp01(t / 4)) * 12;
          sc = 0.96 + 0.04 * m;
        } else if (modo === 'slam') {
          const m = mola(frame, 'estalo', it.q);
          op = clamp01(t / 2);
          sc = 1 + (1 - m) * 1.2;
          blur = (1 - clamp01(t / 4)) * 16;
        } else if (modo === 'foco') {
          op = clamp01(t / 4);
          blur = (1 - janelaM(t, 0, 7, 'sai')) * 22;
          sx = 1 + 0.15 * (1 - janelaM(t, 0, 10, 'sai'));
        }
        return (
          <div
            key={it.i}
            style={{
              ...base,
              opacity: op * s.op,
              transform: `translateY(${ty + s.y}px) scale(${sc * pop * sx}, ${sc * pop})`,
              filter: blur + s.blur > 0.3 ? `blur(${blur + s.blur}px)` : undefined,
            }}
          >
            {it.texto}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Altura de uma linha de fala no estilo (para empilhar blocos). */
export const alturaLinha = (e: EstiloM = TIPOM.frase) => e.tamanho * e.entrelinha;
