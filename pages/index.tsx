// import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


const Home = () => {

  // const [playGame, setPlayGame] = useState(null); // im planning to make this a boolean. but i want the initial value to be null. how?
  const [playMusic, setPlayMusic] = useState(false);
  const [playGame, setPlayGame] = useState<boolean | null>(null); // Initialize as null, can be boolean later
  const [playerName, setPlayerName] = useState("");
  const [seePlayerGoal, setSeePlayerGoal] = useState(false);

  const handlePlayMusic = () => {
    setPlayMusic(true);
    console.log("music played:", !playMusic);
    const audio = new Audio("./audio/dark_aria.mp3");
    audio.play();
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-500 to-gray-800 bg-opacity-[10%]">
      <img
        src="./images/main.png"
        alt="mainimage"
        width={400}
        height={400}
        className="h-full w-full max-w-[200px] rounded-lg drop-shadow-md"
      />

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handlePlayMusic}className="w-full max-w-[200px] mt-4 font-bold">Start Quest</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] lg:max-w-md rounded-lg bg-black text-white p-4">
            <DialogHeader>
              <DialogTitle className="py-4">{(playGame === null || playGame === true) && " New Player"}</DialogTitle>
              <DialogDescription className="text-white/80 mt-8">
              {playGame === null ? (
                <div>
                  You have acquired the qualifications to be a <span className="font-bold text-white">Player</span>. Your fitness goals will die in the abyss if you choose not to accept. <span className="font-bold text-white">Will you accept?</span>
                </div>
              ) : playGame === true ? (
                <div>
                  {!seePlayerGoal ? (
                    <div className="flex flex-col gap-4">
                      <p>To proceed, please enter your name to begin your journey. Note that this action is irreversible.</p>
                      <div className="flex flex-col items-center gap-4 py-4">
                        <Label htmlFor="name" className="self-start -mb-3">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" placeholder="Sung Jinwoo" className="col-span-3" onChange={(e)=>{setPlayerName(e.target.value)}} />
                      </div>
                      <Button onClick={()=>setSeePlayerGoal(true)} disabled={!playerName} className="disabled:bg-gray-800 bg-blue-600 hover:bg-blue-700 font-bold">Save</Button>
                    </div>
                  ) : ( 
                    <div className="flex flex-col gap-4">
                      <p>To proceed, please enter your name to begin your journey. Note that this action is irreversible.</p>
                      <div className="flex flex-col items-center gap-4 py-4">
                        <Label htmlFor="name" className="self-start -mb-3">
                          Goal <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" placeholder="Sung Jinwoo" className="col-span-3" onChange={(e)=>{setPlayerName(e.target.value)}} />
                      </div>
                      <Button onClick={()=>setSeePlayerGoal(true)} disabled={!playerName} className="disabled:bg-gray-800 bg-blue-600 hover:bg-blue-700 font-bold">Save</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="font-bold text-4xl pb-8">GAME OVER</div>
              )}
              </DialogDescription>
            </DialogHeader>
            {playGame === null &&
              <div className="grid grid-cols-2 gap-4 py-4">
                  <Button onClick={()=>setPlayGame(true)} className="bg-blue-600 hover:bg-blue-700 font-bold">Yes</Button>
                  <Button onClick={()=>setPlayGame(false)} className="bg-red-600 hover:bg-red-700 font-bold">No</Button>
              </div>
            }
            {/* <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div> */}
            {/* <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      {/* </Link> */}
    </div>
  );
};

export default Home;
