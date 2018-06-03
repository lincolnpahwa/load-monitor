const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
Generic Task 
Executes and processes commands assigned to it.
**/
class Task {
	constructor(cmd = null) {
		this.cmd = cmd;
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
		return _error;
	}
}

module.exports = Task;