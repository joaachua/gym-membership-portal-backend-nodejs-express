require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");

// CORS
const cors = require("cors");

// Routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

// Swagger
const { swaggerUi, specs } = require("./config/swagger-option");

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/reset-password", (req, res) => {
	const token = req.query.token;
	if (!token) {
		return res.status(400).send("Token is required.");
	}
	res.sendFile(
		path.join(__dirname, "services", "form", "reset-password.html"),
		{ token }
	);
});

app.get("/user-reset-password", (req, res) => {
	const token = req.query.token;
	if (!token) {
		return res.status(400).send("Token is required.");
	}
	res.sendFile(
		path.join(__dirname, "services", "form", "user-reset-password.html"),
		{ token }
	);
});

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});