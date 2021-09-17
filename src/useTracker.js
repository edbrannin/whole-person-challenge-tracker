import createPersistedState from 'use-persisted-state';

const useGoalState = createPersistedState('goal');
const useAmountsState = createPersistedState('amounts');

const useTracker = () => {
  const [goal, setGoal] = useGoalState(100);
  const [amountsText, setAmountsText] = useAmountsState('');
  
  const amountsNumbers = amountsText.split('\n').map(line => Number(line)).filter(x => x)
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