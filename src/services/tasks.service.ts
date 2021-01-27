import { TaskDto } from '../dtos/tasks.dto';
import HttpException from '../exceptions/HttpException';
import tasksModel from '../models/tasks.model';
import { Task } from '../interfaces/tasks.interface';
import sequelize from '../models/index.model';
import { QueryTypes } from 'sequelize';

// import QueryTypes from ''
class TaskService {
  public tasks = tasksModel;

  public async createTask(userUUID, taskData: TaskDto): Promise<Task> {
    const createTaskData: Task = await this.tasks.create({ ...taskData, userId: userUUID });

    return createTaskData;
  }

  public async findAllTasks(userUUID: string): Promise<Task[]> {
    const tasks: Task[] = await this.tasks.findAll({ where: { userId: userUUID, deletedAt: null }, raw: true });
    return tasks;
  }

  public async findNextTasks(userUUID: string): Promise<any> {
    console.log('id is: ' + userUUID);
    const tasks: Task[] = await sequelize.query(
      'select * from public.tasks where "userId" = :userId and "deletedAt" IS NULL and (date_trunc(\'day\', "lastCompletedDt") + "repeatFloor" * INTERVAL \'1 day\' = date_trunc(\'day\',CURRENT_DATE- INTERVAL \'8 hour\') OR ("computedWeight" > "userWeight"))',
      { replacements: { userId: userUUID }, type: QueryTypes.SELECT },
    );

    return tasks;
  }

  public async findTaskById(taskId: string): Promise<Task> {
    const findTask: Task = await this.tasks.findByPk(taskId);
    // if (!findTask) throw new HttpException(409, 'Task not Found.');

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
    if (!updatedTask) throw new HttpException(409, 'Task did not exist');
    return updatedTask;
  }
}

export default TaskService;
