const { exec } = require("child_process");

const installDependencies = () => {
	return new Promise((resolve, reject) => {
		exec(
			"source app/models/python/venv/bin/activate && pip install -r app/models/python/requirements.txt",
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
