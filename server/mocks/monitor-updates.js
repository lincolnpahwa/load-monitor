/* eslint-env node */
'use strict';

const LoadMonitor = require('../src/load-monitor');
const loadMonitor = new LoadMonitor();

module.exports = function(app) {
  const socketIO = require('socket.io')();

  const server = require('http').Server(app);
  server.listen(4300);
  socketIO.attach(server);

  const monitorUpdatesNSP = socketIO.of('/monitor');

  monitorUpdatesNSP.on('connection', function(socket) {
    socket.emit('connection:successful', { message: 'connection', status: true });
    
    loadMonitor.set('relayUpdates', (event, payload) => {
      socket.emit(event, payload);
    });
    loadMonitor.start();

    socket.on('disconnect', () => {
      loadMonitor.stop();
    })
  })
};
