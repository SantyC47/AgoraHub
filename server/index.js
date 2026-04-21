import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

import db from './db.js'; // 👈 IMPORTANTE

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  connectionStateRecovery: {}
});

app.use(logger('dev'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

// SOCKET.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  //Enviar historial al conectar
  const mensajes = db.prepare(`
    SELECT * FROM mensajes ORDER BY id ASC
  `).all();

  socket.emit('historial', mensajes);

  // Escuchar mensajes
  socket.on('chat message', (msg) => {
    try {
      // Guardar en BD
      db.prepare(`
        INSERT INTO mensajes (content)
        VALUES (?)
      `).run(msg);

      // Enviar a todos
      io.emit('chat message', msg);

      console.log('Mensaje:', msg);
    } catch (error) {
      console.error('Error guardando mensaje:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});