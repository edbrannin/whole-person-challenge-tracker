import { makeWorkout, TrackingUnit, Workout } from "./useTracker";

const NOPE: Workout = {
  amount: 0,
  isBuddyWorkout: false,
  reported: false,
}

const unitFromRaw = (label: string) : TrackingUnit => {
  if (label.startsWith("h")) {
    return 'hours';
  }
  return 'minutes';
}

const LINE_REGEX = /([0-9.]+)([hm]?)(\*)?/;
export const parseLine = (line: string): Workout => {
  if (!line) {
    return NOPE;
  }
  const match = LINE_REGEX.exec(line);
  if (!match) {
    return NOPE;
  }
  const number = match[1];
  const rawUnit = match[2];
  const unit = unitFromRaw(rawUnit);
  const isBuddyWorkout = match[3] === '*';
  return makeWorkout({
    amount: Number(number),
    unit,
    isBuddyWorkout,
  });
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
    <>
      {workouts.length <= 2 && (
        <div>Add your workout amounts, one day per line</div>
      )}
      <textarea
        onChange={(e) => {
          setWorkouts(parseWorkouts(e.target.value))
        }}
        defaultValue={workouts.map(({ amount, unit, isBuddyWorkout }) => `${amount}${unit ? unit.slice(0, 1) : ''}${isBuddyWorkout ? '*' : ''}`).join('\n')}
        rows={workouts.length + 2}
      ></textarea>
      <br />
      Mark Buddy Workouts like <span style={{
        fontFamily: 'monospace',
      }}>45*</span>
    </>
  )
}

export default WorkoutInput;
