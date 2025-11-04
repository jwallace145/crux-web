/**
 * Training session-related types based on OpenAPI specification
 */

export type BoulderOutcome = "Fell" | "Flash" | "Onsite" | "Redpoint";
export type RopeClimbType = "TR" | "Lead";
export type RopeClimbOutcome =
  | "Fell"
  | "Hung"
  | "Flash"
  | "Onsite"
  | "Redpoint";

export interface Boulder {
  id: number;
  training_session_id: number;
  grade: string;
  color_tag?: string;
  outcome: BoulderOutcome;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BoulderRequest {
  grade: string;
  color_tag?: string;
  outcome: BoulderOutcome;
  notes?: string;
}

export interface RopeClimb {
  id: number;
  training_session_id: number;
  climb_type: RopeClimbType;
  grade: string;
  outcome: RopeClimbOutcome;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RopeClimbRequest {
  climb_type: RopeClimbType;
  grade: string;
  outcome: RopeClimbOutcome;
  notes?: string;
}

export interface Partner {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface Gym {
  id: number;
  name: string;
  city?: string;
}

export interface TrainingSession {
  id: number;
  user_id: number;
  gym_id: number;
  session_date: string;
  description?: string;
  gym?: Gym;
  partners?: Partner[];
  boulders?: Boulder[];
  rope_climbs?: RopeClimb[];
  total_climbs: number;
  total_sends: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTrainingSessionRequest {
  gym_id: number;
  session_date: string;
  description?: string;
  partner_ids?: number[];
  boulders?: BoulderRequest[];
  rope_climbs?: RopeClimbRequest[];
}

export interface GetTrainingSessionsResponse {
  training_sessions: TrainingSession[];
  count: number;
  start_date?: string;
  end_date?: string;
}
