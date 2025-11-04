/**
 * Climb Service
 * Handles climb-related API calls
 */

import type {
  Climb,
  CreateClimbRequest,
  GetClimbsResponse,
} from "@/types/climb";
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

class ClimbService {
  /**
   * Create a new climb
   */
  async createClimb(climbData: CreateClimbRequest): Promise<Climb> {
    const response = await apiClient.post<APIResponse<Climb>>(
      "/climbs",
      climbData,
      true,
    );
    return response.data;
  }

  /**
   * Get climbs for a user with optional date filtering
   */
  async getClimbs(
    userId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<GetClimbsResponse> {
    let endpoint = `/climbs?user_id=${userId}`;
    if (startDate) {
      endpoint += `&start_date=${encodeURIComponent(startDate)}`;
    }
    if (endDate) {
      endpoint += `&end_date=${encodeURIComponent(endDate)}`;
    }

    const response =
      await apiClient.get<APIResponse<GetClimbsResponse>>(endpoint);
    return response.data;
  }
}

export const climbService = new ClimbService();
