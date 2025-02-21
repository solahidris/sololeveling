import { Button } from "@/components/ui/button";
import { usePlayer } from "@/context/PlayerContext";
import { calculateTimeLeftTillEndOfDay } from "@/functions/calculateTimeLeftTillEndOfDay";
import { formatCurrentTime } from "@/functions/formatCurrentTime";
import { getWorkoutCounts } from "@/functions/getWorkoutCounts";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHourglassStart, FaRegStar } from "react-icons/fa6";

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
 

const DashboardPage = () => {

  const { playerName, playerRank, workoutLogs, addWorkoutLog } = usePlayer(); 
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
  }, []);

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

  const handleSubmitTodaysWorkout = () => {
    setTodaysWorkoutComleted(true);
    const newLog = {
      id: Date.now(), // Use timestamp for unique ID
      date: new Date(),
      pushup: workoutPushupCount,
      situp: workoutSitupsCount,
      squats: workoutSquatsCount,
      run: workoutRunCount,
    };
    addWorkoutLog(newLog);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-tr from-gray-800 via-gray-500 to-gray-800 relative">
      {/* Background Overlay Dark Screen */}
      <div className="h-full w-full bg-black/80 absolute top-0 left-0 z-0"/>

      <div className="z-10 text-white flex flex-col items-center">
        <p className="absolute top-2 right-2 tracking-wide text-xs">{formatCurrentTime(timeNow)}</p>
        <p className="text-center pb-6 font-bold uppercase tracking-widest">Profile</p>
        <img src="./images/noob.png" alt="profile_pic" width={100} height={100} className="rounded-full h-[120px] w-[120px]"/>
        <p className="font-semibold capitalize pt-2 pb-4">{playerName}</p>
        <div className="flex gap-3 justify-center items-center uppercase">
          <div className="flex flex-col from-zinc-800 via-zinc-800 bg-gradient-to-b p-3 justify-center items-center drop-shadow-md rounded w-14 h-14 aspect-square">
            <p className="font-bold tracking-widest text-[8px]">Exp</p>
            <p className="text-sm font-semibold">{(workoutLogs.length * Math.PI * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className={`flex flex-col p-3 justify-center items-center drop-shadow-md rounded w-16 h-16 aspect-square bg-gradient-to-b
            ${playerRank === "E" ? "from-red-600" : (playerRank === "D" ? "from-amber-600" : (playerRank === "C" ? "from-yellow-600" : (playerRank === "B" ? "from-blue-600" : (playerRank === "A" ? "from-green-600" : "from-purple-600" )))) }
          `}>
            <p className="font-bold tracking-widest text-[8px] -mt-1">Rank</p>
            <p className={`text-2xl font-semibold -mt-0.5
              `}>{playerRank}</p>
          </div>
          <div className="flex flex-col from-zinc-800 via-zinc-800 bg-gradient-to-b p-3 justify-center items-center drop-shadow-md rounded w-14 h-14 aspect-square">
            <p className="font-bold tracking-widest text-[8px]">Days</p>
            <p className="text-sm font-semibold">{(workoutLogs.length)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 my-4 border border-white rounded-lg bg-black p-4 w-[90vw] lg:max-w-sm relative">
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
          <Button onClick={handleSubmitTodaysWorkout} disabled={todaysWorkoutComleted} className={`${todaysWorkoutComleted ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-blue-700 hover:bg-blue-800"} font-bold`}>{todaysWorkoutComleted ? "Completed" : "Set as Complete"}</Button>
        </div>

        <div className="flex flex-col gap-4 my-4 border border-white/20 rounded-lg bg-black p-4 w-[90vw] lg:max-w-sm relative mb-16">
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
                <TableRow key={workout.id} className="text-[10px] text-white/50 tracking-wider" style={{ borderColor: "#FFFFFF30" }}>
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
              <TableRow className="text-[10px] bg-black/[70%] tracking-wider">
                <TableCell className="font-medium p-2 h-10 font-semibold" style={{ borderColor: "#FFFFFF30" }}>Total</TableCell>
                <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.pushup, 0)}</TableCell>
                <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.situp, 0)}</TableCell>
                <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.squats, 0)}</TableCell>
                <TableCell className="font-medium p-2 h-10 font-semibold">{workoutLogs.reduce((total, log) => total + log.run, 0)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="fixed bottom-0 h-12 grid grid-cols-2 w-full text-xs tracking-wide font-medium">
          <button className="bg-zinc-800/60 font-bold uppercase w-full flex justify-center items-center border-r border-white/10 gap-1"><FaRegStar /><p>Ranking</p></button>
          <button className="bg-zinc-800/60 font-bold uppercase w-full flex justify-center items-center border-r border-white/10 gap-1"><CgProfile /><p>Profile</p></button>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
