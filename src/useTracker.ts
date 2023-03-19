import createPersistedState from 'use-persisted-state';

const useGoalState = createPersistedState('goal');
const useAmountsState = createPersistedState('amounts');

export const hoursBelowValue = (valueString, maxHours = 100) => {
  const value = Number(valueString);
  if (value > maxHours) {
    return value;
  }
  return value * 60;
}

const LINE_REGEX = /(\d+)(\*)?/;
export const parseLine = (line) => {
  if (!line) {
    return 0;
  }
  const [, number, buddy] = LINE_REGEX.exec(line);
  if (buddy) {
    return Number(number) * 2;
  }
  return Number(number);
}

const minutesAboveValue = (valueString, minMinutes = 25) => hoursBelowValue(valueString, minMinutes);

const useTracker = () => {
  const [goal, setRawGoal] = useGoalState(100);
  const setGoal = (x) => setRawGoal(hoursBelowValue(x));
  const [amountsText, setAmountsText] = useAmountsState('');
  
  const amountsNumbers = amountsText.split('\n').filter(x => x).map(line => parseLine(line)).filter(x => x).map(x => minutesAboveValue(x))
  const amountsCount = amountsNumbers.length;
  const totalAmount = amountsNumbers.reduce((a, b) => a + b, 0);
  const percentComplete = Math.round(totalAmount / goal * 1000) / 10;



  return {
    goal, setGoal,
    amountsText, setAmountsText,
    amountsCount,
    totalAmount,
    percentComplete,
  };
};

export default useTracker;