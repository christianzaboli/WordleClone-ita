import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useWebHaptics } from "web-haptics/react";

export default function useWordleGame({
  availableWords,
  wordLength,
  totalGuesses,
  wordLengthInput,
}) {
  const { trigger } = useWebHaptics();
  const [guessedWords, setGuessedWords] = useState(() =>
    new Array(totalGuesses).fill(wordLengthInput),
  );
  const [correctWord, setCorrectWord] = useState("");
  const [correctLetterObject, setCorrectLetterObject] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [currentWord, setCurrentWord] = useState(() => wordLengthInput);
  const [gameOver, setGameOver] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [revealedPosition, setRevealedPosition] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);

  const getWord = useCallback(() => {
    if (!availableWords.length) {
      setCorrectWord("");
      setCorrectLetterObject({});
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];
    const letterObject = {};

    for (const letter of word) {
      letterObject[letter] = (letterObject[letter] || 0) + 1;
    }

    setCorrectWord(word);
    setCorrectLetterObject(letterObject);
  }, [availableWords]);

  const resetGame = useCallback(() => {
    setGuessedWords(new Array(totalGuesses).fill(wordLengthInput));
    getWord();
    setWordCount(0);
    setLetterCount(0);
    setCurrentWord(wordLengthInput);
    setGameOver(false);
    setRevealedPosition(null);
    setHintUsed(false);
  }, [getWord, totalGuesses, wordLengthInput]);

  const requestHint = useCallback(() => {
    if (hintUsed || gameOver || !correctWord) return;

    const unrevealedPositions = [];
    for (let i = 0; i < correctWord.length; i++) {
      const letterCorrectlyGuessed = guessedWords.some(
        (word, wordIdx) => wordIdx < wordCount && word[i] === correctWord[i],
      );
      if (!letterCorrectlyGuessed) {
        unrevealedPositions.push(i);
      }
    }

    if (unrevealedPositions.length === 0) return;

    const randomIdx = Math.floor(Math.random() * unrevealedPositions.length);
    const position = unrevealedPositions[randomIdx];

    setRevealedPosition(position);
    setHintUsed(true);

    const letter = correctWord[position].toUpperCase();
    toast.success(`Lettera ${position + 1}: ${letter}`, {
      position: "top-left",
      duration: 3000,
    });
  }, [hintUsed, gameOver, correctWord, guessedWords, wordCount]);

  const handleEnter = useCallback(() => {
    if (gameOver) return;
    if (showSettingsModal) {
      setShowSettingsModal(false);
      return;
    }
    if (currentWord === correctWord) {
      if (availableWords.find((word) => word === currentWord)) {
        if (window.screenX > 640) {
          toast.success("Hai vinto!", { position: "top-left" });
        }
        trigger([{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }]);
        setGameOver(true);
        return;
      }
    }

    if (currentWord !== correctWord && wordCount === totalGuesses - 1) {
      setGameOver(true);
      if (window.screenX > 640) {
        toast.error("Hai perso!", { position: "top-left" });
      }
      trigger([{ duration: 25 }], { intensity: 0.7 });
      return;
    }
    if (guessedWords.includes(currentWord)) {
      toast.error(`Parola giá presente`, {
        position: "top-left",
      });
      trigger([
        { duration: 80, intensity: 0.8 },
        { delay: 80, duration: 50, intensity: 0.3 },
      ]);
      return;
    }
    if (letterCount !== wordLength) {
      toast.error(`La parola deve contenere ${wordLength} lettere`, {
        position: "top-left",
      });
      trigger([
        { duration: 80, intensity: 0.8 },
        { delay: 80, duration: 50, intensity: 0.3 },
      ]);
      return;
    }

    if (!availableWords.includes(currentWord)) {
      toast.error("Parola non valida", { position: "top-left" });
      trigger([
        { duration: 80, intensity: 0.8 },
        { delay: 80, duration: 50, intensity: 0.3 },
      ]);
      return;
    }

    setGuessedWords((current) => {
      const updatedGuessedWords = [...current];
      updatedGuessedWords[wordCount] = currentWord;
      return updatedGuessedWords;
    });

    setWordCount((current) => current + 1);
    setLetterCount(0);
    setCurrentWord(wordLengthInput);
  }, [
    availableWords,
    correctWord,
    currentWord,
    gameOver,
    letterCount,
    totalGuesses,
    wordCount,
    wordLength,
    wordLengthInput,
    showSettingsModal,
  ]);

  const handleBackspace = useCallback(() => {
    if (gameOver || letterCount === 0 || showSettingsModal) {
      return;
    }

    setCurrentWord((word) => {
      const currentWordArray = word.split("");
      currentWordArray[letterCount - 1] = " ";
      return currentWordArray.join("");
    });

    setLetterCount((currentCount) => currentCount - 1);
  }, [gameOver, letterCount, showSettingsModal]);

  const handleAlphabetical = useCallback(
    (key) => {
      if (gameOver || letterCount === wordLength || showSettingsModal) {
        return;
      }

      setCurrentWord((word) => {
        const currentWordArray = word.split("");
        currentWordArray[letterCount] = key.toLowerCase();
        return currentWordArray.join("");
      });

      setLetterCount((currentCount) => currentCount + 1);
    },
    [gameOver, letterCount, wordLength, showSettingsModal],
  );

  const handleVirtualKey = useCallback(
    (key) => {
      if (key === "enter") {
        handleEnter();
        return;
      }

      if (key === "del") {
        handleBackspace();
        return;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        handleAlphabetical(key);
      }
    },
    [handleAlphabetical, handleBackspace, handleEnter],
  );

  useEffect(() => {
    resetGame();
  }, [wordLength, totalGuesses, resetGame]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (gameOver) {
          resetGame();
          return;
        }
        if (showSettingsModal) {
          setShowSettingsModal(false);
        }
      }

      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleAlphabetical(e.key);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, handleAlphabetical, handleBackspace, handleEnter, resetGame]);

  const handleSettingsModal = () => setShowSettingsModal(!showSettingsModal);
  return {
    guessedWords,
    correctWord,
    correctLetterObject,
    wordCount,
    currentWord,
    gameOver,
    resetGame,
    handleVirtualKey,
    showSettingsModal,
    handleSettingsModal,
    revealedPosition,
    hintUsed,
    requestHint,
  };
}
