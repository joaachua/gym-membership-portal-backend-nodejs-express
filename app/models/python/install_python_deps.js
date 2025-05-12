const { exec } = require("child_process");

const installDependencies = () => {
	return new Promise((resolve, reject) => {
		exec(
			"pip3 install -r app/models/python/requirements.txt",
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
