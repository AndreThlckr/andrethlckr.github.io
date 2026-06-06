import React, { useState, useEffect } from 'react';
import { GameConfig } from './types';
import { ChallengeCreator } from './components/ChallengeCreator';
import { GameBoard } from './components/GameBoard';
import { decodeChallengeFromUrl, getShareableUrl } from './utils/urlHelper';
import { Sparkles, HelpCircle, Sun, Moon, Info, ShieldAlert, Globe } from 'lucide-react';
import { playFrogRibbit } from './utils/audio';
import { Language, translations } from './utils/translations';

export default function App() {
  const [activeConfig, setActiveConfig] = useState<GameConfig | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('froordle_lang');
    if (saved === 'en' || saved === 'pt') {
      return saved as Language;
    }
    // Default to PT-BR if user's browser language is Portuguese
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('pt')) {
      return 'pt';
    }
    return 'en';
  });

  const t = translations[language];

  // Sync initialization config from URL
  useEffect(() => {
    const config = decodeChallengeFromUrl();
    if (config) {
      setActiveConfig(config);
    }

    // Sync with browser back/forward buttons
    const handlePopState = () => {
      const updatedConfig = decodeChallengeFromUrl();
      setActiveConfig(updatedConfig);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Set dark mode body class on change
  useEffect(() => {
    const rootElement = document.documentElement;
    if (isDarkMode) {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Hook into challenge creation
  const handleChallengeCreated = (word: string, maxGuesses: number) => {
    const nextUrl = getShareableUrl(word, maxGuesses);
    window.history.pushState(null, '', nextUrl);
    setActiveConfig({ word, maxGuesses });
  };

  // Reset challenge configuration and clear url query parameters
  const handleNewGameRequest = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    window.history.pushState(null, '', baseUrl);
    setActiveConfig(null);
    playFrogRibbit();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Top Header Navigation bar */}
      <header className="border-b border-emerald-500/10 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div 
            onClick={handleNewGameRequest} 
            className="flex items-center gap-2 cursor-pointer group active:scale-95 transition"
            id="header-brand"
          >
            <span className="text-2xl group-hover:rotate-12 transition duration-250">🐸</span>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-emerald-900 dark:text-emerald-300">
              Froordle
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Toggle Trigger */}
            <button
              type="button"
              id="btn-language-toggle"
              onClick={() => {
                const nextLang = language === 'en' ? 'pt' : 'en';
                setLanguage(nextLang);
                localStorage.setItem('froordle_lang', nextLang);
                playFrogRibbit();
              }}
              className="px-2.5 py-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-black border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              title={language === 'en' ? 'Mudar para Português (Brasil)' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'en' ? 'EN 🇺🇸' : 'PT 🇧🇷'}</span>
            </button>

            <button
              type="button"
              id="btn-tutorial"
              onClick={() => setShowHowToPlay(true)}
              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition cursor-pointer"
              title="How to play"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              type="button"
              id="btn-theme-toggle"
              onClick={() => setIsDarkMode(prev => !prev)}
              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 flex flex-col items-center justify-top py-6 relative">
        {activeConfig ? (
          <GameBoard 
            config={activeConfig} 
            onNewGameRequest={handleNewGameRequest}
            language={language}
          />
        ) : (
          <ChallengeCreator 
            onChallengeCreated={handleChallengeCreated}
            language={language}
          />
        )}
      </main>

      {/* Persistent Brand Badge Footer */}
      <footer className="py-6 border-t border-emerald-500/5 text-center text-xs text-slate-400 dark:text-slate-600 select-none">
        <div className="max-w-md mx-auto px-4 space-y-1">
          <p className="font-bold">🐸 {t.footerLabel}</p>
          <p>{t.footerSub}</p>
        </div>
      </footer>

      {/* How to play Overlay Sidebar Component */}
      {showHowToPlay && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowHowToPlay(false)}
        >
          <div 
            className="bg-white dark:bg-slate-950 border-l border-emerald-500/20 w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            id="how-to-play-modal"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>🐸</span> {t.howToPlayTitle}
              </h3>
              <button 
                type="button"
                id="btn-close-tutorial"
                onClick={() => setShowHowToPlay(false)}
                className="text-xs font-black uppercase text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 p-2 cursor-pointer transition"
              >
                {t.closeBtn}
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <p>
                {t.howToPlayIntro.includes('**') ? (
                  <>
                    {t.howToPlayIntro.split('**')[0]}
                    <strong>{language === 'en' ? 'unlimited customizing' : 'personalização ilimitada'}</strong>
                    {t.howToPlayIntro.split('**')[2] || t.howToPlayIntro.split('**')[1]}
                  </>
                ) : (
                  t.howToPlayIntro
                )}
              </p>
              
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">{t.rulesTitle}</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="bg-emerald-600 text-white text-3xs font-extrabold px-1.5 py-0.5 rounded mt-0.5">{t.correctLabel}</span>
                    <p>{t.correctDesc}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-500 text-white text-3xs font-extrabold px-1.5 py-0.5 rounded mt-0.5">{t.presentLabel}</span>
                    <p>{t.presentDesc}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-slate-500 text-white text-3xs font-extrabold px-1.5 py-0.5 rounded mt-0.5">{t.absentLabel}</span>
                    <p>{t.absentDesc}</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/10 space-y-2">
                <h5 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <Info className="w-4 h-4" /> {t.infiniteVarietyTitle}
                </h5>
                <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-400">
                  {t.infiniteVarietyDesc}
                </p>
              </div>

              <button
                type="button"
                id="btn-tutorial-ok"
                onClick={() => setShowHowToPlay(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold p-3 rounded-xl text-center cursor-pointer transition shadow"
              >
                {t.letsJumpInBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
