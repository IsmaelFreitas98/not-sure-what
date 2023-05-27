import './App.css';
import EnergySphere from './components/EnergySphere';

function App() {
  return (
    <div className="App">
      <EnergySphere sizePx={1000} energyRange={200} />
    </div>
  );
}

export default App;
