import AOS from 'aos';
import 'aos/dist/aos.css';

import { Button } from "@/components/ui/button";

import { usePlayer } from '@/context/PlayerContext';
import { supabase } from '@/lib/supabaseClient';

import { calculateTimeLeftTillEndOfDay } from "@/functions/calculateTimeLeftTillEndOfDay";
import { formatCurrentTime } from "@/functions/formatCurrentTime";
import { getWorkoutCounts } from "@/functions/getWorkoutCounts";
import { useEffect, useState } from "react";
import { FaHourglassStart } from "react-icons/fa6";
import { calculateDayStreak } from '@/functions/calculateDayStreak';
import { calculateNewExperience } from '@/functions/calculateNewExperience';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";


import { useRouter } from "next/router";
import MenuNavigation from "@/components/MenuNavigation";
import Link from "next/link";

import MusicIcons from '@/components/MusicIcons';
import confetti from 'canvas-confetti';


const ProfilePage = () => {

  const { email, playerName, playerRank, playerExp, playerDayStreak, setPlayerExp, setPlayerDayStreak, workoutLogs, addWorkoutLog, logout, bannedPermanently } = usePlayer();

  const [workoutPushupCount, setWorkoutPushupCount] = useState(1);
  const [workoutSitupsCount, setWorkoutSitupsCount] = useState(1);
  const [workoutSquatsCount, setWorkoutSquatsCount] = useState(1);
  const [workoutRunCount, setWorkoutRunCount] = useState(1);
  const workoutRoutine = [ {type: "Pushup", count: `${workoutPushupCount}x`}, {type: "Situps", count: `${workoutSitupsCount}x`}, {type: "Squats", count: `${workoutSquatsCount}x`}, {type: "Run", count: `${workoutRunCount}km`},]
  const [timeNow, setTimeNow] = useState(new Date());
  const [todaysWorkoutComleted, setTodaysWorkoutComleted] = useState(false);

  const goalWorkoutBoxCss = "flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-900 p-2 justify-center items-center drop-shadow-md rounded w-full aspect-square"
  const goalNumberCss = "text-xl font-semibold"
  const goalTextCss = "text-xs"

  useEffect(() => {
    const { pushups, situps, squats, run } = getWorkoutCounts(playerRank);
    setWorkoutPushupCount(pushups); setWorkoutSitupsCount(situps); setWorkoutSquatsCount(squats); setWorkoutRunCount(run);
  }, [playerRank]);

  useEffect(() => {
    const intervalId = setInterval(() => { setTimeNow(new Date()); }, 60000); // Update every minute
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);
  

  useEffect(() => {
    const today = new Date();
    const isTodayCompleted = workoutLogs.some(log => {
      const logDate = new Date(log.date);
      return (
        logDate.getDate() === today.getDate() &&
        logDate.getMonth() === today.getMonth() &&
        logDate.getFullYear() === today.getFullYear()
      );
    });
    setTodaysWorkoutComleted(isTodayCompleted);
  }, [workoutLogs]);

  // const handleSubmitTodaysWorkout = async () => {
  //   const today = new Date();
  //   const isTodayCompleted = workoutLogs.some(log => {
  //     const logDate = new Date(log.date);
  //     return (
  //       logDate.getDate() === today.getDate() &&
  //       logDate.getMonth() === today.getMonth() &&
  //       logDate.getFullYear() === today.getFullYear()
  //     );
  //   });
  
  //   if (isTodayCompleted) {
  //     console.log('Workout for today is already completed.');
  //     return; // Exit the function if today's workout is already logged
  //   }
  
  //   setTodaysWorkoutComleted(true);
  
  //   const newLog = {
  //     id: Date.now(), // Ensure unique ID by using current timestamp
  //     date: today,
  //     pushup: workoutPushupCount,
  //     situp: workoutSitupsCount,
  //     squats: workoutSquatsCount,
  //     run: workoutRunCount,
  //   };
  
  //   // Add the new workout log to the local state
  //   addWorkoutLog(newLog);
  
  //   // Calculate new player experience using the updated workoutLogs
  //   const updatedWorkoutLogs = [...workoutLogs, newLog];
  //   const newExp = parseFloat((updatedWorkoutLogs.length * Math.PI * 100).toFixed(0));
  //   setPlayerExp(newExp);
  
  //   // Calculate the day streak
  //   const sortedLogs = updatedWorkoutLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //   let streak = 0;
  //   let currentStreak = 0;
  //   let lastDate: Date | null = null; // Explicitly define the type
  
  //   sortedLogs.forEach(log => {
  //     const logDate = new Date(log.date);
  //     if (lastDate) {
  //       const isConsecutiveDay =
  //         logDate.getDate() === lastDate.getDate() + 1 &&
  //         logDate.getMonth() === lastDate.getMonth() &&
  //         logDate.getFullYear() === lastDate.getFullYear();
  
  //       if (isConsecutiveDay) {
  //         currentStreak++;
  //       } else if (logDate > lastDate) {
  //         currentStreak = 1;
  //       }
  //     } else {
  //       currentStreak = 1; // Initialize streak for the first log
  //     }
  //     lastDate = logDate;
  //     streak = Math.max(streak, currentStreak);
  //   });
  
  //   setPlayerDayStreak(streak);
  
  //   console.log("Updating Supabase with newExp:", newExp, "and updatedWorkoutLogs:", updatedWorkoutLogs);
  
  //   // Update the user's playerExp, workoutLogs, and playerDayStreak in the database
  //   const { error } = await supabase
  //     .from('users')
  //     .update({
  //       playerExp: newExp,
  //       workoutLogs: updatedWorkoutLogs, // Assuming workoutLogs is stored as a JSON array
  //       playerDayStreak: streak
  //     })
  //     .eq('email', email); // Use the user's email to identify the record
  
  //   if (error) {
  //     console.error('Error updating user data:', error.message);
  //   } else {
  //     console.log('User data updated successfully in Supabase');
  //   }
  // };
  const handleSubmitTodaysWorkout = async () => {
    const today = new Date();
    
    // Check if today's workout is already completed
    const isTodayCompleted = workoutLogs.some(log => {
      const logDate = new Date(log.date);
      return (
        logDate.getDate() === today.getDate() &&
        logDate.getMonth() === today.getMonth() &&
        logDate.getFullYear() === today.getFullYear()
      );
    });
  
    if (isTodayCompleted) {
      console.log('Workout for today is already completed.');
      return;
    }
  
    setTodaysWorkoutComleted(true);
  
    const newLog = {
      id: Date.now(),
      date: today,
      pushup: workoutPushupCount,
      situp: workoutSitupsCount,
      squats: workoutSquatsCount,
      run: workoutRunCount,
    };
  
    // Add the new workout log to the local state
    addWorkoutLog(newLog);
  
    // Calculate new player experience
    const updatedWorkoutLogs = [...workoutLogs, newLog];
    const newExp = calculateNewExperience(updatedWorkoutLogs);
    setPlayerExp(newExp);
  
    // Calculate the day streak
    const streak = calculateDayStreak(updatedWorkoutLogs);
    setPlayerDayStreak(streak);
  
    // console.log("Updating Supabase with newExp:", newExp, "and updatedWorkoutLogs:", updatedWorkoutLogs);
  
    try {
      const { error } = await supabase
        .from('users')
        .update({
          playerExp: newExp,
          workoutLogs: updatedWorkoutLogs,
          playerDayStreak: streak
        })
        .eq('email', email);
  
      if (error) throw error;
  
      // console.log('User data updated successfully in Supabase');

      // Trigger confetti when the workout is successfully logged
      confetti({
        particleCount: 100,
        spread: 70,
        // origin: { y: 1 }
        origin: { y: 0.6 }
      });

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating user data:', error.message);
        window.alert(`Error updating user data: ${error.message}`);
      } else {
        console.error('An unknown error occurred:', error);
        window.alert('An unknown error occurred:');
      }
    }
  };



  const router = useRouter();

  const handleLogOut = () => {
    logout();
    router.push("/");
  }
  const handleLogin = () => {
    router.push("/");
  }

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);


  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-tr from-gray-800 via-gray-500 to-gray-800 relative">
      {/* Background Overlay Dark Screen */}
      <div className="h-full w-full bg-black/80 absolute top-0 left-0 z-0"/>
      {/* Logout / Login Buttton */}
      <button onClick={playerRank ? handleLogOut : handleLogin} className={`absolute top-2 left-2 lg:left-[38%] z-10 bg-white/10z-10 text-xs tracking-wider font-semibold ${playerRank ? "text-red-600" : "text-blue-600"}`}>{playerRank ? "Logout" : "Login"}</button>
      <MusicIcons />
      

      <div className="z-10 text-white flex flex-col items-center">
        <p className="absolute top-2 right-2 lg:right-[38%] tracking-wide text-xs font-semibold">{formatCurrentTime(timeNow)}</p>
        <p className="text-center pb-6 font-bold uppercase tracking-widest">Profile</p>
        <img src="./images/noob.png" alt="profile_pic" width={100} height={100} className="rounded-full h-[120px] w-[120px]"/>
        <p className={`font-semibold capitalize pt-2 pb-4 ${bannedPermanently && "text-red-700 line-through decoration-[3px]"}`}>{playerName}</p>
        

        {!bannedPermanently ? 
        (<>
        
          {!playerRank && 
          <div className="flex flex-col justify-center items-center tracking-widest gap-4 pt-20">
            <p>Nothing to see here</p>
            <p>Login to play the game</p>
            <Link href={"/"}><Button className="bg-blue-700 hover:bg-blue-800 font-bold">Login</Button></Link>
          </div>}
          
          {playerRank && <div data-aos="fade-in" className="flex gap-3 justify-center items-center uppercase">
            <div className="flex flex-col from-zinc-800 via-zinc-800 bg-gradient-to-b p-3 justify-center items-center drop-shadow-md rounded w-14 h-14 aspect-square">
              <p className="font-bold tracking-widest text-[8px]">Exp</p>
              <p className="text-sm font-semibold">{playerExp}</p>
            </div>
            <div className={`flex flex-col p-3 justify-center items-center drop-shadow-md rounded w-16 h-16 aspect-square bg-gradient-to-b
              ${playerRank === "E" ? "from-red-600" : (playerRank === "D" ? "from-amber-600" : (playerRank === "C" ? "from-yellow-600" : (playerRank === "B" ? "from-blue-600" : (playerRank === "A" ? "from-green-600" : "from-purple-600" )))) }
            `}>
              <p className="font-bold tracking-widest text-[8px] -mt-1">Rank</p>
              <p className={`text-2xl font-semibold -mt-0.5
                `}>{playerRank}</p>
            </div>
            <div className="flex flex-col from-zinc-800 via-zinc-800 bg-gradient-to-b p-3 justify-center items-center drop-shadow-md rounded w-14 h-14 aspect-square">
              <p className="font-bold tracking-widest text-[8px]">Streak</p>
              <p className="text-sm font-semibold">{playerDayStreak}</p>
            </div>
          </div>}

          {playerRank && <div data-aos="fade-in" className="flex flex-col gap-4 my-4 shadow-md shadow-white/10 rounded-lg bg-black p-4 w-[90vw] lg:max-w-sm relative">
            <p className={`text-xl font-extrabold text-center tracking-wider uppercase bg-gradient-to-r bg-clip-text text-transparent ${todaysWorkoutComleted ? "from-green-800 via-green-500 to-green-800" : "from-red-800 via-red-500 to-red-800"}`}>
              Today&apos;s Task
            </p>
            {todaysWorkoutComleted && <span className="bg-green-700 text-white text-[8px] font-bold mx-auto px-1 py-0.5 rounded absolute top-2 right-2 uppercase">Completed</span>}
            <div className="flex justify-center gap-2">
              {workoutRoutine.map((workout,key)=>(
                <div key={key} className={goalWorkoutBoxCss}>
                  <p className={goalNumberCss}>{workout.count}</p>
                  <p className={goalTextCss}>{workout.type}</p>
                </div>
              ))}
            </div>
            <Button disabled={true}>
              <p className={`${todaysWorkoutComleted && "line-through"}`}>{calculateTimeLeftTillEndOfDay(timeNow)}</p>
              {!todaysWorkoutComleted && <FaHourglassStart className="text-white"/>}
            </Button>
            
            {/* <Button onClick={handleSubmitTodaysWorkout} disabled={todaysWorkoutComleted} className={`${todaysWorkoutComleted ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-blue-700 hover:bg-blue-800"} font-bold`}>{todaysWorkoutComleted ? "Completed" : "Set as Complete"}</Button> */}
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button onClick={handlePlayMusic} className="w-full max-w-[200px] font-bold">Login</Button> */}
                <Button disabled={todaysWorkoutComleted} className={`${todaysWorkoutComleted ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-blue-700 hover:bg-blue-800"} font-bold`}>{todaysWorkoutComleted ? "Completed" : "Set as Complete"}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] lg:max-w-md rounded-lg bg-black text-white p-4">
                  <p className="font-bold text-center">{`Finished Today's Workout?`}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <DialogClose className={`bg-red-700 hover:bg-red-800 font-bold rounded-md`}><Button className={`bg-red-700 hover:bg-red-800 font-bold`}>No</Button></DialogClose>
                    <DialogClose onClick={handleSubmitTodaysWorkout} className={`bg-blue-700 hover:bg-blue-800 font-bold rounded-md`}><Button className={`bg-blue-700 hover:bg-blue-800 font-bold`}>Yes</Button></DialogClose>
                  </div>
                  {/* <LoginUser isSignUp={false} /> */}
              </DialogContent>
            </Dialog>
          </div>}
          
          {playerRank && <div data-aos="fade-in" className="flex flex-col gap-4 my-4 shadow-md shadow-white/10 rounded-lg bg-black p-4 w-[90vw] lg:max-w-sm relative">
            <p className={`text-xl font-extrabold text-center tracking-wider uppercase bg-gradient-to-r bg-clip-text text-transparent from-zinc-800 via-zinc-500 to-zinc-800`}>
              Game Mechanics
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button onClick={handlePlayMusic} className="w-full max-w-[200px] font-bold">Login</Button> */}
                <Button className={`bg-zinc-700 hover:bg-zinc-600 text-white/70 font-bold`}>
                  {`How to Play?`}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] lg:max-w-md rounded-lg bg-black text-white p-4">
                  <p className="font-bold text-xl pt-4 pb-2 tracking-tight capitalize">{`The game mechanics is simple`}</p>
                  <div className='flex flex-col gap-3 tracking-widest text-sm'>
                    <p className="">1&#41; Workout daily for 7 days <br/>to <span className='font-semibold bg-green-600 px-1.5'>rank up.</span></p>
                    <p className="">2&#41; Workout <span className='font-semibold bg-blue-600 px-1.5'>task increases</span> as you rank higher up.</p>
                    <p className="">3&#41; Miss/skip any workout and <br/>you will <span className='font-semibold bg-yellow-600 px-1.5'>rank down.</span></p>
                    <p className="">4&#41; Miss &gt;3 days and your account <br/>will be <span className='font-semibold bg-red-600 px-1.5'>banned.</span></p>
                    <p className="py-4">Note: Penalty system will start on <br/><span className='font-semibold bg-red-600 px-1.5'>10 March 2025</span></p>
                  </div>
                  <div className="grid gap-2">
                    <DialogClose className={`bg-zinc-700 hover:bg-zinc-800 font-bold rounded-md`}><Button className={`bg-zinc-700 hover:bg-zinc-800 font-bold`}>Close</Button></DialogClose>
                  </div>
              </DialogContent>
            </Dialog>
          </div>}

          {playerRank && <div data-aos="fade-in" className="flex flex-col gap-4 my-4 shadow-md shadow-white/10 rounded-lg bg-black p-4 w-[90vw] lg:max-w-sm relative">
            <p className={`text-xl font-extrabold text-center tracking-wider uppercase bg-gradient-to-r bg-clip-text text-transparent from-zinc-800 via-zinc-500 to-zinc-800`}>
              App Development
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button onClick={handlePlayMusic} className="w-full max-w-[200px] font-bold">Login</Button> */}
                <Button className={`bg-gradient-to-tr from-yellow-700 via-yellow-400 to-yellow-700 hover:bg-yellow-800 text-white/100 text-shadow font-bold`} style={{ textShadow: '1px 1px 2px rgb(135, 106, 12)' }}>
                  {`Join the Movement`}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] lg:max-w-md rounded-lg bg-black text-white p-4">
                  <p className="font-bold text-xl pt-4 pb-2 tracking-tight capitalize">{`Building a game is costly`}</p>
                  <div className='flex flex-col gap-3 tracking-widest text-xs'>
                    <p className="">1&#41; Because we need more <span className='font-semibold bg-green-600 px-1.5'>S-rank</span> real life people in real life. Tokyo meetup one fine day?</p>
                    <p className="">2&#41; I code solo. And coding is <br/> <span className='font-semibold bg-blue-600 px-1.5'>super stressful</span> but I really want to make this work.</p>
                    {/* <p className="">3&#41; Let's build an actual non toxic<br/><span className='font-semibold bg-yellow-600 px-1.5'>anime community</span></p> */}
                    {/* <p className="">3&#41; I want to ultimately meet up with all the <span className='font-semibold bg-red-600 px-1.5'>S-rank</span> players IRL. Tokyo?</p> */}
                    <p className="">3&#41; Lastly, lets be real, I need to pay bills, servers and development cost. I dont have much to begin with. This started as a joke but lets make it a real <span className='font-semibold bg-green-600 px-1.5'>W</span> for once. Im getting tired of always losing in life.</p>
                    <p className="py-2 text-[10px]">Note: Thank you for the kind dms. I really didnt expect any traffic tbh. <br/>- <span className='font-semibold bg-red-600 px-1.5'>Solah, S-Rank Dev</span> </p>
                    <p className="text-[10px] text-sky-400 leading-tight">{`* By purchasing the OG NFT, you will receive in-game benefits once the app is complete`}</p>
                    <Link href="https://opensea.io/collection/our-solo-leveling/overview" className='w-full'><Button className='w-full bg-blue-700 hover:bg-blue-800 font-bold'>OpenSea NFT</Button></Link>
                    <Link href="https://www.paypal.com/ncp/payment/L9WWND5R4YXA6" className='w-full'><Button className='w-full bg-blue-700 hover:bg-blue-800 font-bold'>Paypal</Button></Link>
                  </div>
                  <div className="grid gap-2">
                    <DialogClose className={`bg-zinc-700 hover:bg-zinc-800 font-bold rounded-md`}><Button className={`bg-zinc-700 hover:bg-zinc-800 font-bold`}>Close</Button></DialogClose>
                  </div>
              </DialogContent>
            </Dialog>
          </div>}

          {playerRank && <div data-aos="fade-in" className="flex flex-col gap-4 my-4 shadow-md shadow-white/10 rounded-lg bg-black p-4 w-[90vw] lg:max-w-sm relative mb-16">
            <p className="font-bold text-center">Workout History</p>
            <Table>
              <TableCaption className="text-[10px] tracking-wider">A list of your all your accumulated hard work.</TableCaption>
              <TableHeader>
                <TableRow className="text-center text-xs text-start">
                  <TableHead className="px-2 h-8 text-white/90 font-semibold">Date</TableHead>
                  <TableHead className="px-2 h-8 text-white/90 font-semibold">Pushup</TableHead>
                  <TableHead className="px-2 h-8 text-white/90 font-semibold">Situps</TableHead>
                  <TableHead className="px-2 h-8 text-white/90 font-semibold">Squats</TableHead>
                  <TableHead className="px-2 h-8 text-white/90 font-semibold">Run</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workoutLogs.map((workout) => (
                  <TableRow key={workout.id} className="text-xs text-white/50 tracking-wide" style={{ borderColor: "#FFFFFF30" }}>
                    <TableCell className="font-medium p-2 h-10">
                      {new Date(workout.date).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="font-medium p-2 h-10">{workout.pushup}</TableCell>
                    <TableCell className="font-medium p-2 h-10">{workout.situp}</TableCell>
                    <TableCell className="font-medium p-2 h-10">{workout.squats}</TableCell>
                    <TableCell className="font-medium p-2 h-10">{workout.run}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter style={{ borderColor: "#000000" }}>
                <TableRow className="text-xs bg-black/[70%] tracking-wide">
                  <TableCell className="font-medium p-2 h-10 font-semibold" style={{ borderColor: "#FFFFFF30" }}>Total</TableCell>
                  <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.pushup, 0)}<span className="text-[10px] font-bold ml-0.5 opacity-50">x</span></TableCell>
                  <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.situp, 0)}<span className="text-[10px] font-bold ml-0.5 opacity-50">x</span></TableCell>
                  <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.squats, 0)}<span className="text-[10px] font-bold ml-0.5 opacity-50">x</span></TableCell>
                  <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.run, 0)}<span className="text-[10px] font-bold ml-0.5 opacity-50">km</span></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>}

        </>
        ) : (
          <div className="mt-8 flex flex-col gap-4 rounded-lg p-12 bg-gradient-to-b from-red-600">
            <p className="font-bold text-4xl text-center">GAME OVER</p>
            <span className="font-bold text-xs text-center tracking-widest">There are no redos in life.<br/> You have been eliminated by the system.</span>
          </div>
        )}

        <MenuNavigation />

      </div> 


    </div>
  );
};

export default ProfilePage;