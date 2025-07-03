import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';


dotenv.config();

const port = 5000;


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytuhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
