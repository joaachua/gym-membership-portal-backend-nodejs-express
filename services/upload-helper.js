const multer = require("multer");
const path = require("path");

// Storage for images
const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/images/"); // Save images in 'uploads/images'
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
	},
});

// Storage for documents
const documentStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/documents/"); // Save documents in 'uploads/documents'
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
