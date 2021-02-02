import { TaskDto } from '../src/dtos/tasks.dto';
import { sortTasks } from '../src/utils/util';
import { v4 as uuidv4 } from 'uuid';

describe('Testing util', () => {
  describe('sortTasks', () => {
    it('should return sorted by computedWeight highest to lowest', () => {
      const tasks: TaskDto[] = [];
      /*
        today task with highest userWeight
        deferredTask with computedWeight
        rest of today's tasks
          if a ranged date then return as lower priority
          if lastDeferredDate is today don't return it 
      */
      tasks.push(
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '1',
          userWeight: '.1',
          computedWeight: '.5',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '2',
          userWeight: '.5',
          computedWeight: '.6',
          isDeferred: false,
          repeatFloor: 4,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
      );

      const sortedTasks = sortTasks(tasks);

      expect(sortedTasks[0].computedWeight).toBe('.6');
    });

    it('should return sorted by computedWeight highest to lowest, if tied sub sorted by userWeight highest to lowest', () => {
      const tasks: TaskDto[] = [];

      tasks.push(
        // lowest userWeight
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '1',
          userWeight: '.6',
          computedWeight: '.6',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        // highest userWeight
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '2',
          userWeight: '.7',
          computedWeight: '.6',
          isDeferred: false,
          repeatFloor: 4,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        // middle userWeight
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '3',
          userWeight: '.5',
          computedWeight: '.6',
          isDeferred: false,
          repeatFloor: 4,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        // highest computedWeight
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '4',
          userWeight: '.5',
          computedWeight: '.7',
          isDeferred: false,
          repeatFloor: 4,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
      );

      const sortedTasks = sortTasks(tasks);

      expect(sortedTasks[0].title).toBe('4');
      expect(sortedTasks[1].title).toBe('2');
      expect(sortedTasks[2].title).toBe('1');
      expect(sortedTasks[3].title).toBe('3');
    });

    it('should return sorted by computedWeight highest to lowest; if tied sub sorted by userWeight highest to lowest; if tied sub sorted by smallest delta between floor and ceiling to largest delta', () => {
      const tasks: TaskDto[] = [];

      tasks.push(
        //Ceiling to floor delta == 2
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '1',
          userWeight: '.5',
          computedWeight: '.5',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 4,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        //Ceiling to floor delta == 7
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '2',
          userWeight: '.5',
          computedWeight: '.5',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 9,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        //Ceiling to floor delta == 10
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '3',
          userWeight: '.5',
          computedWeight: '.5',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 12,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        //Ceiling to floor delta == 0
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '4',
          userWeight: '.5',
          computedWeight: '.5',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        // Largest Computed weight
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '5',
          userWeight: '.5',
          computedWeight: '.6',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
        // Largest User weight
        new TaskDto({
          taskId: uuidv4(),
          userId: uuidv4(),
          title: '6',
          userWeight: '.6',
          computedWeight: '.5',
          isDeferred: false,
          repeatFloor: 2,
          repeatCeiling: 2,
          lastDeferredDt: new Date(Date.now()),
          lastCompletedDt: new Date(Date.now()),
        }),
      );

      const sortedTasks = sortTasks(tasks);

      expect(sortedTasks[0].title).toBe('5');
      expect(sortedTasks[1].title).toBe('6');
      expect(sortedTasks[2].title).toBe('4');
      expect(sortedTasks[3].title).toBe('1');
      expect(sortedTasks[4].title).toBe('2');
      expect(sortedTasks[5].title).toBe('3');
    });
  });
});
