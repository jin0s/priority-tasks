import HttpException from '../exceptions/HttpException';
import tasksModel from '../models/tasks.model';
import { Task } from '../interfaces/tasks.interface';
import sequelize from '../models/index.model';
import { QueryTypes } from 'sequelize';
import { isToday } from 'date-fns';
import { computeWeightOnDefer, sortTasks } from '../utils/util';

class TaskService {
  public tasks = tasksModel;

  public async createTask(userUUID, taskData: Task): Promise<Task> {
    const createTaskData: Task = await this.tasks.create({ ...taskData, userId: userUUID });

    return createTaskData;
  }

  public async findAllTasks(userUUID: string): Promise<Task[]> {
    const tasks: Task[] = await this.tasks.findAll({ where: { userId: userUUID, deletedAt: null }, raw: true });
    return tasks;
  }

  public async findNextTasks(userUUID: string): Promise<any> {
    const tasks: Task[] = await sequelize.query(
      'select * from public.tasks where "userId" = :userId and "deletedAt" IS NULL and (date_trunc(\'day\', "lastCompletedDt") + "repeatFloor" * INTERVAL \'1 day\' <= date_trunc(\'day\',CURRENT_DATE- INTERVAL \'8 hour\') OR ("computedWeight" > "userWeight"))',
      { replacements: { userId: userUUID }, type: QueryTypes.SELECT },
    );

    const filteredTasks = tasks.filter(function (task) {
      // Filter if task was deferred today
      const passedFilter: boolean = !isToday(task.lastDeferredDt) && new Date() >= task.deferredUntilDt;
      // Filter out a task until the deferredUntilDt
      return passedFilter;
    });

    const sortedTasks = sortTasks(filteredTasks);

    return sortedTasks;
  }

  public async findTaskById(taskId: string): Promise<Task> {
    const findTask: Task = await this.tasks.findByPk(taskId);
    if (!findTask) throw new HttpException(409, 'Task not Found.');
    return findTask;
  }

  public async findTaskByUserAndId(userId: string, taskId: string): Promise<Task> {
    const findTask: Task = await this.tasks.findOne({ where: { taskId: taskId, userId: userId } });
    if (!findTask) throw new HttpException(409, 'Task not Found.');
    return findTask;
  }

  public async deleteTaskById(userId: string, taskId: string): Promise<Task> {
    const deletedTask: Task = await this.tasks.destroy({ where: { taskId: taskId, userId: userId } });
    if (!deletedTask) throw new HttpException(409, 'Task did not exist');

    return deletedTask;
  }

  public async updateTask(userUUID: string, taskId: string, taskData: Task): Promise<Task> {
    // const title = taskData.title;
    // const userWeight = taskData.userWeight;
    // const computerWeight = taskData.computerWeight;
    // const isDeferred = taskData.isDeferred;
    // const repeatFloor = taskData.repeatFloor;
    // const repeatCeiling = taskData.repeatCeiling;
    // const lastCompletedDate = taskData.lastCompletedDate;
    // const lastDeferredDate = taskData.lastDeferredDate;

    const updatedTask: Task = await this.tasks.update({ ...taskData }, { where: { taskId: taskId, userId: userUUID }, returning: true });
    if (!updatedTask) throw new HttpException(409, 'Task did not exist to update');
    return updatedTask;
  }

  /**
   * When user hits this service the task's
   *  1. update computed weight to user weight + calculation business logic
   *  2. update last defered date to today
   *  3. set isDefered to true
   */
  public async deferTask(userId: string, taskId: string, deferredUntilDt?: Date): Promise<Task> {
    const task: Task = await this.findTaskByUserAndId(userId, taskId);
    if (!task) throw new HttpException(409, 'Task did not exist to defer');

    let updateValues;
    if (deferredUntilDt !== undefined) {
      updateValues = {
        deferredUntilDt: deferredUntilDt,
        isDeferred: true,
      };
    } else {
      updateValues = {
        computedWeight: computeWeightOnDefer(task.computedWeight),
        isDeferred: true,
        lastDeferredDt: new Date().toISOString(),
      };
    }

    const queryOptions = {
      where: { taskId: task.taskId, userId: task.userId },
      returning: true,
    };

    const deferredTask: Task = await this.tasks.update(updateValues, queryOptions);
    return deferredTask;
  }

  /**
   * When user hits this service the task's
   *  1. update computed weight to user weight
   *  2. update last completed date to today
   *  3. set isDefered to false
   */
  public async completeTask(userId: string, taskId: string): Promise<Task> {
    const task: Task = await this.findTaskByUserAndId(userId, taskId);
    if (!task) throw new HttpException(409, 'Task did not exist to complete');
    const deferredTask: Task = await this.tasks.update(
      {
        computedWeight: task.userWeight,
        isDeferred: false,
        lastCompletedDt: new Date().toISOString(),
      },
      {
        where: { taskId: task.taskId, userId: task.userId },
        returning: true,
      },
    );

    return deferredTask;
  }
}

export default TaskService;
