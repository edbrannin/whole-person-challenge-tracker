import createPersistedState from 'use-persisted-state';

const useGoalState = createPersistedState('goal');
const useWorkoutsState = createPersistedState('workouts');
const useTrackingMode = createPersistedState('tracking-mode');

export type Workout = {
  date?: string
  amount: number
  activity?: string
  isBuddyWorkout: boolean
}

const useTracker = () => {
  const [goal, setGoal] = useGoalState(100) as [number, (goal: number) => void];
  const [workouts, setWorkouts] = useWorkoutsState([]) as [Workout[], (workouts: Workout[]) => void];
  const [trackingMode, setTrackingMode] = useTrackingMode('hours') as [string, (newValue: string) => void]

  const setTrackingModeHours = () => setTrackingMode('hours');
  const setTrackingModeMiles = () => setTrackingMode('miles');

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
  
  const amountsNumbers = workouts.map(({ amount, isBuddyWorkout }) => isBuddyWorkout ? amount * 2: amount);
  const amountsCount = workouts.length;
  const totalAmount = amountsNumbers.reduce((a, b) => a + b, 0);
  const percentComplete = Math.round(totalAmount / goal * 1000) / 10;

  return {
    goal, setGoal,
    trackingMode, setTrackingModeHours, setTrackingModeMiles,
    workouts, setWorkouts,
    addWorkout, removeWorkout, changeWorkout,
    amountsCount,
    totalAmount,
    percentComplete,
  };
};

export default useTracker;