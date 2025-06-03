
import React, { useEffect, useState } from 'react';

interface SpeechBubbleProps {
  message: string | null;
  duration?: number;
}

const SpeechBubble = ({ message, duration = 4000 }: SpeechBubbleProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-gray-300 min-w-32 max-w-48">
        <p className="text-sm text-gray-800 text-center">{message}</p>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechBubble;
