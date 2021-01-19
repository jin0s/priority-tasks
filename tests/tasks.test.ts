import request from 'supertest';
import App from '../src/app';
import { Task } from '../src/interfaces/tasks.interface';
import taskModel from '../src/models/tasks.model';
import TaskRoute from '../src/routes/tasks.route';
import { TaskDto } from '../src/dtos/tasks.dto';
import AuthRoute from '../src/routes/auth.route';
import { UserDto } from '../src/dtos/users.dto';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /tasks', () => {
    it('response statusCode 200 / findAll', async() => {
      const authRoute = new AuthRoute();
      const taskRoute = new TaskRoute();
      const app = new App([authRoute, taskRoute]);
      const agent = request.agent(app.getServer());
      const userData : UserDto = {
        email: "example@gmail.com",
        password: "qwer1234"
      };
      const findTasks: Task[] = await taskModel.findAll({where: {userId: "e5eaa83c-f9f2-41e2-9132-8966b1fed584"}, raw: true});
      const response = await agent.post(`${authRoute.path}/login`).send(userData); 
      return agent.get(`${taskRoute.path}`).expect(200);
    });
  });

  describe('[GET] /tasks/:id', () => {
    it('response statusCode 200 / findOne', async () => {
      const taskId ='1d100f42-aa2a-4892-9896-a936b69c9c45';
      const findTask: Task = taskModel.findByPk(taskId);
      const authRoute = new AuthRoute();
      const taskRoute = new TaskRoute();
      const app = new App([authRoute, taskRoute]);
      const agent = request.agent(app.getServer());
      const userData : UserDto = {
        email: "example@gmail.com",
        password: "qwer1234"
      };
      const response = await agent.post(`${authRoute.path}/login`).send(userData); 

      return agent.get(`${taskRoute.path}/${taskId}`).expect(200);
    });
  });

  describe('[POST] /tasks', () => {
    it('response statusCode 201 / created', async () => {
      const authRoute = new AuthRoute();
      const taskRoute = new TaskRoute();
      const app = new App([authRoute, taskRoute]);
      const agent = request.agent(app.getServer());
      const userData : UserDto = {
        email: "example@gmail.com",
        password: "qwer1234"
      };
      const response = await agent.post(`${authRoute.path}/login`).send(userData); 

      const taskData: TaskDto = {
        title: "New Task",
        userWeight: ".5",
        computedWeight: ".5",
        isDeferred: false,
        repeatFloor: 2,
        repeatCeiling: 2,
        lastCompletedDt: new Date("2021-01-01T00:00:00.001Z"),
        lastDeferredDt: new Date("2021-01-01T00:00:00.001Z")
      }

      return agent.post(`${taskRoute.path}`).send(taskData).expect(201);
    });
  });

  describe('[PUT] /tasks/:id', () => {
    it('response statusCode 200 / updated', async () => {
      const authRoute = new AuthRoute();
      const taskRoute = new TaskRoute();
      const app = new App([authRoute, taskRoute]);
      const agent = request.agent(app.getServer());
      const userData : UserDto = {
        email: "example@gmail.com",
        password: "qwer1234"
      };
      const response = await agent.post(`${authRoute.path}/login`).send(userData); 

      const taskId ='1d100f42-aa2a-4892-9896-a936b69c9c45';
      const taskData: TaskDto = {
        title: "Task is now updated",
        userWeight: ".5",
        computedWeight: ".5",
        isDeferred: false,
        repeatFloor: 2,
        repeatCeiling: 2,
        lastCompletedDt: new Date("2021-01-01T00:00:00.001Z"),
        lastDeferredDt: new Date("2021-01-01T00:00:00.001Z")
    };

      return agent.put(`${taskRoute.path}/${taskId}`).send(taskData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 / deleted', async () => {
      const authRoute = new AuthRoute();
      const taskRoute = new TaskRoute();
      const app = new App([authRoute, taskRoute]);
      const agent = request.agent(app.getServer());
      const userData : UserDto = {
        email: "example@gmail.com",
        password: "qwer1234"
      };
      var response = await agent.post(`${authRoute.path}/login`).send(userData); 

      const taskData: TaskDto = {
        title: "New Task",
        userWeight: ".5",
        computedWeight: ".5",
        isDeferred: false,
        repeatFloor: 2,
        repeatCeiling: 2,
        lastCompletedDt: new Date("2021-01-01T00:00:00.001Z"),
        lastDeferredDt: new Date("2021-01-01T00:00:00.001Z")
      }

      response = await agent.post(`${taskRoute.path}`).send(taskData).expect(201);
      const taskId = response.body.data.taskId;
      return agent.delete(`${taskRoute.path}/${taskId}`).expect(200, { data: 1, message: 'deleted' });
    });
  });

});

