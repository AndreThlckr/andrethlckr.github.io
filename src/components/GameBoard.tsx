import React, { useState, useEffect, useRef } from 'react';
import { GameConfig, KeyboardKeyStatus, LetterStatus } from '../types';
import { Keyboard } from './Keyboard';
import { 
  playTypeSound, 
  playBackspaceSound, 
  playSubmitSound, 
  playErrorSound, 
  playVictorySound, 
  playDefeatSound,
  playFrogRibbit
} from '../utils/audio';
import { Volume2, VolumeX, RefreshCw, Sparkles, Share2, Copy, Check, Home, Award } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface GameBoardProps {
  config: GameConfig;
  onNewGameRequest: () => void;
  language: Language;
}

interface ConfettiItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ config, onNewGameRequest, language }) => {
  const { word, maxGuesses } = config;
  const wordLength = word.length;

  const t = translations[language];

  // Game States
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [wobbleRow, setWobbleRow] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState(false);
  
  // Confetti particles for victory
  const [confetti, setConfetti] = useState<ConfettiItem[]>([]);
  const confettiIdCounter = useRef(0);

  // Derive status
  const isWon = guesses.length > 0 && guesses[guesses.length - 1] === word;
  const isLost = !isWon && guesses.length >= maxGuesses;
  const isGameOver = isWon || isLost;

  // Audio mute toggling
  const handleKeySound = (soundFn: () => void) => {
    if (!isMuted) {
      soundFn();
    }
  };

  // Process keyboard status mapping (used by key colors on layout)
  const keyStatuses: KeyboardKeyStatus = {};
  guesses.forEach((guess) => {
    for (let i = 0; i < wordLength; i++) {
      const char = guess[i];
      if (word[i] === char) {
        keyStatuses[char] = 'correct';
      } else if (word.includes(char)) {
        // Only set present if it's not already correct
        if (keyStatuses[char] !== 'correct') {
          keyStatuses[char] = 'present';
        }
      } else {
        if (!keyStatuses[char]) {
          keyStatuses[char] = 'absent';
        }
      }
    }
  });

  // Custom Wordle Exact mapping for each letter in a completed row (for high fidelity rendering matching answer duplicates)
  const calculateRowLetterStatuses = (guess: string): LetterStatus[] => {
    const statuses = Array(wordLength).fill('absent') as LetterStatus[];
    const targetLetterCounts: { [key: string]: number } = {};

    for (let i = 0; i < wordLength; i++) {
      const c = word[i];
      targetLetterCounts[c] = (targetLetterCounts[c] || 0) + 1;
    }

    // Pass 1: exact matches
    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === word[i]) {
        statuses[i] = 'correct';
        targetLetterCounts[guess[i]]--;
      }
    }

    // Pass 2: partial matches
    for (let i = 0; i < wordLength; i++) {
      if (statuses[i] !== 'correct') {
        const char = guess[i];
        if (targetLetterCounts[char] && targetLetterCounts[char] > 0) {
          statuses[i] = 'present';
          targetLetterCounts[char]--;
        }
      }
    }

    return statuses;
  };

  // Handle a key press
  const handleInputChar = (input: string) => {
    if (isGameOver) return;

    if (input === 'BACKSPACE') {
      if (currentGuess.length > 0) {
        setCurrentGuess(prev => prev.slice(0, -1));
        handleKeySound(playBackspaceSound);
      }
    } else if (input === 'ENTER') {
      if (currentGuess.length < wordLength) {
        // Complete current guess first
        setWobbleRow(true);
        setTimeout(() => setWobbleRow(false), 500);
        handleKeySound(playErrorSound);
        return;
      }

      const nextGuesses = [...guesses, currentGuess];
      setGuesses(nextGuesses);
      const isWinner = currentGuess === word;

      if (isWinner) {
        handleKeySound(playVictorySound);
        triggerVictoryConfetti();
      } else if (nextGuesses.length >= maxGuesses) {
        handleKeySound(playDefeatSound);
      } else {
        handleKeySound(playSubmitSound);
      }
      
      setCurrentGuess('');
    } else {
      // standard key
      if (currentGuess.length < wordLength) {
        const sanitized = input.toUpperCase().trim();
        // Allow any sequence of characters to be entered as requested
        if (sanitized.length === 1) {
          setCurrentGuess(prev => prev + sanitized);
          handleKeySound(playTypeSound);
        }
      }
    }
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE' || key === 'DELETE') {
        handleInputChar('BACKSPACE');
      } else if (key === 'ENTER') {
        handleInputChar('ENTER');
      } else if (e.key.length === 1) {
        // Accept any printed key matching query parameters
        handleInputChar(e.key);
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeyDown);
    };
  }, [currentGuess, guesses, isGameOver, wordLength]);

  // Generate confetti burst on victory
  const triggerVictoryConfetti = () => {
    const emojis = ['🐸', '🍀', '✨', '👑', '🎉', '🌟', '🍃', '🥳', '💚'];
    const newParticles: ConfettiItem[] = [];
    
    // Spawn 55 delightful particles
    for (let i = 0; i < 55; i++) {
      newParticles.push({
        id: confettiIdCounter.current++,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100, // percentage of viewport width
        y: 100 + Math.random() * 20, // initial gravity offset below screen
        scale: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * 360,
        delay: Math.random() * 1.5 // staggered delay in seconds
      });
    }
    setConfetti(newParticles);
  };

  // Share grid copy text with emojis
  const handleShareGrid = () => {
    // Emojis: correct=🟩, present=🟨, absent=⬜/⬛
    let shareText = `${t.shareTitle}\n${guesses.length}/${maxGuesses} ${t.attemptsLabel}\n\n`;
    
    guesses.forEach((guess) => {
      const statuses = calculateRowLetterStatuses(guess);
      const rowEmojis = statuses.map(s => {
        if (s === 'correct') return '🟩';
        if (s === 'present') return '🟨';
        return '⬜';
      }).join('');
      shareText += `${rowEmojis}\n`;
    });

    shareText += `\nPlay Froordle & challenge others: ${window.location.href}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedText(true);
      handleKeySound(playFrogRibbit);
      setTimeout(() => setCopiedText(false), 3000);
    }).catch(() => {
      alert((language === 'en' ? 'Results copied to memory:\n\n' : 'Resultados copiados para a memória:\n\n') + shareText);
    });
  };

  // Determine dynamic sizing for grid letters on different word lengths to ensure they fit neatly
  const getCellSizing = () => {
    if (wordLength <= 4) {
      return 'w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl rounded-2xl';
    }
    if (wordLength <= 6) {
      return 'w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl rounded-xl';
    }
    if (wordLength <= 8) {
      return 'w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl rounded-lg';
    }
    return 'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-md rounded-md';
  };

  const cellSizeClass = getCellSizing();

  // Localized Victory Description
  const getVictoryDesc = () => {
    const triesText = language === 'en' 
      ? (guesses.length === 1 ? 'try' : 'tries')
      : (guesses.length === 1 ? 'tentativa' : 'tentativas');
    return t.victoryDesc
      .replace('{count}', guesses.length.toString())
      .replace('{tries}', triesText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center relative select-none font-sans">
      
      {/* Victory Particles Container */}
      {confetti.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden min-h-[100vh]">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute animate-float-particle font-emoji"
              style={{
                left: `${c.x}%`,
                bottom: `110%`,
                transform: `scale(${c.scale}) rotate(${c.rotation}deg)`,
                animationDelay: `${c.delay}s`,
                fontSize: '1.5rem'
              }}
            >
              {c.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Grid Controller Headers */}
      <div className="w-full max-w-lg mb-6 flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={onNewGameRequest}
          id="btn-back-home"
          className="p-2 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-950 rounded-xl hover:scale-105 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <Home className="w-4 h-4" /> {t.newChallengeBtn}
        </button>

        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-full border border-emerald-500/10">
          <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Froordle: {wordLength} {t.lettersLabel}
          </span>
        </div>

        <button
          type="button"
          id="btn-toggle-sound"
          onClick={() => setIsMuted(prev => !prev)}
          className="p-2 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-950 rounded-xl hover:scale-105 transition cursor-pointer"
          title={isMuted ? 'Unmute game sound' : 'Mute game sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Board Grid layout */}
      <div className="flex-1 flex items-center justify-center py-4 w-full">
        <div className="flex flex-col gap-1.5 justify-center items-center">
          {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
            const isSubmitted = rowIndex < guesses.length;
            const isTypingRow = rowIndex === guesses.length;

            let rowGuess = '';
            let letterStatuses: LetterStatus[] = [];

            if (isSubmitted) {
              rowGuess = guesses[rowIndex];
              letterStatuses = calculateRowLetterStatuses(rowGuess);
            } else if (isTypingRow) {
              rowGuess = currentGuess;
            }

            const rowWobble = isTypingRow && wobbleRow ? 'animate-row-wobble' : '';

            return (
              <div 
                key={rowIndex} 
                className={`flex gap-1.5 justify-center items-center ${rowWobble}`}
                id={`grid-row-${rowIndex}`}
              >
                {Array.from({ length: wordLength }).map((_, cellIndex) => {
                  const char = rowGuess[cellIndex] || '';
                  let statusClass = 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100';
                  
                  if (isSubmitted) {
                    const status = letterStatuses[cellIndex];
                    if (status === 'correct') {
                      statusClass = 'bg-emerald-600 text-white border-emerald-600 font-extrabold animate-cell-reveal shadow-md';
                    } else if (status === 'present') {
                      statusClass = 'bg-amber-500 text-white border-amber-500 font-extrabold animate-cell-reveal shadow-md';
                    } else {
                      statusClass = 'bg-slate-300 border-slate-300 dark:bg-slate-800 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60';
                    }
                  } else if (isTypingRow) {
                    if (char) {
                      statusClass = 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-800 dark:text-emerald-300 scale-105 border-2 animate-bounce-short font-bold shadow-sm';
                    } else {
                      statusClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800';
                    }
                  } else {
                    statusClass = 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-900/60 opacity-40';
                  }

                  return (
                    <div
                      key={cellIndex}
                      id={`cell-${rowIndex}-${cellIndex}`}
                      style={{ animationDelay: isSubmitted ? `${cellIndex * 150}ms` : '0ms' }}
                      className={`
                        ${cellSizeClass}
                        flex items-center justify-center font-bold border-2 transition-all duration-300
                        ${statusClass}
                      `}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game End Modals/Overlay alerts */}
      {isGameOver && (
        <div id="game-over-panel" className="w-full max-w-lg mt-4 bg-white dark:bg-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scale-in">
          {isWon ? (
            <div className="space-y-2">
              <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600">
                <Award className="w-8 h-8 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
                {t.victoryTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {getVictoryDesc()}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl animate-pulse">😢🐸</div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {t.defeatTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.defeatDesc}
              </p>
              <div className="inline-block p-3.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 font-mono">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-widest mb-1">
                  {t.secretWordWas}
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                  {word}
                </span>
              </div>
            </div>
          )}

          {/* Quick Stats Grid overview for copy/paste */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={handleShareGrid}
              id="btn-share-results"
              type="button"
              className="p-3.5 rounded-xl font-extrabold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4" /> {t.copiedResultText}
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> {t.shareResultsBtn}
                </>
              )}
            </button>
            <button
              onClick={onNewGameRequest}
              id="btn-new-game-post"
              type="button"
              className="p-3.5 rounded-xl font-extrabold text-sm bg-slate-900 hover:bg-slate-800 text-slate-100 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" /> {t.createAnotherBtn}
            </button>
          </div>
          {copiedText && (
            <p className="text-2xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
              {t.copiedShareBlockSuccess}
            </p>
          )}
        </div>
      )}

      {/* Main Interactive Controls / Keyboard */}
      {!isGameOver && (
        <Keyboard 
          onKeyPress={handleInputChar} 
          keyStatuses={keyStatuses} 
        />
      )}

      {/* Helpful footer options */}
      <div className="text-center mt-6 text-2xs text-slate-400/80 font-semibold uppercase tracking-widest flex items-center gap-2">
        {t.footerInstruction}
      </div>
    </div>
  );
};
