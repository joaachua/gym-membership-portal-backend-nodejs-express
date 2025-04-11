const express = require("express");
const app = express();
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

require("dotenv").config();

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});