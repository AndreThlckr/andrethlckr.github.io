import React from 'react';
import { KeyboardKeyStatus, LetterStatus } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: KeyboardKeyStatus;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStatuses }) => {
  const getKeyStyle = (key: string): string => {
    // Utility key styles
    if (key === 'ENTER' || key === 'BACKSPACE') {
      return 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs sm:text-sm flex-1 press-effect';
    }

    const status = keyStatuses[key];
    switch (status) {
      case 'correct':
        return 'bg-emerald-600 text-white font-black hover:bg-emerald-700 active:bg-emerald-800';
      case 'present':
        return 'bg-amber-500 text-white font-black hover:bg-amber-600 active:bg-amber-700';
      case 'absent':
        return 'bg-slate-500 text-white/90 font-medium hover:bg-slate-600 opacity-60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 active:bg-slate-300 text-slate-800 dark:text-slate-100 font-bold';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-1 sm:px-4 mt-6 select-none" id="qwerty-keyboard">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const style = getKeyStyle(key);
              const label = key === 'BACKSPACE' ? '⌫' : key;
              
              return (
                <button
                  key={key}
                  type="button"
                  id={`key-${key.toLowerCase()}`}
                  onClick={() => onKeyPress(key)}
                  className={`
                    h-12 sm:h-14 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer text-sm sm:text-base shadow-sm
                    ${key === 'ENTER' || key === 'BACKSPACE' ? 'px-2 sm:px-4' : 'flex-1'}
                    ${style}
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
