(function () {
  const MORSE = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-',
    L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-',
    W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.'
  };
  const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([key, value]) => [value, key]));
  const practiceChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  let audioContext;
  let stopPlayback = false;
  let heldTone;
  let heldToneRequest = 0;
  const emptyResultText = {
    'text-to-morse': 'Morse code will appear here.',
    'morse-to-text': 'English text will appear here.'
  };
  const inputPlaceholderText = {
    'text-to-morse': 'English text will appear here.',
    'morse-to-text': 'Morse code will appear here.'
  };

  function setTheme(theme, animate = false) {
    if (animate) {
      document.documentElement.classList.add('theme-switching');
      window.setTimeout(() => document.documentElement.classList.remove('theme-switching'), 460);
    }
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('mca-theme', theme);
    document.querySelector('[data-theme-toggle]')?.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }

  function initTheme() {
    const stored = localStorage.getItem('mca-theme');
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(stored || preferred);
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  }

  function toMorse(text) {
    return text.toUpperCase().split('').map((char) => {
      if (char === ' ') return '/';
      return MORSE[char] || '';
    }).filter(Boolean).join(' ');
  }

  function fromMorse(input) {
    const normalized = input.trim().replace(/[–—−]/g, '-').replace(/[|]/g, '/').replace(/\s*\/\s*/g, ' / ');
    if (!normalized) return { text: '', errors: [] };
    const tokens = normalized.split(/\s+/);
    const errors = [];
    const text = tokens.map((token) => {
      if (token === '/') return ' ';
      if (REVERSE[token]) return REVERSE[token];
      errors.push(token);
      return '?';
    }).join('').replace(/\s+/g, ' ').trim();
    return { text, errors };
  }

  function getMorseFromValue(value, modeHint) {
    const trimmed = value.trim();
    if (!trimmed) return '';
    const looksMorse = /^[.\-\s/|–—−]+$/.test(trimmed);
    return modeHint === 'morse-to-text' || looksMorse ? trimmed.replace(/[|]/g, '/') : toMorse(trimmed);
  }

  function renderMorseTokens(code) {
    let index = 0;
    return code.split('').map((char) => {
      if (char === '.' || char === '-') {
        return `<span class="morse-token" data-token-index="${index++}">${char}</span>`;
      }
      return char === ' ' ? ' ' : char;
    }).join('');
  }

  function copyText(text, button) {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      if (!button) return;
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = original; }, 1200);
    });
  }

  function unitFromWpm(wpm) {
    return 1200 / Math.max(5, Number(wpm || 18));
  }

  function sequenceFromMorse(code, wpm = 18) {
    const unit = unitFromWpm(wpm);
    const sequence = [];
    const words = code.trim().split(/\s*\/\s*/);
    words.forEach((word, wordIndex) => {
      const letters = word.trim().split(/\s+/).filter(Boolean);
      letters.forEach((letter, letterIndex) => {
        [...letter].forEach((part, partIndex) => {
          if (part === '.' || part === '-') {
            sequence.push({ on: true, duration: part === '.' ? unit : unit * 3 });
            if (partIndex < letter.length - 1) sequence.push({ on: false, duration: unit });
          }
        });
        if (letterIndex < letters.length - 1) sequence.push({ on: false, duration: unit * 3 });
      });
      if (wordIndex < words.length - 1) sequence.push({ on: false, duration: unit * 7 });
    });
    return sequence;
  }

  function ensureAudio() {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    return audioContext;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function playMorse(code, options = {}) {
    const morse = getMorseFromValue(code, options.mode);
    if (!morse) return;
    stopPlayback = false;
    document.documentElement.classList.add('is-audio-playing');
    const ctx = ensureAudio();
    if (ctx.state === 'suspended') await ctx.resume();
    const tokens = options.scope ? [...options.scope.querySelectorAll('[data-token-index]')] : [];
    const activeCard = options.card || options.scope?.closest?.('.tool-card');
    activeCard?.classList.add('is-playing');
    let tokenIndex = 0;
    const sequence = sequenceFromMorse(morse, options.wpm || 18);
    try {
      for (const item of sequence) {
        if (stopPlayback) break;
        if (item.on) {
          const oscillator = ctx.createOscillator();
          const gain = ctx.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.value = Number(options.tone || 650);
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + item.duration / 1000);
          oscillator.connect(gain).connect(ctx.destination);
          const active = tokens[tokenIndex++];
          active?.classList.add('is-playing');
          oscillator.start();
          oscillator.stop(ctx.currentTime + item.duration / 1000);
          await sleep(item.duration);
          active?.classList.remove('is-playing');
        } else {
          await sleep(item.duration);
        }
      }
    } finally {
      activeCard?.classList.remove('is-playing');
      document.documentElement.classList.remove('is-audio-playing');
    }
  }

  async function startHeldTone(tone = 650) {
    const request = ++heldToneRequest;
    const ctx = ensureAudio();
    if (ctx.state === 'suspended') await ctx.resume();
    if (heldTone || request !== heldToneRequest) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = Number(tone || 650);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.012);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    heldTone = { oscillator, gain };
  }

  function stopHeldTone() {
    heldToneRequest += 1;
    if (!heldTone) return;
    const ctx = ensureAudio();
    const { oscillator, gain } = heldTone;
    heldTone = null;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
    oscillator.stop(ctx.currentTime + 0.04);
  }

  function makeWavBlob(code, wpm = 18, tone = 650) {
    const sampleRate = 44100;
    const sequence = sequenceFromMorse(code, wpm);
    const totalSamples = Math.ceil(sequence.reduce((sum, item) => sum + item.duration, 0) / 1000 * sampleRate);
    const data = new Int16Array(totalSamples);
    let offset = 0;
    sequence.forEach((item) => {
      const count = Math.floor(item.duration / 1000 * sampleRate);
      for (let i = 0; i < count && offset + i < data.length; i += 1) {
        const envelope = Math.min(1, i / 240, (count - i) / 240);
        data[offset + i] = item.on ? Math.sin(2 * Math.PI * tone * i / sampleRate) * 16000 * Math.max(0, envelope) : 0;
      }
      offset += count;
    });
    const buffer = new ArrayBuffer(44 + data.length * 2);
    const view = new DataView(buffer);
    const writeString = (pos, str) => [...str].forEach((char, i) => view.setUint8(pos + i, char.charCodeAt(0)));
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + data.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, data.length * 2, true);
    data.forEach((sample, index) => view.setInt16(44 + index * 2, sample, true));
    return new Blob([view], { type: 'audio/wav' });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function initConverters() {
    document.querySelectorAll('[data-converter]').forEach((card) => {
      const input = card.querySelector('[data-input]');
      const output = card.querySelector('[data-output]');
      const error = card.querySelector('[data-error]');
      const sourceLabel = card.querySelector('[data-source-label]');
      const resultLabel = card.querySelector('[data-result-label]');
      const count = card.querySelector('[data-count]');
      let mode = card.dataset.defaultMode || 'text-to-morse';

      function setMode(next) {
        mode = next;
        card.querySelectorAll('[data-mode]').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
        input.placeholder = inputPlaceholderText[mode];
        if (sourceLabel) sourceLabel.textContent = mode === 'morse-to-text' ? 'Morse Code' : 'Text';
        if (resultLabel) resultLabel.textContent = mode === 'morse-to-text' ? 'Text' : 'Morse Code';
        update();
      }

      function update() {
        const value = input.value;
        if (count) count.textContent = `${value.length} / ${input.maxLength || 1200}`;
        error.hidden = true;
        if (!value.trim()) {
          output.textContent = emptyResultText[mode];
          return;
        }
        if (mode === 'morse-to-text') {
          const result = fromMorse(value);
          output.textContent = result.text || 'No readable Morse code found.';
          if (result.errors.length) {
            error.textContent = `Unknown Morse pattern: ${result.errors.slice(0, 4).join(', ')}`;
            error.hidden = false;
          }
        } else {
          const morse = toMorse(value);
          output.innerHTML = renderMorseTokens(morse);
        }
      }

      input.addEventListener('input', update);
      card.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
      card.querySelector('[data-copy]')?.addEventListener('click', (event) => copyText(output.textContent.trim(), event.currentTarget));
      card.querySelector('[data-clear]')?.addEventListener('click', () => { input.value = ''; update(); input.focus(); });
      card.querySelector('[data-swap]')?.addEventListener('click', () => {
        const nextInput = output.textContent.trim();
        input.value = Object.values(emptyResultText).includes(nextInput) ? '' : nextInput;
        setMode(mode === 'morse-to-text' ? 'text-to-morse' : 'morse-to-text');
      });
      card.querySelector('[data-play]')?.addEventListener('click', () => {
        const code = mode === 'text-to-morse' ? output.textContent : input.value;
        playMorse(code, { scope: output, mode, card });
      });
      card.querySelector('[data-download]')?.addEventListener('click', () => {
        const text = output.textContent.trim();
        if (text) downloadBlob(new Blob([text], { type: 'text/plain' }), 'morse-code.txt');
      });
      card.querySelectorAll('[data-example]').forEach((button) => button.addEventListener('click', () => {
        input.value = button.dataset.example;
        if (mode === 'morse-to-text') setMode('text-to-morse');
        update();
      }));
      update();
      setMode(mode);
    });
  }

  function initCopyAndPlayButtons() {
    document.addEventListener('click', (event) => {
      const copyButton = event.target.closest('[data-copy-value]');
      if (copyButton) copyText(copyButton.dataset.copyValue, copyButton);
      const playButton = event.target.closest('[data-play-morse]');
      if (playButton) playMorse(playButton.dataset.playMorse, { card: playButton.closest('.tool-card, .section, .answer-card') });
    });
  }

  function initAlphabetSearch() {
    const search = document.querySelector('[data-alphabet-search]');
    if (!search) return;
    search.addEventListener('input', () => {
      const value = search.value.trim().toUpperCase();
      document.querySelectorAll('[data-symbol-card]').forEach((card) => {
        const haystack = `${card.dataset.symbol} ${card.dataset.morse}`.toUpperCase();
        card.hidden = value && !haystack.includes(value);
      });
    });
  }

  function initSoundTool() {
    const tool = document.querySelector('[data-sound-tool]');
    if (!tool) return;
    const input = tool.querySelector('[data-sound-input]');
    const output = tool.querySelector('[data-sound-output]');
    const wpm = tool.querySelector('[data-wpm]');
    const tone = tool.querySelector('[data-tone]');
    const wpmValue = tool.querySelector('[data-wpm-value]');
    const toneValue = tool.querySelector('[data-tone-value]');
    const progress = tool.querySelector('[data-progress]');
    const loop = tool.querySelector('[data-loop]');

    function update() {
      wpmValue.textContent = wpm.value;
      toneValue.textContent = `${tone.value} Hz`;
      output.textContent = getMorseFromValue(input.value);
    }

    async function playLoop() {
      do {
        progress.style.width = '100%';
        await playMorse(output.textContent, { wpm: wpm.value, tone: tone.value, card: tool });
        progress.style.width = '0%';
      } while (loop.checked && !stopPlayback);
    }

    input.addEventListener('input', update);
    wpm.addEventListener('input', update);
    tone.addEventListener('input', update);
    tool.querySelector('[data-sound-play]')?.addEventListener('click', playLoop);
    tool.querySelector('[data-sound-stop]')?.addEventListener('click', () => { stopPlayback = true; progress.style.width = '0%'; });
    tool.querySelector('[data-sound-copy]')?.addEventListener('click', (event) => copyText(output.textContent, event.currentTarget));
    tool.querySelector('[data-sound-download]')?.addEventListener('click', () => downloadBlob(makeWavBlob(output.textContent, wpm.value, tone.value), 'morse-code.wav'));
    update();
  }

  function initPractice() {
    const tool = document.querySelector('[data-practice]');
    if (!tool) return;
    const prompt = tool.querySelector('[data-practice-prompt]');
    const answers = tool.querySelector('[data-practice-answers]');
    const feedback = tool.querySelector('[data-practice-feedback]');
    const scoreEl = tool.querySelector('[data-practice-score]');
    const streakEl = tool.querySelector('[data-practice-streak]');
    const progress = tool.querySelector('[data-practice-progress]');
    const wpm = tool.querySelector('[data-practice-wpm]');
    let mode = 'read';
    let current = 'A';
    let score = 0;
    let count = 0;
    let streak = 0;

    function pickOptions(answer) {
      const set = new Set([answer]);
      while (set.size < 4) set.add(practiceChars[Math.floor(Math.random() * practiceChars.length)]);
      return [...set].sort(() => Math.random() - 0.5);
    }

    function nextQuestion() {
      current = practiceChars[Math.floor(Math.random() * practiceChars.length)];
      prompt.textContent = mode === 'read' ? MORSE[current] : 'Listen, then choose';
      answers.innerHTML = pickOptions(current).map((char) => `<button type="button" data-answer="${char}">${char}</button>`).join('');
      feedback.textContent = mode === 'read' ? 'Choose the matching character.' : 'Press Play if you need to hear it again.';
      if (mode === 'listen') playMorse(MORSE[current], { wpm: wpm.value, card: tool });
    }

    function updateScore() {
      scoreEl.textContent = score;
      streakEl.textContent = streak;
      progress.style.width = `${Math.min(100, count * 10)}%`;
    }

    answers.addEventListener('click', (event) => {
      const button = event.target.closest('[data-answer]');
      if (!button || count >= 10) return;
      count += 1;
      if (button.dataset.answer === current) {
        score += 1;
        streak += 1;
        button.classList.add('correct');
        feedback.textContent = `Correct. ${current} is ${MORSE[current]}.`;
      } else {
        streak = 0;
        button.classList.add('wrong');
        answers.querySelector(`[data-answer="${current}"]`)?.classList.add('correct');
        feedback.textContent = `Not this time. ${current} is ${MORSE[current]}.`;
      }
      updateScore();
      if (count < 10) setTimeout(nextQuestion, 850);
      else feedback.textContent += ' Round complete.';
    });

    tool.querySelectorAll('[data-practice-mode]').forEach((button) => button.addEventListener('click', () => {
      mode = button.dataset.practiceMode;
      tool.querySelectorAll('[data-practice-mode]').forEach((item) => item.classList.toggle('active', item === button));
      nextQuestion();
    }));
    tool.querySelector('[data-practice-play]')?.addEventListener('click', () => playMorse(MORSE[current], { wpm: wpm.value, card: tool }));
    tool.querySelector('[data-practice-reset]')?.addEventListener('click', () => {
      score = 0; count = 0; streak = 0; updateScore(); nextQuestion();
    });
    updateScore();
    nextQuestion();
  }

  function initKeyer() {
    const tool = document.querySelector('[data-keyer]');
    if (!tool) return;
    const keyButton = tool.querySelector('[data-keyer-button]');
    const live = tool.querySelector('[data-keyer-live]');
    const codeOutput = tool.querySelector('[data-keyer-code]');
    const textOutput = tool.querySelector('[data-keyer-text]');
    const status = tool.querySelector('[data-keyer-status]');
    const wpm = tool.querySelector('[data-keyer-wpm]');
    const tone = tool.querySelector('[data-keyer-tone]');
    const wpmValue = tool.querySelector('[data-keyer-wpm-value]');
    const toneValue = tool.querySelector('[data-keyer-tone-value]');
    const state = {
      letters: [],
      current: '',
      isDown: false,
      pressStart: 0,
      lastRelease: 0
    };

    function unit() {
      return unitFromWpm(wpm.value);
    }

    function letterGap() {
      return unit() * 3;
    }

    function wordGap() {
      return unit() * 7;
    }

    function dashThreshold() {
      return unit() * 2;
    }

    function rawCode() {
      return [...state.letters, state.current].filter(Boolean).join(' ').replace(/\s+\/\s+/g, ' / ');
    }

    function decodedText() {
      const raw = rawCode();
      if (!raw) return '';
      return fromMorse(raw).text || '';
    }

    function update(message) {
      const raw = rawCode();
      codeOutput.textContent = raw || 'Waiting for input';
      textOutput.textContent = decodedText() || 'Waiting for input';
      wpmValue.textContent = `${wpm.value} WPM`;
      toneValue.textContent = `${tone.value} Hz`;
      if (message) status.textContent = message;
      tool.classList.toggle('has-input', Boolean(raw));
    }

    function commitLetter() {
      if (!state.current) return false;
      state.letters.push(state.current);
      state.current = '';
      return true;
    }

    function addWordSpace() {
      commitLetter();
      if (state.letters.length && state.letters[state.letters.length - 1] !== '/') {
        state.letters.push('/');
      }
    }

    function applyPauseGap(now) {
      if (!state.lastRelease) return;
      const gap = now - state.lastRelease;
      if (gap >= wordGap()) {
        if (state.current) commitLetter();
        else if (state.letters.length && state.letters[state.letters.length - 1] !== '/') state.letters.push('/');
      } else if (gap >= letterGap()) {
        commitLetter();
      }
    }

    function beginPress() {
      if (state.isDown) return;
      const now = performance.now();
      applyPauseGap(now);
      state.isDown = true;
      state.pressStart = now;
      keyButton.setAttribute('aria-pressed', 'true');
      tool.classList.add('is-key-down');
      live.textContent = 'Sound on';
      status.textContent = 'Listening...';
      startHeldTone(tone.value).then(() => {
        if (!state.isDown) stopHeldTone();
      });
      update();
    }

    function endPress() {
      if (!state.isDown) return;
      const now = performance.now();
      const duration = now - state.pressStart;
      const symbol = duration >= dashThreshold() ? '-' : '.';
      state.current += symbol;
      state.lastRelease = now;
      state.isDown = false;
      keyButton.setAttribute('aria-pressed', 'false');
      tool.classList.remove('is-key-down');
      live.textContent = symbol === '-' ? 'Dash' : 'Dot';
      stopHeldTone();
      update(`${symbol === '-' ? 'Dash' : 'Dot'} added.`);
    }

    function shouldUseSpaceKey(target) {
      if (target.closest?.('input, textarea, select, [contenteditable="true"]')) return false;
      if (target.closest?.('button, a') && target !== keyButton) return false;
      return true;
    }

    keyButton.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      keyButton.setPointerCapture?.(event.pointerId);
      beginPress();
    });
    keyButton.addEventListener('pointerup', (event) => {
      event.preventDefault();
      endPress();
    });
    keyButton.addEventListener('pointercancel', endPress);
    keyButton.addEventListener('lostpointercapture', endPress);

    document.addEventListener('keydown', (event) => {
      if (event.code !== 'Space' || event.repeat || !shouldUseSpaceKey(event.target)) return;
      event.preventDefault();
      beginPress();
    });
    document.addEventListener('keyup', (event) => {
      if (event.code !== 'Space' || !state.isDown) return;
      event.preventDefault();
      endPress();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) endPress();
    });

    tool.querySelector('[data-keyer-letter]')?.addEventListener('click', () => {
      const changed = commitLetter();
      if (changed) state.lastRelease = 0;
      update(changed ? 'Letter space added.' : 'No active letter to space yet.');
    });
    tool.querySelector('[data-keyer-word]')?.addEventListener('click', () => {
      addWordSpace();
      state.lastRelease = 0;
      update('Word space added.');
    });
    tool.querySelector('[data-keyer-play]')?.addEventListener('click', () => {
      const raw = rawCode();
      if (raw) playMorse(raw, { wpm: wpm.value, tone: tone.value, card: tool });
    });
    tool.querySelector('[data-keyer-copy-code]')?.addEventListener('click', (event) => copyText(rawCode(), event.currentTarget));
    tool.querySelector('[data-keyer-copy-text]')?.addEventListener('click', (event) => copyText(decodedText(), event.currentTarget));
    tool.querySelector('[data-keyer-clear]')?.addEventListener('click', () => {
      state.letters = [];
      state.current = '';
      state.isDown = false;
      state.pressStart = 0;
      state.lastRelease = 0;
      keyButton.setAttribute('aria-pressed', 'false');
      tool.classList.remove('is-key-down');
      stopHeldTone();
      live.textContent = 'Ready';
      update('Cleared.');
    });
    [wpm, tone].forEach((control) => control.addEventListener('input', () => update()));
    update();
  }

  function initMotion() {
    const motionSafe = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const header = document.querySelector('.site-header');

    function updateScrollState() {
      const y = window.scrollY || 0;
      header?.classList.toggle('is-scrolled', y > 10);
      root.style.setProperty('--scroll-ratio', String(Math.min(1, y / 420)));
    }

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    if (motionSafe) {
      let pointerFrame = 0;
      let pointerX = 0;
      let pointerY = 0;
      window.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (pointerFrame) return;
        pointerFrame = window.requestAnimationFrame(() => {
          root.style.setProperty('--cursor-x', `${pointerX}px`);
          root.style.setProperty('--cursor-y', `${pointerY}px`);
          pointerFrame = 0;
        });
      }, { passive: true });
    }

    if (motionSafe && 'IntersectionObserver' in window) {
      const targets = document.querySelectorAll('.section, .feature-tile, .tool-card, .answer-card, .site-footer');
      targets.forEach((target, index) => {
        target.classList.add('reveal-ready');
        target.style.setProperty('--reveal-delay', `${Math.min(index * 28, 180)}ms`);
      });
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      targets.forEach((target) => observer.observe(target));
    }

    document.querySelectorAll('.translator-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });

    document.addEventListener('click', (event) => {
      const button = event.target.closest('.button, .examples button, .symbol-actions button, td button, .answer-grid button, .keyer-button');
      if (!button || !motionSafe) return;
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'button-ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.append(ripple);
      window.setTimeout(() => ripple.remove(), 560);
    });
  }

  function initEmailLinks() {
    document.querySelectorAll('[data-email-address], [data-email-link]').forEach((node) => {
      const user = node.dataset.emailUser;
      const domain = node.dataset.emailDomain;
      if (!user || !domain) return;
      const email = `${user}@${domain}`;
      node.textContent = email;
      if (node.matches('a')) {
        node.setAttribute('href', `mailto:${email}`);
        node.setAttribute('aria-label', `Email ${email}`);
      }
    });
  }

  initTheme();
  initEmailLinks();
  initConverters();
  initCopyAndPlayButtons();
  initAlphabetSearch();
  initSoundTool();
  initPractice();
  initKeyer();
  initMotion();
}());
