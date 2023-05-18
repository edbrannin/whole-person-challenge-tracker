import { useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
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
export type TrackingMode = "time" | "distance";

export const TrackingUnitsForMode = (mode: TrackingMode): TrackingUnit[] => {
  if (mode === 'time') {
    return ['hours', 'minutes'];
  } else if (mode === 'distance') {
    return ['miles', 'kilometers'];
  }
  throw new Error(`Invalid TrackingMode: ${mode}`);
}

export type Workout = {
  date?: string
  amount: number
  unit?: TrackingUnit
  activity?: string
  isBuddyWorkout: boolean
  reported: boolean
  id: number
}

export type WorkoutExport = {
  goal: number,
  goalUnit: TrackingUnit,
  workouts: Workout[],
  trackingMode: TrackingMode,
}

export const makeWorkout = ({
  date, amount, unit, activity, isBuddyWorkout, reported, id
}: {
    date?: string,
    amount: number,
    unit?: TrackingUnit,
    activity?: string,
    isBuddyWorkout?: boolean,
    reported?: boolean,
    id: number,
}): Workout => ({
  date, amount, unit, activity, id,
  isBuddyWorkout: !!isBuddyWorkout,
  reported: !!reported,
})

export const calculateAmount = (amount: number, unit?: TrackingUnit) => {
  const multiplier = unit ? goalMultipliers[unit] : 1;
  return amount * multiplier;
}

const calculateWorkoutAmount = ({ amount, unit, isBuddyWorkout }: Workout) => {
  const buddyBonus = isBuddyWorkout ? 2 : 1;
  return calculateAmount(amount, unit) * buddyBonus;
}

type StateHook<T> = [T, (val: T) => void];

export type AddWorkoutFunc = (workout?: Workout) => void;
export type ChangeWorkoutFunc = (workout: Workout, id: number) => void;
export type RemoveWorkoutFunc = (id: number) => void;

const getTodayDateString = () => {
  const offset = new Date().getTimezoneOffset()
  const result = new Date(new Date().getTime() - (offset*60*1000))
  return result.toISOString().split('T')[0]
}

const useTracker = () => {
  const [goal, setGoal] = useGoalState(100) as StateHook<number>;
  const [goalUnit, setGoalUnit] = useGoalUnitState('hours') as StateHook<TrackingUnit>;
  const [workouts, setWorkouts] = useWorkoutsState([]) as StateHook<Workout[]>;
  const [trackingMode, setTrackingMode] = useTrackingMode('time') as StateHook<TrackingMode>;
  const [nextId, setNextId] = useState(() => workouts.map((w, i) => w.id || i + 1).reduce((max: number, id: number) => max > id ? max : id, 0) + 1)
  const getAndIncrementNextId = () => {
    const result = nextId;
    setNextId(result + 1);
    return result;
  }

  const setTrackingModeTime = () => setTrackingMode('time');
  const setTrackingModeDistance = () => setTrackingMode('distance');

  const addWorkout = (newWorkout?: Workout) => setWorkouts([
    ...workouts,
    makeWorkout({
      ...(newWorkout || {}),
      activity: newWorkout?.activity || '',
      date: newWorkout?.date || getTodayDateString(),
      amount: newWorkout?.amount || 0,
      unit: newWorkout?.unit || trackingMode === 'time' ? 'minutes' : 'hours',
      id: getAndIncrementNextId(),
    }),
  ]);

  // TODO Sort by date
  const changeWorkout: ChangeWorkoutFunc = (newWorkout: Workout, id: number) => setWorkouts(workouts.map(w => {
    if (w.id === id) {
      return newWorkout;
    }
    return w;
  }));
  const removeWorkout = (id: number) => setWorkouts(workouts.filter(w => w.id !== id));

  useEffectOnce(() => {
    // Update workouts to all have IDs, if needed
    if (workouts.filter(w => w.id === undefined).length > 0) {
      setWorkouts(workouts.map(w => ({
        ...w,
        id: w.id || getAndIncrementNextId(),
      })))
    }
  })

  const goalAmount = useMemo(() => calculateAmount(goal, goalUnit), [goal, goalUnit]);
  const amountsNumbers = workouts.map((w) => calculateWorkoutAmount(w));

  const amountsCount = workouts.length;
  const totalAmount = amountsNumbers.reduce((a, b) => a + b, 0);
  const percentComplete = Math.round(totalAmount / goalAmount * 1000) / 10;

  const exportSettings = () => JSON.stringify({
    goal,
    goalUnit,
    workouts,
    trackingMode,
  });

  const importSettings = (exportedSettings: string) => {
    const parsedSettings = JSON.parse(exportedSettings);
    const WORKOUT_KEYS: (keyof WorkoutExport)[] = ["goal", "goalUnit", "workouts", "trackingMode"];
    WORKOUT_KEYS.forEach(key => {
      if (!parsedSettings[key]) {
        console.error(`Loaded settings should contain ${key} but does not`, parsedSettings[key], parsedSettings);
        throw new Error(`Loaded settings should contain ${key} but does not`);
      }
    })
    const { goal, goalUnit, workouts, trackingMode } = parsedSettings;
    setGoal(goal);
    setGoalUnit(goalUnit);
    setWorkouts(workouts);
    setTrackingMode(trackingMode);
  };


  return {
    goal, setGoal,
    goalUnit, setGoalUnit,
    trackingMode, setTrackingModeTime, setTrackingModeDistance,
    workouts, setWorkouts,
    addWorkout, removeWorkout, changeWorkout,
    amountsCount,
    goalAmount, totalAmount,
    percentComplete,
    exportSettings, importSettings,
  };
};

export default useTracker;
