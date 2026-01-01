// src/hooks/useContainerSize.ts
import { useState, useEffect, useRef } from "react";

export function useContainerSize<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return { containerRef, size };
}
