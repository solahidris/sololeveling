import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface MusicContextType {
  playMusic: boolean;
  setPlayMusic: (value: boolean) => void;
  handlePlayMusic: () => void;
  loopMusic: boolean;
  setLoopMusic: (value: boolean) => void;
  toggleLoop: () => void; // Add toggleLoop to the context type
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playMusic, setPlayMusic] = useState(false);
  const [loopMusic, setLoopMusic] = useState(false);

  // Use useRef to persist the audio object across re-renders
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("./audio/dark_aria.mp3");
    }

    const audio = audioRef.current;

    if (playMusic) {
      // console.log("music already played");
      setPlayMusic(false);
      audio.pause(); // Pause the audio
      audio.currentTime = 0; // Reset the audio to the start
    } else {
      setPlayMusic(true);
      // console.log("set play music true:: ", !playMusic);
      audio.loop = loopMusic; // Use loopMusic state
      audio.play();
    }
  };

  const toggleLoop = () => {
    setLoopMusic((prevLoop) => {
      const newLoop = !prevLoop;
      // console.log(`Previous loop state: ${prevLoop}`);
      // console.log(`New loop state: ${newLoop}`);
      if (audioRef.current) {
        audioRef.current.loop = newLoop;
        // console.log(`Audio loop property set to: ${audioRef.current.loop}`);
      }
      
      return newLoop;
    });
  };

  return (
    <MusicContext.Provider value={{ playMusic, setPlayMusic, handlePlayMusic, loopMusic, setLoopMusic, toggleLoop }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};