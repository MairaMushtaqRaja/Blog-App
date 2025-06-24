import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import connectDB from './config/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRoute from './routes/BlogRoutes.js';
const app = express();
await connectDB()
// middlewares
app.use(cors());
app.use(express.json());


// Routes
app.get('/', (req, res) =>
    res.send("Server is Running"))

app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRoute)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("server is running on PORT " + PORT)
})
export default app;

