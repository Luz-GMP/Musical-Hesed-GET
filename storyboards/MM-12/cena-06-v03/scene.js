(function () {
  'use strict';

  const cues = [
    { id: 'Q01', title: 'O caminho', cue: '“Naquela época...”', image: 'assets/MM12-Q01.jpg', duration: 18, transition: 'page-reveal', drift: 1 },
    { id: 'Q02', title: 'Belém ao longe', cue: '“José... precisou ir até Belém”', image: 'assets/MM12-Q02.jpg', duration: 17, transition: 'diagonal-wipe', drift: -1 },
    { id: 'Q03', title: 'A chegada', cue: '“E quando eles chegaram lá...”', image: 'assets/MM12-Q03.jpg', duration: 16, transition: 'ink-dissolve', drift: 1 },
    { id: 'Q04', title: 'A noite', cue: '“...não tinha lugar pra ficar”', image: 'assets/MM12-Q04.jpg', duration: 17, transition: 'pan-crossfade', drift: -1 },
    { id: 'Q05', title: 'Sem acolhimento', cue: '“Nenhuma hospedagem disponível”', image: 'assets/MM12-Q05.jpg', duration: 18, transition: 'shadow-fold', drift: 1 },
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
      far: 'polygon(0 0, 100% 0, 100% 57%, 0 52%)',
      mid: 'polygon(0 29%, 100% 26%, 100% 81%, 0 76%)',
      near: 'polygon(0 61%, 100% 57%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 51%, 0 57%)',
      mid: 'polygon(0 27%, 100% 32%, 100% 80%, 0 75%)',
      near: 'polygon(0 63%, 100% 58%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 54%, 0 48%)',
      mid: 'polygon(0 25%, 100% 30%, 100% 83%, 0 78%)',
      near: 'polygon(0 64%, 100% 59%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 55%, 0 50%)',
      mid: 'polygon(0 31%, 100% 28%, 100% 84%, 0 79%)',
      near: 'polygon(0 65%, 100% 60%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 53%, 0 49%)',
      mid: 'polygon(0 29%, 100% 26%, 100% 82%, 0 77%)',
      near: 'polygon(0 62%, 100% 57%, 100% 100%, 0 100%)'
    },
    {
      far: 'polygon(0 0, 100% 0, 100% 60%, 0 53%)',
      mid: 'polygon(0 31%, 100% 28%, 100% 88%, 0 80%)',
      near: 'polygon(0 70%, 100% 63%, 100% 100%, 0 100%)'
    }
  ];

  const transitionFor = (kind, progress) => {
    const p = easeOut(progress);
    switch (kind) {
      case 'page-reveal':
        return { opacity: p, clip: `inset(0 ${100 - p * 100}% 0 0)`, transform: `scale(${1.045 - p * 0.045})`, filter: `sepia(${0.58 - p * 0.58}) brightness(${0.72 + p * 0.28})` };
      case 'diagonal-wipe':
        return { opacity: p, clip: `polygon(0 0, ${p * 100}% 0, ${Math.max(0, p * 100 - 10)}% 100%, 0 100%)`, transform: `translateX(${(1 - p) * 3}%) scale(${1.035 - p * 0.035})`, filter: `brightness(${0.7 + p * 0.3})` };
      case 'ink-dissolve':
        return { opacity: p, clip: 'inset(0)', transform: `scale(${1.065 - p * 0.065})`, filter: `grayscale(${1 - p}) contrast(${1.52 - p * 0.52}) blur(${(1 - p) * 8}px)` };
      case 'pan-crossfade':
        return { opacity: p, clip: 'inset(0)', transform: `translateX(${(1 - p) * 5 * kind.length / 13}%) scale(${1.05 - p * 0.05})`, filter: `brightness(${0.68 + p * 0.32}) blur(${(1 - p) * 3}px)` };
      case 'shadow-fold':
        return { opacity: p, clip: `polygon(0 0, ${36 + p * 64}% 0, ${20 + p * 80}% 100%, 0 100%)`, transform: `translateY(${(1 - p) * 2}%) scale(${1.04 - p * 0.04})`, filter: `brightness(${0.48 + p * 0.52})` };
      default:
        return { opacity: p, clip: 'inset(0)', transform: `scale(${1.028 - p * 0.028})`, filter: `brightness(${0.74 + p * 0.26}) blur(${(1 - p) * 1.5}px)` };
    }
  };

  function createScene(cue, index, review) {
    const article = document.createElement('article');
    article.className = 'scene';
    article.dataset.sceneId = cue.id;
    article.innerHTML = [
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
        const entering = globalTime >= start - 1.2 && globalTime < start;
        const active = globalTime >= start && globalTime < end;
        const exiting = index < cues.length - 1 && globalTime >= end && globalTime < end + 1.2;
        if (!entering && !active && !exiting) return;

        const local = globalTime - start;
        const build = easeOut(clamp((local + (entering ? 1.2 : 0)) / 1.65));
        const introProgress = easeOut(clamp((local + 1.2) / 1.8));
        const exitProgress = exiting ? 1 - easeOut(clamp((globalTime - end) / 1.2)) : 1;
        const transition = transitionFor(cue.transition, clamp((local + 1.2) / 1.8));
        const mask = masks[index];
        const motion = clamp(local / cue.duration);
        const ambience = Math.sin((local + index * 1.7) * 0.62);
        const pan = cue.drift * (motion * 18 + ambience * 2.2);
        const zoom = motion * 1.6 + ambience * 0.18;
        const opacity = transition.opacity * exitProgress;

        const ref = scenes[index];
        ref.root.style.display = 'block';
        ref.root.style.opacity = String(opacity);
        ref.root.style.clipPath = transition.clip;
        ref.root.style.transform = transition.transform;
        ref.root.style.filter = transition.filter;

        const farBuild = easeOut(clamp((local + 0.1) / 1.0));
        const midBuild = easeOut(clamp((local - 0.42) / 1.05));
        const nearBuild = easeOut(clamp((local - 0.88) / 1.25));
        ref.far.style.clipPath = mask.far;
        ref.mid.style.clipPath = mask.mid;
        ref.near.style.clipPath = mask.near;
        ref.far.style.opacity = String(0.56 * farBuild);
        ref.mid.style.opacity = String(0.98 * midBuild);
        ref.near.style.opacity = String(0.74 * nearBuild);
        ref.far.style.transform = `translate3d(${pan * 0.2}px, ${-zoom * 0.28}px, 0) scale(${1.055 + zoom * 0.005})`;
        ref.mid.style.transform = `translate3d(${pan * 0.58}px, ${-zoom * 0.16}px, 0) scale(${1.025 + zoom * 0.007})`;
        ref.near.style.transform = `translate3d(${pan * 1.12}px, ${zoom * 0.12}px, 0) scale(${1.075 + zoom * 0.012})`;
        ref.paper.style.opacity = String(0.18 + ambience * 0.012);
        ref.ink.style.opacity = String(0.18 + (1 - build) * 0.16);
        ref.grade.style.opacity = String(0.62 + ambience * 0.025);
        ref.bloom.style.opacity = String((0.55 + ambience * 0.08) * nearBuild);
        ref.vector.style.opacity = String(0.1 + 0.33 * nearBuild);
        ref.vector.style.transform = `translate3d(${pan * 0.72}px, ${-zoom * 0.2}px, 0) scale(${1.01 + zoom * 0.006})`;
        if (ref.caption) ref.caption.style.opacity = String(review ? smooth(clamp((local - 1.5) / 0.8)) * exitProgress : 0);

        // The final stable is intentionally calmer: it carries the hand-off into Scene 7.
        if (cue.id === 'Q06') {
          ref.far.style.opacity = String(0.5 * farBuild);
          ref.near.style.opacity = String(0.62 * nearBuild);
          ref.vector.style.opacity = String(0.08 + 0.2 * nearBuild);
          ref.bloom.style.opacity = String((0.38 + ambience * 0.04) * nearBuild);
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
