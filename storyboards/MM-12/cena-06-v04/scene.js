(function () {
  'use strict';

  const cues = [
    { id: 'Q01', title: 'O caminho', cue: '“Naquela época...”', image: 'assets/MM12-Q01.jpg', duration: 18, transition: 'paper-sweep', drift: 1 },
    { id: 'Q02', title: 'Belém ao longe', cue: '“José... precisou ir até Belém”', image: 'assets/MM12-Q02.jpg', duration: 17, transition: 'cutout-wipe', drift: -1 },
    { id: 'Q03', title: 'A chegada', cue: '“E quando eles chegaram lá...”', image: 'assets/MM12-Q03.jpg', duration: 16, transition: 'ink-reveal', drift: 1 },
    { id: 'Q04', title: 'A noite', cue: '“...não tinha lugar pra ficar”', image: 'assets/MM12-Q04.jpg', duration: 17, transition: 'camera-pan', drift: -1 },
    { id: 'Q05', title: 'Sem acolhimento', cue: '“Nenhuma hospedagem disponível”', image: 'assets/MM12-Q05.jpg', duration: 18, transition: 'fold-shadow', drift: 1 },
    { id: 'Q06', title: 'Um abrigo simples', cue: '“...onde os animais ficavam”', image: 'assets/MM12-Q06.jpg', duration: 20, transition: 'quiet-hold', drift: -1 }
  ];

  const starts = cues.reduce((acc, cue, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + cues[index - 1].duration);
    return acc;
  }, []);
  const totalDuration = cues.reduce((sum, cue) => sum + cue.duration, 0);
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const easeOut = value => 1 - Math.pow(1 - clamp(value), 3);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const masks = [
    {
      far: 'polygon(0 0, 100% 0, 96% 47%, 74% 52%, 42% 48%, 0 57%)',
      mid: 'polygon(7% 35%, 32% 26%, 67% 31%, 100% 24%, 95% 83%, 58% 77%, 19% 84%)',
      near: 'polygon(0 64%, 21% 57%, 45% 66%, 73% 57%, 100% 63%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 54%, 77% 48%, 45% 57%, 0 50%)',
      mid: 'polygon(0 29%, 28% 23%, 61% 35%, 100% 27%, 91% 84%, 51% 78%, 13% 86%)',
      near: 'polygon(0 59%, 26% 66%, 58% 57%, 100% 64%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 94% 49%, 66% 55%, 31% 47%, 0 53%)',
      mid: 'polygon(4% 28%, 42% 32%, 73% 24%, 100% 34%, 96% 81%, 62% 87%, 22% 79%)',
      near: 'polygon(0 62%, 23% 56%, 49% 67%, 81% 58%, 100% 70%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 52%, 70% 47%, 37% 55%, 0 49%)',
      mid: 'polygon(0 34%, 34% 24%, 70% 30%, 100% 23%, 93% 86%, 54% 78%, 10% 84%)',
      near: 'polygon(0 63%, 29% 58%, 56% 64%, 82% 55%, 100% 66%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 98% 50%, 69% 55%, 40% 48%, 0 55%)',
      mid: 'polygon(6% 28%, 36% 35%, 64% 24%, 100% 32%, 97% 80%, 57% 86%, 17% 77%)',
      near: 'polygon(0 66%, 19% 58%, 43% 66%, 76% 57%, 100% 63%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 58%, 75% 52%, 42% 61%, 0 53%)',
      mid: 'polygon(3% 32%, 31% 25%, 66% 33%, 100% 27%, 96% 88%, 64% 82%, 22% 90%)',
      near: 'polygon(0 70%, 24% 62%, 51% 72%, 79% 61%, 100% 70%, 100% 100%, 0 100%)'
    }
  ];

  const transitionFor = (kind, progress) => {
    const p = easeOut(progress);
    switch (kind) {
      case 'paper-sweep':
        return { opacity: p, clip: `polygon(${p * 100}% 0, 100% 0, 100% 100%, ${Math.max(0, p * 100 - 12)}% 100%)`, transform: `translateX(${(1 - p) * -4}%) scale(${1.035 - p * 0.035})`, filter: `sepia(${0.42 - p * 0.2}) contrast(${1.22 + p * 0.08})` };
      case 'cutout-wipe':
        return { opacity: p, clip: `polygon(0 0, ${p * 100}% 0, ${Math.min(100, p * 100 + 15)}% 100%, 0 100%)`, transform: `translateX(${(1 - p) * 4}%) scale(${1.028 - p * 0.028})`, filter: `sepia(${0.36 - p * 0.18}) contrast(${1.26 + p * 0.04})` };
      case 'ink-reveal':
        return { opacity: p, clip: `polygon(0 0, ${p * 82}% 0, ${Math.min(100, p * 100)}% 41%, ${Math.max(0, p * 88)}% 100%, 0 100%)`, transform: `scale(${1.05 - p * 0.05})`, filter: `grayscale(${0.64 - p * 0.46}) sepia(${0.52 - p * 0.24}) contrast(${1.48 - p * 0.2}) blur(${(1 - p) * 3}px)` };
      case 'camera-pan':
        return { opacity: p, clip: 'inset(0)', transform: `translateX(${(1 - p) * 7}%) scale(${1.045 - p * 0.045})`, filter: `sepia(${0.32 - p * 0.16}) contrast(${1.28 + p * 0.04}) blur(${(1 - p) * 1.5}px)` };
      case 'fold-shadow':
        return { opacity: p, clip: `polygon(0 0, ${32 + p * 68}% 0, ${18 + p * 82}% 100%, 0 100%)`, transform: `translateY(${(1 - p) * 3}%) scale(${1.04 - p * 0.04})`, filter: `sepia(${0.4 - p * 0.2}) brightness(${0.62 + p * 0.38}) contrast(${1.25 + p * 0.05})` };
      default:
        return { opacity: p, clip: 'inset(0)', transform: `scale(${1.018 - p * 0.018})`, filter: `sepia(${0.24 - p * 0.1}) contrast(${1.18 + p * 0.08})` };
    }
  };

  function createScene(cue, index, review) {
    const article = document.createElement('article');
    article.className = 'scene';
    article.dataset.sceneId = cue.id;
    article.innerHTML = [
      '<div class="backplate" aria-hidden="true"></div>',
      `<img class="layer far" alt="" src="${cue.image}">`,
      `<img class="layer mid" alt="${escapeHtml(cue.title)}" src="${cue.image}">`,
      `<img class="layer near" alt="" src="${cue.image}">`,
      '<div class="paper" aria-hidden="true"></div>',
      '<div class="ink" aria-hidden="true"></div>',
      '<div class="grade" aria-hidden="true"></div>',
      '<div class="bloom" aria-hidden="true"></div>',
      '<div class="grain" aria-hidden="true"></div>',
      '<img class="vector-overlay" aria-hidden="true" src="assets/mm12-cordel-overlay.svg">',
      review ? `<div class="caption"><b>${escapeHtml(cue.title)}</b><span>${escapeHtml(cue.cue)}</span></div>` : ''
    ].join('');
    article.style.zIndex = String(index + 1);
    return article;
  }

  function mount(stage, mode) {
    const review = mode === 'review';
    stage.classList.add('stage');
    stage.innerHTML = '';
    const scenes = cues.map((cue, index) => {
      const scene = createScene(cue, index, review);
      stage.appendChild(scene);
      return {
        root: scene,
        backplate: scene.querySelector('.backplate'),
        far: scene.querySelector('.far'),
        mid: scene.querySelector('.mid'),
        near: scene.querySelector('.near'),
        paper: scene.querySelector('.paper'),
        ink: scene.querySelector('.ink'),
        grade: scene.querySelector('.grade'),
        bloom: scene.querySelector('.bloom'),
        grain: scene.querySelector('.grain'),
        vector: scene.querySelector('.vector-overlay'),
        caption: scene.querySelector('.caption')
      };
    });

    function resetScene(ref) {
      ref.root.style.display = 'none';
      ref.root.style.opacity = '0';
      ref.root.style.clipPath = 'inset(0)';
      if (ref.caption) ref.caption.style.opacity = '0';
    }

    function renderAt(time) {
      const globalTime = clamp(Number(time) || 0, 0, totalDuration - 1 / 30);
      scenes.forEach(resetScene);
      cues.forEach((cue, index) => {
        const start = starts[index];
        const end = start + cue.duration;
        const entering = globalTime >= start - 1.35 && globalTime < start;
        const active = globalTime >= start && globalTime < end;
        const exiting = index < cues.length - 1 && globalTime >= end && globalTime < end + 1.35;
        if (!entering && !active && !exiting) return;

        const local = globalTime - start;
        const build = easeOut(clamp((local + (entering ? 1.35 : 0)) / 1.95));
        const exitProgress = exiting ? 1 - easeOut(clamp((globalTime - end) / 1.35)) : 1;
        const transition = transitionFor(cue.transition, clamp((local + 1.35) / 1.95));
        const mask = masks[index];
        const motion = clamp(local / cue.duration);
        const ambience = Math.sin((local + index * 1.7) * 0.62);
        const pan = cue.drift * (motion * 34 + ambience * 3.2);
        const zoom = motion * 2.4 + ambience * 0.22;
        const opacity = transition.opacity * exitProgress;

        const ref = scenes[index];
        ref.root.style.display = 'block';
        ref.root.style.opacity = String(opacity);
        ref.root.style.clipPath = transition.clip;
        ref.root.style.transform = transition.transform;
        ref.root.style.filter = transition.filter;

        const farBuild = easeOut(clamp((local + 0.18) / 0.92));
        const midBuild = easeOut(clamp((local - 0.36) / 0.96));
        const nearBuild = easeOut(clamp((local - 0.78) / 1.08));
        ref.far.style.clipPath = mask.far;
        ref.mid.style.clipPath = mask.mid;
        ref.near.style.clipPath = mask.near;
        ref.backplate.style.opacity = String(0.78 * build);
        ref.far.style.opacity = String(0.94 * farBuild);
        ref.mid.style.opacity = String(0.92 * midBuild);
        ref.near.style.opacity = String(0.88 * nearBuild);
        ref.far.style.transform = `translate3d(${pan * 0.18}px, ${-zoom * 0.22}px, 0) scale(${1.045 + zoom * 0.004})`;
        ref.mid.style.transform = `translate3d(${pan * 0.62}px, ${-zoom * 0.12}px, 0) scale(${1.018 + zoom * 0.006})`;
        ref.near.style.transform = `translate3d(${pan * 1.28}px, ${zoom * 0.14}px, 0) rotate(${cue.drift * zoom * 0.018}deg) scale(${1.065 + zoom * 0.01})`;
        ref.paper.style.opacity = String(0.26 + ambience * 0.018);
        ref.ink.style.opacity = String(0.32 + (1 - build) * 0.18);
        ref.grade.style.opacity = String(0.42 + ambience * 0.028);
        ref.bloom.style.opacity = String((0.18 + ambience * 0.04) * nearBuild);
        ref.vector.style.opacity = String(0.18 + 0.48 * nearBuild);
        ref.vector.style.transform = `translate3d(${pan * 0.78}px, ${-zoom * 0.16}px, 0) scale(${1.015 + zoom * 0.006})`;
        if (ref.caption) ref.caption.style.opacity = String(review ? smooth(clamp((local - 1.5) / 0.8)) * exitProgress : 0);

        // The final stable is intentionally calmer: it carries the hand-off into Scene 7.
        if (cue.id === 'Q06') {
          ref.backplate.style.opacity = String(0.64 * build);
          ref.far.style.opacity = String(0.82 * farBuild);
          ref.near.style.opacity = String(0.72 * nearBuild);
          ref.vector.style.opacity = String(0.12 + 0.32 * nearBuild);
          ref.bloom.style.opacity = String((0.2 + ambience * 0.03) * nearBuild);
        }
      });
      return globalTime;
    }

    const timeline = {
      duration: () => totalDuration,
      seek: time => renderAt(time),
      totalTime: time => renderAt(time)
    };
    renderAt(0);
    return { cues, starts, totalDuration, scenes, renderAt, timeline };
  }

  window.MM12Scene = { cues, starts, totalDuration, mount };
}());
