
import React, { useEffect, useState } from 'react';
import ChatTalkingHead from '@/components/ChatTalkingHead/ChatTalkingHead';

const Index = () => {
    const [backgroundColor, setBackgroundColor] = useState('#e2ffe5'); // Default mint background

    useEffect(() => {
        // Get the current theme from localStorage
        const savedFaceTheme = localStorage.getItem('faceTheme');
        if (savedFaceTheme) {
            const theme = JSON.parse(savedFaceTheme);
            setBackgroundColor(theme.screenColor);
        }

        // Listen for theme changes
        const handleStorageChange = () => {
            const updatedTheme = localStorage.getItem('faceTheme');
            if (updatedTheme) {
                const theme = JSON.parse(updatedTheme);
                setBackgroundColor(theme.screenColor);
            }
        };

        // Create a custom event listener for theme changes
        window.addEventListener('storage', handleStorageChange);
        
        // Create a MutationObserver to watch for changes to the talking-head-container
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const savedFaceTheme = localStorage.getItem('faceTheme');
                    if (savedFaceTheme) {
                        const theme = JSON.parse(savedFaceTheme);
                        setBackgroundColor(theme.screenColor);
                    }
                }
            });
        });

        // Start observing the document with the configured parameters
        const container = document.querySelector('.talking-head-container');
        if (container) {
            observer.observe(container, { attributes: true });
        }

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    return (
    <div className="min-h-screen p-4" style={{ backgroundColor }}>
      <div className="container mx-auto py-8">
        <ChatTalkingHead />
      </div>
    </div>
    );
}

export default Index;
