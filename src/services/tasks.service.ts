import { TaskDto } from '../dtos/tasks.dto';
import HttpException from '../exceptions/HttpException';
import { Task } from '../interfaces/tasks.interface';
import tasks from '../models/tasks.model';

class TaskService {
  public tasks = tasks;

  public async findTaskById(taskId: string): Promise<Task> {
    const findTask: Task = await this.tasks.findByPk(taskId);
    if (!findTask) throw new HttpException(409, 'Task not Found.');

    return findTask;
  }

  public async createTask(taskData: TaskDto): Promise<Task> {
    const createTaskData: Task = await this.tasks.create({ ...taskData });

    return createTaskData;
  }
}

export default TaskService;
