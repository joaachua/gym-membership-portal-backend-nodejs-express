const express = require("express");
const app = express();

// CORS
const cors = require("cors");

// Routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

// Swagger
const { swaggerUi, specs } = require("./config/swagger-option");

require("dotenv").config();

app.use(express.json());

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});