/* =====================================================================================
   tempos.ts: lê um tempos.json (cada palavra com início e fim em segundos) e devolve as funções que
   as cenas usam para pôr a fala na tela.

   FORMATO DO tempos.json
     {
       "fps": 30,
       "fim_fala_s": 7.4,                       // fim da última palavra (s)
       "cenas":   [{ "cena": 1, "inicio_s": 0, "fim_s": 2.1, "inicio_f": 0, "dur_f": 63 }, ...],
       "palavras": [{ "t": "Foco", "s": 0.40, "e": 0.82 }, ...]
     }
   - "t" é a palavra como aparece na tela (pontuação no fim é limpa pelo <Fala>).
   - "s"/"e": início e fim da palavra em segundos. Com narração, vêm da transcrição com tempo por
     palavra; sem narração, gere com `npm run tempos -- "texto" > arquivo.json` (ritmo do guia).
   - "cenas": onde cada cena começa e termina (s); inicio_f = round(inicio_s × fps).
   ===================================================================================== */
export type Palavra = { t: string; s: number; e: number };
export type CenaFala = { cena: number; inicio_s: number; fim_s: number; inicio_f: number; dur_f: number };
export type TemposJson = { fps: number; fim_fala_s: number; cenas: CenaFala[]; palavras: Palavra[] };

export const criarTempos = (json: TemposJson) => {
  const PALAVRAS = json.palavras;
  const CENAS_FALA = json.cenas;
  /** As palavras ditas dentro da cena n (1, 2, ...), na ordem. */
  const falaDaCena = (n: number): Palavra[] => {
    const c = CENAS_FALA[n - 1];
    if (!c) throw new Error(`tempos: cena ${n} não existe`);
    return PALAVRAS.filter((p) => p.s >= c.inicio_s - 1e-6 && p.s < c.fim_s - 1e-6);
  };
  /** Fatia de palavras de uma cena, por índice inicial e final (inclusive). */
  const trecho = (n: number, de: number, ate?: number): Palavra[] => falaDaCena(n).slice(de, ate === undefined ? undefined : ate + 1);
  return { fps: json.fps, fimFala: json.fim_fala_s, PALAVRAS, CENAS_FALA, falaDaCena, trecho };
};
