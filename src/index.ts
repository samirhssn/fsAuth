import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception';
import { MongoClient } from 'mongodb';
import app from './routes/authRoutes.js';
import { connectDB } from './utils/mongoose.js';



const mongoUri = process.env.MONGO_URI || ''
const dbName = process.env.DB_NAME || ''
const jwtSecret = process.env.JWT_SECRET || ''

if (!mongoUri || !dbName || !jwtSecret) {
  throw new Error('Missing MongoDB URI, DB Name or JWT_SECRET in .env')
}

const client = new MongoClient(mongoUri)
let db, usersCollection

async function connectToDB() {
  try {
    await client.connect()
    db = client.db(dbName)
    usersCollection = db.collection('users')
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  }
}

await connectToDB();
await connectDB();

// const app = new Hono()
// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// });


app.onError((err: Error, c) => {
  if (err instanceof HTTPException) {
    const res = err.getResponse();
    return c.json({ success: false, message: res.body }, res.status as any);
  }

  console.error(' Unhandled Error:', err)

  return c.json(
    { message: 'Internal Server Error', error: err.message },
    500
  )
});

// example
// throw new HTTPException(400, { message: 'This is a bad request' });


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
