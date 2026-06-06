export type Language = 'en' | 'pt';

export interface Translations {
  description: string;
  secretWordLabel: string;
  randomWordBtn: string;
  secretWordPlaceholder: string;
  wordRequirementNote: string;
  maxGuessesLabel: string;
  customWordWarning: string;
  liveGridPreview: string;
  generateChallengeBtn: string;
  challengeCraftedTitle: string;
  challengeCraftedDesc: string;
  copiedToClipboard: string;
  playYourChallengeBtn: string;
  goToGameBtn: string;
  
  // Difficulty
  difficultyEmpty: string;
  difficultyHardcore: string;
  difficultyTricky: string;
  difficultyStandard: string;
  difficultyEasy: string;

  // GameBoard
  newChallengeBtn: string;
  lettersLabel: string;
  footerInstruction: string;
  victoryTitle: string;
  victoryDesc: string;
  defeatTitle: string;
  defeatDesc: string;
  secretWordWas: string;
  copiedResultText: string;
  shareResultsBtn: string;
  createAnotherBtn: string;
  copiedShareBlockSuccess: string;
  shareTitle: string;
  attemptsLabel: string;

  // App & Tutorial
  howToPlayTitle: string;
  howToPlayIntro: string;
  rulesTitle: string;
  correctLabel: string;
  correctDesc: string;
  presentLabel: string;
  presentDesc: string;
  absentLabel: string;
  absentDesc: string;
  infiniteVarietyTitle: string;
  infiniteVarietyDesc: string;
  letsJumpInBtn: string;
  footerSub: string;
  footerLabel: string;
  closeBtn: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    description: "Create custom word-guessing challenges. Type a secret word, set the guess allowance, and share the link with friends!",
    secretWordLabel: "Secret Word / Character Sequence",
    randomWordBtn: "Random Froggy Word",
    secretWordPlaceholder: "e.g. RIBBIT",
    wordRequirementNote: "Supports letters, numbers, symbols or any combination up to 15 characters. Non-word custom codes are allowed!",
    maxGuessesLabel: "Maximum Guesses Allowed",
    customWordWarning: "Please enter a visual word!",
    liveGridPreview: "Live Grid Preview",
    generateChallengeBtn: "Generate Froordle Challenge",
    challengeCraftedTitle: "Froordle Crafted!",
    challengeCraftedDesc: "The secret word is locked in. Copy the shareable link below and send it to your friends or play it now!",
    copiedToClipboard: "✓ Copied to clipboard! Ready to share.",
    playYourChallengeBtn: "Play Your Challenge Now",
    goToGameBtn: "Go to Game",
    
    difficultyEmpty: "Empty",
    difficultyHardcore: "Hardcore! 🐸🔥",
    difficultyTricky: "Tricky 🐸💦",
    difficultyStandard: "Standard 🐸🍏",
    difficultyEasy: "Easy 🐸🎈",

    newChallengeBtn: "New Challenge",
    lettersLabel: "Letters",
    footerInstruction: "Press letters to guess • Enter to confirm • Backspace to delete",
    victoryTitle: "Frogtastic! You Won! 🎉",
    victoryDesc: "Splendid jumping! You cracked the challenge in {count} {tries}.",
    defeatTitle: "Splatter! No more jumps.",
    defeatDesc: "You weren't able to solve this Froordle challenge.",
    secretWordWas: "The secret word was:",
    copiedResultText: "Result Copied!",
    shareResultsBtn: "Share My Grid",
    createAnotherBtn: "Create Another",
    copiedShareBlockSuccess: "✓ Share block copied to clipboard with Wordle-style emojis!",
    shareTitle: "Froordle Challenge 🐸",
    attemptsLabel: "attempts",

    howToPlayTitle: "Playing Froordle",
    howToPlayIntro: "Froordle operates exactly like traditional Wordle, but allows **unlimited customizing**! Create challenges with custom secret characters of any length and share the game.",
    rulesTitle: "The Rules:",
    correctLabel: "CORRECT",
    correctDesc: "Letter is in the exact right position (colored green).",
    presentLabel: "PRESENT",
    presentDesc: "Letter is in the word but currently in the wrong placement (colored yellow).",
    absentLabel: "ABSENT",
    absentDesc: "Letter is not in the word (colored grid gray).",
    infiniteVarietyTitle: "Infinite Variety",
    infiniteVarietyDesc: "Because Froordle supports code sequences, symbols, numbers, and uppercase/lowercase combinations, you do not need to guess standard dictionary words. Let your creativity leap!",
    letsJumpInBtn: "Let's Jump In!",
    footerSub: "Any character matches allowed. High-fidelity duplicate scoring rules applied.",
    footerLabel: "Froordle • Jumping word puzzles",
    closeBtn: "Close",
  },
  pt: {
    description: "Crie desafios personalizados de adivinhar palavras! Digite uma palavra secreta, defina o limite de palpites e compartilhe o link com amigos!",
    secretWordLabel: "Palavra Secreta / Sequência de Caracteres",
    randomWordBtn: "Palavra de Sapo Aleatória",
    secretWordPlaceholder: "ex: PERERECA",
    wordRequirementNote: "Suporta letras, números, símbolos ou qualquer combinação até 15 caracteres. Códigos personalizados são permitidos!",
    maxGuessesLabel: "Máximo de Palpites Permitidos",
    customWordWarning: "Por favor insira uma palavra válida!",
    liveGridPreview: "Pré-visualização do Grid",
    generateChallengeBtn: "Gerar Desafio Froordle",
    challengeCraftedTitle: "Froordle Criado!",
    challengeCraftedDesc: "A palavra secreta está salva. Copie o link compartilhável abaixo e envie aos seus amigos ou jogue agora!",
    copiedToClipboard: "✓ Copiado para a área de transferência! Pronto para compartilhar.",
    playYourChallengeBtn: "Jogar Desafio Agora",
    goToGameBtn: "Ir para o Jogo",
    
    difficultyEmpty: "Vazio",
    difficultyHardcore: "Super Difícil! 🐸🔥",
    difficultyTricky: "Complicado 🐸💦",
    difficultyStandard: "Padrão 🐸🍏",
    difficultyEasy: "Fácil 🐸🎈",

    newChallengeBtn: "Novo Desafio",
    lettersLabel: "Letras",
    footerInstruction: "Pressione as letras para digitar • Enter para confirmar • Backspace para apagar",
    victoryTitle: "Sapo-tástico! Você Venceu! 🎉",
    victoryDesc: "Salto esplêndido! Você resolveu o desafio em {count} {tries}.",
    defeatTitle: "Splash! Sem mais saltos.",
    defeatDesc: "Você não conseguiu decifrar este desafio Froordle.",
    secretWordWas: "A palavra secreta era:",
    copiedResultText: "Resultado Copiado!",
    shareResultsBtn: "Compartilhar Meu Grid",
    createAnotherBtn: "Criar Outro",
    copiedShareBlockSuccess: "✓ Bloco de compartilhamento copiado! Com emojis estilo Wordle.",
    shareTitle: "Desafio Froordle 🐸",
    attemptsLabel: "tentativas",

    howToPlayTitle: "Como Jogar Froordle",
    howToPlayIntro: "O Froordle funciona exatamente como o Wordle tradicional, mas permite **personalização ilimitada**! Crie desafios com personagens secretos de qualquer tamanho e compartilhe o jogo.",
    rulesTitle: "As Regras:",
    correctLabel: "CORRETO",
    correctDesc: "A letra está na posição exata correta (cor verde).",
    presentLabel: "PRESENTE",
    presentDesc: "A letra está na palavra, mas atualmente na posição incorreta (cor amarela).",
    absentLabel: "AUSENTE",
    absentDesc: "A letra não faz parte do termo secreto (cor cinza).",
    infiniteVarietyTitle: "Variedade Infinita",
    infiniteVarietyDesc: "Como o Froordle aceita sequências de códigos, símbolos, números e combinações de maiúsculas/minúsculas, você não precisa se limitar a palavras comuns. Deixe sua imaginação saltar!",
    letsJumpInBtn: "Começar a Jogar!",
    footerSub: "Qualquer sequência de caracteres é válida. Regras de pontuação de duplicatas aplicadas com precisão.",
    footerLabel: "Froordle • Desafios de palavras saltitantes",
    closeBtn: "Fechar",
  }
};
