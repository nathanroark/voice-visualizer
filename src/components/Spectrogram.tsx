// src/components/Spectrogram.tsx
import React, { useRef, useEffect } from "react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";
import { GlowCardWrapper } from "./GlowCardWrapper";

const Spectrogram: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyser = useAudioAnalyzer();

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width;
    const height = canvas.height;

    const drawSpectrogram = () => {
      analyser.getByteFrequencyData(dataArray);

      // Shift the existing image one pixel to the left for a scrolling effect.
      const imageData = ctx.getImageData(1, 0, width - 1, height);
      ctx.putImageData(imageData, 0, 0);
      // Clear the rightmost column with black to maintain the black background.
      ctx.fillRect(width - 1, 0, 1, height);

      // Draw the latest column with a green tint.
      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const y = height - Math.floor((height * i) / bufferLength);
        // Map value 0-255 to a lightness between 15% and 85%.
        const lightness = (value / 255) * 70;
        ctx.fillStyle = `hsl(142.1, 70.6%, ${lightness}%)`;
        ctx.fillRect(width - 1, y, 1, 1);
      }

      requestAnimationFrame(drawSpectrogram);
    };

    drawSpectrogram();
  }, [analyser]);

  return (
    <GlowCardWrapper color="green">
      <canvas ref={canvasRef} width={500} height={300} />
    </GlowCardWrapper>
  );
};

export default Spectrogram;
