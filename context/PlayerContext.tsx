import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatTimestampToDate } from '@/functions/formatTimestampToDate';

// Define the shape of the context
export interface WorkoutLog {
  id: number;
  date: Date;
  pushup: number;
  situp: number;
  squats: number;
  run: number;
}

export interface PlayerContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  playerRank: string;
  setPlayerRank: (rank: string) => void;
  playerCreated: string;
  setPlayerCreated: (rank: string) => void;
  playerExp: number;
  setPlayerExp: (exp: number) => void;
  playerDayStreak: number;
  setPlayerDayStreak: (streak: number) => void;
  email: string;
  setEmail: (email: string) => void;
  workoutLogs: WorkoutLog[];
  setWorkoutLogs: (logs: WorkoutLog[]) => void;
  addWorkoutLog: (log: WorkoutLog) => void;
  bannedPermanently: boolean;
  setBannedPermanently: (banned: boolean) => void;
  logout: () => void;
}

// Create the context with default values
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Create a provider component
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState("");
  const [playerRank, setPlayerRank] = useState("");
  const [playerCreated, setPlayerCreated] = useState("");
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [playerExp, setPlayerExp] = useState(0);
  const [playerDayStreak, setPlayerDayStreak] = useState(0);
  const [bannedPermanently, setBannedPermanently] = useState(false);
  const [email, setEmail] = useState("");

  const addWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prevLogs) => [...prevLogs, log]);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

          if (!error && userData) {
            // console.log('Fetched user data:', userData); // Debugging line
            setPlayerName(userData.playerName);
            setPlayerRank(userData.playerRank);
            setPlayerExp(userData.playerExp);
            setPlayerDayStreak(userData.playerDayStreak);
            setPlayerCreated(formatTimestampToDate(userData.created_at));
            setEmail(userData.email);
            setBannedPermanently(userData.bannedPermanently);
             // Ensure workoutLogs are set
            setWorkoutLogs(userData.workoutLogs || []);
          } else {
            console.error('Error fetching user data:', error); // Debugging line
          }
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setPlayerName('');
    setPlayerRank('');
    setPlayerExp(0);
    setPlayerDayStreak(0);
    setPlayerCreated('');
    setBannedPermanently(false);
    setEmail('');
  };

  return (
    <PlayerContext.Provider value={{
      playerName,
      setPlayerName,
      playerRank,
      setPlayerRank,
      workoutLogs,
      setWorkoutLogs,
      addWorkoutLog,
      playerExp,
      setPlayerExp,
      playerDayStreak,
      setPlayerDayStreak,
      playerCreated,
      setPlayerCreated,
      bannedPermanently,
      setBannedPermanently,
      email,
      setEmail,
      logout
    }}>
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