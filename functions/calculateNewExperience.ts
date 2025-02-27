import { WorkoutLog } from "@/context/PlayerContext";

// Helper function to calculate new experience
export const calculateNewExperience = (logs: WorkoutLog[]) => {
  return parseFloat((logs.length * Math.PI * 100).toFixed(0));
};
