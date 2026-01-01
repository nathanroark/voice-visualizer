import { useQuery } from "@tanstack/react-query";
import type { Entity, Position } from "./subscriptions";

export const usePositionQuery = () => {
  const { isPending, error, data, isFetching } = useQuery<Position[]>({
    queryKey: ["positions"],
    queryFn: async () => [] as Position[],
    staleTime: Infinity,
  });

  return { isPending, error, data, isFetching };
};

export const useEntityQuery = () => {
  const { isPending, error, data, isFetching } = useQuery<Entity[]>({
    queryKey: ["entities"],
    queryFn: async () => [] as Entity[],
    staleTime: Infinity,
  });

  return { isPending, error, data, isFetching };
};
