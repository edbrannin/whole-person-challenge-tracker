import { useState, useEffect, useRef } from 'react';
import useTracker, { TrackingUnit } from './useTracker';
import { differenceInCalendarDays, differenceInBusinessDays } from 'date-fns'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import Racetrack from './Racetrack';
import Racer from './Racer';
import TrackingAmount from './TrackingAmount';
import WorkoutsInput from './WorkoutsInput';
import UnitPicker from './UnitPicker';
import SettingsButton from './SettingsButton';
import { CHALLENGE_END_DAY, CHALLENGE_LENGTH_DAYS } from './challenge';

// Update the number of days remaining every hour
const DAYS_LEFT_INTERVAL_MILLIS = 60 * 60 * 1000;

const Tracker = () => {
  const {
    goal, setGoal,
    goalUnit, setGoalUnit,
    workouts,
    addWorkout, removeWorkout, changeWorkout,
    trackingMode,
    setTrackingModeTime, setTrackingModeDistance,
    // amountsCount,
    goalAmount, totalAmount,
    percentComplete,
    exportSettings, importSettings,
  } = useTracker();

  const goalRef = useRef<HTMLInputElement>(null);

  const { width, height } = useWindowSize()

  const getDaysRemaining = () => differenceInCalendarDays(CHALLENGE_END_DAY, new Date());
  const [daysRemaining, setDaysRemaining] = useState(getDaysRemaining());
  const getBusinessDaysRemaining = () => differenceInBusinessDays(CHALLENGE_END_DAY, new Date());
  const [businessDaysRemaining, setBusinessDaysRemaining] = useState(getBusinessDaysRemaining());
  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(getDaysRemaining())
      setBusinessDaysRemaining(getBusinessDaysRemaining())
    }, DAYS_LEFT_INTERVAL_MILLIS);
    return () => clearInterval(interval);
  });

  const challengePercent = Math.round((CHALLENGE_LENGTH_DAYS - daysRemaining) / CHALLENGE_LENGTH_DAYS * 1000) / 10;

  const setTrackingUnit = (newUnit: TrackingUnit) => {
    setGoalUnit(newUnit);
    if (newUnit === 'minutes' || newUnit === 'hours') {
      setTrackingModeTime();
    } else if (newUnit === 'miles' || newUnit === 'kilometers') {
      setTrackingModeDistance();
    }
  }

  const updateGoal = (inputText: string) => {
    const amount = Number(inputText);
    if (!Number.isNaN(amount)) {
      setGoal(amount);
    }
  }

  useEffect(() => {
    if (goalUnit === 'minutes' || goalUnit === 'hours') {
      setTrackingModeTime();
    } else if (goalUnit === 'miles' || goalUnit === 'kilometers') {
      setTrackingModeDistance();
    }
  }, [goalUnit, setTrackingModeTime, setTrackingModeDistance]);

  const winner = percentComplete >= 100;

  return (
    <div>
      {winner && (
        <Confetti
          width={width}
          height={height}
        />
      )}
      <SettingsButton onExportSettings={exportSettings} onImportSettings={importSettings} />
      <h2>
        {percentComplete}% Complete!
      </h2>
      <p>
        {daysRemaining} days to go!  The challenge is {challengePercent}% complete.
        <br/>
        (That's {businessDaysRemaining} business days)
      </p>
      <div>
        <label>
          Goal:
          <br />
          <input
            type="text"
            ref={goalRef}
            value={goal}
            onChange={(e) => updateGoal(e.target.value)}
          />
          <UnitPicker onChange={setTrackingUnit} />
          <br />
          (<TrackingAmount amount={goal} unit={goalUnit} />)
        </label>
      </div>
      <div>
          <h3>
            Workouts
          </h3>
          <div>
            Total: <TrackingAmount amount={totalAmount} unit={'minutes'} />
          </div>
          <br />
          <WorkoutsInput
            workouts={workouts}
            addWorkout={() => addWorkout(undefined)}
            removeWorkout={removeWorkout}
            changeWorkout={changeWorkout}
            trackingMode={trackingMode}
          />
      </div>
      <Racetrack>
        <Racer name="You" percent={percentComplete} color={`color-mix(in srgb, red ${100 - percentComplete}%, lightblue ${percentComplete}%)`} />
        <Racer name="Challenge" percent={challengePercent} color="lightgray" />
      </Racetrack>
      {winner ? (
        <h1>A winner is you!</h1>
      ) : (
        <div>
          <p>
            To finish, average {Math.round((goalAmount - totalAmount) / daysRemaining)} minutes per day.
            <br />
            (or {Math.round((goalAmount - totalAmount) / businessDaysRemaining)} minutes per business day)
            <br />
            (or half that, with buddy hours)
          </p>
        </div>
      )}
    </div>
  )
}

export default Tracker;
