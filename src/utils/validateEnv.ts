import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  var envVars = {}
  if(process.env.NODE_ENV === 'production'){
    envVars = {
      NODE_ENV: str(),
      DATABASE_URL: str(),
    }
  } else {
    envVars = {
      NODE_ENV: str(),
      PG_USER: str(),
      PG_PASSWORD: str(),
      PG_HOST: str(),
      PG_DATABASE: str(),
      JWT_SECRET: str(),
      PORT: port(),
    }
  }
  cleanEnv(process.env, envVars);
}

export default validateEnv;
