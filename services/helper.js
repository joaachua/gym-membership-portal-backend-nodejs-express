const sendSuccessResponse = (res, statusCode, message, data = {}) => {
	res.status(statusCode).json({
		success: true,
		status_code: statusCode,
		message,
		data,
	});
};

const sendErrorResponse = (res, statusCode, message, errors = []) => {
	res.status(statusCode).json({
		success: false,
		status_code: statusCode,
		message,
		data: errors,
	});
};

const getUrl = (filename, type) => {
	if (!filename) return null; // Return null if no file is uploaded

	const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // Set your domain or environment variable

	let folderPath = "";
	if (type === "image") {
		folderPath = "uploads/images/";
	} else if (type === "document") {
		folderPath = "uploads/documents/";
	} else {
		return null; // Handle unknown types
	}

	return `${baseUrl}/${folderPath}${filename}`;
};

const deleteUploadedFile = (filePath) => {
	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (!err) {
			fs.unlink(filePath, (deleteErr) => {
				if (deleteErr) {
					return sendErrorResponse(res, 400, 
						res,
						400,
						`Error deleting file: ${deleteErr}`
					);
				}
			});
		} else {
			return sendErrorResponse(res, 400, res, 400, "File does not exist");
		}
	});
};

module.exports = {
	sendSuccessResponse,
	sendErrorResponse,
	getUrl,
	deleteUploadedFile,
};
