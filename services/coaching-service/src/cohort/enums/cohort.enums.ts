export enum MentoringType {
  ONE_TO_ONE = 1,
  GROUP = 2,
}

export enum CohortStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  STARTED = 2,
  COMPLETED = 3,
}

export enum CreationStatus {
  MANUAL = 1,
  AUTOMATED = 2,
}

export enum CohortType {
  COACHING = 1,
  MENTORING = 2,
}

export enum AssignCoachType {
  EXTERNAL = 0,
  INTERNAL = 1,
}

export enum SearchOption {
  OFFLINE_MATCHES = 0, // was SEMI_AUTOMATED
  AUTOMATIC_THROUGH_ALGORITHM = 1, // was FULLY_AUTOMATED
} 