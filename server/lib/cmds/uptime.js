/**
Uptime Task 
Runs `uptime` and process the output.
**/

const Task = require('../task');

class Uptime extends Task {
  constructor() {
    super('uptime');
  }

  process({ stdout, stderr }) {
    if (stderr) {
      this.error(stderr);
      return;
    }
    const timestamp = new Date().getTime();

    const uptimeData = stdout.trim().split(',');

    const loadAveragesData = uptimeData[uptimeData.length - 1];

    const [, loadAverageList] = loadAveragesData.trim().split(':');

    const [min1, min5, min15] = loadAverageList.trim().split(' ');

    return { stdout, min1: parseFloat(min1), min5: parseFloat(min5), min15: parseFloat(min15), timestamp };
  }
}

module.exports = Uptime;
