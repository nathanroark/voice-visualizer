// src/components/FrequencyBars.tsx
import React, { useRef, useEffect } from "react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";
import { GlowCardWrapper } from "./GlowCardWrapper";

const FrequencyBars: React.FC = () => {
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

    const drawBars = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // Draw each frequency bar
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        // ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        // blue tailwind color
        ctx.fillStyle = `hsl(198.6 88.7% 48.4%)`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      requestAnimationFrame(drawBars);
    };

    drawBars();
  }, [analyser]);

  return (
    <GlowCardWrapper color="sky">
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        // style={{ background: "#222" }}
      />
    </GlowCardWrapper>
  );
};

export default FrequencyBars;
