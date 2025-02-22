import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let error;
    if (isSignUp) {
      ({ error } = await supabase.auth.signUp({ email, password }));
      if (!error) {
        alert('Sign-up successful! Please check your email to login to your account.');
      }
    } else {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) {
        router.push('/dashboard');
        // alert('Sign-in successful! Please check your email to confirm your account.');
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
      <form onSubmit={handleAuth} className="flex flex-col gap-1">
        <div className='grid grid-cols-2 gap-1 borders p-1 rounded-lg bg-white/15 -mt-['>
          <Button onClick={() => setIsSignUp(!isSignUp)} className={`transition duration-300 ${isSignUp ? "" : "bg-blue-600 hover:bg-blue-700"}`}>
            {isSignUp ? 'Switch to Login' : 'Login'}
          </Button>
          <Button onClick={() => setIsSignUp(!isSignUp)} className={`transition duration-300 ${isSignUp ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
            {!isSignUp ? 'Switch to Sign Up' : 'Sign Up'}
          </Button>
        </div>
        <p className='text-center font-semibold text-lg pt-2 pb-4'>{isSignUp ? "Sign Up" : "Login"}</p>
        <Label className='text-start'>Email</Label>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Label className='text-start pt-4'>Password</Label>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading} className='my-4 bg-blue-700 hover:bg-blue-800'>
          {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
        </Button>
      </form>
      {error && <p>{error}</p>}
      {/* <Button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
      </Button> */}
    </div>
  );
};

export default LoginUser;