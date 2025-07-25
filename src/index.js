import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import createUserTable from './data/createUserTable.js';

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use('/api', userRoutes);

// Error handling middleware
app.use(errorHandler)

// create table if it doesn't exist
createUserTable();

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});