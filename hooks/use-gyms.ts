"use client";

import { useCallback, useEffect, useState } from "react";
import { gymService } from "@/lib/gym-service";
import type { Gym } from "@/types/gym";

interface UseGymsReturn {
  gyms: Gym[];
  isLoading: boolean;
  error: string | null;
  refreshGyms: () => Promise<void>;
}

export function useGyms(): UseGymsReturn {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGyms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await gymService.getGyms();
      setGyms(response.gyms || []);
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : "Failed to fetch gyms",
      );
      setGyms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGyms = useCallback(async () => {
    await fetchGyms();
  }, [fetchGyms]);

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  return {
    gyms,
    isLoading,
    error,
    refreshGyms,
  };
}
