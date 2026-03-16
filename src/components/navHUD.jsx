export default function NavHUD(handleSettingsModal, resetGame) {
  return (
    <div className="fixed sm:absolute top-3 right-2 sm:top-20 sm:right-5 grid gap-2 sm:gap-4 z-40">
      <button
        className="py-2 px-4 sm:py-3 sm:px-6 rounded-lg border-gray-700 hover:border-gray-500 text-xs sm:text-sm select-none"
        onClick={(e) => {
          handleSettingsModal();
          e.target.blur();
        }}
      >
        Settings
      </button>
      <button
        className="py-2 px-4 sm:py-3 sm:px-6 rounded-lg border-gray-700 hover:border-gray-500 text-xs sm:text-sm select-none"
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
