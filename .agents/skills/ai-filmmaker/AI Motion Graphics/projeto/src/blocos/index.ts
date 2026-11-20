/* =====================================================================================
   blocos: as peças que montam as cenas. Importe daqui num vídeo novo:
     import { Fala, MiraLaser, Faisca, GradeChao, FundoM, Poeira, HUD } from '../../blocos';

   PALAVRA CINÉTICA SINCRONIZADA
     <Fala palavras x y estilo modo destaque />   cada palavra entra no quadro em que é dita
                                                  (modos: sobe, maquina, letras, slam, foco)
     useLayoutFala(props)                         a geometria de cada palavra/letra (prender
                                                  luz, risco ou partícula na palavra)
   LUZ
     <Faisca x y forca rastro />                  faísca quente que "escreve" (núcleo branco + estrela)
     <LinhaLuz x1 x2 y progresso cabeca />        filete de luz com cabeça brilhante
     <Flare x y forca largura />                  ponto de luz com estrela horizontal
   MIRA
     <MiraLaser x y raio fora />                  mira de laser com régua, círculo girando e leitura X/Y
   PROFUNDIDADE
     <FundoM brilho grade deriva />               fundo escuro + glow + grade de prancheta + vinheta + grão
     <GradeChao horizonte velocidade progresso /> chão em perspectiva correndo para a câmera
     <Camera zoom janela origem deriva giro>      câmera sempre viva (push + balanço)
   PARTÍCULAS
     <Poeira n semente velocidade />              poeira em 3 planos, sempre andando
     <Fagulhas f q0 x y n raio />                 estouro de fagulhas num instante
     <Onda f q0 x y />                            onda de choque (anel que abre e apaga)
     <Particulas fontes alvos tempo />            texto/pontos que viram partículas e voam até alvos
   HUD
     <HUD tl tr bl br inicio />                   rótulos técnicos de canto (mono 28 px) + cruzes
     timecodeM(quadro)                            "MM:SS:QQ"
   OUTROS
     <Feixe f q0 de para />                       feixe de luz entre dois pontos
     vidro(ativo)                                 estilo de cartão de vidro (CSS)
     <SimboloSkill cx cy R desenho brilho />      losango com M (símbolo do filme)
     <LogoApp tam sigla />                        lugar reservado para ícone de app (placeholder)
   ===================================================================================== */
export { Fala, useLayoutFala, alturaLinha, type FalaProps, type ModoFala } from '../Fala';
export { MiraLaser } from './MiraLaser';
export { Camera, Faisca, Flare, FundoM, GradeChao, HUD, LinhaLuz, Poeira, timecodeM } from '../visual';
export { Fagulhas, Feixe, Onda, vidro } from '../cenas/pecas';
export { Particulas } from '../transicoes/Particulas';
export { SimboloSkill, pontosDoSimbolo } from '../cenas/simbolo-skill';
export { LogoApp } from '../logos';
