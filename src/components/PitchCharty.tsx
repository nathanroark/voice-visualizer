// src/components/PitchChart.tsx
import React, { useRef, useEffect } from "react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";
import { GlowCardWrapper } from "./GlowCardWrapper";

// A simple autocorrelation function to estimate the pitch in Hz.
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1; // too quiet to detect pitch

  let r1 = 0;
  let r2 = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < 0.2) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < 0.2) {
      r2 = SIZE - i;
      break;
    }
  }
  const trimmed = buffer.slice(r1, r2);
  const newSize = trimmed.length;
  const autocorr = new Array(newSize).fill(0);
  for (let lag = 0; lag < newSize; lag++) {
    let sum = 0;
    for (let i = 0; i < newSize - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }
    autocorr[lag] = sum;
  }
  let d = 0;
  while (d < newSize - 1 && autocorr[d] > autocorr[d + 1]) {
    d++;
  }
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < newSize; i++) {
    if (autocorr[i] > maxval) {
      maxval = autocorr[i];
      maxpos = i;
    }
  }
  if (maxpos <= 0) return -1;
  return sampleRate / maxpos;
}

const PitchChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyser = useAudioAnalyzer();
  const pitchHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    const sampleRate = analyser.context.sampleRate;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Define frequency range for mapping (adjust these as needed)
    const minFreq = 50;
    const maxFreq = 500;
    // Example target pitches (in Hz)
    const targetMasculine = 120; // e.g., desired masculine pitch
    const targetFeminine = 220; // e.g., desired feminine pitch

    // Function to map a frequency value to a Y coordinate on the canvas.
    const mapPitchToY = (freq: number) => {
      const clamped = Math.min(Math.max(freq, minFreq), maxFreq);
      return (
        canvasHeight -
        ((clamped - minFreq) / (maxFreq - minFreq)) * canvasHeight
      );
    };

    const maxHistory = canvasWidth; // one data point per pixel

    const draw = () => {
      analyser.getFloatTimeDomainData(buffer);
      const pitch = autoCorrelate(buffer, sampleRate);
      const pitchValue = pitch > 0 ? pitch : 0; // use 0 if no pitch is detected

      // Update pitch history.
      const history = pitchHistoryRef.current;
      history.push(pitchValue);
      if (history.length > maxHistory) {
        history.shift();
      }

      // Clear canvas.
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw the pitch history as a line chart.
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const x = i;
        const y = mapPitchToY(history[i]);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = "#0f0"; // green line for pitch
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw target pitch lines.
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      const yMasculine = mapPitchToY(targetMasculine);
      ctx.strokeStyle = "#f00"; // red dashed line for masculine target
      ctx.moveTo(0, yMasculine);
      ctx.lineTo(canvasWidth, yMasculine);
      ctx.stroke();

      ctx.beginPath();
      const yFeminine = mapPitchToY(targetFeminine);
      ctx.strokeStyle = "#00f"; // blue dashed line for feminine target
      ctx.moveTo(0, yFeminine);
      ctx.lineTo(canvasWidth, yFeminine);
      ctx.stroke();
      ctx.setLineDash([]);

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser]);

  return (
    <GlowCardWrapper color="purple">
      <canvas ref={canvasRef} width={500} height={300} />
    </GlowCardWrapper>
  );
};

export default PitchChart;
