export interface NewTask {
  title: string;
  userWeight: number;
  repeatFloor: number;
  repeatCeiling: number;
  deferredUntilDt?: Date;
}

export interface Task extends NewTask {
  taskId?: string;
  userId?: string;

  computedWeight?: number;
  isDeferred: boolean;

  lastCompletedDt: Date;
  lastDeferredDt: Date;
}
