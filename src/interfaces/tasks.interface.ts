export interface Task {
  taskId: string;
  userId: string;
  title: string;
  userWeight: number;
  computerWeight: number;
  isDeferred: boolean;
  repeatFloor: number;
  repeatCeiling: number;
  lastCompletedDate: Date;
  lastDeferredDate: Date;
}
