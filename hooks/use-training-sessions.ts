"use client";

import { useCallback, useEffect, useState } from "react";
import { trainingService } from "@/lib/training-service";
import type {
  CreateTrainingSessionRequest,
  TrainingSession,
} from "@/types/training";

interface UseTrainingSessionsReturn {
  sessions: TrainingSession[];
  isLoading: boolean;
  error: string | null;
  createSession: (sessionData: CreateTrainingSessionRequest) => Promise<void>;
  refreshSessions: () => Promise<void>;
}

export function useTrainingSessions(): UseTrainingSessionsReturn {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await trainingService.getTrainingSessions();
      setSessions(response.training_sessions || []);
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : "Failed to fetch training sessions",
      );
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSession = useCallback(
    async (sessionData: CreateTrainingSessionRequest) => {
      try {
        setError(null);
        await trainingService.createTrainingSession(sessionData);
        // Refresh sessions after creating
        await fetchSessions();
      } catch (err) {
        const errorMessage =
          err && typeof err === "object" && "message" in err
            ? (err.message as string)
            : "Failed to create training session";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [fetchSessions],
  );

  const refreshSessions = useCallback(async () => {
    await fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    isLoading,
    error,
    createSession,
    refreshSessions,
  };
}
