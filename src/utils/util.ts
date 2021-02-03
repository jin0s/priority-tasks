import { Task } from '../interfaces/tasks.interface';

export const isEmptyObject = (obj: any): boolean => {
  return !Object.keys(obj).length;
};

/*
 * The method sorts an array of TaskDtos based on business logic
 * First sort by computedWeight descending
 *    If tied sort by userWeight descending
 *      If tied sort by delta between ceiling and floor ascending
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) =>
    // First sort by computedWeight descending
    b.computedWeight  > a.computedWeight
      ? 1
      : // If tied sort by userWeight descending
      b.computedWeight === a.computedWeight
      ? b.userWeight > a.userWeight
        ? 1
        : // If tied sort by delta between ceiling and floor ascending
        b.userWeight === a.userWeight
        ? b.repeatCeiling - b.repeatFloor < a.repeatCeiling - b.repeatFloor
          ? 1
          : -1
        : -1
      : -1,
  );
};
