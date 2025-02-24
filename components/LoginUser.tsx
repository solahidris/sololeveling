import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { usePlayer } from '@/context/PlayerContext';
// import { WorkoutLog } from '@/context/PlayerContext';

// Define the props type
type LoginUserProps = {
  isSignUp?: boolean; // Optional prop
  playerName?: string;
  playerRank?: string;
};

const LoginUser = ({ isSignUp = false, playerName, playerRank }: LoginUserProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const [isSignUpState, setisSignUpState] = useState(isSignUp);
  const isSignUpState = isSignUp;
  const router = useRouter();
  const { setPlayerName, setPlayerRank, setPlayerExp, setPlayerDayStreak, setEmail: setContextEmail, setWorkoutLogs } = usePlayer();

  const handleAuth = async () => {
    setLoading(true);
    let error;
    if (isSignUpState) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
      if (!error) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ email, playerName: playerName, playerRank: playerRank, playerExp: 0, playerDayStreak: 0 }]);
        if (!insertError) {
          alert(`Sign-up successful! It's time to lock in and level up.`);
          router.push("/profile");
        } else {
          setError(insertError.message);
        }
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
      if (!error && data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (!userError && userData) {
          // Update context with user data
          setPlayerName(userData.playerName);
          setPlayerRank(userData.playerRank);
          setPlayerExp(userData.playerExp);
          setPlayerDayStreak(userData.playerDayStreak);
          setContextEmail(userData.email);
          // I Think this was causing duplicated on login
          // const logs = userData.workoutLogs || [];
          // (logs as WorkoutLog[]).forEach((log: WorkoutLog) => addWorkoutLog(log));
          // Directly set workout logs to avoid duplication
          setWorkoutLogs(userData.workoutLogs || []);


          router.push('/profile');
        }
      }
    }
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setError(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        {!isSignUpState && <div className='pt-8' />}
        <div className='bg-white/10 rounded-lg p-3 pt-2 pb-3 mb-4 flex flex-col gap-2'>
          <p className='text-start font-semibold text-xl'>{isSignUpState ? "Sign Up" : "Login"}</p>
          <Label className='text-start text-xs'>
            {isSignUpState ? 
              "Create an account and level up the ranks" 
              : 
              "Login to your account to continue your quest"
            }
          </Label>
        </div>

        <Label className='text-start text-xs tracking-wider'>Email</Label>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Label className='text-start text-xs pt-4 tracking-wider'>Password</Label>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleAuth} disabled={loading || !password || !email} className='my-4 bg-blue-700 hover:bg-blue-800 font-semibold'>
          {loading ? (isSignUpState ? 'Creating account...' : 'Logging in...') : (isSignUpState ? 'Create account' : 'Login')}
        </Button>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginUser;