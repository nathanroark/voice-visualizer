// src/components/Waveform.tsx
import React, { useRef, useEffect } from "react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";
import { GlowCardWrapper } from "./GlowCardWrapper";

const Waveform: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyser = useAudioAnalyzer();

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width;
    const height = canvas.height;

    const drawWaveform = () => {
      analyser.getByteTimeDomainData(dataArray);

      // Clear the canvas
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // Draw the waveform line
      ctx.lineWidth = 2;
      // ctx.strokeStyle = "#0f0";
      // purple tailwind color
      //
      ctx.strokeStyle = `hsl(270.7 91% 65.1%)`;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Normalize (0-255 to ~0-2)
        const y = (v * height) / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      requestAnimationFrame(drawWaveform);
    };

    drawWaveform();
  }, [analyser]);

  return (
    <GlowCardWrapper color="purple">
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        // style={{ background: "#111" }}
      />
    </GlowCardWrapper>
  );
};

export default Waveform;
