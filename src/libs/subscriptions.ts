import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export type Entity = {
  id: string;
  [key: string]: unknown;
};

export type Position = {
  id: string;
  user: string;
  room: string;
  coordianates: {
    x: number;
    y: number;
  };
};

// Type guard to check if data has an "id"
function isValidEntity(obj: unknown): obj is Entity {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "id" in obj &&
    typeof obj.id === "string"
  );
}

// Type guard to check if data is a Position type
function isPositionData(obj: unknown): obj is Position {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "id" in obj &&
    typeof obj.id === "string" &&
    "coordianates" in obj &&
    obj.coordianates !== null &&
    typeof obj.coordianates === "object" &&
    "x" in obj.coordianates &&
    typeof obj.coordianates.x === "number" &&
    "y" in obj.coordianates &&
    typeof obj.coordianates.y === "number"
  );
}

export const useWebsocketSubscription = () => {
  const queryClient = useQueryClient();
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // const websocket = new WebSocket("wss://echo.websocket.org/");
    const websocket = new WebSocket("ws://localhost:3000/pos");

    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (isPositionData(data)) {
          queryClient.setQueryData<Position[]>(
            ["positions"],
            (oldData = []) => {
              const exists = oldData.some(
                (position) => position.id === data.id
              );
              return exists
                ? oldData.map((p) => (p.id === data.id ? { ...p, ...data } : p))
                : [...oldData, data];
            }
          );
        } else if (isValidEntity(data)) {
          queryClient.setQueryData<Entity[]>(["entities"], (oldData = []) => {
            const exists = oldData.some((entity) => entity.id === data.id);
            return exists
              ? oldData.map((e) => (e.id === data.id ? { ...e, ...data } : e))
              : [data, ...oldData];
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    return () => {
      websocket.close();
    };
  }, [queryClient]);

  // Function to send a message
  const sendMessage = (message: unknown) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open yet!");
    }
  };

  return { sendMessage };
};
