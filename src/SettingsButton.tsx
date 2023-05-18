import { useState } from "react";
import "./SettingsButton.css";

const SettingsButton = ({
  onExportSettings,
  onImportSettings,
}: {
  onExportSettings: () => string,
  onImportSettings: (newSettings: string) => void,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const handleImport = () => {
    try {
      const newSettings = prompt("Paste the settings JSON here:");
      if (newSettings) {
        onImportSettings(newSettings);
      }
    } catch (err) {
      console.error("Error importing settings:", err);
    }
  };
  const handleExport = () => {
    navigator.clipboard.writeText(onExportSettings())
    setShowCheckmark(true);
    setTimeout(() => setShowCheckmark(false), 3000)
  }
  return (
    <>
      <a className="showSettingsButton" onClick={() => setShowSettings(!showSettings)}>⚙️</a>
      {showSettings && (
        <div>
          <button onClick={handleImport}>Import Settings</button>
          <button onClick={handleExport}>Export Settings {showCheckmark && '(Copied ✅)'}</button>
        </div>
      )}
    </>
  );
};

export default SettingsButton;
