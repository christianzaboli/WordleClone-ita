import LetterBox from "./LetterBox";

export default function WordLine({
  word,
  correctWord,
  guessedWords,
  revealed,
  keyboard = false,
  onKeyPress,
}) {
  function getLetterStatuses(guessWord, solutionWord) {
    const guessLetters = guessWord.split("");
    const solutionLetters = solutionWord.split("");

    const remainingLetters = {};
    solutionLetters.forEach((letter) => {
      remainingLetters[letter] = (remainingLetters[letter] || 0) + 1;
    });

    const statuses = guessLetters.map(() => ({ green: false, yellow: false }));

    guessLetters.forEach((letter, index) => {
      if (letter === solutionLetters[index]) {
        statuses[index].green = true;
        remainingLetters[letter] -= 1;
      }
    });

    guessLetters.forEach((letter, index) => {
      if (statuses[index].green) return;
      if (!remainingLetters[letter]) return;

      statuses[index].yellow = true;
      remainingLetters[letter] -= 1;
    });

    return statuses;
  }

  if (keyboard) {
    return (
      <div className="flex flex-row justify-center">
        {word.map((letter, index) => {
          const isInSolution = correctWord.split("").includes(letter);
          const isInGuesses = guessedWords
            .flatMap((word) => word.split(""))
            .includes(letter);

          const hasCorrectLetterInSolution =
            isInSolution && isInGuesses && revealed;

          const hasTypedCorrectLetter = isInGuesses && isInSolution;

          const hasMissedLetter = isInGuesses && !isInSolution;

          return (
            <LetterBox
              letter={letter}
              green={hasCorrectLetterInSolution}
              yellow={hasTypedCorrectLetter}
              missed={hasMissedLetter}
              revealed={revealed}
              key={index}
              keyboard={keyboard}
              onClick={onKeyPress}
            />
          );
        })}
      </div>
    );
  }

  const letterStatuses = getLetterStatuses(word, correctWord);

  return (
    <div className="flex flex-row justify-center gap-1 my-1">
      {word.split("").map((letter, index) => {
        const { green, yellow } = letterStatuses[index];

        return (
          <LetterBox
            letter={letter}
            green={green && revealed}
            yellow={yellow && revealed}
            revealed={revealed}
            key={index}
            keyboard={keyboard}
          />
        );
      })}
    </div>
  );
}
