// src/hooks/useAudioAnalyzer.ts
import { useState, useEffect } from "react";

export const useAudioAnalyzer = (): AnalyserNode | null => {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        // Request microphone access (HTTPS or localhost required)
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioContext = new AudioContext();
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048; // Adjust for resolution as needed

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyserNode);

        setAnalyser(analyserNode);
      } catch (error) {
        console.error("Error initializing audio analyzer:", error);
      }
    };

    initAudio();
  }, []);

  return analyser;
};
