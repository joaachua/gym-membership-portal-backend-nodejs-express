const fs = require('fs');
const multer = require("multer");
const path = require("path");

// Storage for images
const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
	  	const dir = path.join(__dirname, '../uploads/images');
  
		// Create the folder if it doesn't exist
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
  
	  	cb(null, dir); // Save images here
	},
	filename: function (req, file, cb) {
	  	cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
	},
});

// Storage for documents
const documentStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = path.join(__dirname, '../uploads/documents');
  
		// Create the folder if it doesn't exist
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		cb(null, dir); ; // Save documents in 'uploads/documents'
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
	},
});

// File filter for images
const imageFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Only image files are allowed"), false);
	}
};

// File filter for documents
const documentFilter = (req, file, cb) => {
	if (
		file.mimetype === "application/pdf" ||
		file.mimetype === "application/msword" ||
		file.mimetype ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		cb(null, true);
	} else {
		cb(new Error("Only PDF and Word documents are allowed"), false);
	}
};

// Upload configurations
const uploadImage = multer({
	storage: imageStorage,
	fileFilter: imageFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB for images
});

const uploadDocument = multer({
	storage: documentStorage,
	fileFilter: documentFilter,
	limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB for documents
});

module.exports = { uploadImage, uploadDocument };
