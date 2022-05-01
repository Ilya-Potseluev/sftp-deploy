import EventEmitter from 'events';
import util from 'util';
import read from 'read';
import sftp from 'ssh2-sftp-client';

const configRequied = ['host', 'port', 'username', 'from', 'to'];

function getPassword(config) {
	return config.password
		? config
		: util
				.promisify(read)({
					prompt: 'Password for ' + config.username + '@' + config.host + ' (ENTER for none): ',
					default: '',
					silent: true,
				})
				.then(res => Object.assign(config, { password: res }));
}

function checkConfig(config) {
	let message = [];
	for (let prop of configRequied) if (!config[prop]) message.push(prop);
	if (message.length) throw 'Config has nо ' + message.join(', ');
}

export default class Deployer extends EventEmitter {
	async init(config = {}) {
		checkConfig(config);
		this.config = await getPassword(config);
	}
	async deploy() {
		let client = new sftp();
		let fileCounter = 0;

		client.on('upload', (...args) => {
			this.emit('upload', ...args);
			fileCounter++;
		});

		await client.connect(this.config);
		if (this.config.rmdir) await client.rmdir(this.config.to, true);
		await client.uploadDir(this.config.from, this.config.to);
		await client.end();
		return fileCounter;
	}
}
