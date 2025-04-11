const sendSuccessResponse = (message, data = {}) => {
	return {
		success: true,
		message,
		data,
	};
};

const sendErrorResponse = (message, error = null) => {
	return {
		success: false,
		message,
		error,
	};
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

module.exports = {
	sendSuccessResponse,
	sendErrorResponse,
	getUrl,
};
