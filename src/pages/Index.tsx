
import React from 'react';
import ChatTalkingHead from '@/components/ChatTalkingHead/ChatTalkingHead';

const Index = () => {
    return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8">
        {/* <h1 className="text-3xl font-bold text-center mb-2">Talking Head Chat Demo</h1>
        <p className="text-center text-gray-600 mb-8">
          Click the settings icon in the top-right corner of the avatar to configure your AI provider.
        </p> */}
        <ChatTalkingHead />
      </div>
    </div>
    );
}

export default Index;
