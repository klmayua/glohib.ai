import { Server as SocketServer } from 'socket.io';
import { Logger } from 'pino';

export function registerWebrtcHandlers(
  io: SocketServer,
  deps: { pool: any; log: Logger }
) {
  io.on('connection', (socket) => {
    deps.log.info({ sid: socket.id }, 'socket connected');

    socket.on('join-room', (room: string) => {
      socket.join(room);
      socket.to(room).emit('user-joined', socket.id);
    });

    socket.on('offer', (data: { to: string; offer: any }) => {
      socket.to(data.to).emit('offer', { from: socket.id, offer: data.offer });
    });

    socket.on('answer', (data: { to: string; answer: any }) => {
      socket.to(data.to).emit('answer', { from: socket.id, answer: data.answer });
    });

    socket.on('ice-candidate', (data: { to: string; candidate: any }) => {
      socket.to(data.to).emit('ice-candidate', { from: socket.id, candidate: data.candidate });
    });

    socket.on('disconnect', () => {
      deps.log.info({ sid: socket.id }, 'socket disconnected');
    });
  });
}
