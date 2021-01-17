import { Pool } from 'pg';

var PgPool : Pool;

if(process.env.NODE_ENV === 'development') {
  PgPool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: {rejectUnauthorized: false},
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  console.log('using development database');
} else {
  PgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {rejectUnauthorized: false}
  });
}

PgPool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      if(process.env.NODE_ENV === 'development'){
        console.log(`Connected to ${process.env.PG_HOST}`)
        console.log(result.rows)
      }
    })
  })    


export default PgPool