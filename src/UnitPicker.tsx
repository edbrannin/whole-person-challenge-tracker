import { useRef } from "react";
import { TrackingUnit } from "./useTracker";

const DEFAULT_UNIT = {
  time: "hours",
  distance: "miles",
}

const UnitPicker = ({
  onChange,
  trackingMode,
}: {
  onChange: (newValue: TrackingUnit) => void
  trackingMode?: "time" | "distance"
}) => {
  const goalTypeRef = useRef<HTMLSelectElement>(null);
  const reportChange = () => {
    const value = goalTypeRef.current?.value;
    if (value) {
      onChange(goalTypeRef.current?.value as TrackingUnit);
    }
  };

  return (
    <div style={{
      display: 'inline-block',
    }}>
      <select ref={goalTypeRef} onChange={reportChange} defaultValue={DEFAULT_UNIT[trackingMode || 'time']}>
        {(trackingMode === undefined || trackingMode === 'time') && (
          <>
            <option value="hours" onChange={() => reportChange()}>Hours</option>
            <option value="minutes" onChange={() => reportChange()}>Minutes</option>
          </>
        )}
        {(trackingMode === undefined || trackingMode === 'distance') && (
          <>
            <option value="miles" onChange={() => reportChange()}>Miles</option>
            <option value="kilometers" onChange={() => reportChange()}>KM</option>
          </>
        )}
      </select>
    </div>
  )
};

export default UnitPicker;
