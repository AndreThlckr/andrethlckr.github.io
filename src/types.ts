export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface GameConfig {
  word: string;
  maxGuesses: number;
}

export interface GuessLetter {
  char: string;
  status: LetterStatus;
}

export interface KeyboardKeyStatus {
  [key: string]: LetterStatus;
}
