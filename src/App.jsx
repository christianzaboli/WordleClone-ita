import "./App.css";
import { Toaster } from "sonner";
import WordLine from "./components/WordLine";
import useSettings from "./hooks/useSettings";
import Keyboard from "./components/Keyboard";
import useWordleGame from "./hooks/useWordleGame";
import SettingsModal from "./components/SettingsModal";
import NavHUD from "./components/navHUD";
import { TextMorph } from "torph/react";

console.log(`
██╗    ██╗ ██████╗ ██████╗ ██████╗  ██████╗ ██╗     
██║    ██║██╔═══██╗██╔══██╗██╔══██╗██╔═══██╗██║     
██║ █╗ ██║██║   ██║██████╔╝██║  ██║██║   ██║██║     
██║███╗██║██║   ██║██╔══██╗██║  ██║██║   ██║██║     
╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝╚██████╔╝███████╗
 ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚══════╝`);

function App() {
  const {
    changeWordLength,
    wordLength,
    wordLengthInput,
    changeTotalGuesses,
    totalGuesses,
    availableWords,
  } = useSettings();

  const {
    guessedWords,
    correctWord,
    correctLetterObject,
    wordCount,
    currentWord,
    gameOver,
    resetGame,
    handleVirtualKey,
    handleSettingsModal,
    showSettingsModal,
    revealedPosition,
    hintUsed,
    requestHint,
  } = useWordleGame({
    availableWords,
    wordLength,
    totalGuesses,
    wordLengthInput,
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto h-full flex flex-col gap-15 sm:gap-0 sm:justify-center">
      <Toaster
        toastOptions={{
          style: {
            background: "#121213",
            color: "white",
          },
        }}
      />
      <h1 className="text-4xl sm:text-5xl text-white font-extrabold select-none mb-6 sm:mb-8">
        {
          <TextMorph duration={1200}>
            {gameOver ? correctWord.toUpperCase() : "WORDOL!"}
          </TextMorph>
        }
      </h1>
      <div className="mb-6 sm:mb-8">
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

      <Keyboard
        revealed={gameOver}
        correctWord={correctWord}
        guessedWords={guessedWords}
        correctLetterObject={correctLetterObject}
        onKeyPress={handleVirtualKey}
        revealedPosition={revealedPosition}
      />
      {NavHUD(handleSettingsModal, resetGame, requestHint, hintUsed, gameOver)}

      {showSettingsModal &&
        SettingsModal(
          handleSettingsModal,
          changeWordLength,
          wordLength,
          changeTotalGuesses,
        )}
    </div>
  );
}

export default App;
