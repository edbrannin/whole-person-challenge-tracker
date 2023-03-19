import { useState, useEffect } from 'react';
import useTracker from './useTracker';
import { differenceInCalendarDays, differenceInBusinessDays } from 'date-fns'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import Racetrack from './Racetrack';
import Racer from './Racer';
import Duration from './Duration';

const CHALLENGE_START_DAY = new Date('2023-02-01');
const CHALLENGE_END_DAY = new Date('2023-04-04');
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
  const getBusinessDaysRemaining = () => differenceInBusinessDays(CHALLENGE_END_DAY, new Date());
  const [businessDaysRemaining, setBusinessDaysRemaining] = useState(getBusinessDaysRemaining());
  useEffect(() => {
    const interval = setInterval(
      () => setDaysRemaining(getDaysRemaining()),
      () => setBusinessDaysRemaining(getBusinessDaysRemaining()),
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
            defaultValue={goal}
            onChange={(e) => {
              setGoal(e.target.value);
            }}
          />
          <br />
          (<Duration minutes={goal} />)
        </label>
      </div>
      <div>
        <label>
          Amounts:
          <br/>
          Total: <Duration minutes={totalAmount} />
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
          Mark Buddy Workouts like <tt>45*</tt>
        </label>
      </div>
      <Racetrack>
        <Racer name="You" percent={percentComplete} color={percentComplete > challengePercent ? 'lightblue' : 'pink'}/>
        <Racer name="Challenge" percent={challengePercent} color="lightgray"/>
      </Racetrack>
      <div>
        <p>
          To finish, average {Math.round((goal - totalAmount) / daysRemaining)} minutes per day.
          <br />
          (or {Math.round((goal - totalAmount) / businessDaysRemaining)} minutes per business day)
          <br />
          (or half that, with buddy hours)
        </p>
      </div>
    </div>
  )
}

export default Tracker;