import { Hono } from "hono"
import { login, register } from "../controllers/authController.js";
import { sign } from "crypto";

const app = new Hono()

app.post('/login', login);
app.post('/signup', register);


export default app;
