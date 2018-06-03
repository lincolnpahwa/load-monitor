import Component from '@ember/component';
import { A } from '@ember/array';
import { next } from '@ember/runloop';
import { computed } from '@ember/object';
import WebSocketUpdateEnabled from '../mixins/web-socket-enabled';

/** 
Load Monitor Component
**/
export default Component.extend(WebSocketUpdateEnabled, {

  classNames: ['load-monitor-component'],

  // Socket event names
  SOCKET_INITIAL_CONNECT_EVENT: 'monitor:load:initial',

  SOCKET_SNAPSHOT_EVENT: 'monitor:load:snapshot',

  SOCKET_UPDATE_EVENT: 'monitor:load:update',

  SOCKET_ALERT_UPDATE: 'monitor:load:alert',

  sortProperties: ['timestamp:desc'],

  alertsList: computed.sort('alertsData', 'sortProperties'),

  init() {
    this._super(...arguments);
    this.setProperties({
      processed: false,
      alertsData: A([]),
      loadData: A([]),
      lastUpdateTimestamp: new Date().getTime(),
      min1: 0,
      min5: 0,
      min15: 0,
      updatePayload: {}
    });
    this.registerUpdates();
  },

  registerUpdates() {
    const socket = this.getSocketInstance();

    this.addListeners(socket);
  },
  // Register socket listeners
  addListeners(socket) { 
    this._super(...arguments);
    socket.on(this.SOCKET_INITIAL_CONNECT_EVENT, this.initialDataLoad, this);
    socket.on(this.SOCKET_SNAPSHOT_EVENT, this.onSocketSnapshotEvent, this);
    socket.on(this.SOCKET_UPDATE_EVENT, this.onSocketUpdateEvent, this);
    socket.on(this.SOCKET_ALERT_UPDATE, this.onSocketAlertEvent, this);
  },
  // Remove socket listeners
  removeListeners() {
    const socket = this.getSocketInstance();
    socket.off(this.SOCKET_INITIAL_CONNECT_EVENT, this.initialDataLoad);
    socket.off(this.SOCKET_SNAPSHOT_EVENT, this.onSocketSnapshotEvent);
    socket.off(this.SOCKET_UPDATE_EVENT, this.onSocketUpdateEvent);
    socket.off(this.SOCKET_ALERT_UPDATE, this.onSocketAlertEvent);
    this._super(socket);
  },

  initialDataLoad(data) {
    const loadData = this.get('loadData');
    const alertsData = this.get('alertsData');
    // Add load and alerts history on initial load
    loadData.pushObjects(data.snapshots);
    alertsData.pushObjects(data.alerts);

    this.set('loadData', loadData);
    this.set('alertsData', alertsData);
    this.onSocketSnapshotEvent(loadData.get('lastObject') || {})

    next(this, function() {
      this.set('processed', true);
    })
  },

  onSocketSnapshotEvent(data) { // Handle latest snapshot socket message
    const { timestamp, min1, min5, min15 } = data;
    // Update latest statistics
    this.setProperties({
      lastUpdateTimestamp: timestamp,
      min1,
      min5,
      min15
    });
  },

  onSocketUpdateEvent(data) { // Handle 1 min. load average socket message 
    const loadData = this.get('loadData');
    // Update load history
    loadData.pushObject(data);

    this.set('loadData', loadData);
    this.set('updatePayload', data);
  },

  onSocketAlertEvent(data) { // Handle alert socket message
    const alertsData = this.get('alertsData');
    // Update alert history
    alertsData.pushObject(data);
    this.set('alertsData', alertsData);
  },

  willDestroyElement() { // Remove socket update listeners before component destroys
    this.removeListeners();
    this._super(...arguments);
  }

});
