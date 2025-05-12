const { exec } = require("child_process");

const installDependencies = () => {
	return new Promise((resolve, reject) => {
		exec(
			`python3 app/models/python/venv/bin/python3 -m pip install -r app/models/python/requirements.txt`,
			(error, stdout, stderr) => {
				if (error) {
					return reject(`exec error: ${error}`);
				}
				if (stderr) {
					return reject(`stderr: ${stderr}`);
				}
				resolve(stdout);
			}
		);
	});
};

module.exports = { installDependencies };
