export const getWorkoutCounts = (rank: string) => {
  switch(rank) {
    case "E":
      return { pushups: 10, situps: 10, squats: 10, run: 1 };
    case "D":
      return { pushups: 20, situps: 20, squats: 20, run: 2 };
    case "C":
      return { pushups: 40, situps: 40, squats: 40, run: 4 };
    case "B":
      return { pushups: 60, situps: 60, squats: 60, run: 6 };
    case "A":
      return { pushups: 80, situps: 80, squats: 80, run: 8 };
    default:
      return { pushups: 100, situps: 100, squats: 100, run: 10 };
  }
};