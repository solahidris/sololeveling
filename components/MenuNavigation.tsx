import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { FaRegStar } from "react-icons/fa6";

const MenuNavigation = () => {
  return (
    <div className="fixed bottom-0 h-12 grid grid-cols-2 w-full text-xs tracking-wide font-medium shadow-[0_-15px_15px_rgba(0,0,0,0.10)] lg:shadow-md shadow-zinc-700/30">
      <Link
        href="/ranking"
        className="bg-gradient-to-t from-zinc-900 via-zinc-900 to-zinc-800 font-bold uppercase w-full flex justify-center items-center border-r border-white/5 gap-1"
      >
        <FaRegStar />
        <p>Ranking</p>
      </Link>
      <Link
        href="/profile"
        className="bg-gradient-to-t from-zinc-900 via-zinc-900 to-zinc-800 font-bold uppercase w-full flex justify-center items-center border-r border-white/5 gap-1"
      >
        <CgProfile />
        <p>Profile</p>
      </Link>
    </div>
  );
};

export default MenuNavigation;