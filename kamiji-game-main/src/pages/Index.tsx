
import { useState } from "react";
import TamagotchiGame from "../components/TamagotchiGame";
import RPG from "../components/rpg/RPG";

const Index = () => {
  const [currentGame, setCurrentGame] = useState<'tamagotchi' | 'rpg'>('tamagotchi');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Game Collection
          </h1>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentGame('tamagotchi')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                currentGame === 'tamagotchi'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Tamagotchi
            </button>
            <button
              onClick={() => setCurrentGame('rpg')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                currentGame === 'rpg'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              RPG Adventure
            </button>
          </div>
        </div>
        
        {currentGame === 'tamagotchi' ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <TamagotchiGame />
            </div>
          </div>
        ) : (
          <RPG />
        )}
      </div>
    </div>
  );
};

export default Index;
