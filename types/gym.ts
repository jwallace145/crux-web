/**
 * Gym-related types based on OpenAPI specification
 */

export type GymType = "bouldering" | "roped" | "full";

export interface Gym {
  id: number;
  name: string;
  description?: string;
  type: GymType;
  address?: string;
  city: string;
  state?: string;
  province?: string;
  country: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  has_bouldering?: boolean;
  has_top_rope?: boolean;
  has_lead_climbing?: boolean;
  has_auto_belay?: boolean;
  has_kids_area?: boolean;
  has_training_area?: boolean;
  has_yoga_classes?: boolean;
  has_shower?: boolean;
  has_parking?: boolean;
  has_gear_rental?: boolean;
  has_pro_shop?: boolean;
  has_cafe?: boolean;
  wall_height?: number;
  square_feet?: number;
  day_pass_price?: number;
  monthly_price?: number;
  yearly_price?: number;
  gear_rental_price?: number;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetGymsResponse {
  gyms: Gym[];
  count: number;
}
