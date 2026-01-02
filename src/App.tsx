import Spectrogram from "./components/Spectrogram";
import FrequencyBars from "./components/FrequencyBars";
import Waveform from "./components/Waveform";
import PitchChart from "./components/PitchChart";
import { GitHubIcon } from "./components/icons";

function App() {
  const repoUrl = "https://github.com/nathanroark/voice-visualizer";
  return (
    <div className="min-h-screen  bg-background flex">
      <div className="flex justify-center m-auto lg:flex-row flex-col py-16 lg:py-0">
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
      {/* GitHub Icon in the bottom right corner */}
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 hover:opacity-80 transition-opacity "
      >
        <GitHubIcon className="size-9" />
      </a>
    </div>
  );
}

export default App;
