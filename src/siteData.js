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
    title: 'Morse Code Translator with Alphabet, Sound and Practice',
    description: 'Translate English and Morse code, listen to dot-dash audio, check the alphabet, and practice with beginner-friendly Morse tools.'
  },
  '/morse-code-alphabet/': {
    title: 'Morse Code Alphabet: A-Z Letters, Numbers and Symbols',
    description: 'Use the Morse code alphabet table for A-Z letters, numbers, punctuation, prosigns, sound playback, and quick copy checks.'
  },
  '/morse-code-decoder/': {
    title: 'Morse Code Decoder: Convert Dots and Dashes to English',
    description: 'Decode Morse code into English text, fix spacing problems, test SOS and HELLO examples, and play the message as sound.'
  },
  '/english-to-morse/': {
    title: 'English to Morse Code Translator: Text to Dots and Dashes',
    description: 'Convert English words, names, numbers, and short messages into Morse code with copy, audio playback, and plain spacing tips.'
  },
  '/learn-morse-code/': {
    title: 'Learn Morse Code: Beginner Steps, Groups and Daily Drills',
    description: 'Learn Morse code with starter letter groups, a simple daily plan, listening drills, timing rules, and practice tools.'
  },
  '/morse-code-practice/': {
    title: 'Morse Code Practice: Listening, Reading and Key Trainer',
    description: 'Practice Morse code with listening questions, visual Morse questions, tap-and-hold key input, sound feedback, and progress tracking.'
  },
  '/morse-code-meaning/': {
    title: 'Morse Code Meaning: What Dots and Dashes Represent',
    description: 'Understand what Morse code means, how dots and dashes represent text, why spacing matters, and where Morse is still used.'
  },
  '/international-morse-code/': {
    title: 'International Morse Code Reference: Letters, Numbers and Timing',
    description: 'Review International Morse code letters, numbers, punctuation, prosigns, timing units, spacing rules, and reference sources.'
  },
  '/morse-code-sounds/': {
    title: 'Morse Code Sounds: Play, Adjust and Download Dot-Dash Audio',
    description: 'Play Morse code sounds, change WPM and tone, loop short messages, copy the code, and download practice audio as a WAV file.'
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
