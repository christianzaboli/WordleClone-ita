export default function LetterBox({ letter, green, yellow, revealed }) {
  function backgroundColor() {
    if (green) return "bg-green-500";
    if (yellow) return "bg-yellow-500";
    if (!green && !yellow && revealed) return "bg-slate-600";
    return "bg-transparent";
  }
  return (
    <div
      className={`w-16 h-16 border-[1px] border-gray-600 text-white text-4xl flex justify-center items-center font-bold select-none ${backgroundColor()}`}
    >
      {letter.toUpperCase()}
    </div>
  );
}
