import { useMemo } from 'react';
import createPersistedState from 'use-persisted-state';

const useGoalState = createPersistedState('goal');
const useGoalUnitState = createPersistedState('goal-unit');
const useWorkoutsState = createPersistedState('workouts');
const useTrackingMode = createPersistedState('tracking-mode');

export const goalMultipliers : Record<TrackingUnit, number> = {
  hours: 60,
  minutes: 1,
  miles: 1,
  kilometers: 0.621371,
}

export type TrackingUnit = "hours" | "minutes" | "miles" | "kilometers";

export type Workout = {
  date?: string
  amount: number
  unit?: TrackingUnit
  activity?: string
  isBuddyWorkout: boolean
  reported: boolean
}

export const makeWorkout = ({
  date, amount, unit, activity, isBuddyWorkout, reported
}: {
    date?: string,
    amount: number,
    unit?: TrackingUnit,
    activity?: string,
    isBuddyWorkout?: boolean,
    reported?: boolean,
}): Workout => ({
  date, amount, unit, activity,
  isBuddyWorkout: !!isBuddyWorkout,
  reported: !!reported,
})

export const calculateAmount = (amount: number, unit?: TrackingUnit) => {
  const multiplier = unit ? goalMultipliers[unit] : 1;
  return amount * multiplier;
}

const calculateWorkoutAmount = ({ amount, unit, isBuddyWorkout }: Workout) => {
  console.log('Workout:', amount, unit, isBuddyWorkout);
  const buddyBonus = isBuddyWorkout ? 2 : 1;
  return calculateAmount(amount, unit) * buddyBonus;
}

type StateHook<T> = [T, (val: T) => void];

const useTracker = () => {
  const [goal, setGoal] = useGoalState(100) as StateHook<number>;
  const [goalUnit, setGoalUnit] = useGoalUnitState('hours') as StateHook<TrackingUnit>;
  const [workouts, setWorkouts] = useWorkoutsState([]) as StateHook<Workout[]>;
  const [trackingMode, setTrackingMode] = useTrackingMode('time') as StateHook<string>;

  const setTrackingModeTime = () => setTrackingMode('time');
  const setTrackingModeDistance = () => setTrackingMode('distance');

  const addWorkout = (newWorkout: Workout) => setWorkouts([...workouts, newWorkout]) // TODO Sort by date
  const changeWorkout = (newWorkout: Workout, index: number) => setWorkouts([
    ...workouts.slice(0, index),
    newWorkout,
    ...workouts.slice(index),
  ]);
  const removeWorkout = (index: number) => setWorkouts([
    ...workouts.slice(0, index),
    ...workouts.slice(index),
  ]);

  const goalAmount = useMemo(() => calculateAmount(goal, goalUnit), [goal, goalUnit]);
  console.log('goalAmount', goalAmount, goal, goalUnit)
  
  const amountsNumbers = workouts.map((w) => calculateWorkoutAmount(w));
  console.log('goalAmount', goalAmount, goal, goalUnit)

  const amountsCount = workouts.length;
  const totalAmount = amountsNumbers.reduce((a, b) => a + b, 0);
  const percentComplete = Math.round(totalAmount / goalAmount * 1000) / 10;

  return {
    goal, setGoal,
    goalUnit, setGoalUnit,
    trackingMode, setTrackingModeTime, setTrackingModeDistance,
    workouts, setWorkouts,
    addWorkout, removeWorkout, changeWorkout,
    amountsCount,
    goalAmount, totalAmount,
    percentComplete,
  };
};

export default useTracker;