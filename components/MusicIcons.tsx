import { useMusic } from "@/context/MusicContext";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import { useRouter } from "next/router";

const MusicIcons = () => {

  const { playMusic, handlePlayMusic, toggleLoop, loopMusic } = useMusic();
  const router = useRouter();
  const isHomepage = router.pathname === "/";

  const buttonCss = "z-20 bg-gradient-to-b from-zinc-800 hover:bg-zinc-700 h-8 w-12 animate active:scale-[90%] text-white flex justify-center items-center rounded";

  return (
    <div className={`flex flex-col gap-2 absolute right-4 ${isHomepage ? "top-4" : "top-12"}`}>
      <button
        onClick={handlePlayMusic}
        className={buttonCss}
      >
        {playMusic ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
      <button
        onClick={toggleLoop}
        className={buttonCss}
      >
        {loopMusic ? <TbRepeatOff /> : <TbRepeat />}
      </button>
    </div>
  );
};

export default MusicIcons;
