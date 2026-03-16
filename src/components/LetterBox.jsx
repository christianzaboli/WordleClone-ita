export default function LetterBox({
  letter,
  green,
  yellow,
  missed,
  revealed,
  keyboard = false,
  onClick,
}) {
  function backgroundColor() {
    if (green) return "bg-green-500";
    if (yellow && !green) return "bg-yellow-500";
    if (missed && !yellow) return "bg-slate-700";
    if (!green && !yellow && revealed && !keyboard) return "bg-slate-600";
    if (keyboard && !yellow && !green && !missed) return "bg-gray-500";
    return "bg-transparent";
  }
  if (keyboard) {
    return (
      <button
        className={`${letter === "enter" || letter === "del" ? "w-28" : "w-16"} h-16 
          border-[1px] border-gray-600 text-white text-2xl flex justify-center items-center font-bold select-none hover:cursor-pointer hover:border-white ${backgroundColor()}`}
        onClick={(e) => {
          onClick(letter);
          e.target.blur();
        }}
      >
        {letter.toUpperCase()}
      </button>
    );
  }
  return (
    <div
      className={`w-16 h-16 border-[1px] border-gray-600 text-white text-4xl flex justify-center items-center font-bold select-none ${backgroundColor()}`}
    >
      {letter.toUpperCase()}
    </div>
  );
}
