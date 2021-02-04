export interface Task {
  taskId?: string;
  userId?: string;
  title: string;
  userWeight: number;
  computedWeight?: number;
  isDeferred: boolean;
  repeatFloor: number;
  repeatCeiling: number;
  lastCompletedDt: Date;
  lastDeferredDt: Date;
  deferredUntilDt?: Date;
}
