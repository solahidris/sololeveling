import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = () => {

  const goalWorkoutBoxCss = "flex flex-col bg-white"

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-500 to-gray-800">
      <div className="flex flex-col">
        <p>Daily Workout Goal</p>
        <div className="flex gap-2">
          <div className={goalWorkoutBoxCss}>
            <p>100x</p>
            <p>Pushup</p>
          </div>
          <div className={goalWorkoutBoxCss}>
            <p>100x</p>
            <p>Situps</p>
          </div>
          <div className={goalWorkoutBoxCss}>
            <p>100x</p>
            <p>Squats</p>
          </div>
          <div className={goalWorkoutBoxCss}>
            <p>10km</p>
            <p>Run</p>
          </div>
        </div>
      </div>
      {/* <img
        src="./images/main.png"
        alt="mainimage"
        width={400}
        height={400}
        className="h-full w-full max-w-[200px] rounded-lg drop-shadow-md"
      /> */}
      <Link href="/dashboard" className="mt-4 w-full flex justify-center">
        <Button className="w-full max-w-[200px]">Start</Button>
      </Link>
    </div>
  );
};

export default Dashboard;
