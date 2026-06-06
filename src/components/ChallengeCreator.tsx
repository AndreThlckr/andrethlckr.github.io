import React, { useState } from 'react';
import { Sparkles, ArrowRight, Copy, Check } from 'lucide-react';
import { getShareableUrl } from '../utils/urlHelper';
import { playFrogRibbit, playTypeSound } from '../utils/audio';
import { Language, translations } from '../utils/translations';

interface ChallengeCreatorProps {
  onChallengeCreated: (word: string, maxGuesses: number) => void;
  language: Language;
}

export const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ onChallengeCreated, language }) => {
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState(6);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const t = translations[language];

  const cleanWord = word.trim().toUpperCase();
  const wordLength = cleanWord.length;

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Allow any characters based on prompt ("allow any sequence of characters to be entered") but limit length for layouts
    if (rawVal.length <= 15) {
      setWord(rawVal);
      playTypeSound();
    }
  };

  const getRandomWord = () => {
    const EN_WORDS = [
      'RIBBIT', 'FROGGY', 'SWAMP', 'POND', 'JUMPING', 'TOAD', 'TADPOLE', 'LILYPAD', 
      'CROAK', 'GREEN', 'LEAPER', 'MOSQUITO', 'WATER', 'SPRING', 'FLOW', 'FLIPPER'
    ];
    const PT_WORDS = [
      'PERERECA', 'GIRINO', 'REBOCAR', 'LAGOA', 'SALTAR', 'SAPO', 'BREJO', 'VERDE',
      'INSETO', 'MOSQUITO', 'AGUA', 'FONTE', 'SALTO', 'FROORDLE', 'LILYPAD', 'CROAK'
    ];
    const pool = language === 'pt' ? PT_WORDS : EN_WORDS;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setWord(picked);
    playFrogRibbit();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanWord) return;

    const url = getShareableUrl(cleanWord, guesses);
    setShareUrl(url);
    setShowShareModal(true);
    playFrogRibbit();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      const input = document.getElementById('share-url-input') as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  // Generate difficulty badge text
  const getDifficulty = () => {
    if (wordLength === 0) return { label: t.difficultyEmpty, color: 'bg-slate-100 text-slate-600 dark:bg-slate-900' };
    
    // Calculate simple rating based on word length relative to guesses
    const ratio = wordLength / guesses;
    if (ratio > 1.2) return { label: t.difficultyHardcore, color: 'bg-red-500 text-white' };
    if (ratio > 0.8) return { label: t.difficultyTricky, color: 'bg-orange-500 text-white' };
    if (ratio > 0.5) return { label: t.difficultyStandard, color: 'bg-emerald-500 text-white' };
    return { label: t.difficultyEasy, color: 'bg-sky-500 text-white' };
  };

  const difficulty = getDifficulty();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8" id="froordle-creator">
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4 ring-8 ring-emerald-500/10">
          <span className="text-5xl animate-bounce-short">🐸</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-900 dark:text-emerald-300">
          Froordle
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-md max-w-md mx-auto mt-2">
          {t.description}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-emerald-500/20 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <form onSubmit={handleCreate} className="space-y-6">
            
            {/* Word entry */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t.secretWordLabel}
                </label>
                <button
                  type="button"
                  id="btn-random-word"
                  onClick={getRandomWord}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer transition p-1"
                >
                  <Sparkles className="w-3" /> {t.randomWordBtn}
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  id="input-secret-word"
                  value={word}
                  onChange={handleWordChange}
                  required
                  placeholder={t.secretWordPlaceholder}
                  className="w-full text-center tracking-widest text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-700 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-0 rounded-2xl p-4 transition-all"
                  autoComplete="off"
                  autoFocus
                />
                
                {wordLength > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold px-2 py-1 rounded">
                      {wordLength} {language === 'en' ? 'chars' : 'cars'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t.wordRequirementNote}
              </p>
            </div>

            {/* Guesses slider */}
            <div className="space-y-2 bg-emerald-50/40 dark:bg-slate-950 p-4 rounded-2xl border border-emerald-500/10">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t.maxGuessesLabel}
                </label>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-500/10 px-3.5 py-1 rounded-xl shadow-sm">
                  {guesses}
                </span>
              </div>
              <input
                type="range"
                id="input-guesses-slider"
                min="1"
                max="15"
                value={guesses}
                onChange={(e) => {
                  setGuesses(parseInt(e.target.value, 10));
                  playTypeSound();
                }}
                className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer appearance-none"
              />
              <div className="flex justify-between text-2xs text-slate-400 font-mono">
                <span>1 ({language === 'en' ? 'Instant Death' : 'Morte Instantânea'})</span>
                <span>6 ({language === 'en' ? 'Standard' : 'Padrão'})</span>
                <span>15 ({language === 'en' ? 'Very Forgiving' : 'Muito Generoso'})</span>
              </div>
            </div>

            {/* Live Interactive Grid Preview */}
            {wordLength > 0 && (
              <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.liveGridPreview} ({wordLength}x{guesses})
                  </h3>
                  <span className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                    {difficulty.label}
                  </span>
                </div>
                
                {/* Visual grid mockup */}
                <div className="flex flex-col gap-1 items-center overflow-x-auto py-2">
                  {Array.from({ length: Math.min(guesses, 5) }).map((_, rIdx) => (
                    <div key={rIdx} className="flex gap-1 justify-center">
                      {Array.from({ length: wordLength }).map((_, cIdx) => (
                        <div
                          key={cIdx}
                          className="w-6 h-6 flex items-center justify-center text-3xs font-extrabold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-300 select-none"
                        >
                          {rIdx === 0 && cleanWord[cIdx] ? cleanWord[cIdx] : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                  {guesses > 5 && (
                    <div className="text-3xs text-slate-400 font-semibold italic text-center mt-1">
                      + {guesses - 5} {language === 'en' ? 'more attempt rows...' : 'mais fileiras de tentativa...'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Launch Action */}
            <button
              type="submit"
              id="btn-create-challenge"
              disabled={!cleanWord}
              className={`
                w-full p-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition shadow-lg text-white
                ${cleanWord 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 active:scale-[0.98] cursor-pointer' 
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
              `}
            >
              {t.generateChallengeBtn} <ArrowRight className="w-5 h-5 animate-pulse" />
            </button>

          </form>
        </div>
      </div>

      {/* Share / Launch Overlay Dialog Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => {
            setShowShareModal(false);
            onChallengeCreated(cleanWord, guesses);
          }}
        >
          <div 
            className="bg-white dark:bg-slate-950 border border-emerald-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
            id="share-modal-container"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {t.challengeCraftedTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.challengeCraftedDesc}
              </p>
            </div>

            {/* Link view */}
            <div className="space-y-2">
              <div className="flex gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5">
                <input
                  type="text"
                  id="share-url-input"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent text-xs text-slate-600 dark:text-slate-300 font-mono w-full focus:outline-none focus:ring-0 border-0 p-1"
                />
                <button
                  type="button"
                  id="btn-copy-url"
                  onClick={copyToClipboard}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg p-2.5 transition active:scale-95 cursor-pointer flex items-center justify-center"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                  {t.copiedToClipboard}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                id="btn-modal-play-now"
                onClick={() => {
                  setShowShareModal(false);
                  onChallengeCreated(cleanWord, guesses);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-100 font-extrabold p-3.5 rounded-xl text-center cursor-pointer transition shadow-sm"
              >
                {t.playYourChallengeBtn}
              </button>
              <button
                type="button"
                id="btn-modal-close"
                onClick={() => {
                  setShowShareModal(false);
                  onChallengeCreated(cleanWord, guesses);
                }}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 text-center cursor-pointer transition"
              >
                {t.goToGameBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
