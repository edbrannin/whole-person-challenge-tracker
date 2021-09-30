import { useState, useEffect } from 'react';
import useTracker from './useTracker';
import { differenceInCalendarDays } from 'date-fns'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const CHALLENGE_START_DAY = new Date('2021-09-07');
const CHALLENGE_END_DAY = new Date('2021-11-06');
const CHALLENGE_LENGTH_DAYS = differenceInCalendarDays(CHALLENGE_END_DAY, CHALLENGE_START_DAY);

// Update the number of days remaining every hour
const DAYS_LEFT_INTERVAL_MILLIS = 60 * 60 * 1000;

const Tracker = () => {
  const {
    goal, setGoal,
    amountsText, setAmountsText,
    amountsCount,
    totalAmount,
    percentComplete,
  } = useTracker();

  const { width, height } = useWindowSize()

  const getDaysRemaining = () => differenceInCalendarDays(CHALLENGE_END_DAY, new Date());
  const [daysRemaining, setDaysRemaining] = useState(getDaysRemaining());
  useEffect(() => {
    const interval = setInterval(
      () => setDaysRemaining(getDaysRemaining()),
      DAYS_LEFT_INTERVAL_MILLIS,
    )
    return () => clearInterval(interval);
  });

  const challengePercent = Math.round((CHALLENGE_LENGTH_DAYS - daysRemaining) / CHALLENGE_LENGTH_DAYS * 1000) / 10;

  return (
    <div>
      {percentComplete > 100 && (
        <Confetti
          width={width}
          height={height}
        />
      )}
      <h2>
        {percentComplete}% Complete!
      </h2>
      <p>{daysRemaining} days to go!  The challenge is {challengePercent}% complete.</p>
      <div>
        <label>
          Goal:
          <br />
          <input
            type="text"
            defaultValue={goal}
            onChange={(e) => {
              setGoal(e.target.value);
            }}
          />
        </label>
      </div>
      <div>
        <label>
          Amounts:
          <br/>
          Total {totalAmount}
          {amountsCount <= 2 && (
            <div>Add your workout amounts, one day per line</div>
          )}
          <br />
          <textarea
            onChange={(e) => {
              setAmountsText(e.target.value);
            }}
            defaultValue={amountsText}
            rows={amountsText.split('\n').length + 2}
          ></textarea>
          <br />
        </label>
      </div>
    </div>
  )
}

export default Tracker;