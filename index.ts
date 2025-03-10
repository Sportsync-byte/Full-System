import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import organizationRoutes from './routes/organization';
import subscriptionRoutes from './routes/subscription';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// WebSocket handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('joinGame', (gameId) => {
    socket.join(gameId);
  });

  socket.on('scoreUpdate', (data) => {
    io.to(data.gameId).emit('scoreUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
