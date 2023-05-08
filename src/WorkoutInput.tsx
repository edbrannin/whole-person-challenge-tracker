import { ChangeEvent, ReactElement } from "react";
import { TrackingMode, TrackingUnitsForMode, Workout } from "./useTracker";

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

const InputWrapper = ({
  name,
  children
}: {
  name: string,
  children: ReactElement
}) => (
  <div className="WorkoutInput-LabelInput">
    <label htmlFor={name}>
      <div>{name}</div>
      <div>{children}</div>
    </label>
  </div>
)

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
  <InputWrapper name={name}>
    <input type={inputTypeForWorkout(name)} name={name} value={String(workout[name])} onChange={handleChange(name)} ></input>
  </InputWrapper>
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
  <InputWrapper name={name}>
    <input type="checkbox" name={name} checked={Boolean(workout[name])} onChange={handleChange(name)} ></input>
  </InputWrapper>
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
  <InputWrapper name="unit">
    <select value={workout.unit} onChange={handleChange('unit')}>
      {TrackingUnitsForMode(trackingMode).map(unit => (
        <option key={unit} value={unit}>{unit}</option>
      ))}
    </select>
  </InputWrapper>
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


  return (
    <div className="WorkoutInput">
      <FormTextInput workout={workout} handleChange={handleChange} name="date" />
      <FormTextInput workout={workout} handleChange={handleChange} name="activity" />
      <FormTextInput workout={workout} handleChange={handleChange} name="amount" />
      <TrackingUnitInput workout={workout} handleChange={handleChange} trackingMode={trackingMode} />
      <FormCheckboxInput workout={workout} handleChange={handleChangeCheckbox} name="isBuddyWorkout" />
      <FormCheckboxInput workout={workout} handleChange={handleChangeCheckbox} name="reported" />
      <button onClick={() => onDelete()}>Remove</button>
    </div>
  );
}

export default WorkoutInput;
