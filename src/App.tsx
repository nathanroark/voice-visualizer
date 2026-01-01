import Spectrogram from "./components/Spectrogram";
import FrequencyBars from "./components/FrequencyBars";
import Waveform from "./components/Waveform";
import PitchChart from "./components/PitchChart";

function App() {
  return (
    <div className="flex justify-center min-h-screen m-auto lg:flex-row flex-col py-16 lg:py-0 bg-background">
      <div className="m-auto gap-4 flex lg:flex-row flex-col">
        <div className="flex flex-col gap-4">
          <FrequencyBars />
          <Spectrogram />
        </div>
        <div className="flex flex-col gap-4">
          <Waveform />
          <PitchChart />
        </div>
      </div>
    </div>
  );
}

export default App;
