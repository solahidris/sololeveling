import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-500 to-gray-800">
      <img
        src="./images/main.png"
        alt="mainimage"
        width={400}
        height={400}
        className="h-full w-full max-w-[200px] rounded-lg drop-shadow-md"
      />
      <Link href="/dashboard" className="mt-4 w-full flex justify-center">
        <Button className="w-full max-w-[200px]">Start</Button>
      </Link>
    </div>
  );
};

export default Home;
