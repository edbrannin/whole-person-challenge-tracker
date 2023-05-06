import WorkoutInput from "./WorkoutInput";
import { AddWorkoutFunc, ChangeWorkoutFunc, RemoveWorkoutFunc, TrackingMode, Workout } from "./useTracker";
import './WorkoutsInput.css';

const WorkoutsInput = ({
  workouts,
  addWorkout,
  removeWorkout,
  changeWorkout,
  trackingMode,
}: {
  workouts: Workout[],
  addWorkout: AddWorkoutFunc,
  removeWorkout: RemoveWorkoutFunc,
  changeWorkout: ChangeWorkoutFunc,
  trackingMode: TrackingMode,
}) => {
  return (
    <div className="WorkoutsInput">
      {workouts.filter(w => w).map(workout => (
        <WorkoutInput
          key={workout.id}
          onChange={(newValue: Workout) => changeWorkout(newValue, workout.id)}
          onDelete={() => removeWorkout(workout.id)}
          workout={workout}
          trackingMode={trackingMode}
        />
      ))}
      <button onClick={() => addWorkout()}>Add Workout</button>
    </div>
  )
}


export default WorkoutsInput;
