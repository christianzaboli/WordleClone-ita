import { useWebHaptics } from "web-haptics/react";

export default function LetterBox({
  letter,
  green,
  yellow,
  missed,
  revealed,
  hinted = false,
  animateReveal = false,
  revealDelay = 0,
  keyboard = false,
  onClick,
}) {
  const { trigger } = useWebHaptics();
  function backgroundColor() {
    if (green) return "bg-[#538D4E] border-[#538D4E]";
    if (yellow && !green) return "bg-[#B59F3B] border-[#B59F3B]";
    if (missed && !yellow) return "bg-slate-700 border-slate-700";
    if (!green && !yellow && revealed && !keyboard)
      return "bg-slate-600 border-slate-600";
    if (hinted && !green && !yellow && !missed)
      return "bg-transparent border-cyan-500 border-2";
    if (keyboard && !yellow && !green && !missed) return "bg-gray-500";
    return "bg-transparent";
  }
  if (keyboard) {
    return (
      <button
        className={`${letter === "enter" || letter === "del" ? "w-16 sm:w-28" : "w-9 sm:w-16"} h-14 sm:h-16 
          border-[1px] border-gray-600
           text-white text-base sm:text-2xl 
           flex justify-center items-center font-bold select-none hover:cursor-pointer hover:border-white ${backgroundColor()}
           rounded-[4px] sm:rounded-md m-[2px]
           transform-gpu transition-transform duration-100 ease-out active:scale-90
           `}
        onClick={(e) => {
          onClick(letter);
          trigger([{ duration: 25 }], { intensity: 0.7 });
          e.target.blur();
        }}
      >
        {letter.toUpperCase()}
      </button>
    );
  }
  return (
    <div
      className={`w-16 h-16 sm:w-16 sm:h-16 border-[1px] border-gray-600 text-white text-3xl sm:text-4xl flex justify-center items-center font-bold select-none ${backgroundColor()}
       sm:m-0 ${animateReveal ? "wordline-reveal" : ""}`}
      style={animateReveal ? { animationDelay: `${revealDelay}ms` } : undefined}
    >
      {letter.toUpperCase()}
    </div>
  );
}
