const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os');

/**
Generic Task 
Executes and processes commands assigned to it.
**/
class Task {
	constructor(cmd = null) {
		this.cmd = cmd;
		this.platform = os.platform();
	}

	async run() {
		if (this.cmd) {
			try {
				const output = await exec(this.cmd);
				return this.process(output);
			} catch (e) {
				this.error(e);
			}
		}
	}

	process(output) { // default output
		return output; 
	}

	error(_error) { // handle errors
		console.error(_error)
		return _error;
	}
}

module.exports = Task;