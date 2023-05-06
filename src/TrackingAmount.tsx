import { calculateAmount, TrackingUnit } from "./useTracker";

const TrackingAmount = ({
  amount, unit = "hours"
}: {
  amount: number, unit: TrackingUnit
}) => {
  if (unit === "hours" || unit === "minutes") {
    const minutes = calculateAmount(amount, unit);
    return (
      <span>
        {Math.round(minutes * 10) / 600} hours, or {Math.round(minutes * 100) / 100} minutes
      </span>
    )
  }
  const miles = calculateAmount(amount, unit);
  return (
    <span>
        {Math.round(miles * 10) / 10} miles
    </span>
  )
}

export default TrackingAmount;
