import { ChangeEvent, ReactElement } from "react";
import { TrackingMode, TrackingUnitsForMode, Workout } from "./useTracker";
import classnames from 'classnames/dedupe';

import './WorkoutInput.css';

const inputTypeForWorkout = (name: keyof Workout): React.HTMLInputTypeAttribute => {
  if (name === 'reported' || name === 'isBuddyWorkout') {
    return 'checkbox';
  }
  if (name === 'date') {
    return 'date';
  }
  if (name === 'amount') {
    return 'number';
  }
  return "text";
}

type HandleChangeFunc = (name: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

const FormTextInput = ({
  workout,
  name,
  handleChange,
}: {
  workout: Workout,
  name: keyof Workout,
  handleChange: (name: keyof Workout) => (e: ChangeEvent<HTMLInputElement>) => void,
  trackingMode?: TrackingMode,
}) => (
  <input type={inputTypeForWorkout(name)} name={name} value={String(workout[name])} onChange={handleChange(name)} ></input>
);


const FormCheckboxInput = ({
  workout,
  name,
  handleChange,
}: {
  workout: Workout,
  name: 'reported' | 'isBuddyWorkout',
  handleChange: (name: 'reported' | 'isBuddyWorkout') => (e: ChangeEvent<HTMLInputElement>) => void,
  trackingMode?: TrackingMode,
}) => (
  <input type="checkbox" name={name} checked={Boolean(workout[name])} onChange={handleChange(name)} ></input>
);

const TrackingUnitInput = ({
  workout,
  handleChange,
  trackingMode,
} : {
  workout: Workout,
  handleChange: HandleChangeFunc,
  trackingMode: TrackingMode
}) => (
  <select value={workout.unit} onChange={handleChange('unit')}>
    {TrackingUnitsForMode(trackingMode).map(unit => (
      <option key={unit} value={unit}>{unit}</option>
    ))}
  </select>
)

const WorkoutInput = ({
  workout,
  onChange,
  onDelete,
  trackingMode,
}: {
  workout: Workout,
  onChange: (w: Workout) => void,
  onDelete: () => void,
  trackingMode: TrackingMode,
}) => {
  const handleChange: HandleChangeFunc = (name: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('handleChange', name, e.target.value)
    onChange({
      ...workout,
      [name]: e.target.value,
    })
  };

  const handleChangeCheckbox = (name: 'isBuddyWorkout' | 'reported') => (e: ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange', name, e.target.value === 'on')
    onChange({
      ...workout,
      [name]: !Boolean(workout[name]),
    })
  };

  const className = classnames('workoutInput', {
    reported: workout.reported,
    buddy: workout.isBuddyWorkout,
  })

  return (
    <tr className={className}>
      <td>
        <FormTextInput workout={workout} handleChange={handleChange} name="date" />
      </td>
      <td><FormTextInput workout={workout} handleChange={handleChange} name="activity" /></td>
      <td><FormTextInput workout={workout} handleChange={handleChange} name="amount" /></td>
      <td><TrackingUnitInput workout={workout} handleChange={handleChange} trackingMode={trackingMode} /></td>
      <td><FormCheckboxInput workout={workout} handleChange={handleChangeCheckbox} name="isBuddyWorkout" /></td>
      <td><FormCheckboxInput workout={workout} handleChange={handleChangeCheckbox} name="reported" /></td>
      <td><button onClick={() => onDelete()}>Remove</button></td>
    </tr>
  );
}

export default WorkoutInput;
