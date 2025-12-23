export enum GoalStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Goal {
  id: string
  userId: string
  title: string
  description?: string
  year: number
  status: GoalStatus
  created_at: string
  updated_at: string
}

export interface GoalPayload {
  title: string
  description?: string
  year: number
  status: GoalStatus
}

export interface UpdateGoalPayload {
  title?: string
  description?: string
  year?: number
  status?: GoalStatus
}
