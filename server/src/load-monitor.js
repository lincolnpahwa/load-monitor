const cron = require('node-cron'); // Utility used for scheduling tasks

const Uptime = require('../lib/cmds/uptime');

class LoadMonitor {
  constructor(relayUpdates = () => {}, threshold = 1.0) {
    this.uptimeTask = new Uptime(); // Reference to the uptime task
    this.threshold = threshold; // Alert threshold 
    this.snapshots = []; // History of snapshots
    this.alerts = []; // History of alerts
    this.thresholdCrossed = false; // Two minute load average is higher than threshold
    this.relayUpdates = relayUpdates; // Method used for relaying updates
    this.scheduler = cron.schedule('*/10 * * * * *', async function() {
      const { timestamp, min1, min5, min15 } = await this.uptimeTask.run();
      this.sendUpdate('monitor:load:snapshot', { timestamp, min1, min5, min15 });
      if (this.snapshots.length >= 6 * 10) {
        this.snapshots.shift();
      }

      this.snapshots.push({ timestamp, min1 });
      this.sendUpdate('monitor:load:update', { timestamp, min1 });
      this.calculateTwoMinuteAverage();
    }.bind(this));
  }

  start() {
    this.relayUpdates('monitor:load:initial', { snapshots : this.snapshots, alerts: this.alerts});
    this.scheduler.start();
  }

  stop() {
    this.scheduler.stop();
  }

  calculateTwoMinuteAverage() {
    if (this.snapshots.length > 6) {
      const latestIndex = this.snapshots.length - 1;
      const latestSnapshot = this.snapshots[latestIndex];
      const snapshotTwoMinuteAgo = this.snapshots[latestIndex - 6];
      const average = (latestSnapshot.min1 + snapshotTwoMinuteAgo.min1) / 2;

      this.processAverage(average, latestSnapshot.timestamp);
    }
  }

  processAverage(average, timestamp) {
    if (average > this.threshold) {
      if (!this.thresholdCrossed) {
        const alert = {
          type: 'High',
          timestamp,
          load: average
        };
        this.alerts.push(alert);
        this.thresholdCrossed = true;
        this.sendUpdate('monitor:load:alert', alert);
      }
    } else {
      if (this.thresholdCrossed) {
        const alert = {
          type: 'Low',
          timestamp,
          load: average
        };
        this.alerts.push(alert);
        this.thresholdCrossed = false;
        this.sendUpdate('monitor:load:alert', alert);
      }
    }
  }

  sendUpdate() {
    this.relayUpdates(...arguments);
  }

  set(key, value) {
    this[key] = value;
  }
}

module.exports = LoadMonitor;
