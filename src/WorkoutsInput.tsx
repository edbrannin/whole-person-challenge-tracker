import WorkoutInput from "./WorkoutInput";
import { AddWorkoutFunc, ChangeWorkoutFunc, RemoveWorkoutFunc, TrackingMode, Workout } from "./useTracker";
import './WorkoutsInput.css';
import { useState } from "react";

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
  const [showReported, setShowReported] = useState(true);

  return (
    <div className="WorkoutsInput">
      <div>
        <label>
          <input type="checkbox" name="showReported" checked={showReported} onChange={() => setShowReported(!showReported)} />
          {' '}
          Show Reported
        </label>
      </div>
      <table>
        <thead>
          <tr>
          <th>Date</th>
          <th>Activity</th>
          <th>Amount</th>
          <th>Unit</th>
          <th>Buddy?</th>
          <th>Reported?</th>
          </tr>
        </thead>
        <tbody>
          {workouts.filter(w => w).filter(w => showReported || !w.reported).map(workout => (
            <WorkoutInput
              key={workout.id}
              onChange={(newValue: Workout) => changeWorkout(newValue, workout.id)}
              onDelete={() => removeWorkout(workout.id)}
              workout={workout}
              trackingMode={trackingMode}
            />
          ))}
        </tbody>
      </table>
      <button onClick={() => addWorkout()}>Add Workout</button>
    </div>
  )
}


export default WorkoutsInput;
