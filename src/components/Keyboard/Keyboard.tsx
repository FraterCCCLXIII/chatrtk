import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Smile, Image, Keyboard as KeyboardIcon, Gamepad2 } from 'lucide-react';
import { useWindow } from '@/lib/windowManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { GamepadProvider } from '@/contexts/GamepadContext';
import Gamepad from '@/components/Gamepad/Gamepad';
import './Keyboard.css';

interface KeyboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeyPress: (key: string) => void;
}

type Tab = 'keyboard' | 'emojis' | 'gifs' | 'gamepad';

const Keyboard: React.FC<KeyboardProps> = ({ open, onOpenChange, onKeyPress }) => {
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('keyboard');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [gifSearch, setGifSearch] = useState('');
  
  const {
    state,
    handleDragStart,
    handleResizeStart,
    toggleMaximize,
    style
  } = useWindow({
    initialPosition: {
      x: window.innerWidth - 420,
      y: window.innerHeight - 320
    },
    initialSize: {
      width: 400,
      height: 300
    },
    minSize: {
      width: 300,
      height: 200
    },
    bounds: {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    }
  });

  if (!open) return null;

  const handleKeyClick = (key: string) => {
    onKeyPress(key);
  };

  const handleGamepadButtonPress = (buttonId: string) => {
    onKeyPress(buttonId);
  };

  const keyboardLayout = {
    row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    row2: ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    row3: ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    row4: ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    row5: ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
  };

  const emojis = ['😀', '😂', '🥰', '😎', '🤔', '😴', '😡', '😭', '🥳', '🤩', '😇', '🤗', '🤫', '🤐', '😶', '😐', '😑', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍🍳', '👩‍🍳', '👨‍🏫', '👩‍🏫', '👨‍🏭', '👩‍🏭'];

  const filteredEmojis = emojis.filter(emoji => 
    emojiSearch === '' || emoji.includes(emojiSearch)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'keyboard':
        return (
          <div className="keyboard-container">
            {Object.entries(keyboardLayout).map(([rowName, keys]) => (
              <div key={rowName} className="keyboard-row">
                {keys.map((key, index) => (
                  <button
                    key={`${rowName}-${index}`}
                    className={`keyboard-key ${key.toLowerCase()}`}
                    onClick={() => handleKeyClick(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      case 'emojis':
        return (
          <div className="emojis-container">
            <input
              type="text"
              placeholder={getTranslation('searchEmojis', currentLanguage)}
              value={emojiSearch}
              onChange={(e) => setEmojiSearch(e.target.value)}
              className="search-input"
            />
            <div className="emojis-grid">
              {filteredEmojis.map((emoji, index) => (
                <button
                  key={index}
                  className="emoji-button"
                  onClick={() => handleKeyClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        );
      case 'gifs':
        return (
          <div className="gifs-container">
            <input
              type="text"
              placeholder={getTranslation('searchGifs', currentLanguage)}
              value={gifSearch}
              onChange={(e) => setGifSearch(e.target.value)}
              className="search-input"
            />
            <div className="gifs-grid">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="gif-placeholder">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'gamepad':
        return (
          <GamepadProvider>
            <Gamepad onButtonPress={handleGamepadButtonPress} />
          </GamepadProvider>
        );
    }
  };

  return (
    <div className="keyboard-modal" style={style}>
      <div className="keyboard-header" onMouseDown={handleDragStart}>
        <div className="keyboard-title">
          {getTranslation('keyboard', currentLanguage)}
        </div>
        <div className="keyboard-controls">
          <button onClick={toggleMaximize} className="keyboard-control-button">
            {state.isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => onOpenChange(false)} className="keyboard-control-button">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="keyboard-tabs">
        <button
          className={`keyboard-tab ${activeTab === 'keyboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('keyboard')}
          title={getTranslation('keyboard', currentLanguage)}
        >
          <KeyboardIcon size={16} />
        </button>
        <button
          className={`keyboard-tab ${activeTab === 'emojis' ? 'active' : ''}`}
          onClick={() => setActiveTab('emojis')}
          title={getTranslation('emojis', currentLanguage)}
        >
          <Smile size={16} />
        </button>
        <button
          className={`keyboard-tab ${activeTab === 'gifs' ? 'active' : ''}`}
          onClick={() => setActiveTab('gifs')}
          title={getTranslation('gifs', currentLanguage)}
        >
          <Image size={16} />
        </button>
        <button
          className={`keyboard-tab ${activeTab === 'gamepad' ? 'active' : ''}`}
          onClick={() => setActiveTab('gamepad')}
          title={getTranslation('gamepad', currentLanguage)}
        >
          <Gamepad2 size={16} />
        </button>
      </div>
      {renderContent()}
      <div className="keyboard-resize-handle" onMouseDown={(e) => handleResizeStart(e, 'se')} />
    </div>
  );
};

export default Keyboard; 