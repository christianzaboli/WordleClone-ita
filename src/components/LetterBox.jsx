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
        className={`${letter === "enter" || letter === "del" ? "w-14 sm:w-28" : "w-7 sm:w-16"} h-10 sm:h-16 
          border-[1px] border-gray-600
           text-white text-xs sm:text-2xl 
           flex justify-center items-center font-bold select-none hover:cursor-pointer hover:border-white ${backgroundColor()}
           rounded-md sm:rounded-lg m-[1px]
           `}
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
      className={`w-14 h-14 sm:w-16 sm:h-16 border-[1px] border-gray-600 text-white text-3xl sm:text-4xl flex justify-center items-center font-bold select-none ${backgroundColor()}
      rounded-sm sm:rounded-lg m-[1px] sm:m-0`}
    >
      {letter.toUpperCase()}
    </div>
  );
}
