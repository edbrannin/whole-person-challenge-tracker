import Tracker from './Tracker';
import './App.css';
import { CHALLENGE_URL } from './challenge';

function App() {
  return (
    <div className="App">
      <a href={CHALLENGE_URL}>
        <header className="App-header">
          Bandwidth Challenge Tracker
        </header>
      </a>
      <Tracker/>
    </div>
  );
}

export default App;
