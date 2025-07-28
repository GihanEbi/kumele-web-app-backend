import express from 'express';
import userRoutes   from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
