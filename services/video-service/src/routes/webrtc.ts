import { Router } from 'express';
import { Server as SocketServer } from 'socket.io';
import { Logger } from 'pino';

export default function create(deps: { pool: any; io: SocketServer; log: Logger }) {
  const router = Router();

  router.post('/signal', (req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}
