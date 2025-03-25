import type { Context } from "hono";
import { Token } from "../utils/token.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { HTTPException } from "hono/http-exception";
import { v4 as uuidv4 } from 'uuid'


export async function login(c: Context) {
  try {
    const body = await c.req.json()
    const { email, password } = body;

    // validation
    if (!email || !password) {
      console.log('Missing email or password')
      throw new HTTPException(422, { message: 'Invalid email or password' });
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      console.log(` User not found with email: ${email}`);
      throw new HTTPException(404, { message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log('⚠️ Password mismatch for user:', email);
      throw new HTTPException(422, { message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = Token.createToken(uuidv4(), { userId: user._id, email: user.email }, 'access');

    // backup
    // const token = jwt.sign(
    //   { userId: user._id, email: user.email },
    //   jwtSecret,
    //   { expiresIn: '1h' }
    // )

    console.log(`Login successful for ${email}`)
    return c.json({ token }, 201);

  } catch (err) {
    console.error(' Error during login:', err)
    return c.text('Internal server error', 500)
  }
}

export async function register(c: Context) {
  // try {
    const body = await c.req.json()
    const { name, email, password } = body;

    // validation
    if (!name || !email || !password) {
      console.log('Missing name, email or password');
      throw new HTTPException(422, { message: "Name, email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log(`Email already registered: ${email}`)
      throw new HTTPException(400, { message: 'Email already registered' })
    }

     // Hash password
     const saltRounds = 10
     const hashedPassword = await bcrypt.hash(password, saltRounds)
 
     // Create user
     const user = new User({ name, email, password: hashedPassword })
     await user.save()
 
     console.log(`✅ Registered user: ${email}`)

     // craete token
     const token = Token.createToken(uuidv4(), { userId: user._id, email: user.email }, 'access');

     return c.json({ message: 'User registered successfully', token }, 201);
  // }
  // catch (err) {
  //   console.error('Error during registration:', err);
  //   return c.text('Internal server error', 500);
  // }
}



// app.post('/login', async (c: Context) => {
//   try {
//     const body = await c.req.json()
//     const { email, password } = body

//     // Basic validation
//     if (!email || !password) {
//       console.log('⚠️ Missing email or password')
//       return c.text('Email and password are required', 400)
//     }

//     // Find user
//     const user = await usersCollection.findOne({ email })
//     if (!user) {
//       console.log(`⚠️ User not found with email: ${email}`)
//       return c.text('Invalid email or password', 401)
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       console.log('⚠️ Password mismatch for user:', email)
//       return c.text('Invalid email or password', 401)
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       jwtSecret,
//       { expiresIn: '1h' }
//     )

//     console.log(`✅ Login successful for ${email}`)
//     return c.json({ token })

//   } catch (err) {
//     console.error('❌ Error during login:', err)
//     return c.text('Internal server error', 500)
//   }
// })