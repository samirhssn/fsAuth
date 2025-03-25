// mongoose.ts
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI || ''

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Mongoose connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  }
}
