/**
 * Training Session Service
 * Handles training session-related API calls
 */

import type {
  CreateTrainingSessionRequest,
  GetTrainingSessionsResponse,
  TrainingSession,
} from "@/types/training";
import { apiClient } from "./api-client";

interface APIResponse<T> {
  service_name: string;
  version: string;
  environment: string;
  api_name: string;
  request_id: string;
  timestamp: string;
  status: string;
  message: string;
  data: T;
}

class TrainingService {
  /**
   * Create a new training session
   */
  async createTrainingSession(
    sessionData: CreateTrainingSessionRequest,
  ): Promise<TrainingSession> {
    const response = await apiClient.post<APIResponse<TrainingSession>>(
      "/training-sessions",
      sessionData,
      true,
    );
    return response.data;
  }

  /**
   * Get training sessions for the authenticated user with optional date filtering
   */
  async getTrainingSessions(
    startDate?: string,
    endDate?: string,
  ): Promise<GetTrainingSessionsResponse> {
    let endpoint = "/training-sessions";
    const params: string[] = [];

    if (startDate) {
      params.push(`start_date=${encodeURIComponent(startDate)}`);
    }
    if (endDate) {
      params.push(`end_date=${encodeURIComponent(endDate)}`);
    }

    if (params.length > 0) {
      endpoint += `?${params.join("&")}`;
    }

    const response = await apiClient.get<
      APIResponse<GetTrainingSessionsResponse>
    >(endpoint, true);
    return response.data;
  }
}

export const trainingService = new TrainingService();
