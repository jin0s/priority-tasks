export interface Task {
  taskId?: string;
  userId?: string;
  title: string;
  userWeight: number | string;
  computedWeight?: number | string;
  isDeferred: boolean;
  repeatFloor: number;
  repeatCeiling: number;
  lastCompletedDt: Date;
  lastDeferredDt: Date;
}
