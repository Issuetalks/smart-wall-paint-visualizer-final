import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({ limit: '50mb', extended: false }));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart Wall Paint Visualizer API is running',
    timestamp: new Date().toISOString()
  });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});