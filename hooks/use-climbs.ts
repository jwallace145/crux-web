"use client";

import { useCallback, useEffect, useState } from "react";
import { climbService } from "@/lib/climb-service";
import type { Climb, CreateClimbRequest } from "@/types/climb";

interface UseClimbsReturn {
  climbs: Climb[];
  isLoading: boolean;
  error: string | null;
  createClimb: (climbData: CreateClimbRequest) => Promise<void>;
  refreshClimbs: () => Promise<void>;
}

export function useClimbs(userId: number | undefined): UseClimbsReturn {
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClimbs = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await climbService.getClimbs(userId);
      setClimbs(response.climbs || []);
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : "Failed to fetch climbs",
      );
      setClimbs([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createClimb = useCallback(
    async (climbData: CreateClimbRequest) => {
      try {
        setError(null);
        await climbService.createClimb(climbData);
        // Refresh climbs after creating
        await fetchClimbs();
      } catch (err) {
        const errorMessage =
          err && typeof err === "object" && "message" in err
            ? (err.message as string)
            : "Failed to create climb";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [fetchClimbs],
  );

  const refreshClimbs = useCallback(async () => {
    await fetchClimbs();
  }, [fetchClimbs]);

  useEffect(() => {
    fetchClimbs();
  }, [fetchClimbs]);

  return {
    climbs,
    isLoading,
    error,
    createClimb,
    refreshClimbs,
  };
}
