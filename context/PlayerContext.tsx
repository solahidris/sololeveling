import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the context
interface WorkoutLog {
  id: number;
  date: Date;
  pushup: number;
  situp: number;
  squats: number;
  run: number;
}

interface PlayerContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  playerRank: string;
  setPlayerRank: (rank: string) => void;
  workoutLogs: WorkoutLog[];
  addWorkoutLog: (log: WorkoutLog) => void;
}

// Create the context with default values
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Create a provider component
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState("");
  const [playerRank, setPlayerRank] = useState("");
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPlayerName = localStorage.getItem('playerName');
      const storedPlayerRank = localStorage.getItem('playerRank');
      const storedLogs = localStorage.getItem('workoutLogs');
      if (storedPlayerName) setPlayerName(storedPlayerName);
      if (storedPlayerRank) setPlayerRank(storedPlayerRank);
      if (storedLogs) setWorkoutLogs(JSON.parse(storedLogs));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('playerName', playerName);
    }
  }, [playerName]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('playerRank', playerRank);
    }
  }, [playerRank]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('workoutLogs', JSON.stringify(workoutLogs));
    }
  }, [workoutLogs]);

  const addWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prevLogs) => [...prevLogs, log]);
  };

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName, playerRank, setPlayerRank, workoutLogs, addWorkoutLog }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use the PlayerContext
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};