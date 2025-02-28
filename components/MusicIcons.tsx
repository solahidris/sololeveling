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
    <div className={`flex flex-col gap-2 absolute right-2 ${isHomepage ? "top-2" : "top-8"}`}>
      <Button
        onClick={handlePlayMusic}
        className="bg-gradient-to-b from-zinc-800 hover:bg-zinc-700 h-8 animate active:scale-[90%]"
      >
        {playMusic ? <FaVolumeMute /> : <FaVolumeUp />}
      </Button>
      <Button
        onClick={toggleLoop}
        className="bg-gradient-to-b from-zinc-800 hover:bg-zinc-700 h-8 animate active:scale-[90%]"
      >
        {loopMusic ? <TbRepeatOff /> : <TbRepeat />}
      </Button>
    </div>
  );
};

export default MusicIcons;
