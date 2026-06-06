import { GameConfig } from '../types';

/**
 * Obfuscates a string using Base64.
 */
export function obfuscate(text: string): string {
  try {
    return btoa(text.toUpperCase().trim());
  } catch (e) {
    return text;
  }
}

/**
 * De-obfuscates a string from Base64.
 */
export function deobfuscate(encoded: string): string {
  try {
    return atob(encoded).toUpperCase().trim();
  } catch (e) {
    return encoded.toUpperCase().trim();
  }
}

/**
 * Generates the full shareable URL for a given word and guess limit.
 */
export function getShareableUrl(word: string, maxGuesses: number): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const encodedWord = obfuscate(word);
  return `${baseUrl}?w=${encodeURIComponent(encodedWord)}&g=${maxGuesses}`;
}

/**
 * Decodes the game configuration from the active URL query parameter.
 * Supports both hidden/obfuscated keys (?w=, ?g=) and plain keys (?word=, ?guesses=)
 */
export function decodeChallengeFromUrl(): GameConfig | null {
  const params = new URLSearchParams(window.location.search);
  
  let targetWord = '';
  let targetGuesses = 6;
  
  const w = params.get('w');
  const word = params.get('word');
  const g = params.get('g');
  const guesses = params.get('guesses');
  
  if (w) {
    targetWord = deobfuscate(w);
  } else if (word) {
    targetWord = word.toUpperCase().trim();
  }
  
  if (g) {
    const parsedG = parseInt(g, 10);
    if (!isNaN(parsedG) && parsedG > 0) {
      targetGuesses = parsedG;
    }
  } else if (guesses) {
    const parsedGuesses = parseInt(guesses, 10);
    if (!isNaN(parsedGuesses) && parsedGuesses > 0) {
      targetGuesses = parsedGuesses;
    }
  }
  
  if (!targetWord) {
    return null;
  }
  
  // Clean secret word (only allow letters, digits or custom symbols, remove spaces if needed but allow sequence of characters)
  return {
    word: targetWord,
    maxGuesses: targetGuesses
  };
}
