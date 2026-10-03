export type ExerciseType = 'isometric' | 'reps';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  target_sets: number;
  target_reps?: number;
  hold_seconds?: number;
  weight_kg?: number;
  rest_seconds: number;
  equipment: string;
  cue: string;
}

export interface Workout {
  id?: string;
  day_number: number;
  title: string;
  focus: string;
  description: string;
  is_rest: boolean;
  exercises: Exercise[];
}

export interface SetLog {
  set_number: number;
  completed: boolean;
  actual_reps?: number;
  actual_seconds?: number;
  weight_kg?: number;
  rpe?: number; // 1-10
}

export interface ExerciseSessionLog {
  exercise_id: string;
  exercise_name: string;
  sets: SetLog[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  workout_id: number;
  athlete_name: string;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  notes: string;
  logs: ExerciseSessionLog[];
  coach_verdict?: string;
  coach_recommendations?: CoachRecommendations;
  total_duration_seconds: number;
}

export interface CoachRecommendations {
  technique_cues: string[];
  next_session_adjustments: {
    exercise: string;
    action: string;
    target_metric: string;
  }[];
  recovery_advice: string;
  rating_score: number; // 1-10
}

export interface ProgressPhoto {
  id: string;
  athlete_name: string;
  photo_url: string;
  storage_path: string;
  pose: 'front' | 'side' | 'back' | 'handstand' | 'planche' | 'front_lever' | 'other';
  weight_kg: number;
  taken_at: string;
  notes?: string;
  created_at: string;
}

export interface AthleteProfile {
  name: string;
  height_cm: number;
  weight_kg: number;
  body_type: string;
  level: string;
  equipment: string[];
  key_goals: {
    skill: string;
    status: string;
    focus_points: string[];
  }[];
}
