import LetterBox from "./LetterBox";

export default function WordLine({
  word,
  correctWord,
  correctLetterObject,
  revealed,
}) {
  return (
    <div className="flex flex-row space-x-2 m-2 justify-center">
      {word.split("").map((letter, index) => {
        const hasCorrectLocation = letter === correctWord[index];
        const hasCorrectLetter = letter in correctLetterObject;
        return (
          <LetterBox
            letter={letter}
            green={hasCorrectLocation && hasCorrectLetter && revealed}
            yellow={!hasCorrectLocation && hasCorrectLetter && revealed}
            revealed={revealed}
            key={index}
          />
        );
      })}
    </div>
  );
}
