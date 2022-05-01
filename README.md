# sftp-deploy-js
SFTP deployer using [ssh2-sftp-client](https://github.com/theophilusx/ssh2-sftp-client)
## Installation
```js
npm install --save-dev sftp-deploy-js
```
## Example
```javascript
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import Deployer from 'sftp-deploy-js';
const deployer = new Deployer();

const config = {
	host: 'your host',
	port: '22',
	username: 'your username',
	password: 'your password' || null, // if not specified, you can enter in the console
	// other options specified in https://github.com/theophilusx/ssh2-sftp-client#sec-4-2-2

	from: path.join(__dirname, 'dist'), // path on local
	to: '/path/on/server/',
	rmdir: true, // remove or not remove an existing directory on server with files
};

await deployer.init(config); // checks config and asks password
deployer.on('upload', console.log); // copies event from ssh2-sftp-client
let total = await deployer.deploy(); // returns the number of uploaded files
console.log(`Total files: ` + total);
```
