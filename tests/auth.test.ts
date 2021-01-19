import request from 'supertest';
import App from '../src/app';
import AuthRoute from '../src/routes/auth.route';
import { UserDto } from '../src/dtos/users.dto';
import PgPool from '../src/services/postgres.service';

async function deleteUserByEmail(userEmail: string) : Promise<void>{
  try {
    const queryString = 'DELETE FROM public.users WHERE email = $1';
    const values = [userEmail];
    const res = await PgPool.query(queryString, values)
  } catch (err) {
      console.error('Error executing query', err.stack);
  }
};

// afterAll(async () => {
//   await new Promise<void>(resolve => setTimeout(() => resolve(), 15000));
// });

describe('Testing Auth', () => {
  const testEmail = 'test@email.com';

  beforeAll(async () => {
    await deleteUserByEmail(testEmail);
  });

  afterAll(() => {
    PgPool.end()
  });

  describe('[POST] /signup', () => {
    it('response should have the Create userData', () => {
      const userData: UserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return request(app.getServer()).post(`${authRoute.path}/signup`).send(userData);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: UserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };
      process.env.JWT_SECRET = 'jwt_secret';
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return request(app.getServer())
        .post(`${authRoute.path}/login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      const userData: UserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };
      
      // We have to use request.agent for sequential dependecies
      // Must login to get a valid JWT since logout is protected by auth,middleware
      const agent = request.agent(app.getServer())

      const response = await agent
        .post(`${authRoute.path}/login`)
        .send(userData)
          
      return agent
        .post(`${authRoute.path}/logout`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=\;/);
    
    });
  });
});