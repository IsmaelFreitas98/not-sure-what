import './App.css';
import EnergySphere from './components/EnergySphere';

function App() {
  return (
    <div className="App">
      <EnergySphere heightPer={100} widthPer={100} energyRange={200} />
    </div>
  );
}

export default App;
