import { TaskDto } from '../dtos/tasks.dto';

export const isEmptyObject = (obj: any): boolean => {
  return !Object.keys(obj).length;
};

/*
 * The method sorts an array of TaskDtos based on business logic
 * First sort by computedWeight descending
 *    If tied sort by userWeight descending
 *      If tied sort by delta between ceiling and floor ascending
 */
export const sortTasks = (tasks: TaskDto[]): TaskDto[] => {
  return tasks.sort((a, b) =>
    // First sort by computedWeight descending
    parseFloat(b.computedWeight) > parseFloat(a.computedWeight)
      ? 1
      : // If tied sort by userWeight descending
      parseFloat(b.computedWeight) === parseFloat(a.computedWeight)
      ? parseFloat(b.userWeight) > parseFloat(a.userWeight)
        ? 1
        : // If tied sort by delta between ceiling and floor ascending
        parseFloat(b.userWeight) === parseFloat(a.userWeight)
        ? b.repeatCeiling - b.repeatFloor < a.repeatCeiling - b.repeatFloor
          ? 1
          : -1
        : -1
      : -1,
  );
};
