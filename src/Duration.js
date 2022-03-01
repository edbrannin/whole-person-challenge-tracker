const Duration = ({ minutes }) => (
  <span>
    {Math.round(minutes * 100) / 100} minutes, or {Math.round(minutes * 10) / 600} hours
  </span>
);

export default Duration;
