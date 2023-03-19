import { Workout } from "./useTracker";

const NOPE: Workout = {
  amount: 0,
  isBuddyWorkout: false,
}

const LINE_REGEX = /(\d+)(\*)?/;
export const parseLine = (line: string): Workout => {
  if (!line) {
    return NOPE;
  }
  const match = LINE_REGEX.exec(line);
  if (!match) {
    return NOPE;
  }
  const number = match[1];
  const isBuddyWorkout = match[2] === '*';
  return {
    amount: Number(number),
    isBuddyWorkout,
  };
}

const WorkoutInput = ({
  workouts,
  setWorkouts,
  // addWorkout,
  // removeWorkout,
  // changeWorkout,
  // trackingMode,
}: {

  workouts: Workout[],
  setWorkouts: (items: Workout[]) => void,
  // addWorkout: (newWorkout: Workout) => void,
  // removeWorkout,
  // changeWorkout,
  // trackingMode,
}) => {
  const parseWorkouts = (text: string): Workout[] => text.split('\n').map(parseLine);
  return (
    <textarea
      onChange={(e) => {
        setWorkouts(parseWorkouts(e.target.value))
      }}
      defaultValue={workouts.map(({ amount, isBuddyWorkout }) => `${amount}${isBuddyWorkout ? '*' : ''}`).join('\n')}
      rows={workouts.length + 2}
    ></textarea>
  )
}

export default WorkoutInput;
