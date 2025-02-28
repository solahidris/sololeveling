import { Button } from "./ui/button";
import { useMusic } from "@/context/MusicContext";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import { useRouter } from "next/router";

const MusicIcons = () => {

  const { playMusic, handlePlayMusic, toggleLoop, loopMusic } = useMusic();
  const router = useRouter();
  const isHomepage = router.pathname === "/";

  return (
    <div className={`flex flex-col gap-2 absolute ${isHomepage ? "top-4 right-4" : "top-12 right-4"}`}>
      <div
        onClick={handlePlayMusic}
        className="z-20 bg-gradient-to-b from-zinc-800 hover:bg-zinc-700 h-8 w-12 animate active:scale-[90%] text-white flex justify-center items-center rounded"
      >
        {playMusic ? <FaVolumeMute /> : <FaVolumeUp />}
      </div>
      <div
        onClick={toggleLoop}
        className="z-20 bg-gradient-to-b from-zinc-800 hover:bg-zinc-700 h-8 w-12 animate active:scale-[90%] text-white flex justify-center items-center rounded"
      >
        {loopMusic ? <TbRepeatOff /> : <TbRepeat />}
      </div>
    </div>
  );
};

export default MusicIcons;
