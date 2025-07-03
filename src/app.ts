import express from 'express';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);

export default app;
