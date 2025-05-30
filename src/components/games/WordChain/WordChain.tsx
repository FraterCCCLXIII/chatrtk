import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BaseGame from '../BaseGame';
import { GameState, GameConfig, GameAction } from '../GameTypes';

const config: GameConfig = {
  id: 'word-chain',
  name: 'Word Chain',
  description: 'Create a chain of words where each word starts with the last letter of the previous word.',
  category: 'word',
  minPlayers: 1,
  maxPlayers: 2,
  hasAI: true,
  difficulty: 'medium'
};

interface WordChainState extends GameState {
  words: string[];
  lastLetter: string;
  playerTurn: boolean;
  score: number;
}

const WordChain: React.FC<{
  onGameEnd: (result: any) => void;
}> = ({ onGameEnd }) => {
  const [state, setState] = useState<WordChainState>({
    isPlaying: false,
    words: [],
    lastLetter: '',
    playerTurn: true,
    score: 0
  });

  const [input, setInput] = useState('');

  const handleAction = (action: GameAction) => {
    switch (action.type) {
      case 'START_GAME':
        setState(prev => ({
          ...prev,
          isPlaying: true,
          words: [],
          lastLetter: '',
          playerTurn: true,
          score: 0
        }));
        break;
      case 'SUBMIT_WORD':
        if (action.payload) {
          const word = action.payload.toLowerCase();
          if (isValidWord(word)) {
            setState(prev => ({
              ...prev,
              words: [...prev.words, word],
              lastLetter: word[word.length - 1],
              playerTurn: !prev.playerTurn,
              score: prev.score + 1
            }));
          }
        }
        break;
      case 'END_GAME':
        onGameEnd({
          score: state.score,
          words: state.words
        });
        break;
    }
  };

  const isValidWord = (word: string): boolean => {
    if (word.length < 2) return false;
    if (state.words.includes(word)) return false;
    if (state.lastLetter && word[0] !== state.lastLetter) return false;
    return true;
  };

  const handleSubmit = () => {
    if (input.trim()) {
      handleAction({ type: 'SUBMIT_WORD', payload: input.trim() });
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <BaseGame
      config={config}
      state={state}
      onAction={handleAction}
      onGameEnd={onGameEnd}
    >
      <div className="space-y-4">
        {!state.isPlaying ? (
          <Button onClick={() => handleAction({ type: 'START_GAME' })}>
            Start Game
          </Button>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Word Chain</h3>
              <p className="text-sm text-muted-foreground">
                {state.lastLetter 
                  ? `Enter a word starting with "${state.lastLetter}"`
                  : "Enter any word to start"}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a word..."
                disabled={!state.playerTurn}
              />
              <Button 
                onClick={handleSubmit}
                disabled={!state.playerTurn || !input.trim()}
              >
                Submit
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Word Chain:</h4>
              <div className="bg-muted p-4 rounded-lg min-h-[100px]">
                {state.words.length > 0 ? (
                  <p className="text-sm">
                    {state.words.join(' → ')}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No words yet. Start the chain!
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm">
                Score: {state.score}
              </p>
              <Button
                variant="outline"
                onClick={() => handleAction({ type: 'END_GAME' })}
              >
                End Game
              </Button>
            </div>
          </>
        )}
      </div>
    </BaseGame>
  );
};

export default WordChain; 