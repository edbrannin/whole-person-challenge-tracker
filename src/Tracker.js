import useTracker from './useTracker';

const Tracker = () => {
  const {
    goal, setGoal,
    amountsText, setAmountsText,
    amountsCount,
    totalAmount,
    percentComplete,
  } = useTracker();

  return (
    <div>
      <h2>
        {percentComplete}% Complete!
      </h2>
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
          Amounts: Total {totalAmount}
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