/**
 * Climb-related types
 */

export type ClimbType = "indoor" | "outdoor";

export interface Climb {
  id: number;
  user_id: number;
  climb_type: ClimbType;
  climb_date: string;
  grade: string;
  style?: string;
  route_id?: number;
  gym_id?: number;
  completed: boolean;
  attempts: number;
  falls: number;
  rating?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClimbRequest {
  climb_type: ClimbType;
  climb_date: string;
  grade: string;
  route_id?: number;
  gym_id?: number;
  style?: string;
  completed?: boolean;
  attempts?: number;
  falls?: number;
  rating?: number;
  notes?: string;
}

export interface GetClimbsResponse {
  climbs: Climb[];
  count: number;
  user_id: number;
  start_date?: string;
  end_date?: string;
}
