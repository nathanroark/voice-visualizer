// src/components/PitchChart.tsx
import React, { useRef, useEffect } from "react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";
import { GlowCardWrapper } from "./GlowCardWrapper";

// Updated autocorrelation function that only considers lags for frequencies between 50 and 500 Hz.
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1; // too quiet to detect pitch

  // Define our expected frequency range
  const minFreq = 50;
  const maxFreq = 500;
  const minLag = Math.floor(sampleRate / maxFreq); // highest frequency → shortest lag
  const maxLag = Math.floor(sampleRate / minFreq); // lowest frequency → longest lag

  let bestCorrelation = 0;
  let bestLag = -1;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let correlation = 0;
    for (let i = 0; i < SIZE - lag; i++) {
      correlation += buffer[i] * buffer[i + lag];
    }
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }
  if (bestLag === -1) return -1;
  return sampleRate / bestLag;
}

const PitchChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyser = useAudioAnalyzer();
  const pitchHistoryRef = useRef<number[]>([]);
  // We'll store the most recent smoothed pitch to blend with new values.
  const previousSmoothedRef = useRef<number>(0);

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

    // Expected frequency range and target values for visualization.
    const minFreq = 50;
    const maxFreq = 500;
    const targetMasculine = 120;
    const targetFeminine = 220;

    // Define vocal pitch ranges for shading.
    const maleRangeLower = 85;
    const maleRangeUpper = 155;
    const femaleRangeLower = 165;
    const femaleRangeUpper = 255;

    // Smoothing factor for exponential smoothing (0 = no smoothing, 1 = full new value)
    const smoothingFactor = 0.1;

    // Map a frequency value to a Y coordinate on the canvas.
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
      const rawPitch = autoCorrelate(buffer, sampleRate);

      // Filter out values outside the human voice range.
      const currentPitch =
        rawPitch > minFreq && rawPitch < maxFreq
          ? rawPitch
          : previousSmoothedRef.current;

      // Apply exponential smoothing.
      const previousSmoothed = previousSmoothedRef.current;
      const smoothedPitch =
        previousSmoothed === 0
          ? currentPitch
          : previousSmoothed * (1 - smoothingFactor) +
            currentPitch * smoothingFactor;
      previousSmoothedRef.current = smoothedPitch;

      // Update pitch history.
      const history = pitchHistoryRef.current;
      history.push(smoothedPitch);
      if (history.length > maxHistory) {
        history.shift();
      }

      // Clear canvas with a dark background.
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw shaded areas for vocal pitch ranges.
      // Male range shading: light blue translucent.
      const yMaleUpper = mapPitchToY(maleRangeUpper); // higher pitch boundary (top)
      const yMaleLower = mapPitchToY(maleRangeLower); // lower pitch boundary (bottom)
      ctx.fillStyle = "rgba(90, 170, 255, 0.2)"; // adjust opacity as desired
      ctx.fillRect(0, yMaleUpper, canvasWidth, yMaleLower - yMaleUpper);

      // Female range shading: light pink translucent.
      const yFemaleUpper = mapPitchToY(femaleRangeUpper);
      const yFemaleLower = mapPitchToY(femaleRangeLower);
      ctx.fillStyle = "rgba(255, 192, 219, 0.2)";
      ctx.fillRect(0, yFemaleUpper, canvasWidth, yFemaleLower - yFemaleUpper);

      // Draw the pitch history as a line chart.
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const x = i;
        const y = mapPitchToY(history[i] * (4 / 7));
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw target pitch lines.
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      const yMasculine = mapPitchToY(targetMasculine);
      ctx.strokeStyle = "#5aaaff"; // masculine target line color
      ctx.moveTo(0, yMasculine);
      ctx.lineTo(canvasWidth, yMasculine);
      ctx.stroke();

      ctx.beginPath();
      const yFeminine = mapPitchToY(targetFeminine);
      ctx.strokeStyle = "#ffc0db"; // feminine target line color
      ctx.moveTo(0, yFeminine);
      ctx.lineTo(canvasWidth, yFeminine);
      ctx.stroke();
      ctx.setLineDash([]);

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser]);

  return (
    <GlowCardWrapper color="neutral">
      <canvas ref={canvasRef} width={600} height={800} />
    </GlowCardWrapper>
  );
};

export default PitchChart;
