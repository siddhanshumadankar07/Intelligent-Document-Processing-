import React from 'react';
import { JarvisChatPanel } from '../components/jarvis/JarvisChatPanel';

export const ChatPage = () => {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <JarvisChatPanel isFullPage={true} />
    </div>
  );
};
