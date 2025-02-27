
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import LoginUser from "@/components/LoginUser";


const SamplePage = () => {

  const [playMusic, setPlayMusic] = useState(false);
  const [playGame, setPlayGame] = useState<boolean | null>(null); // Initialize as null, can be boolean later
  const { playerName, setPlayerName } = usePlayer(); // Use the context
  const { playerRank, setPlayerRank } = usePlayer(); // Use the context
  const [seePlayerGoal, setSeePlayerGoal] = useState(false);
  const [playerInitialKM, setPlayerInitialKM] = useState(0);
  const [seePlayerIntroDashboard, setSeePlayerIntroDashboard] = useState(false);
  const [seePlayerSignUp, setSeePlayerSignUp] = useState(false);

  const handlePlayMusic = () => {
    if (playMusic) {
      console.log("music already played");
    } else {
      setPlayMusic(true);
      console.log("set play music true:: ", !playMusic);
      const audio = new Audio("./audio/dark_aria.mp3");
      audio.play();
    }
  }

  useEffect(() => {
    if (playerInitialKM < 8) {
      setPlayerRank("E")
    } else {
      setPlayerRank("D")
    }
  // },[playerInitialKM])
  },[playerInitialKM, setPlayerRank])

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] bg-gradient-to-tr from-gray-800 via-gray-500 to-gray-800 bg-opacity-[10%]">
      <img
        src="./images/main_new.png"
        alt="mainimage"
        width={400}
        height={400}
        className="h-full w-full max-w-[200px] rounded-lg drop-shadow-md -mt-20"
      />

        {/* Ad Placement Example */}
        {/* <div id="ezoic-pub-ad-placeholder-101"></div>
        <script>
          {`
            ezstandalone.cmd.push(function() {
              ezstandalone.showAds(101);
            });
          `}
        </script>
        <div id="ezoic-pub-ad-placeholder-102"></div>
        <script>
          {`
            ezstandalone.cmd.push(function() {
              ezstandalone.showAds(102);
            });
          `}
        </script>
        <div id="ezoic-pub-ad-placeholder-103"></div>
        <script>
          {`
            ezstandalone.cmd.push(function() {
              ezstandalone.showAds(103);
            });
          `}
        </script> */}

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handlePlayMusic} className="w-full max-w-[200px] mt-4 font-bold">Start New Quest</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] lg:max-w-md rounded-lg bg-black text-white p-4">
            <DialogHeader>
              <DialogTitle className="py-4 text-center">
                {((playGame === null || playGame === true) && seePlayerIntroDashboard === false) && " New Player"}
                {seePlayerIntroDashboard && !seePlayerSignUp && "Initialization Complete"}
              </DialogTitle>
              <DialogDescription className="text-white/80 mt-8">
              {playGame === null ? (
                <div className="text-center">
                  You have acquired the qualifications to be a <span className="font-bold text-white">Player</span>. Your fitness goals will die in the abyss if you choose not to accept. <span className="font-bold text-white">Will you accept?</span>
                </div>
              ) : playGame === true ? (
                <div>
                  {!seePlayerGoal ? (
                    <div className="flex flex-col gap-4">
                      <p className="text-center">To proceed, please enter your name to begin your journey. Note that this action is irreversible.</p>
                      <div className="flex flex-col items-center gap-4 py-4">
                        <Label htmlFor="name" className="self-start -mb-3">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" placeholder="Sung Jinwoo" className="col-span-3" onChange={(e)=>{setPlayerName(e.target.value)}} />
                      </div>
                      <Button onClick={()=>setSeePlayerGoal(true)} disabled={playerName.length < 3} className="disabled:bg-gray-800 bg-blue-700 hover:bg-blue-800 font-bold">Save</Button>
                    </div>
                  ) : ( 
                    !seePlayerIntroDashboard ? (
                      <div className="flex flex-col gap-4">
                        <p className="text-center">Set your starting level:<br/>How many kilometers can you comfortably run?</p>
                        <div className="flex justify-center items-center">
                          <div className="flex flex-col justify-center items-center gap-1 bg-zinc-900 p-4 aspect-square rounded-lg min-w-[108.6px]">
                            <span className="font-bold text-5xl">{playerInitialKM}</span>
                            <span className="text-xs font-medium">km</span>
                          </div>
                        </div>
                        <Input type="range" min="0" max="10" step="1" value={playerInitialKM} onChange={(e)=>setPlayerInitialKM(Number(e.target.value))}/>
                        <Button onClick={()=>{setSeePlayerIntroDashboard(true)}} disabled={playerInitialKM === 0} className="disabled:bg-gray-800 bg-blue-700 hover:bg-blue-800 font-bold">Save</Button>
                      </div>
                    ) : ( 
                      !seePlayerSignUp ? (
                        <div className="flex flex-col gap-4">
                          <p className="text-center">Your profile is ready. Begin your daily quests and rise through the ranks. Your starting rank is:</p>
                          <div className="flex justify-center items-center rotate-45 py-4">
                            <span className="bg-zinc-800 w-12 h-12 flex justify-center items-center"><span className="-rotate-45 font-bold text-xl capitalize">{playerRank}</span></span>
                          </div>
                          <p className="text-red-500 text-xs text-center">Note that if you miss a day,<br/>you will receive a severe penalty.</p>
                          <Button onClick={()=>setSeePlayerSignUp(true)} className="disabled:bg-gray-800 bg-blue-700 hover:bg-blue-800 font-bold mt-4 w-full">Sign Up Profile</Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <LoginUser isSignUp={true} playerName={playerName} playerRank={playerRank} />
                        </div>
                      )
                    )
                  )}
                </div>
              ) : (
                <div className="pb-8 flex flex-col gap-4">
                  <p className="font-bold text-4xl">GAME OVER</p>
                  <span className="text-xs">There are no redos in life.<br/> You have been eliminated by the system.</span>
                </div>
              )}
              </DialogDescription>
            </DialogHeader>
            {playGame === null &&
              <div className="grid grid-cols-2 gap-4 py-4">
                  <Button onClick={()=>setPlayGame(true)} className="bg-blue-700 hover:bg-blue-800 font-bold">Yes</Button>
                  <Button onClick={()=>setPlayGame(false)} className="bg-red-700 hover:bg-red-800 font-bold">No</Button>
              </div>
            }
          </DialogContent>
        </Dialog>
          <p className="text-white/70 font-semibold text-xs tracking-widest py-1.5">or</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handlePlayMusic} className="w-full max-w-[200px] font-bold">Login</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] lg:max-w-md rounded-lg bg-black text-white p-4">
              <LoginUser isSignUp={false} />
          </DialogContent>
        </Dialog>

    </div>
  );
};

export default SamplePage;
