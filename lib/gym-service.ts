/**
 * Gym Service
 * Handles gym-related API calls
 */

import type { GetGymsResponse, Gym } from "@/types/gym";
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

class GymService {
  /**
   * Get a specific gym by ID
   */
  async getGym(gymId: number): Promise<Gym> {
    const response = await apiClient.get<APIResponse<Gym>>(
      `/gyms?id=${gymId}`,
      true,
    );
    return response.data;
  }

  /**
   * Get all gyms
   */
  async getGyms(): Promise<GetGymsResponse> {
    const response = await apiClient.get<APIResponse<GetGymsResponse>>(
      "/gyms",
      true,
    );
    return response.data;
  }
}

export const gymService = new GymService();
