import AOS from 'aos';
import 'aos/dist/aos.css';

import { usePlayer } from '@/context/PlayerContext';
import { supabase } from '@/lib/supabaseClient';

import { formatCurrentTime } from "@/functions/formatCurrentTime";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/router";
import MenuNavigation from "@/components/MenuNavigation";
 
// Define a type for the user data
interface User {
  playerName: string;
  // playerRank: string;
  playerRank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E'; // Specify possible values
  playerExp: number;
}

const RankingPage = () => {

  const router = useRouter();
  const { playerName, playerRank, playerExp, playerDayStreak, playerCreated, bannedPermanently, logout } = usePlayer();
  const [timeNow, setTimeNow] = useState(new Date());
  const [allUsers, setAllUsers] = useState<User[]>([]); // State to hold all users
  const [playerGlobalRank, setPlayerGlobalRank] = useState(0);
  const [totalPlayersInGame, setTotalPlayersInGame] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => { setTimeNow(new Date()); }, 60000); // Update every minute
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);
  
  const handleLogOut = () => {
    logout();
    router.push("/");
  }
  const handleLogin = () => {
    router.push("/");
  }

  useEffect(() => {
    const fetchAllUsers = async () => {
      const { data, error, count } = await supabase
        .from('users')
        .select('playerName, playerRank, playerExp', { count: 'exact' }) // Fetch count of users
        .eq('bannedPermanently', false) // Exclude permanently banned users
        .order('playerExp', { ascending: false }) // Order by experience descending
        // .limit(100); // Limit to top 100 users
        .limit(30); // Limit to top 30 users

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        // Custom sort logic for playerRank
        const rankOrder = { 'S': 1, 'A': 2, 'B': 3, 'C': 4, 'D': 5, 'E': 6 };
        const sortedData = (data || []).sort((a, b) => {
          return rankOrder[a.playerRank as keyof typeof rankOrder] - rankOrder[b.playerRank as keyof typeof rankOrder];
        });

        setAllUsers(sortedData);
        setTotalPlayersInGame(count || 0);
        // console.log(data);
        // console.log('Total number of users:', count);
        
        // Find the current player's global rank
        const { count: higherExpCount, error: rankError } = await supabase
        .from('users')
        .select('playerExp', { count: 'exact' })
        .eq('bannedPermanently', false)
        .gt('playerExp', playerExp); // Count users with more experience

      if (rankError) {
        console.error('Error fetching player rank:', rankError);
      } else {
        setPlayerGlobalRank((higherExpCount || 0) + 1); // Rank is number of users with more exp + 1
      }

        
      }
    };

    fetchAllUsers();
  }, []);
  
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
      {/* Logout Buttton */}
      <button onClick={playerRank ? handleLogOut : handleLogin} className={`absolute top-4 left-4 lg:left-[38%] z-10 text-xs tracking-wider font-semibold ${playerRank ? "text-red-600" : "text-blue-600"}`}>{playerRank ? "Logout" : "Login"}</button>

      <div className="z-10 text-white flex flex-col items-center">
        <p className="absolute top-4 right-4 lg:right-[38%] tracking-wide text-xs font-semibold">{formatCurrentTime(timeNow)}</p>
        <div className="flex justify-center items-center my-6 py-3 w-[90vw] bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-600 rounded-lg lg:max-w-sm"><span className="font-bold uppercase tracking-widest text-black">Global Ranking</span></div>
        
        {playerName && !bannedPermanently ? (
          <div data-aos="fade-in" className="flex gap-4 w-[90vw] lg:max-w-sm bg-black shadow-md shadow-white/10 rounded-lg p-4">
            <img src="./images/noob.png" alt="profile_pic" width={100} height={100} className={`rounded-full h-[100px] w-[100px] ${bannedPermanently && "grayscale"}`} />
            <div className="flex flex-col justify-between">
              <div className="flex justify-between font-semibold capitalize">
                <div className="flex flex-col gap-1 pb-4">
                  <p className="">{playerName}</p>
                  <p className="text-xs text-gray-600">{`Joined ${playerCreated}`}</p>
                </div>  
                <div><p className="bg-white/10 px-2 py-1 rounded-lg ">{`# ${playerGlobalRank}`}</p></div>
              </div>

              <div className="flex flex-wrap gap-2 justify-start items-center uppercase">
                <div className={`text-xs tracking-widest font-semibold flex gap-2 bg-gradient-to-b p-3 justify-center items-center drop-shadow-md rounded h-6 px-3
                ${playerRank === "E" ? "from-red-600" : (playerRank === "D" ? "from-amber-600" : (playerRank === "C" ? "from-yellow-600" : (playerRank === "B" ? "from-blue-600" : (playerRank === "A" ? "from-green-600" : "from-purple-600" )))) }
                `}>
                  <p className="">Rank</p>
                  <p className="">{playerRank}</p>
                </div>
                <div className="text-xs tracking-widest font-semibold flex gap-2 from-zinc-800 via-zinc-800 bg-gradient-to-b p-3 justify-center items-center drop-shadow-md rounded h-6 px-3">
                  <p className="">Exp</p>
                  <p className="">{playerExp}</p>
                </div>
                <div className="text-xs tracking-widest font-semibold flex gap-2 from-zinc-800 via-zinc-800 bg-gradient-to-b p-3 justify-center items-center drop-shadow-md rounded h-6 px-3">
                  <p className="">Streak</p>
                  <p className="">{playerDayStreak}</p>
                </div>
              </div>

            </div>
          </div> 
          ) : (
            <div data-aos="fade-in" className="flex gap-4 w-[90vw] lg:max-w-sm bg-black shadow-md shadow-white/10 rounded-lg p-4">
              <img src="./images/noob.png" alt="profile_pic" width={100} height={100} className="rounded-full h-[100px] w-[100px]"/>
              <div className="flex flex-col w-full">
                <div className="flex justify-between font-semibold capitalize">
                  <div className="flex flex-col gap-1 pb-4">
                    <p className={`${bannedPermanently && "text-red-700 line-through decoration-[3px]"}`}>{playerName}</p>
                  </div>  
                  {/* <div><p className="bg-white/10 px-2 py-1 rounded-lg ">{`# ${playerGlobalRank}`}</p></div> */}
                </div>
                <div className={`w-full text-xs tracking-widest font-semibold flex gap-2 bg-gradient-to-b from-red-600 p-6 justify-center items-center drop-shadow-md rounded h-6 px-3`}>
                  <p className="text-xl">GAME OVER</p>
                </div>

              </div>
            </div> 
          )
        }

        <div data-aos="fade-in" className="flex flex-col gap-4 my-4 shadow-md shadow-white/10 rounded-lg bg-black p-4 w-[90vw] lg:max-w-sm relative mb-16">
          <p className="font-bold text-center tracking-widest text-yellow-300 uppercase">Hall of Fame</p>
          <Table>
            <TableCaption className="text-[10px] tracking-wider">
              <div>
                <p>{`Train daily, lock in and raise throught the ranks.`}</p>
                <p>{`Total number of players: ${totalPlayersInGame}`}</p>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow className="text-center text-xs text-start">
                <TableHead className="px-2 h-8 text-white/90 font-semibold">No #</TableHead>
                <TableHead className="px-2 h-8 text-white/90 font-semibold">Name</TableHead>
                <TableHead className="px-2 h-8 text-white/90 font-semibold">Rank</TableHead>
                <TableHead className="px-2 h-8 text-white/90 font-semibold">Exp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((user, index) => (
                <TableRow key={user.playerName} className={`text-xs text-white/50 tracking-wide ${user.playerName === playerName && "text-white bg-white/10"}`} style={{ borderColor: "#FFFFFF30" }}>
                  <TableCell className={`font-medium p-2 h-10`}>
                    {index + 1}
                  </TableCell>
                  <TableCell className={`font-medium p-2 h-10`}>{user.playerName}</TableCell>
                  <TableCell className={`font-medium p-2 h-10`}>{user.playerRank}</TableCell>
                  <TableCell className={`font-medium p-2 h-10`}>{user.playerExp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <MenuNavigation />

      </div>

    </div>
  );
};

export default RankingPage;