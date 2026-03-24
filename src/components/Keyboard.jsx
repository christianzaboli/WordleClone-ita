import WordLine from "./WordLine";

//prettier-ignore
const upperKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const middleKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const bottomKeys = ["enter", "z", "x", "c", "v", "b", "n", "m", "del"];
export default function Keyboard({
  revealed,
  correctWord,
  correctLetterObject,
  onKeyPress,
  guessedWords,
  revealedPosition,
}) {
  const hintedLetter =
    revealedPosition !== null && correctWord
      ? correctWord[revealedPosition]
      : null;

  return (
    <div className="mt-6 sm:mt-0">
      <WordLine
        word={upperKeys}
        correctWord={correctWord}
        correctLetterObject={correctLetterObject}
        guessedWords={guessedWords}
        revealed={revealed}
        keyboard={true}
        onKeyPress={onKeyPress}
        hintedLetter={hintedLetter}
      />
      <WordLine
        word={middleKeys}
        correctWord={correctWord}
        correctLetterObject={correctLetterObject}
        guessedWords={guessedWords}
        revealed={revealed}
        keyboard={true}
        onKeyPress={onKeyPress}
        hintedLetter={hintedLetter}
      />
      <WordLine
        word={bottomKeys}
        correctWord={correctWord}
        correctLetterObject={correctLetterObject}
        guessedWords={guessedWords}
        revealed={revealed}
        keyboard={true}
        onKeyPress={onKeyPress}
        hintedLetter={hintedLetter}
      />
    </div>
  );
}
