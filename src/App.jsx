import "./App.css";
import { useState, useEffect } from "react";
import { TOTAL_GUESSES, WORD_LENGTH } from "./libs/consts";
import { Toaster, toast } from "sonner";
import { PAROLE_ITALIANE, PAROLACCE } from "./assets/PAROLE_ITALIANE";
import WordLine from "./components/WordLine";

function App() {
  const [guessedWords, setGuessedWords] = useState(
    new Array(TOTAL_GUESSES).fill("     "),
  );
  const [correctWord, setCorrectWord] = useState("");
  const [correctLetterObject, setCorrectLetterObject] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [currentWord, setCurrentWord] = useState("     ");
  const [gameOver, setGameOver] = useState(false);

  const filteredWordsIta = PAROLE_ITALIANE.filter(
    (parola) => parola.length === WORD_LENGTH,
  );
  const filteredBadWordsIta = PAROLACCE.filter(
    (parola) => parola.length === WORD_LENGTH,
  );
  const availableWords = filteredWordsIta;

  function getWord() {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];
    console.log(word);
    const letterObject = {};
    for (let letter of word) {
      letterObject[letter] = (letterObject[letter] || 0) + 1;
    }
    setCorrectWord(word);
    setCorrectLetterObject(letterObject);
  }
  // Getting Correct Word
  useEffect(() => {
    getWord();
  }, []);

  function handleEnter() {
    if (currentWord === correctWord) {
      if (availableWords.find((word) => word === currentWord)) {
        toast.success("Hai vinto!");
        setGameOver(true);
        return;
      }
    }

    if (currentWord !== correctWord && wordCount === TOTAL_GUESSES - 1) {
      setGameOver(true);
      toast.error("Hai perso!", { position: "top-center" });
      toast.message(`Soluzione: ${correctWord.toUpperCase()}`, {
        position: "bottom-center",
        duration: 7000,
      });
      return;
    }
    if (letterCount !== WORD_LENGTH) {
      toast.error(`La parola deve contenere ${WORD_LENGTH} lettere`, {
        position: "top-center",
      });
      return;
    }
    if (!availableWords.includes(currentWord)) {
      toast.error("Parola non valida", { position: "top-center" });
      return;
    }

    setGuessedWords((current) => {
      const updatedGuessedWords = [...current];
      updatedGuessedWords[wordCount] = currentWord;
      return updatedGuessedWords;
    });

    setWordCount((current) => current + 1);
    setLetterCount(0);
    setCurrentWord("     ");
  }

  function handleBackspace() {
    if (letterCount === 0) {
      return;
    }

    setCurrentWord((currentWord) => {
      const currentWordArray = currentWord.split("");
      currentWordArray[letterCount - 1] = " ";
      const newWord = currentWordArray.join("");
      return newWord;
    });

    setLetterCount((currentCount) => currentCount - 1);
  }

  function handleAlphabetical(key) {
    if (letterCount === WORD_LENGTH) {
      return;
    }

    setCurrentWord((currentWord) => {
      const currentWordArray = currentWord.split("");
      currentWordArray[letterCount] = key;
      const newWord = currentWordArray.join("");
      return newWord;
    });

    setLetterCount((currentCount) => currentCount + 1);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleAlphabetical(e.key);
      } else {
        return;
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") {
        resetGame();
      }
      return;
    }
    document.addEventListener("keydown", handleKeyDown);

    if (gameOver) {
      document.removeEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleEnter, handleBackspace, handleAlphabetical, gameOver]);

  function resetGame() {
    setGuessedWords(new Array(TOTAL_GUESSES).fill("     "));
    getWord();
    setWordCount(0);
    setLetterCount(0);
    setCurrentWord("     ");
    setGameOver(false);
  }

  return (
    <div>
      <Toaster
        toastOptions={{
          style: {
            background: "#121213",
            color: "white",
          },
        }}
      />
      <h1 className="text-6xl text-white font-extrabold select-none mb-2">
        WORD/OLO!
      </h1>
      <div>
        {guessedWords.map((word, index) => {
          if (index === wordCount) {
            return (
              <WordLine
                word={currentWord}
                correctWord={correctWord}
                correctLetterObject={correctLetterObject}
                revealed={gameOver}
                key={index}
              />
            );
          }
          return (
            <WordLine
              word={word}
              correctWord={correctWord}
              correctLetterObject={correctLetterObject}
              revealed={index < wordCount ? true : false}
              key={index}
            />
          );
        })}
      </div>
      <button
        className="m-4 py-4 px-14 border-gray-300 rounded-full hover:border-gray-100 text-lg select-none"
        onKeyDown={resetGame}
        onClick={(e) => {
          resetGame();
          e.target.blur();
        }}
      >
        Reset Game
      </button>
    </div>
  );
}

export default App;
