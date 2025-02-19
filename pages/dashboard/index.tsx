import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = () => {

  const goalWorkoutBoxCss = "flex flex-col bg-white p-2 justify-center items-center drop-shadow-md rounded w-full aspect-square"
  const goalNumberCss = "text-xl font-semibold"
  const goalTextCss = "text-xs"

  const workoutGoals = [
    {number: "100x", text: "Pushup"},
    {number: "100x", text: "Situps"},
    {number: "100x", text: "Squats"},
    {number: "10km", text: "Run"},
  ]

  const runningDistance = [
    {number: "1", text: "km"},
    {number: "2", text: "km"},
    {number: "5", text: "km"},
    {number: "10", text: "km"},
  ]

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-tr from-gray-800 via-gray-500 to-gray-800">
      
      {/* <div className="flex flex-col bg-gray-50 rounded p-4 w-full mb-4">
        <p className="font-semibold text-center mt-2 mb-4">How many km are you comfortable running?</p>
        <div className="flex justify-center gap-2">
          {runningDistance.map((goal,key)=>(
            <button key={key} className={goalWorkoutBoxCss}>
              <p className={goalNumberCss}>{goal.number}</p>
              <p className={goalTextCss}>{goal.text}</p>
            </button>
          ))}
        </div>
      </div>
       */}
      <div className="flex flex-col bg-gray-50 rounded p-4 w-full">
        <p className="font-semibold text-center mt-2 mb-4">Daily Workout Goal</p>
        <div className="flex justify-center gap-2">
          {workoutGoals.map((goal,key)=>(
            <div key={key} className={goalWorkoutBoxCss}>
              <p className={goalNumberCss}>{goal.number}</p>
              <p className={goalTextCss}>{goal.text}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col bg-gray-50 rounded p-4 w-full mt-4">
        <p className="font-semibold text-center mt-2 mb-4">How many km are you comfortable running?</p>
        <div className="flex justify-center gap-2">
          {runningDistance.map((goal,key)=>(
            <button key={key} className={goalWorkoutBoxCss}>
              <p className={goalNumberCss}>{goal.number}</p>
              <p className={goalTextCss}>{goal.text}</p>
            </button>
          ))}
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
        <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold drop-shadow-md">Start Quest</Button>
      </Link>
    </div>
  );
};

export default Dashboard;
