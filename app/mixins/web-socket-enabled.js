import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

/**
Mixin for enabling web socket support
**/
export default Mixin.create({
  socketIOService: service('socket-io'),

  namespace: 'monitor',

  baseURL: 'http://localhost:4300/',

  init() {
    this._super(...arguments);

    this.getSocketInstance();
  },

  getSocketInstance() {
    return this.get('socketIOService').socketFor(`${this.baseURL}${this.get('namespace')}`);
  },

  addListeners() {
    const socket = this.getSocketInstance();
    socket.on('connect', this.onConnect, this);
  },

  removeListeners() {
    const socket = this.getSocketInstance()
    socket.off('connect', this.onConnect);
  },

  onConnect() {
    // Extend to handle connection success events
  }
});
