export const SITE = {
  name: 'Morse Code Alphabet',
  domain: 'morsecodealphabet.net',
  url: 'https://morsecodealphabet.net',
  email: 'support@morsecodealphabet.net'
};

export const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-',
  L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-',
  W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.'
};

export const PROSIGNS = [
  { label: 'SOS', code: '... --- ...', meaning: 'Distress signal' },
  { label: 'AR', code: '.-.-.', meaning: 'End of message' },
  { label: 'AS', code: '.-...', meaning: 'Wait' },
  { label: 'BT', code: '-...-', meaning: 'Separator' },
  { label: 'HH', code: '........', meaning: 'Correction' },
  { label: 'KN', code: '-.--.', meaning: 'Go only, specific station' },
  { label: 'SK', code: '...-.-', meaning: 'End of contact' },
  { label: 'VE', code: '...-.', meaning: 'Understood' }
];

export const primaryNav = [
  { href: '/', label: 'Translator' },
  { href: '/morse-code-alphabet/', label: 'Alphabet' },
  { href: '/morse-code-decoder/', label: 'Decoder' },
  { href: '/morse-code-sounds/', label: 'Sounds' },
  { href: '/morse-code-practice/', label: 'Practice' },
  { href: '/about/', label: 'About' }
];

export const importantLinks = [
  { href: '/morse-code-decoder/', label: 'Morse Code Decoder', desc: 'Convert dots and dashes into readable text.' },
  { href: '/english-to-morse/', label: 'English to Morse', desc: 'Turn words, numbers, and punctuation into Morse code.' },
  { href: '/morse-code-sounds/', label: 'Morse Code Sounds', desc: 'Play Morse with adjustable speed and tone.' },
  { href: '/morse-code-alphabet/', label: 'Morse Code Alphabet', desc: 'Letters, numbers, punctuation, and prosigns.' },
  { href: '/learn-morse-code/', label: 'Learn Morse Code', desc: 'A simple path from alphabet to practice.' },
  { href: '/morse-code-practice/', label: 'Morse Code Practice', desc: 'Train with listening, reading, and tap-key drills.' }
];

export const scenarioLinks = [
  { href: '/learn-morse-code/', label: 'Learn', desc: 'Follow a beginner-friendly practice path.' },
  { href: '/morse-code-practice/', label: 'Practice', desc: 'Train recognition with sound or text.' },
  { href: '/morse-code-sounds/', label: 'Sound', desc: 'Hear how timing changes the message.' }
];

export const sourceLinks = [
  { label: 'ITU Radiocommunication Recommendation M.1677', href: 'https://www.itu.int/rec/R-REC-M.1677/en', note: 'International Morse code characters and operational signs.' },
  { label: 'ARRL Morse Code resources', href: 'https://www.arrl.org/learning-morse-code', note: 'Learning guidance and amateur radio practice context.' },
  { label: 'Encyclopaedia Britannica: Morse Code', href: 'https://www.britannica.com/topic/Morse-Code', note: 'Historical background and plain-language overview.' }
];

export const pageMeta = {
  '/': {
    title: 'Morse Code Translator, Alphabet, Sounds and Practice',
    description: 'Use a fast Morse code translator, hear Morse sounds, browse the alphabet, and practice letters, numbers, and timing.'
  },
  '/morse-code-alphabet/': {
    title: 'Morse Code Alphabet: Letters, Numbers and Symbols',
    description: 'See the complete Morse code alphabet with A-Z letters, numbers, punctuation, prosigns, sound playback, and copy buttons.'
  },
  '/morse-code-decoder/': {
    title: 'Morse Code Decoder: Convert Morse to English',
    description: 'Decode Morse code into English text with examples, copy, sound playback, and clear guidance for dots, dashes, and spaces.'
  },
  '/english-to-morse/': {
    title: 'English to Morse Code Translator',
    description: 'Translate English text into Morse code instantly, copy the result, play sound, and test common examples.'
  },
  '/learn-morse-code/': {
    title: 'Learn Morse Code: Simple Steps and Daily Practice',
    description: 'Learn Morse code with a practical route, letter groups, sound drills, timing rules, and links to practice tools.'
  },
  '/morse-code-practice/': {
    title: 'Morse Code Practice: Listening, Reading and Key Trainer',
    description: 'Practice Morse code with listening questions, visual Morse questions, tap-and-hold key input, sound feedback, and progress tracking.'
  },
  '/morse-code-meaning/': {
    title: 'Morse Code Meaning: What Morse Code Is and How It Works',
    description: 'Understand the meaning of Morse code, its timing rules, uses, examples, and the difference between letters and words.'
  },
  '/international-morse-code/': {
    title: 'International Morse Code Reference',
    description: 'Review International Morse code letters, numbers, punctuation, prosigns, spacing rules, and trusted reference sources.'
  },
  '/morse-code-sounds/': {
    title: 'Morse Code Sounds: Play Dots and Dashes',
    description: 'Play Morse code sounds with speed, tone, loop, copy, and download controls for learning and practice.'
  },
  '/about/': {
    title: 'About Morse Code Alphabet',
    description: 'Learn what Morse Code Alphabet offers: conversion, sound playback, alphabet reference, and practice tools.'
  },
  '/contact/': {
    title: 'Contact Morse Code Alphabet',
    description: 'Contact Morse Code Alphabet for questions, corrections, accessibility notes, or feedback about Morse code tools and references.'
  },
  '/privacy-policy/': {
    title: 'Privacy Policy',
    description: 'Read how Morse Code Alphabet handles contact messages and browser-based tool use.'
  },
  '/terms/': {
    title: 'Terms of Use',
    description: 'Read the terms for using Morse Code Alphabet tools, references, sound playback, and learning materials.'
  },
  '/sources/': {
    title: 'Morse Code Sources',
    description: 'Review the references used for Morse code characters, timing, history, and learning guidance.'
  },
  '/sitemap/': {
    title: 'Sitemap',
    description: 'Browse all available Morse Code Alphabet pages.'
  }
};
