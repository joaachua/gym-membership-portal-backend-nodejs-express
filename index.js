const express = require("express");
const app = express();
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const db = require("./config/db");

require("dotenv").config();

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

db.raw("SELECT 1")
	.then(() => console.log("Database connected successfully."))
	.catch((err) => console.error("Unable to connect to the database:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});