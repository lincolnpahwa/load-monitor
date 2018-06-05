/**
Uptime Task 
Runs `uptime` and process the output.
**/

const Task = require('../task');

const PLATFORM_MAP = {
  MAC: 'darwin',
  LINUX: 'linux'
};

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

    if (this.platform === PLATFORM_MAP.MAC) {
      const uptimeData = stdout.trim().split(',');

      const loadAveragesData = uptimeData[uptimeData.length - 1];

      const [, loadAverageList] = loadAveragesData.trim().split(':');

      const [min1, min5, min15] = loadAverageList.trim().split(' ').map(parseFloat);

      return { stdout, min1, min5, min15, timestamp };
    } else if (this.platform === PLATFORM_MAP.LINUX) {
      const loadAveragesList = stdout.match(/(\d.\d{2}),\s(\d.\d{2}),\s(\d.\d{2})/g);
      const [min1, min5, min15] = loadAveragesList[0].split(',').map(parseFloat);
      return { stdout, min1, min5, min15, timestamp };
    } else {
      throw new Error('Unrecognized platform', this.platform);
    }
  }
}

module.exports = Uptime;
